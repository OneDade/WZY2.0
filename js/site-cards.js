/**
 * 站点卡片加载模块
 * 负责从数据文件加载站点信息并动态生成站点卡片
 */

/**
 * 从JSON数据文件加载站点数据并创建卡片
 */
export async function loadSiteCards() {
    try {
        // 获取站点数据
        const response = await fetch('./data/sites.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const sitesData = await response.json();
        
        // 根据分类创建站点卡片
        createSiteCards(sitesData);
        
        console.log(`已加载 ${sitesData.length} 个站点数据`);
    } catch (error) {
        console.error('加载站点数据失败:', error);
    }
}

/**
 * 根据分类数据创建站点卡片
 * @param {Array} sites 站点数据数组
 */
function createSiteCards(sites) {
    // 定义要处理的分类
    const categories = {
        'ai-tools': document.getElementById('ai-tools-list'),
        'monetization': document.getElementById('monetization-list'),
        'info-gap': document.getElementById('info-gap-list'), 
        'data-analysis': document.getElementById('data-analysis-list'),
        'creation': document.getElementById('creation-list')
    };
    
    // 清空现有内容
    Object.values(categories).forEach(container => {
        if (container) {
            container.innerHTML = '';
        }
    });
    
    // 按照分类分组站点
    const sitesByCategory = {};
    Object.keys(categories).forEach(category => {
        sitesByCategory[category] = [];
    });
    
    // 将站点添加到对应分类
    sites.forEach(site => {
        if (site.category && sitesByCategory[site.category]) {
            sitesByCategory[site.category].push(site);
        }
        
        // 处理站点的子分类
        if (site.subCategories && Array.isArray(site.subCategories)) {
            site.subCategories.forEach(subCategory => {
                if (sitesByCategory[subCategory]) {
                    sitesByCategory[subCategory].push(site);
                }
            });
        }
    });
    
    // 为每个分类创建卡片
    Object.entries(sitesByCategory).forEach(([category, categoryItems]) => {
        const container = categories[category];
        if (!container) return;
        
        // 如果这个分类没有站点，则显示暂无数据提示
        if (categoryItems.length === 0) {
            const emptyMessage = document.createElement('div');
            emptyMessage.className = 'empty-message';
            emptyMessage.textContent = '暂无数据，敬请期待...';
            container.appendChild(emptyMessage);
            return;
        }
        
        // 按照排序权重排序（数值越大越靠前）
        categoryItems.sort((a, b) => (b.weight || 0) - (a.weight || 0));
        
        // 为每个站点创建卡片
        categoryItems.forEach(site => {
            const card = createSiteCard(site);
            container.appendChild(card);
        });
    });
    
    // 初始化后触发延迟加载器刷新
    if (window.APP && window.APP.lazyLoader) {
        setTimeout(() => window.APP.lazyLoader.refresh(), 100);
    }
}

/**
 * 创建单个站点卡片
 * @param {Object} site 站点数据
 * @returns {HTMLElement} 站点卡片元素
 */
function createSiteCard(site) {
    const card = document.createElement('div');
    card.className = 'site-card';
    card.setAttribute('data-categories', [site.category, ...(site.subCategories || [])].join(','));
    
    // 添加是否为新站点、热门站点的标志
    if (site.isNew) {
        card.classList.add('is-new');
    }
    if (site.isHot) {
        card.classList.add('is-hot');
    }
    
    // 构建卡片内容
    const iconUrl = site.icon || './icons/default-icon.svg';
    const siteUrl = site.url || '#';
    
    card.innerHTML = `
        <a href="${siteUrl}" target="_blank" rel="noopener" class="site-link" title="${site.name}">
            <div class="site-icon lazy" data-src="${iconUrl}" aria-label="${site.name}图标"></div>
            <div class="site-info">
                <h3 class="site-name">${site.name || '未命名站点'}</h3>
                <p class="site-desc">${site.description || '暂无描述'}</p>
            </div>
            ${site.isNew ? '<span class="site-badge new-badge">新</span>' : ''}
            ${site.isHot ? '<span class="site-badge hot-badge">热</span>' : ''}
        </a>
    `;
    
    return card;
}

/**
 * 创建空状态提示
 * @param {string} message 提示消息
 * @returns {HTMLElement} 空状态提示元素
 */
function createEmptyState(message = '暂无数据') {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    emptyState.innerHTML = `
        <i class="empty-icon">📭</i>
        <p class="empty-text">${message}</p>
    `;
    return emptyState;
} 