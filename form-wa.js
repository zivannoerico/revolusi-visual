function showPopup(message, isSuccess = true) {
    const popup = document.createElement('div');
    popup.innerText = message;
    
    Object.assign(popup.style, {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: isSuccess ? '#4CAF50' : '#F44336',
        color: 'white',
        padding: '16px 24px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        fontFamily: 'sans-serif',
        fontSize: '16px',
        fontWeight: '500',
        zIndex: '9999',
        opacity: '0',
        transition: 'opacity 0.3s ease-in-out',
        textAlign: 'center'
    });

    document.body.appendChild(popup);

    // Animasi muncul
    setTimeout(() => {
        popup.style.opacity = '1';
    }, 10);

    // Hilangkan setelah 3 detik
    setTimeout(() => {
        popup.style.opacity = '0';
        setTimeout(() => {
            popup.remove();
        }, 300); // Tunggu transisi selesai
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    const pdfForm = document.getElementById('pdfForm');
    const inputName = document.getElementById('inputName');
    const inputPhone = document.getElementById('inputPhone');
    const btnSubmit = document.getElementById('btnSubmit');
    
    if (pdfForm) {
        pdfForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Ubah state tombol menjadi loading
            const originalText = btnSubmit.innerText;
            btnSubmit.innerText = 'Mengirim...';
            btnSubmit.disabled = true;

            const nameValue = inputName.value;
            let phoneValue = inputPhone.value;
            
            // Format nomor telepon (Ganti angka 0 di depan dengan 62)
            // Hilangkan semua karakter yang bukan angka
            phoneValue = phoneValue.replace(/\D/g, ''); 
            if (phoneValue.startsWith('0')) {
                phoneValue = '62' + phoneValue.substring(1);
            } else if (phoneValue.startsWith('8')) {
                phoneValue = '62' + phoneValue;
            }

            // Tambahkan @c.us untuk format Whatsapp API
            const chatId = phoneValue + '@c.us';

            const url = 'https://api-wa.ilhamyanuartaufiki.my.id/api/sendText';
            const apiKey = 'rahasia123';

            const bodyData = {
                "session": "default",
                "chatId": chatId,
                "text": `Halo ${nameValue}, Berikut file PDF kamu:\n\nhttp://laly.space/laragon-wamp.exe`
            };

            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey
                },
                body: JSON.stringify(bodyData)
            })
            .then(async response => {
                if (response.ok) {
                    showPopup('Terimakasih, Kami sudah mengirimkan ke Whatsapp anda', true);
                    pdfForm.reset();
                } else {
                    const errorText = await response.text();
                    throw new Error(errorText || 'Gagal mengirim pesan');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                showPopup('Terjadi kesalahan saat mengirim pesan.', false);
            })
            .finally(() => {
                // Kembalikan tombol seperti semula
                btnSubmit.innerText = originalText;
                btnSubmit.disabled = false;
            });
        });
    }
});
