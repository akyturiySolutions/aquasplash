import { Router } from 'express';
import { stkPush, stkQuery } from '../mpesa/client.js';
import { setPending, setResult, get } from '../mpesa/store.js';

export const mpesaRouter = Router();

// ── 1. Frontend calls this to trigger the STK push prompt ──
mpesaRouter.post('/stkpush', async (req, res) => {
  try {
    const { phone, amount, accountReference, transactionDesc } = req.body;

    if (!phone || !amount) {
      return res.status(400).json({ error: 'phone and amount are required' });
    }

    const result = await stkPush({ phone, amount, accountReference, transactionDesc });

    if (result.ResponseCode !== '0') {
      return res.status(400).json({
        error: result.ResponseDescription || 'STK push was rejected by Safaricom',
      });
    }

    setPending(result.CheckoutRequestID, {
      merchantRequestId: result.MerchantRequestID,
      phone,
      amount,
      accountReference,
    });

    res.json({
      checkoutRequestId: result.CheckoutRequestID,
      customerMessage: result.CustomerMessage,
    });
  } catch (err) {
    console.error('[mpesa] stkpush error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Could not initiate M-Pesa payment. Please try again.' });
  }
});

// ── 2. Safaricom calls this after the customer enters their PIN ──
mpesaRouter.post('/callback', (req, res) => {
  try {
    const stk = req.body?.Body?.stkCallback;
    if (!stk) return res.status(400).json({ ResultCode: 1, ResultDesc: 'Invalid callback payload' });

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stk;

    if (ResultCode === 0) {
      const items = CallbackMetadata?.Item || [];
      const find = name => items.find(i => i.Name === name)?.Value;

      setResult(CheckoutRequestID, {
        status: 'success',
        mpesaReceiptNumber: find('MpesaReceiptNumber'),
        amountPaid: find('Amount'),
        transactionDate: find('TransactionDate'),
        payerPhone: find('PhoneNumber'),
      });
    } else {
      // Common: ResultCode 1032 = user cancelled, 1037 = timeout
      setResult(CheckoutRequestID, {
        status: 'failed',
        resultCode: ResultCode,
        resultDesc: ResultDesc,
      });
    }

    // Safaricom just needs a 200 acknowledging receipt
    res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (err) {
    console.error('[mpesa] callback error:', err.message);
    res.status(500).json({ ResultCode: 1, ResultDesc: 'Server error' });
  }
});

// ── 3. Frontend polls this to find out if payment succeeded ──
mpesaRouter.get('/status/:checkoutRequestId', async (req, res) => {
  const { checkoutRequestId } = req.params;
  const record = get(checkoutRequestId);

  if (!record) {
    return res.status(404).json({ status: 'unknown' });
  }

  // If still pending after a while, ask Safaricom directly as a fallback
  // in case the callback got lost (e.g. Render cold start delay).
  if (record.status === 'pending' && Date.now() - record.createdAt > 15000) {
    try {
      const query = await stkQuery(checkoutRequestId);
      if (query.ResultCode === '0') {
        setResult(checkoutRequestId, { status: 'success', resultDesc: query.ResultDesc });
      } else if (query.ResultCode && query.ResultCode !== '1037') {
        setResult(checkoutRequestId, {
          status: 'failed',
          resultCode: query.ResultCode,
          resultDesc: query.ResultDesc,
        });
      }
    } catch {
      // Query can legitimately fail while still pending — ignore and keep polling
    }
  }

  res.json(get(checkoutRequestId));
});
