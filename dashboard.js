
document.addEventListener('DOMContentLoaded', () => {
    const DUMMY_QUIZZES = [
        {
            id: '1',
            title: 'Basic Multiplication',
            category: 'Math',
            questions: [
                { question: '2 × 2', questionType: 'number', correctAnswer: 4 },
                { question: '3 × 5', questionType: 'number', correctAnswer: 15 },
                { question: '10 × 8', questionType: 'number', correctAnswer: 80 },
            ],
        },
        {
            id: '2',
            title: 'Capital Cities',
            category: 'Geography',
            questions: [
                { question: 'Capital of France?', questionType: 'mcq', correctAnswer: 'Paris', options: ['London', 'Paris', 'Berlin', 'Madrid'] },
                { question: 'Capital of Japan?', questionType: 'mcq', correctAnswer: 'Tokyo', options: ['Beijing', 'Seoul', 'Tokyo', 'Bangkok'] },
            ],
        },
        {
            id: '3',
            title: 'Advanced Multiplication',
            category: 'Math',
            questions: [
                { question: '12 × 12', questionType: 'number', correctAnswer: 144 },
                { question: '15 × 15', questionType: 'number', correctAnswer: 225 },
            ]
        }
    ];

    const quizListContainer = document.getElementById('quiz-list');
    const createQuizBtn = document.getElementById('create-quiz-btn');
    const modal = document.getElementById('create-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelModalBtn = document.getElementById('cancel-modal-btn');

    const renderQuizzes = (quizzes) => {
        if (!quizListContainer) return;

        const groupedByCategory = quizzes.reduce((acc, quiz) => {
            (acc[quiz.category] = acc[quiz.category] || []).push(quiz);
            return acc;
        }, {});

        quizListContainer.innerHTML = Object.entries(groupedByCategory).map(([category, quizItems]) => `
            <div class="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
                <button class="accordion-toggle w-full flex justify-between items-center p-4 text-left font-medium text-slate-800 hover:bg-slate-50">
                    <span>${category} (${quizItems.length})</span>
                    <svg class="w-6 h-6 transform transition-transform duration-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div class="accordion-content bg-slate-50 border-t border-slate-200">
                    <div class="p-4 space-y-3">
                        ${quizItems.map(quiz => `
                            <div class="flex justify-between items-center p-3 bg-white rounded-md border border-slate-200">
                                <div>
                                    <p class="font-bold text-slate-800">${quiz.title}</p>
                                    <p class="text-sm text-slate-500">${quiz.questions.length} questions</p>
                                </div>
                                <div class="flex gap-2">
                                    <button data-id="${quiz.id}" class="edit-btn text-sm font-medium text-blue-600 hover:underline">Edit</button>
                                    <button data-id="${quiz.id}" class="delete-btn text-sm font-medium text-red-600 hover:underline">Delete</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    };

    const setupEventListeners = () => {
        quizListContainer.addEventListener('click', (e) => {
            const target = e.target;
            const quizId = target.dataset.id;
            
            if (target.classList.contains('edit-btn')) {
                console.log('Edit quiz:', quizId);
                alert(`(Placeholder) Edit quiz with ID: ${quizId}`);
            }
            if (target.classList.contains('delete-btn')) {
                console.log('Delete quiz:', quizId);
                if (confirm(`(Placeholder) Are you sure you want to delete quiz with ID: ${quizId}?`)) {
                    alert('Quiz would be deleted.');
                }
            }
            if(target.classList.contains('accordion-toggle')) {
                 const content = target.nextElementSibling;
                 const icon = target.querySelector('svg');
                 if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                    icon.classList.remove('rotate-180');
                 } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                    icon.classList.add('rotate-180');
                 }
            }
        });
        
        createQuizBtn.addEventListener('click', () => modal.classList.remove('hidden'));
        closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
        cancelModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
    };

    renderQuizzes(DUMMY_QUIZZES);
    setupEventListeners();
});
