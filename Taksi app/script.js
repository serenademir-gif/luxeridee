
// Global mesaj değişkeni
window.lastWhatsAppMessage = "Merhaba, genel bir transfer teklifi almak istiyorum."; 

// WHATSAPP_NUMBERS: Numara sadece rakamlardan oluşmalı (Başına ülke kodu 90 eklenmiştir)
const WHATSAPP_NUMBERS = [
    { label: "Acil Durum & VIP", number: "905391196307" } 
];

function openNumberSelection() {
    const message = encodeURIComponent(window.lastWhatsAppMessage);
    
    // Modal içindeki linkleri seç
    const links = document.querySelectorAll('.modal-link-select');
    
    // Dizi 0'dan başlar, bu yüzden [0] kullanarak ilk numarayı alıyoruz
    links.forEach(link => {
        link.setAttribute('href', `https://wa.me/${WHATSAPP_NUMBERS[0].number}?text=${message}`);
    });

    // Modal'ı tetikle
    var modalElement = document.getElementById('numberSelectionModal');
    if (modalElement) {
        var myModal = new bootstrap.Modal(modalElement);
        myModal.show();
    } else {
        // Eğer modal yoksa direkt yönlendir (Yedek plan)
        window.open(`https://wa.me/${WHATSAPP_NUMBERS[0].number}?text=${message}`, '_blank');
    }
}

function sendToWhatsApp(event) {
    if (event) event.preventDefault(); // Formun sayfayı yenilemesini engelle

    // Form elemanlarını alırken hata payını azaltmak için kontrol
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

function setVehicleMessage(message) {
    window.lastWhatsAppMessage = message;
    openNumberSelection(); 
}

// Sayfa yüklendiğinde çalışacaklar
document.addEventListener('DOMContentLoaded', () => {
    // Formun submit olayını dinle
    const form = document.getElementById('offer-request-form');
    if (form) {
        form.addEventListener('submit', sendToWhatsApp);
        console.log("Form dinleyicisi başarıyla bağlandı.");
    }

    // Yorumları yükle
    loadComments();

    // Yorum formu kontrolü
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('comment-name').value;
            const rating = document.getElementById('comment-rating').value;
            const text = document.getElementById('comment-text').value;

            const newComment = {
                name: name,
                rating: parseInt(rating),
                text: text,
                date: new Date().toLocaleDateString('tr-TR')
            };

            saveComment(newComment);
            addCommentToUI(newComment);
            this.reset();
        });
    }
});

// YORUM SİSTEMİ FONKSİYONLARI
function addCommentToUI(comment) {
    const commentsList = document.getElementById('comments-list');
    if(!commentsList) return;
    
    let stars = "";
    for(let i=0; i<5; i++) {
        stars += `<i class="fas fa-star ${i < comment.rating ? 'text-warning' : 'text-muted'}"></i>`;
    }

    const commentHTML = `
        <div class="col-md-4 mb-3">
            <div class="card bg-secondary text-white h-100 border-0 p-3 shadow-sm" style="border-left: 3px solid #ffc107 !important;">
                <div class="mb-2">${stars}</div>
                <p class="card-text">"${comment.text}"</p>
                <div class="d-flex justify-content-between align-items-center mt-auto">
                    <h6 class="fw-bold mb-0">- ${comment.name}</h6>
                    <small class="opacity-50">${comment.date}</small>
                </div>
            </div>
        </div>
    `;
    commentsList.insertAdjacentHTML('afterbegin', commentHTML);
}

function saveComment(comment) {
    let comments = JSON.parse(localStorage.getItem('userComments')) || [];
    comments.push(comment);
    localStorage.setItem('userComments', JSON.stringify(comments));
}

function loadComments() {
    let comments = JSON.parse(localStorage.getItem('userComments')) || [];
    comments.forEach(comment => addCommentToUI(comment));
}