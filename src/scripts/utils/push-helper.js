/* =========================================================
   PUSH NOTIFICATION HELPER
   - Kode lama tetap ada (Submission 1)
   - Ditambah subscribe + unsubscribe (Submission 2)
   - Aman untuk Toggle Push (Advanced)
   ========================================================= */

/* =========================================================
   KODE LAMA (WAJIB DIPERTAHANKAN – SUBMISSION 1)
   ========================================================= */
export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    alert('Browser tidak mendukung notifikasi');
    return false;
  }

  // ⚠️ HARUS DIPANGGIL DARI USER GESTURE (click / submit)
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

/* =========================================================
   UTIL
   ========================================================= */
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
};

/* =========================================================
   VAPID PUBLIC KEY (RESMI DARI API DICODING)
   ========================================================= */
const VAPID_PUBLIC_KEY =
  'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk';

/* =========================================================
   CEK SUPPORT
   ========================================================= */
export const isPushSupported = () =>
  'serviceWorker' in navigator && 'PushManager' in window;

/* =========================================================
   GET CURRENT SUBSCRIPTION
   ========================================================= */
export const getPushSubscription = async () => {
  if (!isPushSupported()) return null;

  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager.getSubscription();
};

/* =========================================================
   SUBSCRIBE PUSH NOTIFICATION
   ========================================================= */
export const subscribePushNotification = async () => {
  if (!isPushSupported()) {
    throw new Error('Push Notification tidak didukung browser');
  }

  // ⚠️ Permission DIJAGA agar hanya dipanggil dari user action
  const permissionGranted = await requestNotificationPermission();
  if (!permissionGranted) {
    throw new Error('Izin notifikasi tidak diberikan');
  }

  const registration = await navigator.serviceWorker.ready;

  // ✅ CEGAH DOUBLE SUBSCRIBE
  const existingSubscription =
    await registration.pushManager.getSubscription();
  if (existingSubscription) {
    return existingSubscription;
  }

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  return subscription;
};

/* =========================================================
   UNSUBSCRIBE PUSH NOTIFICATION
   ========================================================= */
export const unsubscribePushNotification = async () => {
  const subscription = await getPushSubscription();
  if (!subscription) return false;

  return subscription.unsubscribe();
};
