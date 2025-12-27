// ========================================
// Business Like — Авторизация и регистрация
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initPasswordToggle();
    initPasswordStrength();
    initLoginForm();
    initRegisterForm();
});

// ========================================
// Показать/скрыть пароль
// ========================================

function initPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.previousElementSibling;
            
            if (input.type === 'password') {
                input.type = 'text';
                btn.textContent = '🙈';
            } else {
                input.type = 'password';
                btn.textContent = '👁';
            }
        });
    });
}

// ========================================
// Проверка силы пароля
// ========================================

function initPasswordStrength() {
    const passwordInput = document.querySelector('#registerForm #password');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    if (!passwordInput || !strengthFill) return;
    
    passwordInput.addEventListener('input', () => {
        const password = passwordInput.value;
        const strength = checkPasswordStrength(password);
        
        strengthFill.className = 'strength-fill';
        
        if (password.length === 0) {
            strengthFill.style.width = '0';
            strengthText.textContent = 'Введите пароль';
        } else if (strength === 'weak') {
            strengthFill.classList.add('weak');
            strengthText.textContent = 'Слабый пароль';
        } else if (strength === 'medium') {
            strengthFill.classList.add('medium');
            strengthText.textContent = 'Средний пароль';
        } else {
            strengthFill.classList.add('strong');
            strengthText.textContent = 'Надёжный пароль';
        }
    });
}

function checkPasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    
    if (score <= 2) return 'weak';
    if (score <= 3) return 'medium';
    return 'strong';
}

// ========================================
// Форма входа
// ========================================

function initLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = form.email.value;
        const password = form.password.value;
        const remember = form.remember?.checked;
        
        // Валидация
        if (!validateEmail(email)) {
            showNotification('Введите корректный email', 'error');
            return;
        }
        
        if (password.length < 6) {
            showNotification('Пароль должен быть не менее 6 символов', 'error');
            return;
        }
        
        // Показываем загрузку
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner spinner-small"></span> Входим...';
        
        // Имитация запроса к серверу
        await delay(1500);
        
        // Сохраняем пользователя (демо)
        const user = {
            email,
            firstName: 'Пользователь',
            lastName: '',
            role: 'student',
            loggedIn: true
        };
        
        localStorage.setItem('businesslike_user', JSON.stringify(user));
        
        if (remember) {
            localStorage.setItem('businesslike_remember', email);
        }
        
        showNotification('Добро пожаловать! 💼', 'success');
        
        // Перенаправляем в личный кабинет
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    });
    
    // Автозаполнение email если был запомнен
    const rememberedEmail = localStorage.getItem('businesslike_remember');
    if (rememberedEmail) {
        form.email.value = rememberedEmail;
        form.remember.checked = true;
    }
}

// ========================================
// Форма регистрации
// ========================================

function initRegisterForm() {
    const form = document.getElementById('registerForm');
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const firstName = form.firstName.value.trim();
        const lastName = form.lastName.value.trim();
        const email = form.email.value;
        const password = form.password.value;
        const role = form.querySelector('input[name="role"]:checked')?.value || 'student';
        const terms = form.terms?.checked;
        
        // Валидация
        if (firstName.length < 2) {
            showNotification('Введите ваше имя', 'error');
            return;
        }
        
        if (!validateEmail(email)) {
            showNotification('Введите корректный email', 'error');
            return;
        }
        
        if (password.length < 8) {
            showNotification('Пароль должен быть не менее 8 символов', 'error');
            return;
        }
        
        if (!terms) {
            showNotification('Необходимо принять условия использования', 'error');
            return;
        }
        
        // Показываем загрузку
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner spinner-small"></span> Создаём аккаунт...';
        
        // Имитация запроса к серверу
        await delay(2000);
        
        // Сохраняем пользователя (демо)
        const user = {
            email,
            firstName,
            lastName,
            role,
            loggedIn: true,
            registeredAt: new Date().toISOString()
        };
        
        localStorage.setItem('businesslike_user', JSON.stringify(user));
        
        showNotification('Аккаунт создан! Добро пожаловать! 🎉', 'success');
        
        // Перенаправляем
        setTimeout(() => {
            if (role === 'teacher') {
                window.location.href = 'teacher-dashboard.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        }, 1000);
    });
}

// ========================================
// Утилиты
// ========================================

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showNotification(message, type = 'info') {
    if (window.BusinessLike && window.BusinessLike.showNotification) {
        window.BusinessLike.showNotification(message, type);
    } else {
        // Fallback
        alert(message);
    }
}

// ========================================
// Проверка авторизации
// ========================================

function isLoggedIn() {
    const user = JSON.parse(localStorage.getItem('businesslike_user') || '{}');
    return user.loggedIn === true;
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('businesslike_user') || '{}');
}

function logout() {
    localStorage.removeItem('businesslike_user');
    window.location.href = 'index.html';
}

// Экспортируем функции
window.BusinessLikeAuth = {
    isLoggedIn,
    getCurrentUser,
    logout
};

