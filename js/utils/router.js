/**
 * 简单客户端路由器
 * 用于实现单页应用的前端路由
 */

class Router {
    constructor(options = {}) {
        this.options = {
            basePath: '',
            mode: 'history', // 'history' 或 'hash'
            ...options
        };
        
        this.routes = {};
        this.currentRoute = null;
        this.previousRoute = null;
        this.notFoundHandler = null;
    }
    
    /**
     * 初始化路由器
     */
    init() {
        // 根据模式绑定不同的事件
        if (this.options.mode === 'history') {
            // 拦截所有链接点击
            document.addEventListener('click', (e) => {
                const target = e.target.closest('a');
                if (!target) return;
                
                const href = target.getAttribute('href');
                // 忽略外部链接、锚点链接和特殊链接
                if (!href || 
                    href.startsWith('http') || 
                    href.startsWith('#') || 
                    href.startsWith('javascript:') ||
                    target.getAttribute('target') === '_blank') {
                    return;
                }
                
                e.preventDefault();
                this.navigate(href);
            });
            
            // 监听浏览器前进后退
            window.addEventListener('popstate', (e) => {
                this.handleRouteChange();
            });
        } else {
            // hash模式
            window.addEventListener('hashchange', () => {
                this.handleRouteChange();
            });
        }
        
        // 初始路由
        this.handleRouteChange();
    }
    
    /**
     * 注册路由处理器
     * @param {string} path 路径
     * @param {Function} handler 处理函数
     * @returns {Router} 路由器实例，支持链式调用
     */
    add(path, handler) {
        this.routes[path] = handler;
        return this;
    }
    
    /**
     * 注册404处理器
     * @param {Function} handler 处理函数
     * @returns {Router} 路由器实例，支持链式调用
     */
    notFound(handler) {
        this.notFoundHandler = handler;
        return this;
    }
    
    /**
     * 编程式导航
     * @param {string} path 导航路径
     * @param {boolean} replace 是否替换历史记录
     */
    navigate(path, replace = false) {
        const fullPath = this.options.basePath + path;
        
        // 避免重复导航
        if (this.getCurrentPath() === path) return;
        
        if (this.options.mode === 'history') {
            if (replace) {
                history.replaceState({}, '', fullPath);
            } else {
                history.pushState({}, '', fullPath);
            }
            this.handleRouteChange();
        } else {
            window.location.hash = '#' + path;
        }
    }
    
    /**
     * 获取当前路径
     * @returns {string} 当前路径
     */
    getCurrentPath() {
        if (this.options.mode === 'history') {
            return window.location.pathname.replace(this.options.basePath, '');
        } else {
            const hash = window.location.hash;
            return hash ? hash.substring(1) : '/';
        }
    }
    
    /**
     * 处理路由变化
     */
    handleRouteChange() {
        const path = this.getCurrentPath();
        this.previousRoute = this.currentRoute;
        this.currentRoute = path;
        
        // 查找匹配的路由处理器
        const handler = this.routes[path];
        
        if (handler) {
            handler();
        } else {
            // 尝试使用正则表达式匹配路由
            let matched = false;
            for (const routePath in this.routes) {
                if (routePath === path) continue; // 已经检查过精确匹配
                
                try {
                    const regex = new RegExp(`^${routePath}$`);
                    if (regex.test(path)) {
                        this.routes[routePath]();
                        matched = true;
                        break;
                    }
                } catch (e) {
                    // 忽略无效的正则表达式
                }
            }
            
            if (!matched && this.notFoundHandler) {
                this.notFoundHandler();
            }
        }
        
        // 触发路由变化事件
        window.dispatchEvent(new CustomEvent('route-changed', {
            detail: {
                currentRoute: this.currentRoute,
                previousRoute: this.previousRoute
            }
        }));
    }
}

// 导出路由器
export default Router;

// 创建应用路由器实例
document.addEventListener('DOMContentLoaded', () => {
    window.appRouter = new Router();
    
    // 注册路由
    window.appRouter
        .add('/', () => {
            console.log('首页路由');
            document.title = '轻松赚导航 - 首页';
        })
        .add('/ai-tools', () => {
            console.log('AI工具路由');
            document.title = 'AI工具导航 - 轻松赚导航';
            // 滚动到AI工具部分
            document.querySelector('h2:contains("AI软件工具")').scrollIntoView({
                behavior: 'smooth'
            });
        })
        .add('/monetization', () => {
            console.log('变现路由');
            document.title = '变现资源导航 - 轻松赚导航';
            // 滚动到变现部分
            document.querySelector('h2:contains("变现")').scrollIntoView({
                behavior: 'smooth'
            });
        })
        .add('/info-gap', () => {
            console.log('信息差路由');
            document.title = '信息差导航 - 轻松赚导航';
            // 滚动到信息差部分
            document.querySelector('h2:contains("信息差")').scrollIntoView({
                behavior: 'smooth'
            });
        })
        .add('/data-analysis', () => {
            console.log('数据分析路由');
            document.title = '数据分析导航 - 轻松赚导航';
            // 滚动到数据分析部分
            document.querySelector('h2:contains("数据分析")').scrollIntoView({
                behavior: 'smooth'
            });
        })
        .add('/creation', () => {
            console.log('灵感创作路由');
            document.title = '灵感创作导航 - 轻松赚导航';
            // 滚动到灵感创作部分
            document.querySelector('h2:contains("灵感创作")').scrollIntoView({
                behavior: 'smooth'
            });
        })
        .notFound(() => {
            console.log('404路由');
            document.title = '页面未找到 - 轻松赚导航';
            // 可以显示一个404页面
        });
}); 