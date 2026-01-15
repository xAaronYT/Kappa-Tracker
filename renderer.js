let state = { completedQuests: [], collectorItems: [] };
let data = [];
let currentTrader = 'All';
let currentStateFilter = 'hideCompleted';
let openCardId = null;

const collectorItemsList = ["Old firesteel", "Antique axe", "Battered antique book", "#FireKlean gun lube", "Golden rooster figurine", "Silver Badge", "Deadlyslob's beard oil", "Golden 1GPhone smartphone", "Jar of DevilDog mayo", "Can of sprats", "Fake mustache", "Kotton beanie", "Raven figurine", "Pestily plague mask", "Shroud half-mask", "Can of Dr. Lupo's coffee beans", "42 Signature Blend English Tea", "Veritas guitar pick", "Armband (Evasion)", "Can of RatCola soda", "Loot Lord plushie", "WZ Wallet", "LVNDMARK's rat poison", "Smoke balaclava", "Missam forklift key", "Video cassette with the Cyborg Killer movie", "BakeEzy cook book", "JohnB Liquid DNB glasses", "Glorious E lightweight armored mask", "Baddie's red beard", "DRD body armor", "Gingy keychain", "Golden egg", "Press pass (issued for NoiceGuy)", "Axel parrot figurine", "BEAR Buddy plush toy", "Inseq gas pipe wrench", "Viibiin sneaker", "Tamatthi kunai knife replica", "Nut Sack balaclava", "Mazoni golden dumbbell", "Tigzresq splint", "Domontovich ushanka hat"];

function formatName(n) { if(!n) return "unknown"; return n.toLowerCase().replace(/[\s-]/g, '_').replace(/[',#().;:]/g, '').replace(/_+/g, '_'); }

async function forceSave() { if (window.api && window.api.save) await window.api.save(state); }

async function init() {
    try {
        const res = await fetch('./quests_updated.json');
        data = await res.json();
        if (window.api && window.api.load) {
            const loaded = await window.api.load();
            if (loaded) { state.completedQuests = loaded.completedQuests || []; state.collectorItems = loaded.collectorItems || []; }
        }
        renderTraders(); updateStash(); render();
    } catch (e) { console.error("Init Error:", e); }
}

function renderTraders() {
    const traders = [...new Set(data.map(q => q.trader?.name).filter(Boolean))];
    document.getElementById('trader-list').innerHTML = traders.map(t => `
        <div class="trader-card ${t === currentTrader ? 'active' : ''}" onclick="setTraderFilter('${t}')">
            <img src="./assets/traders/${formatName(t)}.png" class="trader-img" onerror="this.src='https://via.placeholder.com/40/222'">
            <span style="font-size:0.7rem; font-weight:bold;">${t.toUpperCase()}</span>
        </div>`).join('');
}

function updateStash() {
    document.getElementById('stash-list').innerHTML = collectorItemsList.map(item => `
        <div class="stash-item ${state.collectorItems.includes(item) ? 'found' : ''}" onclick="toggleItem('${item.replace(/'/g, "\\'")}')">
            <img src="./assets/items/${formatName(item)}.png" title="${item}" onerror="this.src='https://via.placeholder.com/40/222'">
        </div>`).join('');
    const percent = Math.round((state.collectorItems.length / collectorItemsList.length) * 100);
    document.getElementById('k-bar').style.width = percent + '%';
    document.getElementById('k-stats').innerText = `${state.collectorItems.length}/${collectorItemsList.length}`;
}

function render() {
    const list = document.getElementById('list');
    const search = document.getElementById('search-input').value.toLowerCase();
    list.innerHTML = '';

    const filtered = data.filter(q => {
        const matchTrader = currentTrader === 'All' || q.trader?.name === currentTrader;
        const matchSearch = q.name.toLowerCase().includes(search);
        const isDone = state.completedQuests.includes(q.id);
        if (currentStateFilter === 'hideCompleted' && isDone) return false;
        if (currentStateFilter === 'kappaRem' && (!q.kappaRequired || isDone)) return false;
        if (currentStateFilter === 'lkRem' && (!q.lightkeeperRequired || isDone)) return false;
        return matchTrader && matchSearch;
    });

    const total = data.length, done = state.completedQuests.length;
    const kappa = data.filter(q => q.kappaRequired), kDone = kappa.filter(q => state.completedQuests.includes(q.id)).length;
    const lk = data.filter(q => q.lightkeeperRequired), lkDone = lk.filter(q => state.completedQuests.includes(q.id)).length;
    document.getElementById('q-bar').style.width = (done / (total || 1) * 100) + '%'; document.getElementById('q-stats').innerText = `${done}/${total}`;
    document.getElementById('lk-bar').style.width = (lkDone / (lk.length || 1) * 100) + '%'; document.getElementById('lk-stats').innerText = `${lkDone}/${lk.length}`;

    filtered.forEach(q => {
        const isDone = state.completedQuests.includes(q.id);
        const isOpen = openCardId === q.id;
        const card = document.createElement('div');
        card.className = `card ${isDone ? 'done' : ''} ${isOpen ? 'open' : ''}`;
        card.innerHTML = `
            <div style="display:flex; height:100%;">
                <div class="card-main" onclick="toggleQuest('${q.id}')">
                    <div class="card-info">
                        <span class="card-title">${q.name}</span>
                        <span class="trader-sub">${q.trader?.name || 'Unknown'}</span>
                        ${q.lightkeeperRequired ? '<span class="tag lk-tag">LK</span>' : ''}
                        ${q.kappaRequired ? '<span class="tag kappa-tag">KAPPA</span>' : ''}
                    </div>
                </div>
                <div class="drop-btn" onclick="toggleDetails(event, '${q.id}')">
                    <span class="arrow-icon"></span>
                </div>
            </div>
            <div class="card-details">
                <div class="section-title">Objectives</div>
                ${(q.objectives || []).map(o => `<div class="obj-item">${o.description} ${o.count ? `(${o.count})` : ''}</div>`).join('')}
                <div class="section-title">Rewards</div>
                <div style="color:#888;">EXP: ${q.experience}</div>
                <div style="color:#888;">Standing: ${(q.finishRewards?.traderStanding || []).map(s => `${s.trader.name} +${s.standing}`).join(', ') || 'None'}</div>
                <a href="${q.wikiLink}" target="_blank" class="wiki-link">Wiki Page</a>
            </div>`;
        list.appendChild(card);
    });
    
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    const btnIdMap = { 'hideCompleted': 'f-hide', 'kappaRem': 'f-kappaRem', 'lkRem': 'f-lkRem', 'showAll': 'f-all' };
    const activeBtn = document.getElementById(btnIdMap[currentStateFilter]);
    if (activeBtn) activeBtn.classList.add('active');
}

window.toggleDetails = (e, id) => { e.stopPropagation(); openCardId = openCardId === id ? null : id; render(); };
window.setTraderFilter = (f) => { currentTrader = f; renderTraders(); render(); };
window.setStateFilter = (f) => { currentStateFilter = f; render(); };
window.toggleQuest = async (id) => { state.completedQuests = state.completedQuests.includes(id) ? state.completedQuests.filter(i => i !== id) : [...state.completedQuests, id]; await forceSave(); render(); };
window.toggleItem = async (itemName) => { state.collectorItems = state.collectorItems.includes(itemName) ? state.collectorItems.filter(i => i !== itemName) : [...state.collectorItems, itemName]; await forceSave(); updateStash(); };
window.resetProgress = async () => { if (confirm("WIPE ALL PROGRESS?")) { state = { completedQuests: [], collectorItems: [] }; await forceSave(); updateStash(); render(); } };

init();