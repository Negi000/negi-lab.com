// Global config
const DATA_BASE_PATH = 'data/';

// Page load time for synchronized animations
const PAGE_LOAD_TIME = Date.now();

// Fetch helper
async function fetchJson(path) {
    // Removed cache busting for production performance
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    return await response.json();
}

// Hero Slideshow
function initHeroSlideshow() {
    const slideshow = document.querySelector('.hero-slideshow');
    if (!slideshow) return;
    
    const slides = slideshow.querySelectorAll('.slide');
    if (slides.length === 0) return;
    
    let currentIndex = 0;
    const interval = 6000; // 6秒ごとに切り替え
    
    function nextSlide() {
        slides[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % slides.length;
        slides[currentIndex].classList.add('active');
    }
    
    // 自動切り替え
    setInterval(nextSlide, interval);
}

// Mobile Menu Toggle
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navUl = document.querySelector('nav ul');
    
    if (menuBtn && navUl) {
        menuBtn.addEventListener('click', () => {
            navUl.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        navUl.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navUl.classList.remove('active');
                menuBtn.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuBtn.contains(e.target) && !navUl.contains(e.target)) {
                navUl.classList.remove('active');
                menuBtn.classList.remove('active');
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize mobile menu on all pages
    initMobileMenu();
    
    // Initialize hero slideshow
    initHeroSlideshow();
    
    try {
        // Determine current page and run appropriate logic
        const path = window.location.pathname;
        
        if (path.endsWith('characters.html')) {
            await initCharacterList();
        } else if (path.endsWith('character_detail.html')) {
            await initCharacterDetail();
        } else if (path.endsWith('index.html') || path.endsWith('/')) {
            // Optional: Load meta data or featured chars
            loadMetaData();
        }
    } catch (error) {
        console.error('Error:', error);
        document.body.innerHTML = `<div class="container"><h1 style="color:red">Error</h1><p>${error.message}</p></div>`;
    }
});

async function loadMetaData() {
    try {
        const meta = await fetchJson(`${DATA_BASE_PATH}meta.json`);
        console.log('Data last updated:', meta.last_updated);
    } catch (e) {
        console.warn('Meta data not found');
    }
}

// --- Character List Page Logic ---
async function initCharacterList() {
    const grid = document.getElementById('character-grid');
    const searchInput = document.getElementById('search-input');
    const roleFilter = document.getElementById('role-filter');
    
    if (!grid) return;

    // Load lightweight list
    const characterList = await fetchJson(`${DATA_BASE_PATH}character_list.json`);
    
    // State for pagination/filtering
    let currentFilteredList = [];
    let displayedCount = 0;
    const BATCH_SIZE = 20; // Reduced to improve initial load speed

    function getRarityAssets(char) {
        let bgNum = '01'; // Default Normal
        let badge = null;

        if (char.rarity === '一般') bgNum = '01';
        else if (char.rarity === '上級') bgNum = '02';
        else if (char.rarity === '希少') bgNum = '03';
        else if (char.rarity === '伝説') bgNum = '04';
        
        const trueSevenKnights = ['101216', '101226', '101256'];
        
        if (trueSevenKnights.includes(char.id)) {
            badge = 'Atl_UI-List_SPBG03.png';
            bgNum = '04';
        } else if (char.rarity === '伝説') {
            badge = 'Atl_UI-List_SPBG01.png';
        }

        return {
            bg: `images/icon/Atl_UI-List_GradeBG${bgNum}.png`,
            badge: badge ? `images/icon/${badge}` : null
        };
    }

    function createCard(char) {
        const card = document.createElement('div');
        card.className = 'character-card-container';
        card.onclick = () => window.location.href = `character_detail.html?id=${char.id}`;
        
        const assets = getRarityAssets(char);
        const iconPath = `images/icon/Card/Tex_HeroIcon_${char.id}Card.png`;
        
        // タイプアイコン (RoleIcon_{roleId}.png)
        const roleId = char.roleId || '0';
        const typeIconPath = `images/icon/CharacterRoleType/RoleIcon_${roleId.padStart(2, '0')}.png`;
        
        // 星アイコン (Atl_Symbol_Star_M{star}.png) - 3～6のみ
        const maxStar = char.star || '3';
        const starIconPath = `images/icon/Stars/Atl_Symbol_Star_M${maxStar}.png`;
        
        let badgeHtml = '';
        if (assets.badge) {
            // Calculate synchronized animation delay based on page load time
            const elapsed = (Date.now() - PAGE_LOAD_TIME) / 1000; // seconds since page load
            const cyclePosition = elapsed % 10; // position in 10s cycle
            const delay = ((5 - cyclePosition + 10) % 10).toFixed(2);
            
            badgeHtml = `
                <div class="card-badge-container">
                    <img src="${assets.badge}" class="card-badge" alt="badge" loading="lazy" decoding="async">
                    <div class="badge-glow" style="animation-delay: ${delay}s"></div>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="character-card-visual">
                <img src="${assets.bg}" class="card-bg-frame" alt="frame" loading="lazy" decoding="async">
                <div class="card-icon-mask">
                    <img src="${iconPath}" onerror="this.src='https://placehold.co/150x150/1a1a1a/e60012?text=No+Image'" class="card-icon" alt="${char.name}" loading="lazy" decoding="async">
                </div>
                ${badgeHtml}
                <img src="${typeIconPath}" class="card-type-icon" alt="${char.role}" loading="lazy" decoding="async" onerror="this.style.display='none'">
                <img src="${starIconPath}" class="card-star-icon" alt="${maxStar}星" loading="lazy" decoding="async" onerror="this.style.display='none'">
                <div class="card-name-overlay">
                    <span class="card-name-text">${char.name}</span>
                </div>
            </div>
        `;
        return card;
    }

    function appendItems() {
        const fragment = document.createDocumentFragment();
        const nextBatch = currentFilteredList.slice(displayedCount, displayedCount + BATCH_SIZE);
        
        nextBatch.forEach(char => {
            fragment.appendChild(createCard(char));
        });
        
        grid.appendChild(fragment);
        displayedCount += nextBatch.length;

        // If there are more items, ensure the sentinel is at the end
        if (displayedCount < currentFilteredList.length) {
            observer.observe(sentinel);
        } else {
            observer.unobserve(sentinel);
        }
    }

    function updateFilter() {
        const filterText = searchInput.value.toLowerCase();
        const filterRole = roleFilter.value;
        const rarityFilter = document.getElementById('rarity-filter');
        const filterRarity = rarityFilter ? rarityFilter.value : '';

        currentFilteredList = characterList.filter(char => {
            // 除外ID
            if (char.id === '100500') return false;
            
            const nameMatch = char.name.toLowerCase().includes(filterText);
            const roleMatch = filterRole === '' || char.role === filterRole;
            const rarityMatch = filterRarity === '' || char.rarity === filterRarity;
            return nameMatch && roleMatch && rarityMatch;
        });

        // Update results count
        const resultsInfo = document.getElementById('results-count');
        if (resultsInfo) {
            resultsInfo.textContent = `${currentFilteredList.length} 件のキャラクター`;
        }

        // Reset display
        grid.innerHTML = '';
        displayedCount = 0;
        
        // Append sentinel for infinite scroll
        grid.appendChild(sentinel);
        
        // Load first batch
        appendItems();
    }

    // Infinite Scroll Sentinel
    const sentinel = document.createElement('div');
    sentinel.id = 'scroll-sentinel';
    sentinel.style.height = '20px';
    sentinel.style.width = '100%';

    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && displayedCount < currentFilteredList.length) {
            appendItems();
            // Move sentinel to bottom
            grid.appendChild(sentinel);
        }
    });

    // Initial render
    updateFilter();

    // Event listeners
    searchInput.addEventListener('input', updateFilter);
    roleFilter.addEventListener('change', updateFilter);
    
    // Rarity filter if exists
    const rarityFilter = document.getElementById('rarity-filter');
    if (rarityFilter) {
        rarityFilter.addEventListener('change', updateFilter);
    }
    
    // Reset filters function
    window.resetFilters = () => {
        searchInput.value = '';
        roleFilter.value = '';
        if (rarityFilter) rarityFilter.value = '';
        updateFilter();
    };
}

