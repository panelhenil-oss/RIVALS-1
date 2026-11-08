/* ==========================================================
   SCRIPT VAULT — logika za dugmad "Copy"
   Ovaj fajl NE treba mijenjati — sav sadržaj se mijenja
   direktno u index.html (naslovi i tekst unutar kartica).
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const toast = document.getElementById('toast');
  let toastTimeout = null;

  // Jedino gornje dugme kopira sadržaj obe skripte.
  const copyButton = document.getElementById('copy-all');

  if (copyButton) {
    copyButton.addEventListener('click', () => handleCopyClick(copyButton));
  }

  async function handleCopyClick(button) {
    const scriptBlock = document.getElementById('content-1');
    const textToCopy = scriptBlock ? scriptBlock.textContent.trim() : '';

    const success = await copyToClipboard(textToCopy);

    if (success) {
      showCopiedState(button);
      showToast('Kopirano u clipboard');
    } else {
      showToast('Kopiranje nije uspjelo — pokušaj ponovo');
    }
  }

  // Kopiranje u clipboard, sa fallback-om za starije browsere / ne-HTTPS
  async function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.warn('navigator.clipboard nije uspio, koristim fallback.', err);
      }
    }

    // Fallback metoda (radi i na starijim browserima)
    try {
      const tempTextarea = document.createElement('textarea');
      tempTextarea.value = text;
      tempTextarea.style.position = 'fixed';
      tempTextarea.style.opacity = '0';
      document.body.appendChild(tempTextarea);
      tempTextarea.focus();
      tempTextarea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(tempTextarea);
      return successful;
    } catch (err) {
      console.error('Kopiranje nije uspjelo:', err);
      return false;
    }
  }

  // Privremeno mijenja izgled dugmeta u "Copied!" sa kvačicom
  function showCopiedState(button) {
    const textEl = button.querySelector('.copy-btn__text');
    const originalText = textEl.textContent;

    button.classList.add('is-copied');
    textEl.textContent = 'Copied!';

    setTimeout(() => {
      button.classList.remove('is-copied');
      textEl.textContent = originalText;
    }, 2000);
  }

  // Prikazuje malu poruku (toast) na dnu ekrana
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('is-visible');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2200);
  }
});
