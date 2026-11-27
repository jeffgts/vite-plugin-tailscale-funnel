import './style.css';
import { getTunnelUrl } from 'virtual:vite-plugin-tailscale-funnel';

document.querySelector('#app');

// Simple status checker
function updateStatus() {
  const statusEl = document.getElementById('status');
  const tunnelUrlEl = document.getElementById('tunnel-url');
  
  try {
    // Get the tunnel URL from the virtual module
    const tunnelUrl = getTunnelUrl();
    
    // Check if we can detect we're running through Cloudflare
    const isCloudflare = document.location.hostname !== 'localhost' && 
                        document.location.hostname !== '127.0.0.1';
    
    if (isCloudflare) {
      statusEl.textContent = '🟢 Connected via Tailscale Funnel';
      tunnelUrlEl.textContent = tunnelUrl;
      statusEl.style.color = 'green';
      
      // Show copy button for sharing
      const copyBtn = document.getElementById('copy-url');
      if (copyBtn) {
        copyBtn.style.display = 'inline-block';
        copyBtn.onclick = () => {
          navigator.clipboard.writeText(tunnelUrl);
          alert('Tunnel URL copied to clipboard!');
        };
      }
    } else {
      statusEl.textContent = '🟡 Running locally (tunnel may be starting...)';
      statusEl.style.color = 'orange';
      tunnelUrlEl.textContent = tunnelUrl || 'Tunnel starting...';
    }
    
    console.log('🌐 Tunnel URL from virtual module:', tunnelUrl);
  } catch (error) {
    // Virtual module not available (probably in production)
    statusEl.textContent = '🔴 Virtual module not available';
    statusEl.style.color = 'red';
    console.warn('Virtual module not available:', error);
  }
}

// Add refresh functionality
document.getElementById('refresh').addEventListener('click', () => {
  updateStatus();
  console.log('Status refreshed at:', new Date().toLocaleTimeString());
});

// Update status on page load
updateStatus();

// Log some helpful info
console.log('🌐 Tailscale Funnel Plugin Example');
console.log('Current URL:', window.location.href);
console.log('User Agent:', navigator.userAgent);

// Add some interactivity
let clickCount = 0;
document.addEventListener('click', () => {
  clickCount++;
  if (clickCount === 10) {
    alert('🎉 You clicked 10 times! The tunnel is working great!');
    clickCount = 0;
  }
});