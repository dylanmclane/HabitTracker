// Retrieve the necessary DOM elements
const newHabitInput = document.getElementById('new-habit-input');
const addHabitBtn = document.getElementById('add-habit-btn');
const habitGrids = document.getElementById('habit-grids');
const currentDayElement = document.getElementById('current-day'); // Retrieve the current day element

// Create an empty array to store habits
let habits = [];

// Function to get the current date formatted as "Month Day, Year"
function getCurrentDate() {
    const date = new Date();
    const options = { 
        month: 'long',
        day: 'numeric', 
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    };
    return date.toLocaleDateString(undefined, options);
}

// Function to update the current day and time every second
function updateCurrentTime() {
    currentDayElement.textContent = getCurrentDate();
}

// Update the current time immediately
updateCurrentTime();

// Update the current time every second
setInterval(updateCurrentTime, 1000);

// Function to render the habit grids
function renderHabitGrids() {
    // Clear existing habit grids
    habitGrids.innerHTML = '';

    // Loop through habits and create habit grids
    habits.forEach(habit => {
        const habitGrid = document.createElement('div');
        habitGrid.classList.add('habit-grid');

        // Create a grid for the current month
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        const currentDay = currentDate.getDate();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

        // Loop through the days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const completionDate = new Date(currentYear, currentMonth, day);
            const completionDateString = completionDate.toISOString().split('T')[0];

            const isCompleted = habit.completions.includes(completionDateString);
            const isPastDay = day < currentDay;
            const isFutureDay = day > currentDay;

            const gridItem = document.createElement('div');
            gridItem.classList.add('habit-grid-item');

            // Add day number centered in the grid box
            const dayNumber = document.createElement('span');
            dayNumber.classList.add('day-number');
            dayNumber.innerText = day;
            gridItem.appendChild(dayNumber);

            if (isCompleted) {
                gridItem.classList.add('completed');
            } else if (isPastDay) {
                gridItem.classList.add('missed');
            } else {
                gridItem.classList.add('upcoming');
            }

            habitGrid.appendChild(gridItem);
        }

        const habitItem = document.createElement('div');
        habitItem.classList.add('habit-item');
        habitItem.innerText = habit.name;

        const toggleBtn = document.createElement('button');
        toggleBtn.classList.add('toggle-habit-btn');

        const completionDate = new Date(currentYear, currentMonth, currentDay);
        const completionDateString = completionDate.toISOString().split('T')[0];
        const isCompleted = habit.completions.includes(completionDateString);

        if (isCompleted) {
            toggleBtn.innerText = 'Oops, I have not completed this habit today.';
            toggleBtn.classList.add('undo-completion');
        } else {
            toggleBtn.innerText = 'I completed this habit today!';
        }

        toggleBtn.addEventListener('click', () => {
            toggleCompletion(habit, currentYear, currentMonth, currentDay);
            renderHabitGrids();
        });

        const removeBtn = document.createElement('button');
        removeBtn.classList.add('remove-habit-btn');
        removeBtn.innerText = 'Remove';
        removeBtn.addEventListener('click', () => {
            showWarningAndRemoveHabit(habit);
        });

        habitItem.appendChild(toggleBtn);
        habitItem.appendChild(removeBtn);
        habitGrid.appendChild(habitItem);
        habitGrids.appendChild(habitGrid);
    });
}

// Function to toggle habit completion for the current day
function toggleCompletion(habit, year, month, day) {
    const completionDate = new Date(year, month, day);
    const completionDateString = completionDate.toISOString().split('T')[0];

    const isCompleted = habit.completions.includes(completionDateString);

    if (isCompleted) {
        // If already completed, remove the completion
        const index = habit.completions.indexOf(completionDateString);
        if (index !== -1) {
            habit.completions.splice(index, 1);
        }
    } else {
        // If not completed, add the completion
        habit.completions.push(completionDateString);
    }

    updateLocalStorage();
}

// Function to show a warning message and remove a habit
function showWarningAndRemoveHabit(habit) {
    const shouldRemove = confirm('Warning, removing this will lose habit progress. Are you sure you want to remove this habit?');
    if (shouldRemove) {
        const habitIndex = habits.indexOf(habit);
        if (habitIndex !== -1) {
            habits.splice(habitIndex, 1);
            renderHabitGrids();
            updateLocalStorage();
        }
    }
}

// Function to add a new habit
function addHabit() {
    const habitName = newHabitInput.value.trim();
    if (habitName !== '') {
        const newHabit = {
            name: habitName,
            completions: []
        };
        habits.push(newHabit);
        renderHabitGrids();
        updateLocalStorage();
        newHabitInput.value = '';
    }
}

// Event listener for add habit button
addHabitBtn.addEventListener('click', addHabit);

// Function to update local storage with the habits data
function updateLocalStorage() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

// Function to load habits from local storage
function loadHabits() {
    const storedHabits = localStorage.getItem('habits');
    if (storedHabits) {
        habits = JSON.parse(storedHabits);
        renderHabitGrids();
    }
}

// Load habits from local storage on page load
loadHabits();

// Display the current day on page load
currentDayElement.textContent = getCurrentDate();