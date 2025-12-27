// ========================================
// Business Like — Страница курса
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initModuleToggles();
    initFavoriteCourse();
    initVideoPreview();
});

// ========================================
// Раскрытие/скрытие модулей
// ========================================

function initModuleToggles() {
    const moduleHeaders = document.querySelectorAll('.module-header');
    
    moduleHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const module = header.closest('.lesson-module');
            module.classList.toggle('collapsed');
            
            // Анимация контента
            const lessons = module.querySelector('.module-lessons');
            if (lessons) {
                if (module.classList.contains('collapsed')) {
                    lessons.style.maxHeight = '0';
                } else {
                    lessons.style.maxHeight = lessons.scrollHeight + 'px';
                }
            }
        });
    });
    
    // Устанавливаем начальную высоту для открытых модулей
    document.querySelectorAll('.lesson-module:not(.collapsed) .module-lessons').forEach(lessons => {
        lessons.style.maxHeight = lessons.scrollHeight + 'px';
    });
    
    // Добавляем стили для анимации
    const styles = document.createElement('style');
    styles.textContent = `
        .module-lessons {
            overflow: hidden;
            transition: max-height 0.3s ease;
        }
        
        .lesson-module.collapsed .module-lessons {
            max-height: 0 !important;
        }
    `;
    document.head.appendChild(styles);
}

// ========================================
// Избранное для курса
// ========================================

function initFavoriteCourse() {
    const favoriteBtn = document.querySelector('.favorite-course-btn');
    if (!favoriteBtn) return;
    
    // Получаем ID курса из URL
    const courseId = new URLSearchParams(window.location.search).get('id') || '1';
    const favorites = JSON.parse(localStorage.getItem('businesslike_favorite_courses') || '[]');
    
    // Проверяем, в избранном ли курс
    if (favorites.includes(courseId)) {
        favoriteBtn.classList.add('active');
        favoriteBtn.querySelector('.heart').textContent = '♥';
        favoriteBtn.innerHTML = '<span class="heart">♥</span> В избранном';
    }
    
    favoriteBtn.addEventListener('click', () => {
        favoriteBtn.classList.toggle('active');
        
        const isActive = favoriteBtn.classList.contains('active');
        
        if (isActive) {
            favoriteBtn.innerHTML = '<span class="heart">♥</span> В избранном';
            addCourseToFavorites(courseId);
            showNotification('Курс добавлен в избранное!', 'success');
        } else {
            favoriteBtn.innerHTML = '<span class="heart">♡</span> В избранное';
            removeCourseFromFavorites(courseId);
            showNotification('Курс удалён из избранного', 'info');
        }
        
        // Анимация
        favoriteBtn.style.transform = 'scale(0.95)';
        setTimeout(() => favoriteBtn.style.transform = 'scale(1)', 150);
    });
}

function addCourseToFavorites(courseId) {
    const favorites = JSON.parse(localStorage.getItem('businesslike_favorite_courses') || '[]');
    if (!favorites.includes(courseId)) {
        favorites.push(courseId);
        localStorage.setItem('businesslike_favorite_courses', JSON.stringify(favorites));
    }
}

function removeCourseFromFavorites(courseId) {
    let favorites = JSON.parse(localStorage.getItem('businesslike_favorite_courses') || '[]');
    favorites = favorites.filter(id => id !== courseId);
    localStorage.setItem('businesslike_favorite_courses', JSON.stringify(favorites));
}

// ========================================
// Превью видео
// ========================================

function initVideoPreview() {
    const playBtn = document.querySelector('.play-preview-btn');
    if (!playBtn) return;
    
    playBtn.addEventListener('click', () => {
        // Здесь можно открыть модальное окно с видео
        // Для демо просто показываем уведомление
        showNotification('Превью видео скоро будет доступно!', 'info');
        
        // Или можно перенаправить на первый урок
        // window.location.href = 'lesson.html?course=1&lesson=1';
    });
}

// ========================================
// Прогресс курса
// ========================================

function updateCourseProgress() {
    const completedLessons = document.querySelectorAll('.lesson-item.completed').length;
    const totalLessons = document.querySelectorAll('.lesson-item').length;
    const percentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
    
    // Обновляем прогресс-бар
    const progressFill = document.querySelector('.mini-progress-fill');
    if (progressFill) {
        progressFill.style.width = percentage + '%';
    }
    
    // Обновляем текст
    const progressText = document.querySelector('.progress-text');
    if (progressText) {
        progressText.textContent = `Прогресс: ${completedLessons}/${totalLessons} уроков`;
    }
    
    return { completed: completedLessons, total: totalLessons, percentage };
}

// ========================================
// Блокировка уроков
// ========================================

function handleLockedLesson(event) {
    const lessonItem = event.target.closest('.lesson-item');
    if (lessonItem && lessonItem.classList.contains('locked')) {
        event.preventDefault();
        showNotification('Сначала пройдите предыдущие уроки!', 'error');
    }
}

// Добавляем обработчик для заблокированных уроков
document.addEventListener('click', handleLockedLesson);

// ========================================
// Утилиты
// ========================================

function showNotification(message, type = 'info') {
    if (window.BusinessLike && window.BusinessLike.showNotification) {
        window.BusinessLike.showNotification(message, type);
    } else {
        console.log(`[${type}] ${message}`);
    }
}

// Инициализация прогресса при загрузке
updateCourseProgress();

