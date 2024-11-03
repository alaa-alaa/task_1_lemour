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
    Object.values(customExercises).forEach(exercise => {
        workoutPlan.push({ exercise: exercise.name, reps: exercise.reps, sets: exercise.sets, note: exercise.note });
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
        if (exercise.note) workoutSection.innerHTML += ` (${exercise.note})`;
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
    const exerciseName = document.getElementById("custom-exercise-name").value;
    const exerciseReps = document.getElementById("custom-exercise-reps").value;
    const exerciseSets = document.getElementById("custom-exercise-sets").value;
    const exerciseNote = document.getElementById("custom-exercise-note").value;

    if (!exerciseName || !exerciseReps || !exerciseSets) {
        alert("Please fill out all fields.");
        return;
    }

    customExercises[exerciseName] = { name: exerciseName, reps: exerciseReps, sets: exerciseSets, note: exerciseNote };
    alert("Custom exercise added!");
    document.getElementById("custom-exercise-name").value = '';
    document.getElementById("custom-exercise-reps").value = '';
    document.getElementById("custom-exercise-sets").value = '';
    document.getElementById("custom-exercise-note").value = '';
}

/**
 * Sets the calorie target.
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
}

/**
 * Logs the daily calorie intake.
 * 
 * @returns {void}
 */
function logDailyCalorieIntake() {
    dailyCalorieIntake = parseInt(document.getElementById("daily-calorie-intake").value);
    if (isNaN(dailyCalorieIntake)) {
        alert("Please enter a valid daily calorie intake.");
        return;
    }
    alert("Daily calorie intake logged!");
    document.getElementById("daily-calorie-intake").value = '';
}

/**
 * Displays the calorie tracking information.
 * 
 * @returns {void}
 */
function displayCalorieTracking() {
    const calorieTrackingSection = document.getElementById("calorie-tracking-info");
    calorieTrackingSection.innerHTML = `<p>Calorie Target: ${calorieTarget}</p>`;
    calorieTrackingSection.innerHTML += `<p>Daily Calorie Intake: ${dailyCalorieIntake}</p>`;
    calorieTrackingSection.innerHTML += `<p>Remaining Calories: ${calorieTarget - dailyCalorieIntake}</p>`;
    calorieTrackingSection.classList.remove("hidden");
}

// Add event listeners to the buttons
document.getElementById("register-btn").addEventListener("click", register);
document.getElementById("login-btn").addEventListener("click", login);
document.getElementById("init-workout-btn").addEventListener("click", initWorkout);
document.getElementById("add-custom-exercise-btn").addEventListener("click", addCustomExercise);
document.getElementById("set-calorie-target-btn").addEventListener("click", setCalorieTarget);
document.getElementById("log-daily-calorie-intake-btn").addEventListener("click", logDailyCalorieIntake);
document.getElementById("display-calorie-tracking-btn").addEventListener("click", displayCalorieTracking);