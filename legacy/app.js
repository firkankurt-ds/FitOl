// App State
const state = {
    currentUser: null,
    currentDate: new Date('2025-11-25'), // Start simulation from the requested date
    viewDate: new Date('2025-11-25'),
    selectedDate: null
};

// DOM Elements
const screens = {
    login: document.getElementById('login-screen'),
    app: document.getElementById('app-screen')
};

const views = {
    calendar: document.getElementById('calendar-view'),
    workout: document.getElementById('workout-view')
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadUser();
    if (state.currentUser) {
        showApp();
    } else {
        showLogin();
    }

    setupEventListeners();
});

function setupEventListeners() {
    // Login Form
    document.getElementById('login-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const user = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            age: document.getElementById('age').value,
            weight: document.getElementById('weight').value,
            gender: document.querySelector('input[name="gender"]:checked').value
        };
        saveUser(user);
        showApp();
    });

    // Calendar Controls
    document.getElementById('prev-month').addEventListener('click', () => {
        state.viewDate.setMonth(state.viewDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('next-month').addEventListener('click', () => {
        state.viewDate.setMonth(state.viewDate.getMonth() + 1);
        renderCalendar();
    });

    // Workout View Controls
    document.getElementById('back-to-calendar').addEventListener('click', () => {
        views.workout.classList.remove('active');
    });
}

// User Management
function loadUser() {
    const saved = localStorage.getItem('fitol_user');
    if (saved) {
        state.currentUser = JSON.parse(saved);
    }
}

function saveUser(user) {
    localStorage.setItem('fitol_user', JSON.stringify(user));
    state.currentUser = user;
}

function showLogin() {
    screens.login.classList.add('active');
    screens.app.classList.remove('active');
}

function showApp() {
    screens.login.classList.remove('active');
    screens.app.classList.add('active');

    document.getElementById('user-greeting').textContent = `Hello, ${state.currentUser.firstName}`;
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    renderCalendar();
}

// Calendar Logic
function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    grid.innerHTML = '';

    const year = state.viewDate.getFullYear();
    const month = state.viewDate.getMonth();

    document.getElementById('calendar-month').textContent = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    // Day Headers
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    days.forEach(d => {
        const el = document.createElement('div');
        el.className = 'calendar-day header';
        el.textContent = d;
        grid.appendChild(el);
    });

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay(); // 0 = Sun

    // Empty slots for previous month
    for (let i = 0; i < startDayOfWeek; i++) {
        const el = document.createElement('div');
        el.className = 'calendar-day empty';
        grid.appendChild(el);
    }

    // Days
    for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(year, month, i);
        const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }); // e.g., "Tuesday"
        const dateString = date.toISOString().split('T')[0];

        const el = document.createElement('div');
        el.className = 'calendar-day';
        el.textContent = i;

        // Check if today
        const today = new Date();
        if (date.toDateString() === today.toDateString()) {
            el.classList.add('today');
        }

        // Check for workout
        const workout = WORKOUT_PROGRAM[dayOfWeek];
        if (workout && workout.length > 0) {
            el.classList.add('has-workout');

            // Check if completed (simple check if any data exists for this date)
            const savedData = localStorage.getItem(`workout_${dateString}`);
            if (savedData) {
                el.classList.add('completed');
            }

            el.addEventListener('click', () => openWorkout(date, workout));
        } else {
            el.classList.add('rest-day');
        }

        grid.appendChild(el);
    }
}

// Workout Logic
function openWorkout(date, exercises) {
    state.selectedDate = date;
    const dateString = date.toISOString().split('T')[0];

    document.getElementById('workout-date-title').textContent = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });

    const container = document.getElementById('workout-content');
    container.innerHTML = '';

    // Load saved data
    const savedData = JSON.parse(localStorage.getItem(`workout_${dateString}`) || '{}');

    exercises.forEach((ex, exIndex) => {
        const card = document.createElement('div');
        card.className = 'exercise-card';

        const setsReps = ex.sets_reps || '3x10';
        // Parse sets (e.g., "4x6-8" -> 4 sets)
        const numSets = parseInt(setsReps.split('x')[0]) || 3;

        let setsHtml = '';
        for (let i = 1; i <= numSets; i++) {
            const savedSet = savedData[`${exIndex}_${i}`] || {};
            setsHtml += `
                <div class="set-row">
                    <span class="set-number">#${i}</span>
                    <input type="number" class="set-input" placeholder="kg" 
                        data-ex="${exIndex}" data-set="${i}" data-type="weight" value="${savedSet.weight || ''}">
                    <input type="number" class="set-input" placeholder="reps" 
                        data-ex="${exIndex}" data-set="${i}" data-type="reps" value="${savedSet.reps || ''}">
                </div>
            `;
        }

        card.innerHTML = `
            <div class="exercise-header">
                <span class="exercise-name">${ex.name}</span>
                <div class="exercise-meta">
                    <div>${ex.sets_reps}</div>
                    <div>${ex.rir || ''}</div>
                </div>
            </div>
            <div class="sets-container">
                ${setsHtml}
            </div>
        `;

        container.appendChild(card);
    });

    // Save Button
    const saveBtn = document.createElement('button');
    saveBtn.className = 'save-btn';
    saveBtn.textContent = 'Save Workout';
    saveBtn.onclick = () => saveWorkout(dateString);
    container.appendChild(saveBtn);

    views.workout.classList.add('active');
}

function saveWorkout(dateString) {
    const inputs = document.querySelectorAll('.set-input');
    const data = {};

    inputs.forEach(input => {
        const ex = input.dataset.ex;
        const set = input.dataset.set;
        const type = input.dataset.type;
        const val = input.value;

        const key = `${ex}_${set}`;
        if (!data[key]) data[key] = {};
        data[key][type] = val;
    });

    localStorage.setItem(`workout_${dateString}`, JSON.stringify(data));

    // Visual feedback
    const btn = document.querySelector('.save-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Saved!';
    btn.style.background = '#10b981';

    setTimeout(() => {
        btn.textContent = originalText;
        views.workout.classList.remove('active');
        renderCalendar(); // Update completion status
    }, 1000);
}
