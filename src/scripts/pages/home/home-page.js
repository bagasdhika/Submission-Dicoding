import {
  getStories,
  subscribeNotification,
  unsubscribeNotification,
} from '../../data/api';
import { getToken } from '../../utils/auth';
import { showToast } from '../../utils/toast';

import {
  isPushSupported,
  subscribePushNotification,
  getPushSubscription,
  unsubscribePushNotification,
} from '../../utils/push-helper';

export default class HomePage {
  async render() {
    return `
      <section class="container" id="main-content" tabindex="-1">
        <h1 class="page-title">Daftar Story</h1>

        <!-- ===== PUSH TOGGLE (ADVANCED) ===== -->
        <div class="push-toggle">
          <label>
            <input type="checkbox" id="pushToggle" />
            Aktifkan Push Notification
          </label>
        </div>

        <p class="location-info">
          Klik salah satu story untuk menyorot lokasi pada peta
        </p>

        <div
          id="map"
          class="story-map"
          aria-label="Peta lokasi story"
          role="application"
        ></div>

        <section
          id="storyList"
          class="story-list"
          aria-live="polite"
          aria-busy="true"
        ></section>
      </section>
    `;
  }

  async afterRender() {
    /* =====================================================
       AUTH (SUBMISSION 1 – WAJIB, TIDAK DIUBAH)
       ===================================================== */
    const token = getToken();
    if (!token) {
      location.hash = '#/login';
      return;
    }

    /* =====================================================
       PUSH NOTIFICATION TOGGLE (ADVANCED +4)
       ===================================================== */
    const pushToggle = document.getElementById('pushToggle');

    if (isPushSupported()) {
      const existingSubscription = await getPushSubscription();
      pushToggle.checked = !!existingSubscription;

      // 🔹 INI PENAMBAHAN YANG ANDA MAKSUD
      pushToggle.addEventListener('change', async () => {
        try {
          if (pushToggle.checked) {
            // SUBSCRIBE
            const subscription = await subscribePushNotification();
            await subscribeNotification(subscription, token);
            showToast('Push notification diaktifkan', 'success');
          } else {
            // UNSUBSCRIBE
            const subscription = await getPushSubscription();
            if (subscription) {
              await unsubscribeNotification(subscription.endpoint, token);
              await unsubscribePushNotification();
              showToast('Push notification dinonaktifkan', 'info');
            }
          }
        } catch (error) {
          console.error(error);
          showToast('Gagal mengatur push notification', 'error');
          pushToggle.checked = !pushToggle.checked; // rollback
        }
      });
    } else {
      pushToggle.disabled = true;
      showToast('Browser tidak mendukung push notification', 'warning');
    }

    /* =====================================================
       STORY LIST – LOADING STATE (KODE LAMA)
       ===================================================== */
    const storyList = document.getElementById('storyList');
    storyList.setAttribute('aria-busy', 'true');
    storyList.innerHTML = `
      <div class="skeleton skeleton-card"></div>
      <div class="skeleton skeleton-card"></div>
      <div class="skeleton skeleton-card"></div>
    `;

    /* =====================================================
       MAP (SUBMISSION 1 – WAJIB)
       ===================================================== */
    const map = L.map('map', {
      center: [-6.2, 106.8],
      zoom: 5,
      zoomControl: true,
    });

    const osmLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '&copy; OpenStreetMap' }
    );

    const topoLayer = L.tileLayer(
      'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      { attribution: '&copy; OpenTopoMap' }
    );

    osmLayer.addTo(map);

    L.control.layers(
      {
        OpenStreetMap: osmLayer,
        Topographic: topoLayer,
      },
      null,
      { position: 'topright' }
    ).addTo(map);

    /* =====================================================
       LOAD STORY (SUBMISSION 1 – AMAN)
       ===================================================== */
    let response;
    try {
      response = await getStories(token);
    } catch (error) {
      storyList.innerHTML =
        '<p role="alert">Gagal memuat data story</p>';
      storyList.setAttribute('aria-busy', 'false');
      showToast('Gagal memuat data story', 'error');
      return;
    }

    storyList.innerHTML = '';
    storyList.setAttribute('aria-busy', 'false');

    if (!response?.listStory?.length) {
      storyList.innerHTML = '<p>Belum ada story</p>';
      return;
    }

    /* =====================================================
       SINKRONISASI LIST ↔ MAP
       ===================================================== */
    const markers = [];

    response.listStory.forEach((story) => {
      const article = document.createElement('article');
      article.className = 'story-card';
      article.tabIndex = 0;
      article.setAttribute('role', 'button');
      article.setAttribute(
        'aria-label',
        `Story oleh ${story.name}`
      );

      article.innerHTML = `
        <div class="story-header">
          <strong>${story.name}</strong>
        </div>

        <img
          src="${story.photoUrl}"
          alt="Foto story oleh ${story.name}"
          loading="lazy"
        />

        <div class="story-body">
          <p>${story.description}</p>
          <small>${new Date(
            story.createdAt
          ).toLocaleString()}</small>
        </div>
      `;

      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon])
          .addTo(map)
          .bindPopup(
            `<strong>${story.name}</strong><br>${story.description}`
          );

        markers.push(marker);

        const focusToMarker = () => {
          map.setView([story.lat, story.lon], 10, {
            animate: true,
          });

          markers.forEach((m) => m.closePopup());
          marker.openPopup();
        };

        article.addEventListener('click', focusToMarker);
        article.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') focusToMarker();
        });
      }

      storyList.appendChild(article);
    });
  }
}
