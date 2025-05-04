/**
 * 图片懒加载工具
 * 使用Intersection Observer API实现图片延迟加载
 */

class LazyLoader {
    constructor(options = {}) {
        this.options = {
            selector: '.lazy-image',
            rootMargin: '0px 0px 200px 0px',
            ...options
        };
        
        this.observer = null;
        this.init();
    }
    
    init() {
        if (!('IntersectionObserver' in window)) {
            this.loadAllImages();
            return;
        }
        
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    this.observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: this.options.rootMargin
        });
        
        this.observe();
    }
    
    observe() {
        const images = document.querySelectorAll(this.options.selector);
        images.forEach(img => {
            this.observer.observe(img);
        });
    }
    
    loadImage(img) {
        const src = img.dataset.src;
        if (!src) return;
        
        // 如果是图片标签
        if (img.tagName.toLowerCase() === 'img') {
            img.src = src;
        } 
        // 如果是背景图
        else {
            img.style.backgroundImage = `url(${src})`;
        }
        
        img.classList.remove('lazy-image');
        img.classList.add('lazy-loaded');
        
        // 触发加载完成事件
        img.dispatchEvent(new CustomEvent('lazy-loaded'));
    }
    
    loadAllImages() {
        const images = document.querySelectorAll(this.options.selector);
        images.forEach(img => this.loadImage(img));
    }
    
    refresh() {
        this.observe();
    }
}

// 导出懒加载类
window.LazyLoader = LazyLoader;

// 页面加载完成后自动初始化懒加载
document.addEventListener('DOMContentLoaded', () => {
    window.lazyLoader = new LazyLoader();
}); 