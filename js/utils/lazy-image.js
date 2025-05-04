/**
 * 图片延迟加载工具
 * 用于优化网站加载性能，只有当图片进入视口时才加载图片
 */
class LazyImageLoader {
    constructor(options = {}) {
        this.options = {
            selector: 'img.lazy',
            rootMargin: '0px 0px 200px 0px',
            threshold: 0.1,
            loadedClass: 'lazy-loaded',
            ...options
        };
        
        this.observer = null;
        this.initialized = false;
    }
    
    /**
     * 初始化延迟加载功能
     */
    init() {
        // 检查是否支持 IntersectionObserver
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(this.onIntersection.bind(this), {
                rootMargin: this.options.rootMargin,
                threshold: this.options.threshold
            });
            
            this.observe();
            this.initialized = true;
            
            // 添加窗口大小变化监听，以重新捕获可能的新元素
            window.addEventListener('resize', this.handleResize.bind(this));
        } else {
            // 回退方案：对于不支持 IntersectionObserver 的浏览器直接加载所有图片
            this.loadAllImages();
        }
    }
    
    /**
     * 监听所有懒加载图片
     */
    observe() {
        const images = document.querySelectorAll(this.options.selector);
        images.forEach(image => {
            if (this.observer && !image.classList.contains(this.options.loadedClass)) {
                this.observer.observe(image);
            }
        });
    }
    
    /**
     * 处理元素进入视口
     * @param {IntersectionObserverEntry[]} entries 
     */
    onIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                this.loadImage(entry.target);
                this.observer.unobserve(entry.target);
            }
        });
    }
    
    /**
     * 加载单个图片
     * @param {HTMLImageElement} image 
     */
    loadImage(image) {
        const src = image.dataset.src;
        const srcset = image.dataset.srcset;
        
        if (src) {
            image.src = src;
        }
        
        if (srcset) {
            image.srcset = srcset;
        }
        
        // 图像加载完成后添加加载完成类
        image.onload = () => {
            image.classList.add(this.options.loadedClass);
            image.removeAttribute('data-src');
            image.removeAttribute('data-srcset');
        };
    }
    
    /**
     * 加载所有图片（回退方案）
     */
    loadAllImages() {
        const images = document.querySelectorAll(this.options.selector);
        images.forEach(image => this.loadImage(image));
    }
    
    /**
     * 处理窗口大小变化
     */
    handleResize() {
        if (this.initialized) {
            this.observe();
        }
    }
    
    /**
     * 刷新延迟加载（手动触发重新检查）
     */
    refresh() {
        if (this.initialized) {
            this.observe();
        }
    }
    
    /**
     * 销毁观察者
     */
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        
        window.removeEventListener('resize', this.handleResize.bind(this));
        this.initialized = false;
    }
}

// 导出延迟加载类
export default LazyImageLoader; 