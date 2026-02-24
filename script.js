// Global mesaj değişkeni
window.lastWhatsAppMessage = "Merhaba, genel bir transfer teklifi almak istiyorum.";

const WHATSAPP_NUMBERS = [
  { label: "VIP Transfer Hattı", number: "905391196307" }
];

/**
 * WhatsApp linkini günceller ve modal varsa açar.
 * NOT: Modal yoksa kesinlikle otomatik WhatsApp açmaz (Ads botları için daha güvenli).
 */
function openNumberSelection() {
  const message = encodeURIComponent(window.lastWhatsAppMessage || "");
  const waUrl = `https://wa.me/${WHATSAPP_NUMBERS[0].number}?text=${message}`;

  // Linkleri güncelle
  const links = document.querySelectorAll('.modal-link-1, .modal-link-2, .modal-link-select');
  links.forEach(link => {
    link.setAttribute('href', waUrl);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener');
  });

  // Modal varsa aç
  const modalElement = document.getElementById('numberSelectionModal');
  if (modalElement && typeof bootstrap !== "undefined") {
    const myModal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
    myModal.show();
  } else {
    // Modal yoksa kullanıcıya tıklama gerektiren bir alternatif göster
    // (İstersen burada ekranda küçük bir toast/alert de gösterebilirsin)
    console.warn("Modal bulunamadı. WhatsApp linki hazır:", waUrl);
  }
}

/**
 * Araçlar sayfasındaki "Fiyat Al" butonları için
 */
function setVehicleMessage(message) {
  window.lastWhatsAppMessage = message;
  openNumberSelection();
}

/**
 * Form gönderildiğinde (index sayfasında) çalışır
 * Güvenli yaklaşım: Modal açılıyor ama otomatik harici yönlendirme yok.
 */
function sendToWhatsApp(event) {
  if (event) event.preventDefault();

  const kalkis = document.getElementById('kalkis')?.value || "Belirtilmedi";
  const varis = document.getElementById('varis')?.value || "Belirtilmedi";
  const tarih = document.getElementById('tarih')?.value || "Belirtilmedi";
  const saat = document.getElementById('saat')?.value || "Belirtilmedi";
  const aracTipiSelect = document.getElementById('arac-tipi');
  const aracTipi = aracTipiSelect ? aracTipiSelect.options[aracTipiSelect.selectedIndex].text : "Belirtilmedi";

  const message =
    `*Yeni Transfer Teklifi Talebi*\n\n` +
    `📍 *Kalkış:* ${kalkis}\n` +
    `🏁 *Varış:* ${varis}\n` +
    `📅 *Tarih:* ${tarih}\n` +
    `⏰ *Saat:* ${saat}\n` +
    `🚗 *Araç:* ${aracTipi}\n\n` +
    `Lütfen fiyat teklifinizi iletiniz.`;

  window.lastWhatsAppMessage = message;
  openNumberSelection();
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('offer-request-form');
  if (form) form.addEventListener('submit', sendToWhatsApp);

  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 1200, once: true });
  }
});
