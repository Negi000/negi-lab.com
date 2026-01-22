/**
 * Build Page JavaScript
 * キャラクター装備ビルドガイド
 */

// 言語別データ読み込み（フォールバック対応）
async function loadLocalizedData(filename) {
    const lang = typeof getLang === 'function' ? getLang() : 'ja';
    try {
        // まず言語別ディレクトリを試す
        const res = await fetch(`data/${lang}/${filename}`);
        if (res.ok) return await res.json();
    } catch (e) {
        console.log(`[build] Fallback to root data for ${filename}`);
    }
    // フォールバック: ルートディレクトリ
    const res = await fetch(`data/${filename}`);
    return await res.json();
}

document.addEventListener('DOMContentLoaded', async () => {
    // i18nの準備完了を待つ
    if (typeof onI18nReady === 'function') {
        onI18nReady(initBuildPage);
    } else {
        initBuildPage();
    }
});

async function initBuildPage() {
    const buildContainer = document.getElementById('build-container');
    const searchInput = document.getElementById('search-input');
    const rarityFilter = document.getElementById('rarity-filter');
    const roleFilter = document.getElementById('role-filter');
    const resultsCount = document.getElementById('results-count');
    
    let buildData = [];
    
    // Load build data
    try {
        buildData = await loadLocalizedData('build.json');
        renderBuildCards(buildData);
    } catch (error) {
        console.error('Failed to load build data:', error);
        buildContainer.innerHTML = `
            <div class="loading-spinner">
                <p>データの読み込みに失敗しました</p>
            </div>
        `;
    }
    
    // Render build cards
    function renderBuildCards(data) {
        const tr = typeof t === 'function' ? t : (k) => k;
        if (data.length === 0) {
            buildContainer.innerHTML = `
                <div class="loading-spinner">
                    <p>${tr('common.noResults')}</p>
                </div>
            `;
            resultsCount.textContent = `0 ${tr('build.characters')}`;
            return;
        }
        
        buildContainer.innerHTML = data.map(char => createBuildCard(char)).join('');
        resultsCount.textContent = `${data.length} ${tr('build.characters')}`;
    }
    
    // Create build card HTML
    function createBuildCard(char) {
        // レアリティのマッピング（英語→背景画像）
        const rarityBgMap = {
            '希少': '03', 'epic': '03',
            '伝説': '04', 'legendary': '04',
            '伝説+': '04', 'legendary+': '04',
            '伝説++': '04', 'legendary++': '04'
        };
        const bgNum = rarityBgMap[char.rarity] || '03';
        
        // レアリティ翻訳
        const rarityTranslate = (rarity) => {
            if (typeof t !== 'function') return rarity;
            const key = 'rarity.' + rarity.toLowerCase().replace('+', '').replace('+', '');
            const translated = t(key);
            return translated !== key ? translated : rarity;
        };
        
        // ロール翻訳（IDまたはテキスト）
        const roleTranslate = (role) => {
            if (typeof t !== 'function') return role;
            const roleIdMap = {
                '1': 'role.attack',
                '2': 'role.defense',
                '3': 'role.support',
                '4': 'role.magic',
                '5': 'role.universal'
            };
            // IDの場合
            if (roleIdMap[role]) {
                return t(roleIdMap[role]);
            }
            // テキストの場合（日本語など）
            const roleTextMap = {
                '攻撃型': 'role.attack',
                '防御型': 'role.defense',
                '支援型': 'role.support',
                '魔法型': 'role.magic',
                '万能型': 'role.universal'
            };
            if (roleTextMap[role]) {
                return t(roleTextMap[role]);
            }
            return role;
        };
        
        // Count non-empty builds
        const buildCount = char.builds.filter(b => b.name && b.name.trim() !== '').length;
        
        const rarityClass = (char.rarity === '希少' || char.rarity === 'epic') ? 'rare' : '';
        
        const displayRarity = rarityTranslate(char.rarity);
        const displayRole = roleTranslate(char.role);
        
        return `
            <div class="build-card" onclick="openBuildModal('${char.id}')">
                <div class="build-card-header">
                    <div class="build-card-icon">
                        <img src="images/icon/Atl_UI-List_GradeBG${bgNum}.webp" class="rarity-bg" alt="">
                        <img src="images/icon/Card/Tex_HeroIcon_${char.id}Card.webp" class="char-icon" alt="${char.name}"
                             onerror="this.src='https://placehold.co/70x70/1a1a1a/666?text=?'">
                    </div>
                    <div class="build-card-info">
                        <div class="build-card-name">${char.name}</div>
                        <div class="build-card-subname">${char.subname || ''}</div>
                        <div class="build-card-tags">
                            <span class="build-tag rarity ${rarityClass}">${displayRarity}</span>
                            <span class="build-tag role">${displayRole}</span>
                        </div>
                    </div>
                </div>
                <div class="build-card-preview">
                    <div class="build-preview-title">
                        <span>📦</span> 装備スロット
                    </div>
                    <div class="build-slots">
                        <div class="build-slot">
                            <div class="slot-icon">⚔️</div>
                            <span class="slot-label">武器1</span>
                        </div>
                        <div class="build-slot">
                            <div class="slot-icon">⚔️</div>
                            <span class="slot-label">武器2</span>
                        </div>
                        <div class="build-slot">
                            <div class="slot-icon">🛡️</div>
                            <span class="slot-label">防具1</span>
                        </div>
                        <div class="build-slot">
                            <div class="slot-icon">🛡️</div>
                            <span class="slot-label">防具2</span>
                        </div>
                        <div class="build-slot">
                            <div class="slot-icon">💍</div>
                            <span class="slot-label">リング</span>
                        </div>
                    </div>
                </div>
                <div class="build-card-footer">
                    <span class="build-count">${buildCount}/3 ビルド登録</span>
                    <button class="view-build-btn">詳細を見る</button>
                </div>
            </div>
        `;
    }
    
    // Filter function
    function filterBuilds() {
        const searchText = searchInput.value.toLowerCase();
        const selectedRarity = rarityFilter.value;
        const selectedRole = roleFilter.value;
        
        const filtered = buildData.filter(char => {
            const nameMatch = char.name.toLowerCase().includes(searchText);
            const rarityMatch = !selectedRarity || char.rarity === selectedRarity;
            const roleMatch = !selectedRole || char.role === selectedRole;
            return nameMatch && rarityMatch && roleMatch;
        });
        
        renderBuildCards(filtered);
    }
    
    // Event listeners
    searchInput.addEventListener('input', filterBuilds);
    rarityFilter.addEventListener('change', filterBuilds);
    roleFilter.addEventListener('change', filterBuilds);
    
    // Reset filters
    window.resetFilters = () => {
        searchInput.value = '';
        rarityFilter.value = '';
        roleFilter.value = '';
        renderBuildCards(buildData);
    };
    
    // Open build modal
    window.openBuildModal = (charId) => {
        const char = buildData.find(c => c.id === charId);
        if (!char) return;
        
        const modal = document.getElementById('build-modal');
        const modalBody = document.getElementById('modal-body');
        
        // 翻訳関数
        const tr = typeof t === 'function' ? t : (k) => k;
        
        const rarityBgMap = {
            '希少': '03',
            '伝説': '04',
            '伝説+': '04',
            '伝説++': '04'
        };
        const bgNum = rarityBgMap[char.rarity] || '03';
        
        // Create tabs
        const tabsHtml = char.builds.map((build, index) => {
            const isEmpty = !build.name || build.name.trim() === '';
            const label = build.name || tr('build.buildNumber').replace('{num}', index + 1);
            return `
                <button class="build-tab ${index === 0 ? 'active' : ''} ${isEmpty ? 'empty' : ''}" 
                        onclick="switchBuildTab(${index})"
                        ${isEmpty ? `title="${tr('build.notRegistered')}"` : ''}>
                    ${label}
                </button>
            `;
        }).join('');
        
        // Create build contents
        const buildsHtml = char.builds.map((build, index) => {
            if (!build.name || build.name.trim() === '') {
                return `
                    <div class="build-content ${index === 0 ? 'active' : ''}" data-build-index="${index}">
                        <div class="no-build">
                            <div class="no-build-icon">📝</div>
                            <p>${tr('build.notRegisteredMessage')}</p>
                        </div>
                    </div>
                `;
            }
            
            return `
                <div class="build-content ${index === 0 ? 'active' : ''}" data-build-index="${index}">
                    <!-- Weapons -->
                    <div class="build-section">
                        <h3 class="build-section-title">⚔️ ${tr('build.weapon')}</h3>
                        <div class="equipment-grid">
                            <div class="equipment-item">
                                <div class="equipment-label">${tr('build.weapon1')}</div>
                                <div class="equipment-name">${build.weapon1.type || '-'}</div>
                                <div class="equipment-ops">
                                    ${build.weapon1.mainOp1 ? `<div class="equipment-op">${build.weapon1.mainOp1}</div>` : ''}
                                    ${build.weapon1.mainOp2 ? `<div class="equipment-op">${build.weapon1.mainOp2}</div>` : ''}
                                    ${!build.weapon1.mainOp1 && !build.weapon1.mainOp2 ? `<div class="equipment-empty">${tr('build.notSet')}</div>` : ''}
                                </div>
                            </div>
                            <div class="equipment-item">
                                <div class="equipment-label">${tr('build.weapon2')}</div>
                                <div class="equipment-name">${build.weapon2.type || '-'}</div>
                                <div class="equipment-ops">
                                    ${build.weapon2.mainOp1 ? `<div class="equipment-op">${build.weapon2.mainOp1}</div>` : ''}
                                    ${build.weapon2.mainOp2 ? `<div class="equipment-op">${build.weapon2.mainOp2}</div>` : ''}
                                    ${!build.weapon2.mainOp1 && !build.weapon2.mainOp2 ? `<div class="equipment-empty">${tr('build.notSet')}</div>` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Armor -->
                    <div class="build-section">
                        <h3 class="build-section-title">🛡️ ${tr('build.armor')}</h3>
                        <div class="equipment-grid">
                            <div class="equipment-item">
                                <div class="equipment-label">${tr('build.armor1')}</div>
                                <div class="equipment-name">${build.armor1.type || '-'}</div>
                                <div class="equipment-ops">
                                    ${build.armor1.mainOp1 ? `<div class="equipment-op">${build.armor1.mainOp1}</div>` : ''}
                                    ${build.armor1.mainOp2 ? `<div class="equipment-op">${build.armor1.mainOp2}</div>` : ''}
                                    ${!build.armor1.mainOp1 && !build.armor1.mainOp2 ? `<div class="equipment-empty">${tr('build.notSet')}</div>` : ''}
                                </div>
                            </div>
                            <div class="equipment-item">
                                <div class="equipment-label">${tr('build.armor2')}</div>
                                <div class="equipment-name">${build.armor2.type || '-'}</div>
                                <div class="equipment-ops">
                                    ${build.armor2.mainOp1 ? `<div class="equipment-op">${build.armor2.mainOp1}</div>` : ''}
                                    ${build.armor2.mainOp2 ? `<div class="equipment-op">${build.armor2.mainOp2}</div>` : ''}
                                    ${!build.armor2.mainOp1 && !build.armor2.mainOp2 ? `<div class="equipment-empty">${tr('build.notSet')}</div>` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Ring -->
                    <div class="build-section">
                        <h3 class="build-section-title">💍 ${tr('build.ring')}</h3>
                        <div class="ring-grid">
                            <div class="ring-item">
                                <div class="ring-label">${tr('build.ringSpecial')}</div>
                                <div class="ring-value">${build.ring.special || '-'}</div>
                            </div>
                            <div class="ring-item">
                                <div class="ring-label">${tr('build.ringStatBoost')}</div>
                                <div class="ring-value">${build.ring.statBoost || '-'}</div>
                            </div>
                            <div class="ring-item">
                                <div class="ring-label">CC</div>
                                <div class="ring-value">${build.ring.cc || '-'}</div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Sub OPs -->
                    <div class="build-section">
                        <h3 class="build-section-title">📊 サブOP候補</h3>
                        <div class="subop-grid">
                            ${build.subOps.map((op, i) => `
                                <div class="subop-item">
                                    <span class="subop-num">${i + 1}</span>
                                    <span class="subop-value">${op || '-'}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Transcendence -->
                    <div class="build-section">
                        <h3 class="build-section-title">✨ ${tr('build.transcendence')}</h3>
                        <div class="transcendence-box">
                            <div class="transcendence-label">🌟 ${tr('build.transcendence4')}</div>
                            <div class="transcendence-value">${build.transcendence4 || tr('build.notSet')}</div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        
        modalBody.innerHTML = `
            <div class="modal-header">
                <div class="modal-char-icon">
                    <img src="images/icon/Atl_UI-List_GradeBG${bgNum}.webp" class="rarity-bg" alt="">
                    <img src="images/icon/Card/Tex_HeroIcon_${char.id}Card.webp" class="char-icon" alt="${char.name}"
                         style="position:relative"
                         onerror="this.src='https://placehold.co/100x100/1a1a1a/666?text=?'">
                </div>
                <div class="modal-char-info">
                    <h2>${char.name}</h2>
                    <p class="subname">${char.subname || ''}</p>
                    <div class="build-card-tags">
                        <span class="build-tag rarity ${char.rarity === '希少' ? 'rare' : ''}">${char.rarity}</span>
                        <span class="build-tag role">${char.role}</span>
                        <span class="build-tag role">${char.weapon_type}</span>
                    </div>
                </div>
            </div>
            
            <div class="build-tabs">
                ${tabsHtml}
            </div>
            
            ${buildsHtml}
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    
    // Switch build tab
    window.switchBuildTab = (index) => {
        const tabs = document.querySelectorAll('.build-tab');
        const contents = document.querySelectorAll('.build-content');
        
        tabs.forEach((tab, i) => {
            tab.classList.toggle('active', i === index);
        });
        
        contents.forEach((content, i) => {
            content.classList.toggle('active', i === index);
        });
    };
    
    // Close modal
    window.closeBuildModal = () => {
        const modal = document.getElementById('build-modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeBuildModal();
        }
    });
}
