// ========================================
// Business Like — Панель учителя
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initLessonsBuilder();
    initImageUpload();
    initCourseForm();
});

// ========================================
// Конструктор уроков
// ========================================

let lessonCount = 2;

function initLessonsBuilder() {
    const addLessonBtn = document.getElementById('addLessonBtn');
    const lessonsBuilder = document.getElementById('lessonsBuilder');
    
    if (addLessonBtn && lessonsBuilder) {
        addLessonBtn.addEventListener('click', () => {
            lessonCount++;
            addLesson(lessonCount);
        });
        
        // Удаление уроков
        lessonsBuilder.addEventListener('click', (e) => {
            if (e.target.classList.contains('btn-remove-lesson')) {
                const lessonItem = e.target.closest('.lesson-builder-item');
                if (lessonsBuilder.querySelectorAll('.lesson-builder-item').length > 1) {
                    lessonItem.remove();
                    updateLessonNumbers();
                } else {
                    showNotification('Курс должен содержать минимум 1 урок', 'error');
                }
            }
        });
    }
}

function addLesson(num) {
    const lessonsBuilder = document.getElementById('lessonsBuilder');
    
    const lessonHTML = `
        <div class="lesson-builder-item" data-lesson="${num}">
            <div class="lesson-builder-header">
                <span class="lesson-number">Урок ${num}</span>
                <button type="button" class="btn-remove-lesson" aria-label="Удалить урок">✕</button>
            </div>
            <div class="lesson-builder-content">
                <div class="form-group">
                    <input type="text" placeholder="Название урока" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <input type="text" placeholder="Ссылка на YouTube видео">
                    </div>
                    <div class="form-group">
                        <input type="text" placeholder="Ссылка на Rutube видео">
                    </div>
                </div>
                <div class="form-group">
                    <textarea rows="3" placeholder="Текстовые материалы урока..."></textarea>
                </div>
            </div>
        </div>
    `;
    
    lessonsBuilder.insertAdjacentHTML('beforeend', lessonHTML);
    
    // Анимация появления
    const newLesson = lessonsBuilder.lastElementChild;
    newLesson.style.opacity = '0';
    newLesson.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        newLesson.style.transition = 'all 0.3s ease';
        newLesson.style.opacity = '1';
        newLesson.style.transform = 'translateY(0)';
    }, 10);
    
    // Скролл к новому уроку
    newLesson.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function updateLessonNumbers() {
    const lessons = document.querySelectorAll('.lesson-builder-item');
    lessons.forEach((lesson, index) => {
        const num = index + 1;
        lesson.dataset.lesson = num;
        lesson.querySelector('.lesson-number').textContent = `Урок ${num}`;
    });
    lessonCount = lessons.length;
}

// ========================================
// Загрузка изображения
// ========================================

function initImageUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('courseImage');
    
    if (!uploadArea || !fileInput) return;
    
    // Клик на область загрузки
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleImageUpload(files[0]);
        }
    });
    
    // Выбор файла
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleImageUpload(e.target.files[0]);
        }
    });
    
    // Добавляем стили для drag
    const style = document.createElement('style');
    style.textContent = `
        .upload-area.dragover {
            border-color: var(--primary);
            background: rgba(108, 92, 231, 0.1);
        }
        
        .upload-area.has-image {
            padding: 0;
            border: none;
        }
        
        .upload-area.has-image img {
            width: 100%;
            height: 200px;
            object-fit: cover;
            border-radius: var(--radius-md);
        }
    `;
    document.head.appendChild(style);
}

function handleImageUpload(file) {
    if (!file.type.startsWith('image/')) {
        showNotification('Пожалуйста, выберите изображение', 'error');
        return;
    }
    
    const uploadArea = document.getElementById('uploadArea');
    const reader = new FileReader();
    
    reader.onload = (e) => {
        uploadArea.innerHTML = `<img src="${e.target.result}" alt="Обложка курса">`;
        uploadArea.classList.add('has-image');
        showNotification('Изображение загружено!', 'success');
    };
    
    reader.readAsDataURL(file);
}

// ========================================
// Форма создания курса
// ========================================

function initCourseForm() {
    const form = document.getElementById('createCourseForm');
    
    if (!form) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const title = document.getElementById('courseTitle').value.trim();
        const description = document.getElementById('courseDescription').value.trim();
        const category = document.getElementById('courseCategory').value;
        const level = document.getElementById('courseLevel').value;
        
        // Валидация
        if (!title || !description || !category || !level) {
            showNotification('Заполните все обязательные поля', 'error');
            return;
        }
        
        // Собираем уроки
        const lessons = [];
        document.querySelectorAll('.lesson-builder-item').forEach((item, index) => {
            const inputs = item.querySelectorAll('input, textarea');
            lessons.push({
                number: index + 1,
                title: inputs[0].value,
                youtubeUrl: inputs[1].value,
                rutubeUrl: inputs[2].value,
                content: inputs[3].value
            });
        });
        
        // Проверяем, что есть хотя бы один урок с названием
        const validLessons = lessons.filter(l => l.title.trim() !== '');
        if (validLessons.length === 0) {
            showNotification('Добавьте хотя бы один урок с названием', 'error');
            return;
        }
        
        // Показываем загрузку
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '⏳ Публикуем...';
        
        // Имитация сохранения
        await delay(2000);
        
        // Сохраняем курс (демо)
        const course = {
            id: Date.now(),
            title,
            description,
            category,
            level,
            lessons: validLessons,
            createdAt: new Date().toISOString(),
            status: 'published'
        };
        
        const courses = JSON.parse(localStorage.getItem('businesslike_teacher_courses') || '[]');
        courses.push(course);
        localStorage.setItem('businesslike_teacher_courses', JSON.stringify(courses));
        
        showNotification('🎉 Курс успешно опубликован!', 'success');
        
        // Сбрасываем форму
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = '🚀 Опубликовать курс';
        
        // Скролл наверх
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========================================
// Утилиты
// ========================================

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showNotification(message, type = 'info') {
    if (window.BusinessLike && window.BusinessLike.showNotification) {
        window.BusinessLike.showNotification(message, type);
    } else {
        alert(message);
    }
}



