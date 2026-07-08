let data = null;

async function loadData() {
    try {
        const response = await fetch('data.json');
        data = await response.json();
        updateUI();
    } catch (error) {
        console.log('Загружены стандартные данные');
        data = getDefaultData();
        updateUI();
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

function updateUI() {
    document.getElementById('mainTitle').textContent = data.mainTitle;
    document.getElementById('mainDesc').textContent = data.mainDesc;
    document.getElementById('btcTitle').textContent = data.btcTitle;
    document.getElementById('btcPrice').textContent = data.btcPrice;
    document.getElementById('btcChange').textContent = data.btcChange;
    document.getElementById('aboutText').textContent = data.aboutText;
    
    // Обновляем статы на задней стороне биткоина
    const stats = document.getElementById('coinStats');
    if (stats) {
        stats.innerHTML = `
            <p>Хэшрейт: ${data.btcHash}</p>
            <p>Блоков: ${data.btcBlocks}</p>
            <p>Сложность: ${data.btcDiff}</p>
        `;
    }
    
    renderNews();
}

function renderNews() {
    const grid = document.getElementById('newsGrid');
    if (!grid) return;
    
    grid.innerHTML = data.news.map(item => `
        <div class="news-item">
            <h3>${item.title}</h3>
            <div class="date">${item.date}</div>
            <p>${item.text}</p>
        </div>
    `).join('');
}

// Перезагрузка данных при изменении
loadData();

// Проверяем обновления каждые 30 секунд
setInterval(loadData, 30000);
