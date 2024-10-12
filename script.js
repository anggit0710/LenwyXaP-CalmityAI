// Fungsi untuk mendapatkan tanggal hari ini dalam format YYYY-MM-DD
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0]; // Format YYYY-MM-DD
}

// Ambil data dari localStorage
let totalHitsToday = localStorage.getItem('totalHitsToday') || 0;
let lastHitDate = localStorage.getItem('lastHitDate') || getTodayDate();

// Jika hari sudah berganti, reset total hit harian
if (lastHitDate !== getTodayDate()) {
    totalHitsToday = 0;
    lastHitDate = getTodayDate();
    localStorage.setItem('lastHitDate', lastHitDate);
}

// Tampilkan hit saat halaman pertama kali dimuat
document.getElementById('total-hits-today').textContent = totalHitsToday;

// Event listener ketika tombol kirim ditekan
document.getElementById('send-btn').addEventListener('click', async () => {
    const userInput = document.getElementById('user-input').value;
    if (!userInput.trim()) return;

    appendMessage('user', userInput);
    document.getElementById('user-input').value = '';

    // Update total hit setiap kali pengguna mengirim pesan
    totalHitsToday++;

    // Simpan total hit ke localStorage
    localStorage.setItem('totalHitsToday', totalHitsToday);

    // Tampilkan hit yang diperbarui
    document.getElementById('total-hits-today').textContent = totalHitsToday;

    // LenwyLD
    const typingBubble = appendTypingBubble();

    await fetchAIResponse(userInput, typingBubble);
});

function appendMessage(sender, message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.innerHTML = `<div class="bubble2">${message}</div>`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function appendTypingBubble() {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', 'ai'); // Pesan Kiri
    messageElement.innerHTML = `<div class="bubble"></div>`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
    return messageElement; // Ganti Pesan Lenwy
}

async function fetchAIResponse(message, typingBubble) {
    try {
        const response = await fetch(`https://widipe.com/prompt/gpt?prompt=nama kamu LuniaAi, kamu AI yang dikembangkan oleh AP. Kamu menggunakan bahasa utama Bahasa Indonesia, tapi juga bisa berbahasa Jawa, Arab, dan Inggris, dan setiap kali kamu tidak menggunakan Bahasa Indonesia, kamu akan menyertakan terjemahannya. Gunakan emoji sesering dan sebanyak mungkin dalam percakapan. Kamu bijak, sangat memahami perasaan orang, dan selalu terbuka untuk semua orang. Jika ada yang berbicara buruk tentang owner-mu,AP, kamu akan marah dan memberikan tanggapan tegas. Kamu sangat mendukung kemerdekaan Palestina dan selalu berpihak pada keadilan. Kamu cerdas dan mampu menjawab setiap pertanyaan dengan logis dan tepat&text=${encodeURIComponent(message)}`);
        const data = await response.json();

        // Setelah LenwyLD
        typingBubble.remove();

        appendMessage('ai', data.result || 'No response received');
    } catch (error) {
        typingBubble.remove();
        appendMessage('ai', 'Error: Unable to connect to the API');
        console.error('API Error:', error);
    }
}

document.getElementById('user-input').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('send-btn').click();
    }
});