// --- Character Detail Page Logic ---
async function initCharacterDetail() {
    const params = new URLSearchParams(window.location.search);
    const charId = params.get('id');
    
    if (!charId) {
        document.querySelector('.detail-container').innerHTML = '<h1>Character ID not specified</h1>';
        return;
    }

    try {
        // Load specific character data
        const versions = await fetchJson(`${DATA_BASE_PATH}details/${charId}.json`);
        
        if (!versions || versions.length === 0) {
            throw new Error('Character data is empty');
        }

        // Default to the first one (highest rarity as sorted by generator)
        renderDetail(versions[0], versions);

    } catch (error) {
        document.querySelector('.detail-container').innerHTML = `<h1>Character not found</h1><p>${error.message}</p>`;
    }
}

function renderDetail(char, versions) {
    // Update Page Title
    document.title = `${char.基本情報.名前} - Seven Knights Re:Birth Wiki`;
    document.getElementById('char-name-title').textContent = char.基本情報.名前;
    document.getElementById('char-subname').textContent = char.基本情報.サブネーム || '';

    // Rarity Selector
    const rarityContainer = document.getElementById('rarity-selector');
    rarityContainer.innerHTML = '';
    versions.forEach(v => {
        const btn = document.createElement('button');
        const isCurrent = v.基本情報.ID === char.基本情報.ID;
        btn.className = `rarity-btn ${isCurrent ? 'active' : ''}`;
        btn.textContent = `★${v.基本情報.星} ${v.基本情報.レアリティ}`;
        btn.onclick = () => renderDetail(v, versions);
        rarityContainer.appendChild(btn);
    });

    // Images
    const portraitImg = document.getElementById('portrait-img');
    portraitImg.src = `images/portrait/${char.基本情報.ID}.png`;
    portraitImg.onerror = () => portraitImg.src = 'https://placehold.co/400x600/1a1a1a/e60012?text=No+Portrait';

    // Basic Info
    const basicInfoGrid = document.getElementById('basic-info-grid');
    basicInfoGrid.innerHTML = `
        <div class="info-item"><span class="info-label">所属</span><span class="info-value">${char.基本情報.所属}</span></div>
        <div class="info-item"><span class="info-label">タイプ</span><span class="info-value">${char.基本情報.タイプ}</span></div>
        <div class="info-item"><span class="info-label">射程</span><span class="info-value">${char.基本情報.射程}</span></div>
        <div class="info-item"><span class="info-label">武器</span><span class="info-value">${char.基本情報.武器タイプ}</span></div>
    `;

    // Stats
    const statsGrid = document.getElementById('stats-grid');
    statsGrid.innerHTML = '';
    for (const [key, value] of Object.entries(char.ステータス)) {
        if (value && value !== "0") {
            statsGrid.innerHTML += `
                <div class="info-item">
                    <span class="info-label">${key}</span>
                    <span class="info-value">${value}</span>
                </div>
            `;
        }
    }

    // Skills
    const skillsContainer = document.getElementById('skills-container');
    skillsContainer.innerHTML = '';
    
    const skillOrder = ['通常攻撃', 'スキル1', 'スキル2', 'パッシブ'];
    skillOrder.forEach(skillType => {
        const skill = char.スキル情報[skillType];
        if (skill && (skill.name || skill.desc)) {
            const descHtml = skill.desc ? skill.desc.replace(/\n/g, '<br>') : 'No description';
            const iconSrc = skill.icon ? `../Exports/ProjectRE/Content/${skill.icon}` : ''; // Attempt to point to local file if served from root, or just use the path. 
            // Actually, for a local file:// view, relative paths might work if they go up.
            // But usually web servers block this. 
            // Let's just use the path from JSON but maybe prepend something if we assume a specific structure.
            // The user said "match the specification", so I will use the keys.
            // I will assume the image path might need adjustment but the text is the priority.
            // I'll use a simple img tag.
            
            // Note: The path in JSON is like "04_UI/..."
            // If we are in "wiki/", we might need "../Exports/ProjectRE/Content/" if accessing raw files.
            // Or maybe the user will copy them later. I will just use the path as is for now, or maybe try to be smart.
            // Let's just use the path from JSON.
            
            skillsContainer.innerHTML += `
                <div class="skill-card">
                    <div class="skill-header-row">
                        ${skill.icon ? `<img src="${skill.icon}" class="skill-icon" onerror="this.style.display='none'" alt="${skill.name}">` : ''}
                        <div class="skill-title-block">
                            <div class="skill-name">
                                <span>${skillType}: ${skill.name || ''}</span>
                                <span class="skill-ct">${skill.cooltime || ''}</span>
                            </div>
                        </div>
                    </div>
                    <div class="skill-desc">${descHtml}</div>
                </div>
            `;
        }
    });

    // Transcendence Effects (超越解放効果)
    const transcendenceContainer = document.getElementById('transcendence-container');
    if (transcendenceContainer) {
        transcendenceContainer.innerHTML = '';
        const transcendence = char.超越解放効果;
        if (transcendence && Object.keys(transcendence).length > 0) {
            let transcendenceHtml = '<div class="transcendence-grid">';
            for (const [key, value] of Object.entries(transcendence)) {
                if (value) {
                    // Extract stage number from key (e.g., "超越1段階解放効果" -> "1")
                    const stageMatch = key.match(/(\d+)/);
                    const stageNum = stageMatch ? stageMatch[1] : '';
                    transcendenceHtml += `
                        <div class="transcendence-item">
                            <span class="transcendence-stage">超越${stageNum}段階</span>
                            <span class="transcendence-effect">${value}</span>
                        </div>
                    `;
                }
            }
            transcendenceHtml += '</div>';
            transcendenceContainer.innerHTML = transcendenceHtml;
        } else {
            transcendenceContainer.innerHTML = '<p class="no-data">超越解放効果はありません</p>';
        }
    }

    // Profile / Flavor Text
    const flavorTextEl = document.getElementById('flavor-text');
    const storyTextEl = document.getElementById('story-text');
    
    if (flavorTextEl) {
        flavorTextEl.textContent = char.基本情報?.フレーバーテキスト ? char.基本情報.フレーバーテキスト.replace(/\\n/g, '\n') : '';
    }
    if (storyTextEl) {
        const story = char.プロフィール?.ストーリー;
        storyTextEl.textContent = story ? story.replace(/\\n/g, '\n') : 'No story available.';
    }
}

