document.addEventListener('DOMContentLoaded', () => {

// =============================================
// ========= STATE & DOM SELECTORS =============
// =============================================
let state = {
    quizState: 'setup', // 'setup', 'active', 'result'
    questions: [],
    settings: {
        shuffle: false,
        repeatWrong: false,
        repeatSet: 1,
        useCustomNumpad: true,
    },
    testResult: null,
    testHistory: [],
    
    // Active quiz state
    currentQueue: [],
    currentIndex: 0,
    answers: [],
    timerInterval: null,
    time: 0,
};

// --- Main Views ---
const setupView = document.getElementById('quiz-setup');
const activeView = document.getElementById('quiz-active');
const resultView = document.getElementById('quiz-result');

// --- Setup View ---
const startQuizBtn = document.getElementById('start-quiz-btn');
const jsonTextarea = document.getElementById('json-textarea');
const jsonError = document.getElementById('json-error');

// --- Settings ---
const settingsContainer = document.getElementById('settings-container');
const shuffleCheck = document.getElementById('setting-shuffle');
const repeatWrongCheck = document.getElementById('setting-repeatWrong');
const useCustomNumpadCheck = document.getElementById('setting-useCustomNumpad');
const repeatSetSelect = document.getElementById('setting-repeatSet');

// --- Active View ---
const timerDisplay = document.getElementById('timer-display');
const quizInfo = document.getElementById('quiz-info');
const questionCard = document.getElementById('question-card');
const questionText = document.getElementById('question-text');
const answerInputs = document.getElementById('answer-inputs');
const endQuizBtn = document.getElementById('end-quiz-btn');

// --- Result View ---
const resultScore = document.getElementById('result-score');
const resultTime = document.getElementById('result-time');
const resultCorrect = document.getElementById('result-correct');
const resultWrong = document.getElementById('result-wrong');
const resultSkipped = document.getElementById('result-skipped');
const resultAnswersSummary = document.getElementById('result-answers-summary');
const startNewQuizBtn = document.getElementById('start-new-quiz-btn');

// --- History ---
const historyContainer = document.getElementById('test-history-container');
const historyTableContainer = document.getElementById('history-table-container');
const clearCacheBtn = document.getElementById('clear-cache-btn');

// --- Modal ---
const loadQuizModalBtn = document.getElementById('load-quiz-modal-btn');
const loadQuizModal = document.getElementById('load-quiz-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const quizSearchInput = document.getElementById('quiz-search-input');
const quizSelectorList = document.getElementById('quiz-selector-list');

// --- Numpad ---
let numpadEl = null;

// =============================================
// =========== DUMMY DATA & CONSTANTS ==========
// =============================================
const DEFAULT_QUESTIONS_STRING = `[
    {"question":"1 × 1","questionType":"number","correctAnswer":1},{"question":"1 × 2","questionType":"number","correctAnswer":2},{"question":"1 × 3","questionType":"number","correctAnswer":3},{"question":"1 × 4","questionType":"number","correctAnswer":4},{"question":"1 × 5","questionType":"number","correctAnswer":5},{"question":"1 × 6","questionType":"number","correctAnswer":6},{"question":"1 × 7","questionType":"number","correctAnswer":7},{"question":"1 × 8","questionType":"number","correctAnswer":8},{"question":"1 × 9","questionType":"number","correctAnswer":9},{"question":"1 × 10","questionType":"number","correctAnswer":10},
    {"question":"2 × 1","questionType":"number","correctAnswer":2},{"question":"2 × 2","questionType":"number","correctAnswer":4},{"question":"2 × 3","questionType":"number","correctAnswer":6},{"question":"2 × 4","questionType":"number","correctAnswer":8},{"question":"2 × 5","questionType":"number","correctAnswer":10},{"question":"2 × 6","questionType":"number","correctAnswer":12},{"question":"2 × 7","questionType":"number","correctAnswer":14},{"question":"2 × 8","questionType":"number","correctAnswer":16},{"question":"2 × 9","questionType":"number","correctAnswer":18},{"question":"2 × 10","questionType":"number","correctAnswer":20}
]`;

const DUMMY_QUIZZES = [
    {id:'1',title:'Basic Multiplication',category:'Math',questions:[{question:'2 × 2',questionType:'number',correctAnswer:4},{question:'3 × 5',questionType:'number',correctAnswer:15},{question:'10 × 8',questionType:'number',correctAnswer:80},],},
    {id:'2',title:'Capital Cities',category:'Geography',questions:[{question:'Capital of France?',questionType:'mcq',correctAnswer:'Paris',options:['London','Paris','Berlin','Madrid']},{question:'Capital of Japan?',questionType:'mcq',correctAnswer:'Tokyo',options:['Beijing','Seoul','Tokyo','Bangkok']},],},
    {id:'3',title:'Advanced Multiplication',category:'Math',questions:[{question:'12 × 12',questionType:'number',correctAnswer:144},{question:'15 × 15',questionType:'number',correctAnswer:225},]}
];


// =============================================
// ============= VIEW MANAGEMENT ===============
// =============================================
function updateView() {
    setupView.hidden = state.quizState !== 'setup';
    activeView.hidden = state.quizState !== 'active';
    resultView.hidden = state.quizState !== 'result';
    settingsContainer.style.display = state.quizState === 'setup' ? 'block' : 'none';
}

// =============================================
// ======== DATA & SETTINGS (LocalStorage) =====
// =============================================
function loadSettings() {
    const saved = localStorage.getItem('quizSettings');
    if (saved) {
        state.settings = { ...state.settings, ...JSON.parse(saved) };
    }
    // Update UI
    shuffleCheck.checked = state.settings.shuffle;
    repeatWrongCheck.checked = state.settings.repeatWrong;
    useCustomNumpadCheck.checked = state.settings.useCustomNumpad;
    repeatSetSelect.value = state.settings.repeatSet;
}

function saveSettings() {
    localStorage.setItem('quizSettings', JSON.stringify(state.settings));
}

function loadHistory() {
    const saved = localStorage.getItem('testHistory');
    state.testHistory = saved ? JSON.parse(saved) : [];
    renderHistory();
}

function saveHistory() {
    localStorage.setItem('testHistory', JSON.stringify(state.testHistory));
}

function loadJson() {
    const saved = localStorage.getItem('quizJson');
    jsonTextarea.value = saved || JSON.stringify(JSON.parse(DEFAULT_QUESTIONS_STRING), null, 2);
}


// =============================================
// ============ CORE QUIZ LOGIC ================
// =============================================
function handleStartQuiz() {
    try {
        const data = JSON.parse(jsonTextarea.value);
        if (!Array.isArray(data)) throw new Error('JSON must be an array.');
        
        localStorage.setItem('quizJson', jsonTextarea.value);
        jsonError.textContent = '';
        
        let finalQuestions = [];
        for (let i = 0; i < state.settings.repeatSet; i++) {
            finalQuestions.push(...data.map(q => ({ ...q })));
        }

        if (state.settings.shuffle) {
            for (let i = finalQuestions.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [finalQuestions[i], finalQuestions[j]] = [finalQuestions[j], finalQuestions[i]];
            }
        }
        
        state.questions = finalQuestions;
        state.currentQueue = [...finalQuestions];
        state.answers = finalQuestions.map(q => ({
            question: q,
            userAnswer: null,
            attempts: [],
            isCorrect: false,
        }));
        state.currentIndex = 0;
        state.quizState = 'active';
        
        startTimer();
        renderQuestion();
        updateView();

    } catch (e) {
        jsonError.textContent = 'Invalid JSON format: ' + e.message;
    }
}

function finishQuiz() {
    stopTimer();
    hideNumpad(); // Ensure numpad is hidden on quiz completion
    let correct = 0, wrong = 0, skipped = 0;

    state.answers.forEach(ans => {
        if (ans.userAnswer === null) skipped++;
        else if (ans.isCorrect) correct++;
        else wrong++;
    });

    const result = {
        date: new Date().toISOString(),
        time: formatTime(state.time),
        score: `${correct}/${state.questions.length}`,
        correct, wrong, skipped,
        answers: state.answers,
    };

    state.testResult = result;
    state.testHistory = [result, ...state.testHistory].slice(0, 10);
    saveHistory();
    renderHistory();

    state.quizState = 'result';
    renderResult();
    updateView();
}

function handleStartNewQuiz() {
    hideNumpad(); // Ensure numpad is hidden for new quiz setup
    state = {
        ...state,
        quizState: 'setup',
        questions: [],
        testResult: null,
        currentQueue: [],
        currentIndex: 0,
        answers: [],
    };
    resetTimer();
    updateView();
}

// =============================================
// ============== ACTIVE QUIZ UI ===============
// =============================================
function renderQuestion() {
    if (state.currentIndex >= state.currentQueue.length) {
        finishQuiz();
        return;
    }

    const q = state.currentQueue[state.currentIndex];
    quizInfo.textContent = `Question ${state.currentIndex + 1} of ${state.currentQueue.length}`;
    questionText.textContent = q.question;
    answerInputs.innerHTML = '';
    answerInputs.className = 'answer-container';

    // Centralized Numpad Visibility Logic
    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    if (q.questionType === 'number' && isMobile && state.settings.useCustomNumpad) {
        showNumpad();
    } else {
        hideNumpad();
    }

    if (q.questionType === 'mcq') {
        answerInputs.classList.add('mcq');
        q.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'mcq-option-btn';
            btn.textContent = opt;
            btn.onclick = () => handleAnswer(opt);
            answerInputs.appendChild(btn);
        });
    } else if (q.questionType === 'number') {
        const input = document.createElement('input');
        input.type = 'number';
        input.className = 'number-input';
        input.placeholder = 'उत्तर लिखो';
        
        if (isMobile && state.settings.useCustomNumpad) {
            input.inputMode = 'none';
        } else {
            input.inputMode = 'decimal';
        }

        input.addEventListener('input', (e) => {
            const val = e.target.value;
            if (String(q.correctAnswer).length === val.length) {
                handleAnswer(val);
            }
        });
        
        answerInputs.appendChild(input);
        setTimeout(() => input.focus(), 100);
    }
}

function handleAnswer(answer) {
    const currentQuestion = state.currentQueue[state.currentIndex];
    const isCorrect = String(answer).trim() === String(currentQuestion.correctAnswer).trim();
    const originalIndex = state.questions.findIndex(q => q.question === currentQuestion.question);

    if (isCorrect) {
        if (originalIndex !== -1 && state.answers[originalIndex].userAnswer === null) {
            state.answers[originalIndex].userAnswer = answer;
            state.answers[originalIndex].isCorrect = true;
        }
        state.currentIndex++;
        renderQuestion();
    } else {
        // Handle wrong answer
        questionCard.classList.add('animate-shake');
        setTimeout(() => questionCard.classList.remove('animate-shake'), 500);

        if (originalIndex !== -1) {
            state.answers[originalIndex].attempts.push(answer);
        }

        if (state.settings.repeatWrong) {
            const nextIndex = Math.min(state.currentQueue.length, state.currentIndex + 2 + Math.floor(Math.random() * 2));
            state.currentQueue.splice(nextIndex, 0, currentQuestion);
        }

        if (currentQuestion.questionType === 'number') {
            const input = answerInputs.querySelector('input');
            if(input) input.value = '';
        }
    }
}


// =============================================
// ============= RESULT SCREEN UI ==============
// =============================================
function renderResult() {
    const { result } = state;
    resultScore.textContent = result.score;
    resultTime.textContent = result.time;
    resultCorrect.textContent = result.correct;
    resultWrong.textContent = result.wrong;
    resultSkipped.textContent = result.skipped;

    resultAnswersSummary.innerHTML = result.answers.map(ans => {
        const isCorrect = ans.isCorrect;
        const cardClass = isCorrect ? 'correct' : 'wrong';
        const userAnswerClass = isCorrect ? 'correct' : 'wrong';
        
        return `
            <div class="answer-summary-card ${cardClass}">
                <strong>${ans.question.question}</strong>
                <div class="answer-summary-details">
                    <span class="user-answer ${userAnswerClass}">Your answer: ${ans.userAnswer ?? '(Skipped)'}</span>
                    <span class="correct-answer">Correct: ${ans.question.correctAnswer}</span>
                </div>
                ${ans.attempts.length > 0 ? `<div class="answer-summary-attempts">Previous attempts: ${ans.attempts.join(', ')}</div>` : ''}
            </div>
        `;
    }).join('');
}


// =============================================
// ============== HISTORY UI ===================
// =============================================
function formatRelativeTime(isoDate) {
    const date = new Date(isoDate);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

function renderHistory() {
    if (state.testHistory.length === 0) {
        historyTableContainer.innerHTML = `<p class="no-history-text">No test history found.</p>`;
        return;
    }
    historyTableContainer.innerHTML = `
        <table class="history-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th class="text-center">Time</th>
                    <th class="text-right">Score</th>
                </tr>
            </thead>
            <tbody>
                ${state.testHistory.map(entry => `
                    <tr>
                        <td>${formatRelativeTime(entry.date)}</td>
                        <td class="text-center">${entry.time}</td>
                        <td class="text-right text-blue">${entry.score}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// =============================================
// ================== MODAL UI =================
// =============================================
function openModal() {
    loadQuizModal.hidden = false;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleEscKey);
}
function closeModal() {
    loadQuizModal.hidden = true;
    document.body.style.overflow = 'auto';
    document.removeEventListener('keydown', handleEscKey);
}
function handleEscKey(e) {
    if (e.key === 'Escape') closeModal();
}

function renderQuizSelector(quizzes) {
    quizSelectorList.innerHTML = quizzes.map(quiz => `
        <button class="quiz-card" data-quiz-id="${quiz.id}">
            <p class="quiz-card-category">${quiz.category}</p>
            <h3 class="quiz-card-title">${quiz.title}</h3>
            <p class="quiz-card-meta">${quiz.questions.length} questions</p>
        </button>
    `).join('');
}

// =============================================
// ============== CUSTOM NUMPAD ================
// =============================================

function createNumpad() {
    if (numpadEl) return;
    const numpadHTML = `
        <div class="numpad-grid">
            <div class="numpad-row">
                <button type="button" class="numpad-btn" data-key="7">7</button>
                <button type="button" class="numpad-btn" data-key="8">8</button>
                <button type="button" class="numpad-btn" data-key="9">9</button>
            </div>
            <div class="numpad-row">
                <button type="button" class="numpad-btn" data-key="4">4</button>
                <button type="button" class="numpad-btn" data-key="5">5</button>
                <button type="button" class="numpad-btn" data-key="6">6</button>
            </div>
            <div class="numpad-row">
                <button type="button" class="numpad-btn" data-key="1">1</button>
                <button type="button" class="numpad-btn" data-key="2">2</button>
                <button type="button" class="numpad-btn" data-key="3">3</button>
            </div>
            <div class="numpad-row">
                <button type="button" class="numpad-btn" data-key=".">.</button>
                <button type="button" class="numpad-btn" data-key="0">0</button>
                <button type="button" class="numpad-btn backspace" data-key="backspace">⌫</button>
            </div>
        </div>
    `;
    numpadEl = document.createElement('div');
    numpadEl.className = 'custom-numpad';
    numpadEl.innerHTML = numpadHTML;
    numpadEl.hidden = true;
    
    numpadEl.addEventListener('mousedown', e => e.preventDefault()); // Prevent input blur
    numpadEl.addEventListener('click', handleNumpadClick);

    document.body.appendChild(numpadEl);
}

function showNumpad() {
    if (!numpadEl) createNumpad();
    numpadEl.hidden = false;
}

function hideNumpad() {
    if (numpadEl) numpadEl.hidden = true;
}

function handleNumpadClick(e) {
    const key = e.target.dataset.key;
    if (!key) return;

    const input = answerInputs.querySelector('.number-input');
    if (!input) return;

    if (key === 'backspace') {
        input.value = input.value.slice(0, -1);
    } else {
        input.value += key;
    }
    
    // Dispatch input event to trigger validation
    input.dispatchEvent(new Event('input', { bubbles: true }));
}


// =============================================
// ============= HELPER FUNCTIONS ==============
// =============================================
function startTimer() {
    state.timerInterval = setInterval(() => {
        state.time++;
        timerDisplay.textContent = formatTime(state.time);
    }, 1000);
}
function stopTimer() {
    clearInterval(state.timerInterval);
}
function resetTimer() {
    state.time = 0;
    timerDisplay.textContent = '00:00';
}
function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}


// =============================================
// ============= EVENT LISTENERS ===============
// =============================================
function setupEventListeners() {
    // --- Settings ---
    [shuffleCheck, repeatWrongCheck, useCustomNumpadCheck].forEach(el => {
        el.addEventListener('change', (e) => {
            state.settings[e.target.id.replace('setting-','')] = e.target.checked;
            saveSettings();
        });
    });
    repeatSetSelect.addEventListener('change', (e) => {
        state.settings.repeatSet = Number(e.target.value);
        saveSettings();
    });

    // --- Buttons ---
    startQuizBtn.addEventListener('click', handleStartQuiz);
    endQuizBtn.addEventListener('click', finishQuiz);
    startNewQuizBtn.addEventListener('click', handleStartNewQuiz);
    clearCacheBtn.addEventListener('click', () => {
        if (confirm("Are you sure you want to clear history and saved quiz JSON?")) {
            localStorage.removeItem('testHistory');
            localStorage.removeItem('quizJson');
            loadHistory();
            loadJson();
        }
    });

    // --- Modal ---
    loadQuizModalBtn.addEventListener('click', openModal);
    closeModalBtn.addEventListener('click', closeModal);
    loadQuizModal.addEventListener('click', (e) => {
        // Close modal if the overlay is clicked, but not its content
        if (e.target === loadQuizModal) {
            closeModal();
        }
    });

    // --- Quiz Selector ---
    quizSearchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = DUMMY_QUIZZES.filter(q => 
            q.title.toLowerCase().includes(term) || q.category.toLowerCase().includes(term)
        );
        renderQuizSelector(filtered);
    });

    quizSelectorList.addEventListener('click', (e) => {
        const card = e.target.closest('.quiz-card');
        if (!card) return;
        const quizId = card.dataset.quizId;
        const selectedQuiz = DUMMY_QUIZZES.find(q => q.id === quizId);
        if (selectedQuiz) {
            jsonTextarea.value = JSON.stringify(selectedQuiz.questions, null, 2);
            closeModal();
        }
    });

    // --- Accordions ---
    document.querySelectorAll('.accordion-btn').forEach(button => {
        button.addEventListener('click', () => {
            const accordion = button.closest('.accordion');
            const isOpen = accordion.dataset.open === 'true';
            accordion.dataset.open = !isOpen;
        });
    });
}


// =============================================
// ================ INITIALIZE =================
// =============================================
function init() {
    loadSettings();
    loadHistory();
    loadJson();
    renderQuizSelector(DUMMY_QUIZZES);
    updateView();
    setupEventListeners();
}

init();

});