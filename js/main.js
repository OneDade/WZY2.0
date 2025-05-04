/**
 * 主入口文件
 * 负责初始化网站的各项功能，包括路由、延迟加载等
 */
import Router from './utils/router.js';
import LazyImageLoader from './utils/lazy-image.js';
import { loadSiteCards } from './site-cards.js';

// 全局状态
const APP = {
    router: null,
    lazyLoader: null,
    darkMode: false,
    // 其他应用状态
};

/**
 * 初始化应用
 */
function initApp() {
    console.log('轻松赚导航 - 应用初始化');
    
    // 初始化图片延迟加载
    initLazyLoading();
    
    // 初始化路由
    initRouter();
    
    // 初始化站点卡片数据
    loadSiteCards();
    
    // 初始化主题切换
    initThemeToggle();
    
    // 初始化搜索功能
    initSearch();
    
    // 初始化分类标签页
    initCategoryTabs();

    // 初始化返回顶部按钮
    initBackToTop();
    
    // 当所有初始化完成后，移除加载中状态
    document.body.classList.remove('is-loading');
}

/**
 * 初始化图片延迟加载
 */
function initLazyLoading() {
    APP.lazyLoader = new LazyImageLoader({
        selector: 'img.lazy, .site-icon.lazy',
        rootMargin: '0px 0px 200px 0px'
    });
    APP.lazyLoader.init();
}

/**
 * 初始化路由
 */
function initRouter() {
    APP.router = new Router({
        mode: 'history',
        root: '/'
    });
    
    // 定义路由
    APP.router.add('/', () => {
        // 主页路由处理
        console.log('显示首页');
        showAllCategories();
    });
    
    APP.router.add('/ai-tools', () => {
        // AI工具页面路由处理
        console.log('显示AI工具页面');
        hideAllCategories();
        showCategory('ai-tools');
    });
    
    APP.router.add('/monetization', () => {
        // 变现页面路由处理
        console.log('显示变现页面');
        hideAllCategories();
        showCategory('monetization');
    });
    
    APP.router.add('/info-gap', () => {
        // 信息差页面路由处理
        console.log('显示信息差页面');
        hideAllCategories();
        showCategory('info-gap');
    });
    
    APP.router.add('/data-analysis', () => {
        // 数据分析页面路由处理
        console.log('显示数据分析页面');
        hideAllCategories();
        showCategory('data-analysis');
    });
    
    APP.router.add('/creation', () => {
        // 创作灵感页面路由处理
        console.log('显示创作灵感页面');
        hideAllCategories();
        showCategory('creation');
    });
    
    // 添加404路由
    APP.router.add('(.*)', () => {
        console.log('页面未找到');
        // 显示404页面或重定向到首页
        window.location.href = '/';
    });
    
    // 初始化路由
    APP.router.init();
}

/**
 * 显示指定分类，隐藏其他分类
 * @param {string} categoryId 分类ID
 */
function showCategory(categoryId) {
    document.getElementById(categoryId).style.display = 'block';
    // 更新标题
    updatePageTitle(categoryId);
    // 刷新延迟加载
    if (APP.lazyLoader) {
        setTimeout(() => APP.lazyLoader.refresh(), 100);
    }
}

/**
 * 隐藏所有分类
 */
function hideAllCategories() {
    const categories = document.querySelectorAll('.category');
    categories.forEach(category => {
        category.style.display = 'none';
    });
}

/**
 * 显示所有分类
 */
function showAllCategories() {
    const categories = document.querySelectorAll('.category');
    categories.forEach(category => {
        category.style.display = 'block';
    });
    // 更新标题为默认标题
    document.title = '轻松赚导航 - 精选网赚资源导航平台';
    // 刷新延迟加载
    if (APP.lazyLoader) {
        setTimeout(() => APP.lazyLoader.refresh(), 100);
    }
}

/**
 * 根据分类ID更新页面标题
 * @param {string} categoryId 分类ID
 */
function updatePageTitle(categoryId) {
    const categoryTitles = {
        'ai-tools': 'AI软件工具',
        'monetization': '变现',
        'info-gap': '信息差',
        'data-analysis': '数据分析',
        'creation': '灵感创作'
    };
    
    const title = categoryTitles[categoryId] || '导航';
    document.title = `${title} - 轻松赚导航`;
}

/**
 * 初始化主题切换
 */
function initThemeToggle() {
    const darkModeToggle = document.getElementById('theme-toggle');
    if (!darkModeToggle) return;
    
    // 检查本地存储中的主题偏好
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        darkModeToggle.checked = true;
        APP.darkMode = true;
    }
    
    // 监听主题切换
    darkModeToggle.addEventListener('change', () => {
        if (darkModeToggle.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            APP.darkMode = true;
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            APP.darkMode = false;
        }
    });
}

/**
 * 初始化搜索功能
 */
function initSearch() {
    const searchInput = document.getElementById('search-input');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length < 2) {
            // 重置搜索，显示所有站点
            document.querySelectorAll('.site-card').forEach(card => {
                card.style.display = 'flex';
            });
            return;
        }
        
        // 搜索站点名称和描述
        document.querySelectorAll('.site-card').forEach(card => {
            const siteName = card.querySelector('.site-name').textContent.toLowerCase();
            const siteDesc = card.querySelector('.site-desc').textContent.toLowerCase();
            
            if (siteName.includes(query) || siteDesc.includes(query)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

/**
 * 初始化分类标签页
 */
function initCategoryTabs() {
    document.querySelectorAll('.category__tabs').forEach(tabContainer => {
        const tabs = tabContainer.querySelectorAll('.category__tab');
        const category = tabContainer.closest('.category');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                
                // 移除其他标签的活动状态
                tabs.forEach(t => t.classList.remove('active'));
                // 添加当前标签的活动状态
                tab.classList.add('active');
                
                // 获取标签对应的数据标识
                const tabId = tab.getAttribute('data-tab');
                
                // 显示/隐藏相应的站点卡片
                if (category) {
                    const allSites = category.querySelectorAll('.site-card');
                    allSites.forEach(site => {
                        const siteCategories = site.getAttribute('data-categories')?.split(',') || [];
                        
                        if (tabId === 'all' || siteCategories.includes(tabId)) {
                            site.style.display = 'flex';
                        } else {
                            site.style.display = 'none';
                        }
                    });
                }
                
                // 刷新延迟加载以捕获新显示的图片
                if (APP.lazyLoader) {
                    setTimeout(() => APP.lazyLoader.refresh(), 100);
                }
            });
        });
    });
}

/**
 * 初始化返回顶部按钮
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;
    
    // 监听滚动事件来显示/隐藏按钮
    window.addEventListener('scroll', () => {
        // 当页面滚动超过300px时显示按钮
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // 点击返回顶部
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// 当DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', initApp);

// 导出应用全局状态，便于调试和其他模块访问
window.APP = APP; 