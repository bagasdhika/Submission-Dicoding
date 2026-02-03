const toastContainerId = 'toast-container';

const createContainer = () => {
  let container = document.getElementById(toastContainerId);

  if (!container) {
    container = document.createElement('div');
    container.id = toastContainerId;
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-atomic', 'true');
    document.body.appendChild(container);
  }

  return container;
};

export const showToast = (message, type = 'success') => {
  const container = createContainer();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'status');
  toast.tabIndex = 0;

  toast.innerHTML = `
    <span>${message}</span>
    <button aria-label="Tutup notifikasi">&times;</button>
  `;

  const close = () => {
    toast.classList.add('hide');
    setTimeout(() => toast.remove(), 300);
  };

  toast.querySelector('button').addEventListener('click', close);

  container.appendChild(toast);

  setTimeout(close, 3000);
};
