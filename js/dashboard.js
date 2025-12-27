// ========================================
// Business Like — Личный кабинет ученика
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initUserMenu();
    initUserData();
    checkAuth();
});

// ========================================
// Меню пользователя
// ========================================

function initUserMenu() {
    const menuBtn = document.getElementById('userMenuBtn');
    const dropdown = document.getElementById('userDropdown');
    const userMenu = document.querySelector('.user-menu');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (menuBtn && userMenu) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userMenu.classList.toggle('open');
        });
        
        // Закрываем при клике вне меню
        document.addEventListener('click', (e) => {
            if (!userMenu.contains(e.target)) {
                userMenu.classList.remove('open');
            }
        });
    }
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}

// ========================================
// Данные пользователя
// ========================================

function initUserData() {
    const user = JSON.parse(localStorage.getItem('businesslike_user') || '{}');
    
    if (user.firstName) {
        // Обновляем имя в приветствии
        const welcomeName = document.getElementById('welcomeName');
        const userName = document.getElementById('userName');
        
        if (welcomeName) welcomeName.textContent = user.firstName;
        if (userName) userName.textContent = user.firstName;
    }
}

// ========================================
// Проверка авторизации
// ========================================

function checkAuth() {
    const user = JSON.parse(localStorage.getItem('businesslike_user') || '{}');
    
    if (!user.loggedIn) {
        // Перенаправляем на страницу входа
        // window.location.href = 'login.html';
        // Для демо оставляем доступ
    }
}

function logout() {
    localStorage.removeItem('businesslike_user');
    
    if (window.BusinessLike && window.BusinessLike.showNotification) {
        window.BusinessLike.showNotification('Вы вышли из аккаунта', 'info');
    }
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 500);
}



