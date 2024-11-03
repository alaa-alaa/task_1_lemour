// Global variables
let user = null;
const workoutPlans = {};
const progressLog = {};
const customExercises = {};
let calorieTarget = 0;
let dailyCalorieIntake = 0;

/**
 * Checks if the provided email address is valid.
 * 
 * @param {string} email - The email address to be validated.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

/**
 * Registers a new user with the provided email and password.
 * 
 * @returns {void}
 */
function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }
    if (!password) {
        alert("Please enter a password.");
        return;
    }

    localStorage.setItem(email, JSON.stringify({ email, password }));
    alert("Registration successful. Please log in.");
}

/**
 * Logs in the user with the provided email and password.
 * 
 * @returns {void}
 */
function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (!email || !isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }
    if (!password) {
        alert("Please enter a password.");
        return;
    }

    const storedUser = JSON.parse(localStorage.getItem(email));
    if (storedUser && storedUser.password === password) {
        user = storedUser;
        alert("Login successful!");
        document.getElementById("auth-section").classList.add("hidden");
        document.getElementById("user-info-section").classList.remove("hidden");
        document.getElementById("progress-log-section").classList.remove("hidden");
        document.getElementById("custom-exercise-section").classList.remove("hidden");
        document.getElementById("calorie-tracking-section").classList.remove("hidden");
    } else {
        alert("Incorrect email or password.");
    }
}

/**
 * Gets the user's goal, experience level, and available equipment.
 * 
 * @returns {object|null} An object containing the user's goal, experience level, and equipment, or null if not all options are selected.
 */
function getUserInfo() {
    const goal = document.querySelector("input[name='goal']:checked");
    const experience = document.querySelector("input[name='experience']:checked");
    const equipment = Array.from(document.querySelectorAll("input[name='equipment']:checked")).map(el => el.value);

    if (!goal || !experience || equipment.length === 0) {
        alert("Please select all options.");
        return null;
    }
    return { goal: goal.value, experience: experience.value, equipment };
}

/**
 * Generates a workout plan based on the user's goal, experience level, and available equipment.
 * 
 * @param {object} userInfo - An object containing the user's goal, experience level, and equipment.
 * @returns {array} An array of workout plan exercises.
 */
function generateWorkoutPlan(userInfo) {
    const workoutPlan = [];

    if (userInfo.goal === "build muscle") {
        workoutPlan.push({ exercise: "Push-ups", reps: userInfo.experience === "beginner" ? 10 : 20, sets: 3 });
        workoutPlan.push({ exercise: "Bench Press", reps: 8, sets: 4 });
    } else if (userInfo.goal === "lose weight") {
        workoutPlan.push({ exercise: "Burpees", reps: userInfo.experience === "beginner" ? 10 : 15, sets: 3 });
        workoutPlan.push({ exercise: "Mountain Climbers", reps: 30, sets: 3 });
    }

    userInfo.equipment.forEach(eq => {
        if (eq === "weights") workoutPlan.push({ exercise: "Dumbbell Squats", reps: 12, sets: 3 });
        else if (eq === "resistance bands") workoutPlan.push({ exercise: "Band Rows", reps: 15, sets: 3 });
        else if (eq === "bodyweight") workoutPlan.push({ exercise: "Plank", reps: 1, sets: 3, time: "60s" });
    });

    // Add custom exercises to the workout plan
    Object.keys(customExercises).forEach(exercise => {
        workoutPlan.push({ exercise, reps: customExercises[exercise].reps, sets: customExercises[exercise].sets, notes: customExercises[exercise].notes });
    });

    workoutPlans[user.email] = workoutPlan;
    return workoutPlan;
}

/**
 * Displays the workout plan in the #workout-plan-section element.
 * 
 * @param {array} workoutPlan - An array of workout plan exercises.
 * @returns {void}
 */
function displayWorkoutPlan(workoutPlan) {
    const workoutSection = document.getElementById("workout-plan-section");
    workoutSection.innerHTML = "<h3>Your Workout Plan:</h3>";
    workoutPlan.forEach((exercise) => {
        workoutSection.innerHTML += `<p>${exercise.exercise}: ${exercise.sets} sets of ${exercise.reps || exercise.time} reps`;
        if (exercise.notes) {
            workoutSection.innerHTML += ` - ${exercise.notes}`;
        }
        workoutSection.innerHTML += "</p>";
    });
    workoutSection.classList.remove("hidden");
}

