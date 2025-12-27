// ========================================
// Business Like — Страница урока
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initVideoPlatformSwitch();
    initQuiz();
    initMatchingGame();
    initProgressChecklist();
    initLessonNavigation();
});

// ========================================
// Переключение вкладок
// ========================================

function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            
            // Убираем активный класс у всех
            tabButtons.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));
            
            // Активируем нужную вкладку
            btn.classList.add('active');
            document.getElementById(tabId)?.classList.add('active');
            
            // Отмечаем прогресс для материалов
            if (tabId === 'text') {
                const checkMaterials = document.getElementById('checkMaterials');
                if (checkMaterials && !checkMaterials.checked) {
                    setTimeout(() => {
                        checkMaterials.checked = true;
                        checkMaterials.closest('.progress-item').classList.add('completed');
                        updateCompleteButton();
                    }, 2000);
                }
            }
        });
    });
}

// ========================================
// Переключение видео платформы (YouTube / Rutube)
// ========================================

function initVideoPlatformSwitch() {
    const switchButtons = document.querySelectorAll('.switch-btn');
    const youtubePlayers = document.getElementById('youtube-player');
    const rutubePlayers = document.getElementById('rutube-player');
    
    switchButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const platform = btn.dataset.platform;
            
            // Переключаем активную кнопку
            switchButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Показываем/скрываем плееры
            if (platform === 'youtube') {
                youtubePlayers?.classList.remove('hidden');
                rutubePlayers?.classList.add('hidden');
            } else {
                youtubePlayers?.classList.add('hidden');
                rutubePlayers?.classList.remove('hidden');
            }
        });
    });
}

// ========================================
// Квиз
// ========================================

let quizState = {
    currentQuestion: 1,
    totalQuestions: 10,
    correctAnswers: 0,
    answered: false
};

function initQuiz() {
    const options = document.querySelectorAll('.quiz-option');
    const retryBtn = document.getElementById('retryQuiz');
    const continueBtn = document.getElementById('continueLesson');
    
    options.forEach(option => {
        option.addEventListener('click', () => handleQuizAnswer(option));
    });
    
    retryBtn?.addEventListener('click', resetQuiz);
    continueBtn?.addEventListener('click', () => {
        // Переходим к игре
        document.querySelector('[data-tab="game"]')?.click();
    });
}

function handleQuizAnswer(option) {
    if (quizState.answered) return;
    quizState.answered = true;
    
    const isCorrect = option.dataset.correct === 'true';
    const question = option.closest('.quiz-question');
    const allOptions = question.querySelectorAll('.quiz-option');
    
    // Отмечаем все варианты
    allOptions.forEach(opt => {
        opt.classList.add('selected');
        if (opt.dataset.correct === 'true') {
            opt.classList.add('correct');
        }
    });
    
    if (isCorrect) {
        quizState.correctAnswers++;
        option.classList.add('correct');
    } else {
        option.classList.add('wrong');
    }
    
    // Переход к следующему вопросу через 1.5 секунды
    setTimeout(() => {
        if (quizState.currentQuestion < quizState.totalQuestions) {
            quizState.currentQuestion++;
            quizState.answered = false;
            showQuestion(quizState.currentQuestion);
        } else {
            showQuizResults();
        }
    }, 1500);
}

function showQuestion(num) {
    const questions = document.querySelectorAll('.quiz-question');
    questions.forEach(q => q.classList.remove('active'));
    
    const targetQuestion = document.querySelector(`[data-question="${num}"]`);
    targetQuestion?.classList.add('active');
    
    // Обновляем прогресс
    document.getElementById('currentQuestion').textContent = num;
    const progressFill = document.getElementById('quizProgressFill');
    if (progressFill) {
        progressFill.style.width = (num / quizState.totalQuestions * 100) + '%';
    }
}

