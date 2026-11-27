import './style.css'
import { getTunnelUrl } from 'virtual:vite-plugin-tailscale-funnel';

document.querySelector('#app').innerHTML += `
  <div style="margin-top: 2rem;">
    <h3>🚀 How it works:</h3>
    <ol>
      <li>Plugin reads your device name and MagicDNS suffix from Tailscale</li>
      <li>Starts <code>tailscale funnel</code> for the local Vite port</li>
      <li>Routes public HTTPS traffic to your development server</li>
      <li>Your local dev server is now publicly accessible!</li>
    </ol>
    
    <div style="margin-top: 1rem; padding: 1rem; background: #f0f8ff; border-radius: 8px; border: 1px solid #ddd;">
      <h4>🌐 Virtual Module Demo:</h4>
      <p><strong>Tunnel URL:</strong> <span id="tunnel-url">Loading...</span></p>
      <button id="copy-url" style="margin-top: 0.5rem; padding: 0.5rem 1rem; cursor: pointer;">📋 Copy URL</button>
      <button id="refresh-url" style="margin-top: 0.5rem; margin-left: 0.5rem; padding: 0.5rem 1rem; cursor: pointer;">🔄 Refresh</button>
    </div>
    
    <p style="margin-top: 1rem; font-style: italic;">
      The URL above is fetched using the virtual module: <code>getTunnelUrl()</code> 🎉
    </p>
  </div>
`

// Demo the virtual module functionality
function updateTunnelUrl() {
  try {
    const tunnelUrl = getTunnelUrl();
    const urlElement = document.getElementById('tunnel-url');
    
    if (tunnelUrl) {
      urlElement.textContent = tunnelUrl;
      urlElement.style.color = 'green';
      
      // Enable copy functionality
      document.getElementById('copy-url').onclick = () => {
        navigator.clipboard.writeText(tunnelUrl);
        alert('Tunnel URL copied to clipboard! 📋');
      };
    } else {
      urlElement.textContent = 'Tunnel starting...';
      urlElement.style.color = 'orange';
    }
    
    console.log('🌐 Tunnel URL from virtual module:', tunnelUrl);
  } catch (error) {
    document.getElementById('tunnel-url').textContent = 'Virtual module not available';
    document.getElementById('tunnel-url').style.color = 'red';
    console.warn('Virtual module error:', error);
  }
}

// Refresh button functionality
document.getElementById('refresh-url').onclick = updateTunnelUrl;

// Update URL on page load and every few seconds
updateTunnelUrl();
setInterval(updateTunnelUrl, 3000);