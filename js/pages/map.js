import { CONFIG } from '../config.js';
import { updateActiveNav } from '../components/nav.js';

export function initMap() {
  updateActiveNav('map');

  document.getElementById('content').innerHTML = `
    <div class="page">
      <p class="page-title">Find Us</p>

      <div class="map-placeholder">
        🗺️
        <p>${CONFIG.map.areaLabel}</p>
      </div>

      <div class="info-card">
        <h3>📍 Service Area</h3>
        <p>${CONFIG.map.serviceAreaText}</p>
      </div>

      <a class="contact-btn green" href="${CONFIG.map.googleMapsUrl}" target="_blank">
        📍 Open in Google Maps
      </a>
    </div>
  `;
}
