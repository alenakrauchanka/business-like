// ========================================
// Business Like — Страница каталога курсов
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    initFavorites();
    initUrlParams();
});

// ========================================
// Фильтрация курсов
// ========================================

function initFilters() {
    const checkboxes = document.querySelectorAll('.filter-checkbox input');
    const resetBtn = document.getElementById('resetFilters');
    const sortSelect = document.getElementById('sortSelect');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filterCourses);
    });
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            checkboxes.forEach(cb => cb.checked = true);
            filterCourses();
        });
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', sortCourses);
    }
}

function filterCourses() {
    const courses = document.querySelectorAll('.course-card');
    const activeCategories = getCheckedValues('category');
    const activeLevels = getCheckedValues('level');
    
    let visibleCount = 0;
    
    courses.forEach(course => {
        const category = course.dataset.category;
        const level = course.dataset.level;
        
        const categoryMatch = activeCategories.length === 0 || activeCategories.includes(category);
        const levelMatch = activeLevels.length === 0 || activeLevels.includes(level);
        
        if (categoryMatch && levelMatch) {
            course.style.display = 'block';
            course.style.animation = 'fadeInUp 0.4s ease forwards';
            visibleCount++;
        } else {
            course.style.display = 'none';
        }
    });
    
    // Обновляем счётчик
    const countElement = document.getElementById('coursesCount');
    if (countElement) {
        countElement.textContent = visibleCount;
    }
}

function getCheckedValues(name) {
    const checkboxes = document.querySelectorAll(`input[name="${name}"]:checked`);
    return Array.from(checkboxes).map(cb => cb.value);
}

function sortCourses() {
    const sortSelect = document.getElementById('sortSelect');
    const grid = document.getElementById('coursesGrid');
    const courses = Array.from(grid.querySelectorAll('.course-card'));
    
    const sortValue = sortSelect.value;
    
    courses.sort((a, b) => {
        switch (sortValue) {
            case 'rating':
                return getRating(b) - getRating(a);
            case 'newest':
                // Для демо — обратный порядок
                return courses.indexOf(b) - courses.indexOf(a);
            case 'duration':
                return getDuration(a) - getDuration(b);
            default: // popular
                return getReviews(b) - getReviews(a);
        }
    });
    
    // Перестраиваем сетку с анимацией
    courses.forEach((course, index) => {
        course.style.order = index;
        course.style.animation = 'none';
        course.offsetHeight; // Trigger reflow
        course.style.animation = `fadeInUp 0.4s ease forwards ${index * 0.05}s`;
    });
}

function getRating(card) {
    const text = card.querySelector('.rating-text')?.textContent || '0';
    return parseFloat(text);
}

function getReviews(card) {
    const text = card.querySelector('.rating-text')?.textContent || '(0)';
    const match = text.match(/\((\d+)\)/);
    return match ? parseInt(match[1]) : 0;
}

function getDuration(card) {
    const text = card.querySelector('.duration')?.textContent || '0';
    const match = text.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
}

// ========================================
// Избранное
// ========================================

function initFavorites() {
    const favoriteButtons = document.querySelectorAll('.favorite-btn');
    
    // Загружаем сохранённые избранные
    const favorites = JSON.parse(localStorage.getItem('businesslike_favorites') || '[]');
    
    favoriteButtons.forEach(btn => {
        const card = btn.closest('.course-card');
        const courseId = card.querySelector('a[href*="course.html"]')?.href || '';
        
        if (favorites.includes(courseId)) {
            btn.classList.add('active');
            btn.innerHTML = '♥';
        }
        
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            btn.classList.toggle('active');
            
            if (btn.classList.contains('active')) {
                btn.innerHTML = '♥';
                addToFavorites(courseId);
                showNotification('Курс добавлен в избранное', 'success');
            } else {
                btn.innerHTML = '♡';
                removeFromFavorites(courseId);
                showNotification('Курс удалён из избранного', 'info');
            }
            
            // Анимация
            btn.style.transform = 'scale(1.3)';
            setTimeout(() => btn.style.transform = 'scale(1)', 200);
        });
    });
}

function addToFavorites(courseId) {
    const favorites = JSON.parse(localStorage.getItem('businesslike_favorites') || '[]');
    if (!favorites.includes(courseId)) {
        favorites.push(courseId);
        localStorage.setItem('businesslike_favorites', JSON.stringify(favorites));
    }
}

function removeFromFavorites(courseId) {
    let favorites = JSON.parse(localStorage.getItem('businesslike_favorites') || '[]');
    favorites = favorites.filter(id => id !== courseId);
    localStorage.setItem('businesslike_favorites', JSON.stringify(favorites));
}

// ========================================
// Обработка URL параметров
// ========================================

function initUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    
    if (category) {
        // Снимаем все чекбоксы категорий
        document.querySelectorAll('input[name="category"]').forEach(cb => {
            cb.checked = false;
        });
        
        // Выбираем нужную категорию
        const targetCheckbox = document.querySelector(`input[name="category"][value="${category}"]`);
        if (targetCheckbox) {
            targetCheckbox.checked = true;
            filterCourses();
            
            // Скроллим к курсам
            setTimeout(() => {
                document.querySelector('.courses-section')?.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }
}

// Показать уведомление (используем из main.js или создаём)
function showNotification(message, type = 'info') {
    if (window.BusinessLike && window.BusinessLike.showNotification) {
        window.BusinessLike.showNotification(message, type);
    } else {
        // Fallback
        console.log(`[${type}] ${message}`);
    }
}