/**
 * Initializes the workout plan by getting the user's info, generating the workout plan, and displaying it.
 * 
 * @returns {void}
 */
function initWorkout() {
    const userInfo = getUserInfo();
    if (userInfo) {
        const workoutPlan = generateWorkoutPlan(userInfo);
        displayWorkoutPlan(workoutPlan);
    }
}

/**
 * Adds a custom exercise to the workout plan.
 * 
 * @returns {void}
 */
function addCustomExercise() {
    const exercise = document.getElementById("custom-exercise-name").value;
    const reps = document.getElementById("custom-exercise-reps").value;
    const sets = document.getElementById("custom-exercise-sets").value;
    const notes = document.getElementById("custom-exercise-notes").value;

    if (!exercise || !reps || !sets) {
        alert("Please fill out all fields.");
        return;
    }

    customExercises[exercise] = { reps, sets, notes };
    alert("Custom exercise added!");
    document.getElementById("custom-exercise-name").value = '';
    document.getElementById("custom-exercise-reps").value = '';
    document.getElementById("custom-exercise-sets").value = '';
    document.getElementById("custom-exercise-notes").value = '';
}

/**
 * Logs the user's workout progress.
 * 
 * @returns {void}
 */
function logProgress() {
    const exercise = document.getElementById("log-exercise").value;
    const setsCompleted = parseInt(document.getElementById("log-sets").value);
    const repsCompleted = parseInt(document.getElementById("log-reps").value);

    if (!exercise || isNaN(setsCompleted) || isNaN(repsCompleted)) {
        alert("Please fill out all fields.");
        return;
    }

    if (!progressLog[exercise]) {
        progressLog[exercise] = [];
    }
    progressLog[exercise].push({ setsCompleted, repsCompleted });
    alert("Progress logged!");
    document.getElementById("log-exercise").value = '';
    document.getElementById("log-sets").value = '';
    document.getElementById("log-reps").value = '';
}

/**
 * Displays the user's workout progress in the #progress-display element.
 * 
 * @returns {void}
 */
function viewProgress() {
    const progressDisplay = document.getElementById("progress-display");
    progressDisplay.innerHTML = "<h3>Your Workout Progress:</h3>";
    Object.keys(progressLog).forEach(exercise => {
        progressDisplay.innerHTML += `<p>${exercise}:`;
        progressLog[exercise].forEach(log => {
            progressDisplay.innerHTML += ` ${log.setsCompleted} sets of ${log.repsCompleted} reps,`;
        });
        progressDisplay.innerHTML = progressDisplay.innerHTML.slice(0, -1) + "</p>";
    });
    progressDisplay.classList.remove("hidden");
}

/**
 * Sets the user's calorie target.
 * 
 * @returns {void}
 */
function setCalorieTarget() {
    calorieTarget = parseInt(document.getElementById("calorie-target").value);
    if (isNaN(calorieTarget)) {
        alert("Please enter a valid calorie target.");
        return;
    }
    alert("Calorie target set!");
    document.getElementById("calorie-target").value = '';
}

/**
 * Logs the user's daily calorie intake.
 * 
 * @returns {void}
 */
function logCalorieIntake() {
    dailyCalorieIntake = parseInt(document.getElementById("daily-calorie-intake").value);
    if (isNaN(dailyCalorieIntake)) {
        alert("Please enter a valid daily calorie intake.");
        return;
    }
    alert("Daily calorie intake logged!");
    document.getElementById("daily-calorie-intake").value = '';
    const calorieDisplay = document.getElementById("calorie-display");
    calorieDisplay.innerHTML = `<p>Daily Calorie Intake: ${dailyCalorieIntake}</p>`;
    calorieDisplay.innerHTML += `<p>Calorie Target: ${calorieTarget}</p>`;
    calorieDisplay.innerHTML += `<p>Remaining Calories: ${calorieTarget - dailyCalorieIntake}</p>`;
    calorieDisplay.classList.remove("hidden");
}