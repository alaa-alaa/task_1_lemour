/**
 * Global variables
 */
let user = null; // Current user
const workoutPlans = {}; // Workout plans for each user
const progressLog = []; // Progress log for the current user

/**
 * Validate email address
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if the email address is valid, false otherwise
 */
function isValidEmail(email) {
    // Regular expression pattern for email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

/**
 * Register a new user
 */
function register() {
    // Get email and password from input fields
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Validate email address
    if (!email || !isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Validate password
    if (!password) {
        alert("Please enter a password.");
        return;
    }

    // Store user data in local storage
    localStorage.setItem(email, JSON.stringify({ email, password }));

    // Display registration success message
    alert("Registration successful. Please log in.");
}

/**
 * Login an existing user
 */
function login() {
    // Get email and password from input fields
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Validate email address
    if (!email || !isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Validate password
    if (!password) {
        alert("Please enter a password.");
        return;
    }

    // Retrieve user data from local storage
    const storedUser = JSON.parse(localStorage.getItem(email));

    // Validate user credentials
    if (storedUser && storedUser.password === password) {
        // Set current user
        user = storedUser;

        // Display login success message
        alert("Login successful!");

        // Hide authentication section and display user information section
        document.getElementById("auth-section").classList.add("hidden");
        document.getElementById("user-info-section").classList.remove("hidden");
        document.getElementById("progress-log-section").classList.remove("hidden");
    } else {
        // Display invalid credentials message
        alert("Incorrect email or password.");
    }
}

/**
 * Get user information (goal, experience level, equipment)
 * @returns {object|null} - User information object or null if incomplete
 */
function getUserInfo() {
    // Get goal, experience level, and equipment from input fields
    const goal = document.querySelector("input[name='goal']:checked");
    const experience = document.querySelector("input[name='experience']:checked");
    const equipment = Array.from(document.querySelectorAll("input[name='equipment']:checked")).map(el => el.value);

    // Validate user information
    if (!goal || !experience || equipment.length === 0) {
        alert("Please select all options.");
        return null;
    }

    // Return user information object
    return { goal: goal.value, experience: experience.value, equipment };
}

/**
 * Generate a workout plan based on user information
 * @param {object} userInfo - User information object
 * @returns {array} - Workout plan array
 */
function generateWorkoutPlan(userInfo) {
    // Initialize workout plan array
    const workoutPlan = [];

    // Add exercises based on user goal and experience level
    if (userInfo.goal === "build muscle") {
        workoutPlan.push({ exercise: "Push-ups", reps: userInfo.experience === "beginner" ? 10 : 20, sets: 3 });
        workoutPlan.push({ exercise: "Bench Press", reps: 8, sets: 4 });
    } else if (userInfo.goal === "lose weight") {
        workoutPlan.push({ exercise: "Burpees", reps: userInfo.experience === "beginner" ? 10 : 15, sets: 3 });
        workoutPlan.push({ exercise: "Mountain Climbers", reps: 30, sets: 3 });
    }

    // Add exercises based on user equipment
    userInfo.equipment.forEach(eq => {
        if (eq === "weights") workoutPlan.push({ exercise: "Dumbbell Squats", reps: 12, sets: 3 });
        else if (eq === "resistance bands") workoutPlan.push({ exercise: "Band Rows", reps: 15, sets: 3 });
        else if (eq === "bodyweight") workoutPlan.push({ exercise: "Plank", reps: 1, sets: 3, time: "60s" });
    });

    // Store workout plan in global variable
    workoutPlans[user.email] = workoutPlan;

    // Return workout plan array
    return workoutPlan;
}

/**
 * Display workout plan
 * @param {array} workoutPlan - Workout plan array
 */
function displayWorkoutPlan(workoutPlan) {
    // Get workout plan section element
    const workoutSection = document.getElementById("workout-plan-section");

    // Clear previous workout plan
    workoutSection.innerHTML = "";

    // Add workout plan title
    workoutSection.innerHTML += "<h3>Your Workout Plan:</h3>";

    // Add exercises to workout plan section
    workoutPlan.forEach((exercise) => {
        workoutSection.innerHTML += `<p>${exercise.exercise}: ${exercise.sets} sets of ${exercise.reps || exercise.time} reps</p>`;
    });

    // Display workout plan section
    workoutSection.classList.remove("hidden");
}

/**
 * Initialize workout plan
 */
function initWorkout() {
    // Get user information
    const userInfo = getUserInfo();

    // Generate and display workout plan if user information is complete
    if (userInfo) {
        const workoutPlan = generateWorkoutPlan(userInfo);
        displayWorkoutPlan(workoutPlan);
    }
}

/**
 * Log workout progress
 */
function logProgress() {
    // Get exercise, sets completed, and reps completed from input fields
    const exercise = document.getElementById("log-exercise").value;
    const setsCompleted = parseInt(document.getElementById("log-sets").value);
    const repsCompleted = parseInt(document.getElementById("log-reps").value);

    // Validate input fields
    if (!exercise || isNaN(setsCompleted) || isNaN(repsCompleted)) {
        alert("Please fill out all fields.");
        return;
    }

    // Add progress log entry
    progressLog.push({ exercise, setsCompleted, repsCompleted });

    // Display progress log success message
    alert("Progress logged!");

    // Clear input fields
    document.getElementById("log-exercise").value = '';
    document.getElementById("log-sets").value = '';
    document.getElementById("log-reps").value = '';
}

/**
 * View workout progress
 */
function viewProgress() {
    // Get progress display section element
    const progressDisplay = document.getElementById("progress-display");

    // Clear previous progress log
    progressDisplay.innerHTML = "";

    // Add progress log title
    progressDisplay.innerHTML += "<h3>Your Workout Progress:</h3>";

    // Add progress log entries to progress display section
    if (progressLog.length === 0) {
        progressDisplay.innerHTML += "<p>No progress logged yet.</p>";
    } else {
        progressLog.forEach(log => {
            progressDisplay.innerHTML += `<p>${log.exercise}: ${log.setsCompleted} sets of ${log.repsCompleted} reps</p>`;
        });
    }

    // Display progress display section
    progressDisplay.classList.remove("hidden");
}