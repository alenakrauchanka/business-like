// ========================================
// Business Like — Основной JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initScrollAnimations();
    initNavbarScroll();
    initSmoothScroll();
});

// ========================================
// Мобильное меню
// ========================================

function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navAuth = document.querySelector('.nav-auth');
    
    if (!menuBtn) return;
    
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        
        // Создаём мобильное меню если его нет
        let mobileMenu = document.querySelector('.mobile-menu');
        
        if (!mobileMenu) {
            mobileMenu = document.createElement('div');
            mobileMenu.className = 'mobile-menu';
            mobileMenu.innerHTML = `
                <nav class="mobile-nav">
                    ${navLinks ? navLinks.innerHTML : ''}
                </nav>
                <div class="mobile-auth">
                    ${navAuth ? navAuth.innerHTML : ''}
                </div>
            `;
            document.querySelector('.navbar').appendChild(mobileMenu);
            
            // Добавляем стили для мобильного меню
            addMobileMenuStyles();
        }
        
        mobileMenu.classList.toggle('open');
        document.body.classList.toggle('menu-open');
    });
}

function addMobileMenuStyles() {
    if (document.querySelector('#mobile-menu-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'mobile-menu-styles';
    styles.textContent = `
        .mobile-menu {
            position: absolute;
            top: 72px;
            left: 0;
            right: 0;
            background: white;
            padding: 24px;
            box-shadow: var(--shadow-lg);
            transform: translateY(-100%);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 999;
        }
        
        .mobile-menu.open {
            transform: translateY(0);
            opacity: 1;
            visibility: visible;
        }
        
        .mobile-nav {
            display: flex;
            flex-direction: column;
            gap: 16px;
            margin-bottom: 24px;
        }
        
        .mobile-nav a {
            font-size: 18px;
            font-weight: 600;
            color: var(--dark);
            padding: 8px 0;
        }
        
        .mobile-auth {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .mobile-auth .btn {
            width: 100%;
            justify-content: center;
        }
        
        .mobile-menu-btn.active span:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .mobile-menu-btn.active span:nth-child(2) {
            opacity: 0;
        }
        
        .mobile-menu-btn.active span:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
        
        body.menu-open {
            overflow: hidden;
        }
    `;
    document.head.appendChild(styles);
}

// ========================================
// Анимации при скролле
// ========================================

function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.category-card, .step-card, .course-card, .feature-card');
    
    if (!animatedElements.length) return;
    
    // Добавляем класс для анимации
    animatedElements.forEach((el, index) => {
        el.classList.add('scroll-animate');
        el.style.transitionDelay = `${index % 3 * 0.1}s`;
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(el => observer.observe(el));
}

// ========================================
// Изменение навбара при скролле
// ========================================

function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Скрываем/показываем при скролле вниз/вверх
        if (currentScroll > lastScroll && currentScroll > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });
    
    // Добавляем стили
    const styles = document.createElement('style');
    styles.textContent = `
        .navbar {
            transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
        }
        
        .navbar.scrolled {
            background: rgba(255, 255, 255, 0.98);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
    `;
    document.head.appendChild(styles);
}

// ========================================
// Плавный скролл
// ========================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Закрываем мобильное меню
                const mobileMenu = document.querySelector('.mobile-menu');
                if (mobileMenu?.classList.contains('open')) {
                    mobileMenu.classList.remove('open');
                    document.querySelector('.mobile-menu-btn')?.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            }
        });
    });
}

// ========================================
// Утилиты
// ========================================

// Форматирование чисел
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

// Debounce функция
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle функция
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Получение параметров URL
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const result = {};
    for (const [key, value] of params) {
        result[key] = value;
    }
    return result;
}

// Показать уведомление
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
        <span class="notification-message">${message}</span>
    `;
    
    // Добавляем стили если их нет
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 90px;
                right: 24px;
                padding: 16px 24px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                display: flex;
                align-items: center;
                gap: 12px;
                z-index: 10000;
                animation: slideInRight 0.3s ease-out;
            }
            
            .notification-success {
                border-left: 4px solid #00B894;
            }
            
            .notification-error {
                border-left: 4px solid #E84393;
            }
            
            .notification-info {
                border-left: 4px solid #6C5CE7;
            }
            
            .notification-icon {
                font-size: 20px;
            }
            
            .notification-success .notification-icon { color: #00B894; }
            .notification-error .notification-icon { color: #E84393; }
            .notification-info .notification-icon { color: #6C5CE7; }
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    // Удаляем через 3 секунды
    setTimeout(() => {
        notification.classList.add('notification-exit');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Экспортируем для использования в других файлах
window.BusinessLike = {
    formatNumber,
    debounce,
    throttle,
    getUrlParams,
    showNotification
};

