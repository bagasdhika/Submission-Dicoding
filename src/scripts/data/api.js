import CONFIG from '../config';

/* =========================================================
   ENDPOINTS
   (DITAMBAH TANPA MENGUBAH ENDPOINT LAMA)
   ========================================================= */
const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,

  STORIES: `${CONFIG.BASE_URL}/stories`,
  STORIES_GUEST: `${CONFIG.BASE_URL}/stories/guest`,

  // SUBMISSION 2 (PUSH NOTIFICATION)
  NOTIFICATION: `${CONFIG.BASE_URL}/notifications/subscribe`,
};

/* =========================================================
   AUTHENTICATION (SUBMISSION 1 – TIDAK DIUBAH)
   ========================================================= */
export async function registerUser({ name, email, password }) {
  const response = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password }),
  });

  return response.json();
}

export async function loginUser({ email, password }) {
  const response = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  return response.json();
}

/* =========================================================
   STORY (SUBMISSION 1 – PERILAKU TETAP)
   ========================================================= */

/**
 * NOTE:
 * - Parameter page & size diberi default
 * - TIDAK memengaruhi pemanggilan lama
 */
export async function getStories(token, page = 1, size = 10) {
  const response = await fetch(
    `${ENDPOINTS.STORIES}?page=${page}&size=${size}&location=1`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.json();
}

export async function getStoryDetail(id, token) {
  const response = await fetch(`${ENDPOINTS.STORIES}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
}

export async function addStory(formData, token) {
  const response = await fetch(ENDPOINTS.STORIES, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      // JANGAN set Content-Type untuk FormData
    },
    body: formData,
  });

  return response.json();
}

export async function addStoryGuest(formData) {
  const response = await fetch(ENDPOINTS.STORIES_GUEST, {
    method: 'POST',
    body: formData,
  });

  return response.json();
}

/* =========================================================
   PUSH NOTIFICATION (SUBMISSION 2 – BARU)
   ========================================================= */

/**
 * Digunakan saat subscribe push
 */
export async function subscribeNotification(data, token) {
  const response = await fetch(ENDPOINTS.NOTIFICATION, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

/**
 * Digunakan saat unsubscribe push
 */
export async function unsubscribeNotification(endpoint, token) {
  const response = await fetch(ENDPOINTS.NOTIFICATION, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ endpoint }),
  });

  return response.json();
}
