// Global mesaj değişkeni
window.lastWhatsAppMessage = "Merhaba, genel bir transfer teklifi almak istiyorum."; 

const WHATSAPP_NUMBERS = [
    { label: "VIP Transfer Hattı", number: "905391196307" } 
];

/**
 * WhatsApp Modalını açar ve mesajı linke yerleştirir.
 */
function openNumberSelection() {
    const message = encodeURIComponent(window.lastWhatsAppMessage);
    
    // Tüm sayfalardaki farklı class isimlerini aynı anda kontrol eder
    const links = document.querySelectorAll('.modal-link-1, .modal-link-2, .modal-link-select');
    
    links.forEach(link => {
        link.setAttribute('href', `https://wa.me/${WHATSAPP_NUMBERS[0].number}?text=${message}`);
    });

    const modalElement = document.getElementById('numberSelectionModal');
    if (modalElement) {
        const myModal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
        myModal.show();
    } else {
        // Modal yoksa direkt WhatsApp'a yönlendir (Failsafe)
        window.open(`https://wa.me/${WHATSAPP_NUMBERS[0].number}?text=${message}`, '_blank');
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
 */
function sendToWhatsApp(event) {
    if (event) event.preventDefault();

    const kalkis = document.getElementById('kalkis')?.value || "Belirtilmedi";
    const varis = document.getElementById('varis')?.value || "Belirtilmedi";
    const tarih = document.getElementById('tarih')?.value || "Belirtilmedi";
    const saat = document.getElementById('saat')?.value || "Belirtilmedi";
    const aracTipiSelect = document.getElementById('arac-tipi');
    const aracTipi = aracTipiSelect ? aracTipiSelect.options[aracTipiSelect.selectedIndex].text : "Belirtilmedi";

    const message = `*Yeni Transfer Teklifi Talebi*\n\n` +
                    `📍 *Kalkış:* ${kalkis}\n` +
                    `🏁 *Varış:* ${varis}\n` +
                    `📅 *Tarih:* ${tarih}\n` +
                    `⏰ *Saat:* ${saat}\n` +
                    `🚗 *Araç:* ${aracTipi}\n\n` +
                    `Lütfen fiyat teklifinizi iletiniz.`;

    window.lastWhatsAppMessage = message;
    openNumberSelection();
}

// Sayfa yüklendiğinde çalışacaklar
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('offer-request-form');
    if (form) form.addEventListener('submit', sendToWhatsApp);

    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 1200, once: true });
    }
});

}
