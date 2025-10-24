
document.addEventListener('DOMContentLoaded', () => {
    // This file uses hardcoded data for demonstration.
    // In a real application, this data would be fetched from a server/database.
    const DUMMY_QUIZZES = [
        {id:'1',title:'Basic Multiplication',category:'Math',questions:[{question:'2 × 2',questionType:'number',correctAnswer:4},{question:'3 × 5',questionType:'number',correctAnswer:15},{question:'10 × 8',questionType:'number',correctAnswer:80}]},
        {id:'2',title:'Capital Cities',category:'Geography',questions:[{question:'Capital of France?',questionType:'mcq',correctAnswer:'Paris',options:['London','Paris','Berlin','Madrid']},{question:'Capital of Japan?',questionType:'mcq',correctAnswer:'Tokyo',options:['Beijing','Seoul','Tokyo','Bangkok']}]},
        {id:'3',title:'Advanced Multiplication',category:'Math',questions:[{question:'12 × 12',questionType:'number',correctAnswer:144},{question:'15 × 15',questionType:'number',correctAnswer:225}]}
    ];

    // --- DOM SELECTORS ---
    const quizListContainer = document.getElementById('quiz-list');
    const createQuizBtn = document.getElementById('create-quiz-btn');
    const modal = document.getElementById('create-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const cancelModalBtn = document.getElementById('cancel-modal-btn');
    const saveQuizBtn = document.getElementById('save-quiz-btn');

    // --- RENDER FUNCTION ---
    const renderQuizzes = (quizzes) => {
        if (!quizListContainer) return;

        // Group quizzes by category
        const groupedByCategory = quizzes.reduce((acc, quiz) => {
            (acc[quiz.category] = acc[quiz.category] || []).push(quiz);
            return acc;
        }, {});

        // Generate HTML for each category accordion
        quizListContainer.innerHTML = Object.entries(groupedByCategory).map(([category, quizItems]) => `
            <div class="accordion">
                <button class="accordion-toggle">
                    <span>${category} (${quizItems.length})</span>
                    <svg class="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
                </button>
                <div class="accordion-content">
                    <div class="accordion-body">
                        ${quizItems.map(quiz => `
                            <div class="quiz-item">
                                <div>
                                    <p class="quiz-item-title">${quiz.title}</p>
                                    <p class="quiz-item-meta">${quiz.questions.length} questions</p>
                                </div>
                                <div class="quiz-item-actions">
                                    <button data-id="${quiz.id}" class="edit-btn">Edit</button>
                                    <button data-id="${quiz.id}" class="delete-btn">Delete</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `).join('');
    };

    // --- EVENT LISTENERS ---
    const setupEventListeners = () => {
        // Event delegation for dynamically created buttons
        quizListContainer.addEventListener('click', (e) => {
            const target = e.target;
            const quizId = target.dataset.id;
            
            // Edit/Delete buttons
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
            // Accordion toggle
            if(target.classList.contains('accordion-toggle')) {
                 const content = target.nextElementSibling;
                 const icon = target.querySelector('svg');
                 if (content.style.maxHeight) {
                    content.style.maxHeight = null;
                    target.classList.remove('open');
                 } else {
                    content.style.maxHeight = content.scrollHeight + "px";
                    target.classList.add('open');
                 }
            }
        });
        
        // Modal controls
        createQuizBtn.addEventListener('click', () => modal.classList.remove('hidden'));
        closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
        cancelModalBtn.addEventListener('click', () => modal.classList.add('hidden'));

        saveQuizBtn.addEventListener('click', () => {
            // Placeholder for save logic
            alert('(Placeholder) Quiz would be saved to the database.');
            modal.classList.add('hidden');
        })
    };

    // --- INITIALIZATION ---
    renderQuizzes(DUMMY_QUIZZES);
    setupEventListeners();
});