function showQuizResults() {
    const quizContent = document.getElementById('quizContent');
    const quizResults = document.getElementById('quizResults');
    
    quizContent?.classList.add('hidden');
    quizResults?.classList.remove('hidden');
    
    const percentage = Math.round((quizState.correctAnswers / quizState.totalQuestions) * 100);
    
    // Обновляем результаты
    document.getElementById('scoreNumber').textContent = percentage;
    document.getElementById('resultsText').textContent = 
        `Вы ответили правильно на ${quizState.correctAnswers} из ${quizState.totalQuestions} вопросов`;
    
    // Иконка и заголовок в зависимости от результата
    const resultsIcon = document.getElementById('resultsIcon');
    const resultsTitle = document.getElementById('resultsTitle');
    
    if (percentage >= 80) {
        resultsIcon.textContent = '🎉';
        resultsTitle.textContent = 'Отлично!';
    } else if (percentage >= 60) {
        resultsIcon.textContent = '👍';
        resultsTitle.textContent = 'Хорошо!';
    } else {
        resultsIcon.textContent = '📚';
        resultsTitle.textContent = 'Нужно повторить';
    }
    
    // Отмечаем квиз как пройденный
    const checkQuiz = document.getElementById('checkQuiz');
    if (checkQuiz) {
        checkQuiz.checked = true;
        checkQuiz.closest('.progress-item').classList.add('completed');
        updateCompleteButton();
    }
}

function resetQuiz() {
    quizState = {
        currentQuestion: 1,
        totalQuestions: 10,
        correctAnswers: 0,
        answered: false
    };
    
    // Сбрасываем все варианты ответов
    document.querySelectorAll('.quiz-option').forEach(opt => {
        opt.classList.remove('selected', 'correct', 'wrong');
    });
    
    // Показываем первый вопрос
    document.getElementById('quizContent')?.classList.remove('hidden');
    document.getElementById('quizResults')?.classList.add('hidden');
    showQuestion(1);
}

// ========================================
// Игра "Соедини пары"
// ========================================

let gameState = {
    selectedCard: null,
    matchedPairs: 0,
    totalPairs: 5,
    moves: 0
};

function initMatchingGame() {
    const gameCards = document.querySelectorAll('.game-card');
    const restartBtn = document.getElementById('restartGame');
    
    gameCards.forEach(card => {
        card.addEventListener('click', () => handleCardClick(card));
    });
    
    restartBtn?.addEventListener('click', resetGame);
    updateGameStats();
}

function handleCardClick(card) {
    // Игнорируем уже совпавшие карточки
    if (card.classList.contains('matched')) {
        return;
    }
    
    // Если карточка уже выбрана - снимаем выбор
    if (card.classList.contains('selected')) {
        card.classList.remove('selected');
        gameState.selectedCard = null;
        return;
    }
    
    if (!gameState.selectedCard) {
        // Первая карточка - выбираем
        gameState.selectedCard = card;
        card.classList.add('selected');
    } else {
        // Вторая карточка - проверяем пару
        const firstCard = gameState.selectedCard;
        const secondCard = card;
        
        // Проверяем что выбраны карточки из разных колонок
        const firstIsEnglish = firstCard.classList.contains('english');
        const secondIsEnglish = secondCard.classList.contains('english');
        
        if (firstIsEnglish === secondIsEnglish) {
            // Обе карточки из одной колонки - меняем выбор
            firstCard.classList.remove('selected');
            secondCard.classList.add('selected');
            gameState.selectedCard = secondCard;
            return;
        }
        
        // Считаем ход
        gameState.moves++;
        updateGameStats();
        
        if (firstCard.dataset.pair === secondCard.dataset.pair) {
            // Совпадение! Отмечаем зелёным
            firstCard.classList.remove('selected');
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            
            gameState.matchedPairs++;
            updateGameStats();
            
            // Проверяем окончание игры
            if (gameState.matchedPairs === gameState.totalPairs) {
                setTimeout(showGameComplete, 500);
            }
        } else {
            // Не совпадает - отмечаем красным на короткое время
            secondCard.classList.add('selected', 'wrong');
            firstCard.classList.add('wrong');
            
            setTimeout(() => {
                firstCard.classList.remove('selected', 'wrong');
                secondCard.classList.remove('selected', 'wrong');
            }, 800);
        }
        
        gameState.selectedCard = null;
    }
}

function updateGameStats() {
    const matchedEl = document.getElementById('gameMatchedPairs');
    const totalEl = document.getElementById('gameTotalPairs');
    const movesEl = document.getElementById('gameMoves');
    
    if (matchedEl) matchedEl.textContent = gameState.matchedPairs;
    if (totalEl) totalEl.textContent = gameState.totalPairs;
    if (movesEl) movesEl.textContent = gameState.moves;
}

function showGameComplete() {
    const game = document.getElementById('matchingGame');
    const complete = document.getElementById('gameComplete');
    
    // Не скрываем игру - показываем все зелёные пары
    complete?.classList.remove('hidden');
    
    document.getElementById('finalMoves').textContent = gameState.moves;
    
    // Отмечаем игру как пройденную
    const checkGame = document.getElementById('checkGame');
    if (checkGame) {
        checkGame.checked = true;
        checkGame.closest('.progress-item').classList.add('completed');
        updateCompleteButton();
    }
}

