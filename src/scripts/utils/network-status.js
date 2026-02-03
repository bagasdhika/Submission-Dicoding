import { showToast } from './toast';

const updateNetworkStatus = () => {
  if (!navigator.onLine) {
    showToast('Anda sedang offline', 'warning');
  } else {
    showToast('Kembali online', 'success');
  }
};

const initNetworkStatus = () => {
  window.addEventListener('offline', updateNetworkStatus);
  window.addEventListener('online', updateNetworkStatus);
};

export default initNetworkStatus;