// Click Effect Handler
document.addEventListener('click', (e) => {
    const container = document.createElement('div');
    container.className = 'click-effect-container';
    container.style.left = `${e.clientX}px`;
    container.style.top = `${e.clientY}px`;
    
    // Helper to create SVG Arcs
    function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
        const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
        return {
            x: centerX + (radius * Math.cos(angleInRadians)),
            y: centerY + (radius * Math.sin(angleInRadians))
        };
    }

    function describeArc(x, y, radius, startAngle, endAngle) {
        const start = polarToCartesian(x, y, radius, endAngle);
        const end = polarToCartesian(x, y, radius, startAngle);
        const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
        const d = [
            "M", start.x, start.y, 
            "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
        ].join(" ");
        return d;
    }

    // Create 3 rings with SVG
    // Gap is 20% (72deg). Visible is 288deg. Half visible is 144deg.
    // We want to draw from the "back" (180deg from gap) towards the gap.
    // Gap is at 0deg (Top) relative to the SVG rotation.
    // So we start at 180deg (Bottom).
    // Right Arc: 180 -> 180 + 144 = 324 (Clockwise)
    // Left Arc: 180 -> 180 - 144 = 36 (Counter-Clockwise)
    
    const ringConfigs = [
        { r: 8, rot: -135 }, // Inner: Gap at Bottom-Left (225deg) -> Rot -135 (or 225)
        { r: 14, rot: -45 }, // Middle: Gap at Top-Left (315deg) -> Rot -45
        { r: 20, rot: 45 }   // Outer: Gap at Top-Right (45deg) -> Rot 45
    ];

    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 100 100");
    svg.classList.add("click-svg-ring");

    ringConfigs.forEach((conf, index) => {
        const group = document.createElementNS(ns, "g");
        group.classList.add("ring-group");
        group.style.transformOrigin = "50px 50px";
        
        // Rotation Animation: Alternating directions
        // Index 0 (Inner): Offset -45 (Starts at rot-45, rotates CW to rot)
        // Index 1 (Middle): Offset +45 (Starts at rot+45, rotates CCW to rot)
        // Index 2 (Outer): Offset -45 (Starts at rot-45, rotates CW to rot)
        const offset = (index % 2 === 0) ? -45 : 45;
        const startRot = conf.rot + offset;
        const endRot = conf.rot;
        
        group.style.setProperty('--rot-from', `${startRot}deg`);
        group.style.setProperty('--rot-to', `${endRot}deg`);
        
        // Right Arc (Clockwise from bottom)
        // Arc 1 (Right side): 180 to 324
        const path1 = document.createElementNS(ns, "path");
        path1.setAttribute("d", describeArc(50, 50, conf.r, 180, 324)); 
        path1.classList.add("ring-path");
        
        // Arc 2 (Left side): 36 to 180
        const path2 = document.createElementNS(ns, "path");
        path2.setAttribute("d", describeArc(50, 50, conf.r, 36, 180));
        path2.classList.add("ring-path");

        group.appendChild(path1);
        group.appendChild(path2);
        svg.appendChild(group);
    });
    
    container.appendChild(svg);

    // Create particles
    const particleCount = 10;
    for (let i = 0; i < particleCount; i++) {
        const p = document.createElement('div');
        p.className = 'click-particle';
        
        // Randomize
        const angle = Math.random() * 360;
        const dist = 15 + Math.random() * 20; // Distance from center
        const size = 2 + Math.random() * 3; // 2px to 5px
        const delay = Math.random() * 0.2; // 0 to 0.2s delay
        
        p.style.width = `${size}px`;
        p.style.height = `${size}px`;
        p.style.setProperty('--angle', `${angle}deg`);
        p.style.setProperty('--dist', `${dist}px`);
        p.style.animationDelay = `${delay}s`;
        
        container.appendChild(p);
    }
    
    document.body.appendChild(container);
    
    // Cleanup
    setTimeout(() => {
        container.remove();
    }, 1200); // Slightly longer for fade out
});
