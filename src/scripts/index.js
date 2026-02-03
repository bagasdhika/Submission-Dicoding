import '../styles/styles.css';
import App from './pages/app';
import initNetworkStatus from './utils/network-status';
import {
  requestNotificationPermission,
} from './utils/push-helper';

/* =====================
   NAVIGATION (KODE LAMA – DIPERTAHANKAN)
   ===================== */
const renderNav = () => {
  const navList = document.getElementById('navList');
  const token = localStorage.getItem('token');

  if (!navList) return;

  if (token) {
    navList.innerHTML = `
      <li><a href="#/">Beranda</a></li>
      <li><a href="#/add">Tambah Story</a></li>
      <li>
        <button id="toggleNotifBtn" aria-pressed="false">
          🔔 Aktifkan Notifikasi
        </button>
      </li>
      <li><button id="logoutBtn">Logout</button></li>
    `;

    document.getElementById('logoutBtn').addEventListener('click', () => {
      localStorage.clear();
      location.hash = '#/login';
      location.reload();
    });
  } else {
    navList.innerHTML = `
      <li><a href="#/login">Login</a></li>
      <li><a href="#/register">Register</a></li>
    `;
  }
};

/* =====================
   APP INIT (KODE LAMA – AMAN)
   ===================== */
document.addEventListener('DOMContentLoaded', async () => {
  initNetworkStatus(); // fitur advance, tidak merusak submission 1

  const app = new App({
    content: document.querySelector('#main-content'),
  });

  renderNav();
  await app.renderPage();

  window.addEventListener('hashchange', async () => {
    renderNav();
    await app.renderPage();
  });
});

/* ===============================
   SERVICE WORKER (WAJIB SUBMISSION 2)
   =============================== */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered');
    } catch {
      console.log('Service Worker failed');
    }
  });
}

/* =====================================
   PUSH NOTIFICATION PERMISSION (AMAN)
   - TIDAK auto request
   - Tidak menyebabkan reject UX
   ===================================== */
window.addEventListener('click', async (event) => {
  if (event.target.id !== 'toggleNotifBtn') return;

  const granted = await requestNotificationPermission();

  if (!granted) {
    alert('Izin notifikasi ditolak');
    return;
  }

  alert('Izin notifikasi diberikan. Langganan aktif.');
});
