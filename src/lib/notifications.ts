// Audio Chime Synthesizer for notifications
const playNotificationSound = () => {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch (e) {
    // Audio context may be restricted by browser autoplay policy
  }
};

type ToastCallback = (title: string, message: string, type?: 'success' | 'info' | 'warning') => void;
const toastListeners = new Set<ToastCallback>();

export const subscribeToast = (callback: ToastCallback) => {
  toastListeners.add(callback);
  return () => {
    toastListeners.delete(callback);
  };
};

export const triggerToast = (title: string, message: string, type: 'success' | 'info' | 'warning' = 'info') => {
  playNotificationSound();
  setTimeout(() => {
    toastListeners.forEach(cb => cb(title, message, type));
  }, 0);
};

export const requestNativeNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    return true;
  }
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  return false;
};

export const sendNativeNotification = (title: string, body: string, options?: NotificationOptions) => {
  // Always trigger audio & in-app toast banner
  triggerToast(title, body, 'info');

  if (!('Notification' in window)) return;

  if (Notification.permission === 'granted') {
    try {
      const notification = new Notification(title, {
        body,
        icon: '/logo.png',
        badge: '/logo.png',
        dir: 'auto',
        ...options,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (e) {
      console.warn('Native notification failed:', e);
    }
  }
};