function resetGame() {
    gameState = {
        selectedCard: null,
        matchedPairs: 0,
        totalPairs: 5,
        moves: 0
    };
    
    // Сбрасываем карточки
    document.querySelectorAll('.game-card').forEach(card => {
        card.classList.remove('selected', 'matched', 'wrong');
    });
    
    // Показываем игру
    document.getElementById('matchingGame')?.classList.remove('hidden');
    document.getElementById('gameComplete')?.classList.add('hidden');
    
    updateGameStats();
    
    // Перемешиваем карточки
    shuffleCards();
}

function shuffleCards() {
    const columns = document.querySelectorAll('.game-column');
    columns.forEach(column => {
        const cards = Array.from(column.querySelectorAll('.game-card'));
        cards.forEach(card => column.removeChild(card));
        
        // Перемешиваем
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        
        cards.forEach(card => column.appendChild(card));
    });
}

// ========================================
// Чеклист прогресса
// ========================================

function initProgressChecklist() {
    const checkboxes = document.querySelectorAll('.progress-checklist input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const item = checkbox.closest('.progress-item');
            if (checkbox.checked) {
                item.classList.add('completed');
            } else {
                item.classList.remove('completed');
            }
            updateCompleteButton();
        });
    });
}

function updateCompleteButton() {
    const checkboxes = document.querySelectorAll('.progress-checklist input[type="checkbox"]');
    const allChecked = Array.from(checkboxes).every(cb => cb.checked);
    
    const completeBtn = document.getElementById('completeLessonBtn');
    if (completeBtn) {
        completeBtn.disabled = !allChecked;
        
        if (allChecked) {
            completeBtn.addEventListener('click', completeLesson);
        }
    }
}

function completeLesson() {
    // Сохраняем прогресс
    const lessonId = new URLSearchParams(window.location.search).get('lesson') || '4';
    const courseId = new URLSearchParams(window.location.search).get('course') || '1';
    
    const completedLessons = JSON.parse(localStorage.getItem('businesslike_completed_lessons') || '{}');
    if (!completedLessons[courseId]) {
        completedLessons[courseId] = [];
    }
    if (!completedLessons[courseId].includes(lessonId)) {
        completedLessons[courseId].push(lessonId);
    }
    localStorage.setItem('businesslike_completed_lessons', JSON.stringify(completedLessons));
    
    // Показываем уведомление
    if (window.BusinessLike && window.BusinessLike.showNotification) {
        window.BusinessLike.showNotification('🎉 Урок завершён! Отличная работа!', 'success');
    }
    
    // Переходим к следующему уроку или обратно к курсу
    setTimeout(() => {
        window.location.href = `course.html?id=${courseId}`;
    }, 1500);
}

// ========================================
// Навигация по урокам
// ========================================

function initLessonNavigation() {
    const prevBtn = document.getElementById('prevLesson');
    const nextBtn = document.getElementById('nextLesson');
    
    const currentLesson = parseInt(new URLSearchParams(window.location.search).get('lesson')) || 4;
    const courseId = new URLSearchParams(window.location.search).get('course') || '1';
    
    if (prevBtn) {
        if (currentLesson <= 1) {
            prevBtn.disabled = true;
        } else {
            prevBtn.addEventListener('click', () => {
                window.location.href = `lesson.html?course=${courseId}&lesson=${currentLesson - 1}`;
            });
        }
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            // Проверяем, завершён ли урок
            const checkboxes = document.querySelectorAll('.progress-checklist input[type="checkbox"]');
            const allChecked = Array.from(checkboxes).every(cb => cb.checked);
            
            if (allChecked) {
                window.location.href = `lesson.html?course=${courseId}&lesson=${currentLesson + 1}`;
            } else {
                if (window.BusinessLike && window.BusinessLike.showNotification) {
                    window.BusinessLike.showNotification('Сначала завершите все задания урока!', 'error');
                }
            }
        });
    }
    
    // Блокируем заблокированные уроки
    document.querySelectorAll('.lesson-nav-item.locked').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.BusinessLike && window.BusinessLike.showNotification) {
                window.BusinessLike.showNotification('Сначала пройдите предыдущие уроки!', 'error');
            }
        });
    });
}

