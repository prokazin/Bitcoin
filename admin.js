let data = null;

async function loadAdminData() {
    try {
        const response = await fetch('data.json');
        data = await response.json();
        populateForm();
    } catch (error) {
        data = getDefaultData();
        populateForm();
    }
}

function getDefaultData() {
    return {
        mainTitle: 'Добро пожаловать в мир криптовалют',
        mainDesc: 'Следите за курсами и новостями в реальном времени',
        btcTitle: 'Bitcoin',
        btcPrice: '$67,432',
        btcChange: '+2.4%',
        btcHash: '623 EH/s',
        btcBlocks: '845,231',
        btcDiff: '89.6T',
        aboutText: 'Мы отслеживаем криптовалюты с 2018 года. Наша цель — предоставлять актуальную информацию в удобном формате.',
        news: [
            { title: 'Биткоин обновил максимум', date: '2026-07-08', text: 'Курс BTC достиг нового исторического рекорда на фоне институциональных инвестиций.' },
            { title: 'Ethereum 2.0: обновление', date: '2026-07-07', text: 'Сеть Ethereum успешно обновилась, увеличив пропускную способность.' },
            { title: 'Регулирование крипты', date: '2026-07-06', text: 'Новые законы о криптовалютах вступают в силу в нескольких странах.' }
        ]
    };
}

function populateForm() {
    document.getElementById('mainTitleInput').value = data.mainTitle || '';
    document.getElementById('mainDescInput').value = data.mainDesc || '';
    document.getElementById('btcTitleInput').value = data.btcTitle || '';
    document.getElementById('btcPriceInput').value = data.btcPrice || '';
    document.getElementById('btcChangeInput').value = data.btcChange || '';
    document.getElementById('btcHashInput').value = data.btcHash || '';
    document.getElementById('btcBlocksInput').value = data.btcBlocks || '';
    document.getElementById('btcDiffInput').value = data.btcDiff || '';
    document.getElementById('aboutTextInput').value = data.aboutText || '';
    renderNewsAdmin();
}

function renderNewsAdmin() {
    const list = document.getElementById('newsList');
    if (!list) return;
    
    list.innerHTML = data.news.map((item, index) => `
        <div class="news-item-admin" data-index="${index}">
            <input type="text" value="${item.title}" placeholder="Заголовок" class="news-title">
            <input type="text" value="${item.date}" placeholder="Дата" class="news-date">
            <textarea placeholder="Текст новости" class="news-text">${item.text}</textarea>
            <button onclick="deleteNews(${index})" class="delete-btn">Удалить</button>
        </div>
    `).join('');
}

function deleteNews(index) {
    data.news.splice(index, 1);
    renderNewsAdmin();
}

function addNews() {
    data.news.push({ title: 'Новая новость', date: '2026-07-08', text: 'Текст новости...' });
    renderNewsAdmin();
}

async function saveData() {
    const status = document.getElementById('saveStatus');
    status.className = 'save-status';
    status.style.display = 'none';
    
    // Собираем данные из формы
    data.mainTitle = document.getElementById('mainTitleInput').value;
    data.mainDesc = document.getElementById('mainDescInput').value;
    data.btcTitle = document.getElementById('btcTitleInput').value;
    data.btcPrice = document.getElementById('btcPriceInput').value;
    data.btcChange = document.getElementById('btcChangeInput').value;
    data.btcHash = document.getElementById('btcHashInput').value;
    data.btcBlocks = document.getElementById('btcBlocksInput').value;
    data.btcDiff = document.getElementById('btcDiffInput').value;
    data.aboutText = document.getElementById('aboutTextInput').value;
    
    // Собираем новости
    const newsItems = document.querySelectorAll('.news-item-admin');
    data.news = [];
    newsItems.forEach(item => {
        const title = item.querySelector('.news-title').value;
        const date = item.querySelector('.news-date').value;
        const text = item.querySelector('.news-text').value;
        data.news.push({ title, date, text });
    });
    
    try {
        const response = await fetch('data.json', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data, null, 2)
        });
        
        if (response.ok) {
            status.className = 'save-status success';
            status.textContent = '✅ Данные успешно сохранены!';
            status.style.display = 'block';
            
            // Обновляем главную страницу
            window.opener?.location.reload();
        } else {
            throw new Error('Ошибка сохранения');
        }
    } catch (error) {
        // Если не работает PUT, сохраняем в localStorage
        localStorage.setItem('cryptoData', JSON.stringify(data));
        status.className = 'save-status success';
        status.textContent = '✅ Данные сохранены в локальное хранилище!';
        status.style.display = 'block';
        
        // Показываем инструкцию для GitHub Pages
        status.innerHTML += '<br><small>Для GitHub Pages: скачайте data.json и загрузите вручную</small>';
    }
}

// Загружаем данные при открытии
loadAdminData();
