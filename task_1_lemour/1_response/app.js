// Global variables
let user = null;
const workoutPlans = {};
const progressLog = [];

/**
 * Checks if the provided email address is valid.
 * 
 * @param {string} email - The email address to be validated.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
function isValidEmail(email) {
    // Regular expression pattern for a valid email address
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    // Test the email against the pattern
    return emailPattern.test(email);
}

/**
 * Registers a new user with the provided email and password.
 * 
 * @returns {void}
 */
function register() {
    // Get the email and password from the input fields
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Check if the email is valid
    if (!email || !isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }
    // Check if the password is provided
    if (!password) {
        alert("Please enter a password.");
        return;
    }

    // Store the user in local storage
    localStorage.setItem(email, JSON.stringify({ email, password }));
    alert("Registration successful. Please log in.");
}

/**
 * Logs in the user with the provided email and password.
 * 
 * @returns {void}
 */
function login() {
    // Get the email and password from the input fields
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    // Check if the email is valid
    if (!email || !isValidEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }
    // Check if the password is provided
    if (!password) {
        alert("Please enter a password.");
        return;
    }

    // Get the stored user from local storage
    const storedUser = JSON.parse(localStorage.getItem(email));
    // Check if the user exists and the password matches
    if (storedUser && storedUser.password === password) {
        user = storedUser;
        alert("Login successful!");
        // Hide the auth section and show the user info section
        document.getElementById("auth-section").classList.add("hidden");
        document.getElementById("user-info-section").classList.remove("hidden");
        document.getElementById("progress-log-section").classList.remove("hidden");
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
    // Get the selected goal, experience level, and equipment
    const goal = document.querySelector("input[name='goal']:checked");
    const experience = document.querySelector("input[name='experience']:checked");
    const equipment = Array.from(document.querySelectorAll("input[name='equipment']:checked")).map(el => el.value);

    // Check if all options are selected
    if (!goal || !experience || equipment.length === 0) {
        alert("Please select all options.");
        return null;
    }
    // Return the user's info
    return { goal: goal.value, experience: experience.value, equipment };
}

/**
 * Generates a workout plan based on the user's goal, experience level, and available equipment.
 * 
 * @param {object} userInfo - An object containing the user's goal, experience level, and equipment.
 * @returns {array} An array of workout plan exercises.
 */
function generateWorkoutPlan(userInfo) {
    // Initialize the workout plan
    const workoutPlan = [];

    // Add exercises based on the user's goal
    if (userInfo.goal === "build muscle") {
        workoutPlan.push({ exercise: "Push-ups", reps: userInfo.experience === "beginner" ? 10 : 20, sets: 3 });
        workoutPlan.push({ exercise: "Bench Press", reps: 8, sets: 4 });
    } else if (userInfo.goal === "lose weight") {
        workoutPlan.push({ exercise: "Burpees", reps: userInfo.experience === "beginner" ? 10 : 15, sets: 3 });
        workoutPlan.push({ exercise: "Mountain Climbers", reps: 30, sets: 3 });
    }

    // Add exercises based on the user's equipment
    userInfo.equipment.forEach(eq => {
        if (eq === "weights") workoutPlan.push({ exercise: "Dumbbell Squats", reps: 12, sets: 3 });
        else if (eq === "resistance bands") workoutPlan.push({ exercise: "Band Rows", reps: 15, sets: 3 });
        else if (eq === "bodyweight") workoutPlan.push({ exercise: "Plank", reps: 1, sets: 3, time: "60s" });
    });

    // Store the workout plan in the workoutPlans object
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
    // Get the #workout-plan-section element
    const workoutSection = document.getElementById("workout-plan-section");
    // Set the innerHTML of the element
    workoutSection.innerHTML = "<h3>Your Workout Plan:</h3>";
    // Loop through the workout plan exercises and add them to the element
    workoutPlan.forEach((exercise) => {
        workoutSection.innerHTML += `<p>${exercise.exercise}: ${exercise.sets} sets of ${exercise.reps || exercise.time} reps</p>`;
    });
    // Remove the hidden class from the element
    workoutSection.classList.remove("hidden");
}

/**
 * Initializes the workout plan by getting the user's info, generating the workout plan, and displaying it.
 * 
 * @returns {void}
 */
function initWorkout() {
    // Get the user's info
    const userInfo = getUserInfo();
    // Check if the user's info is valid
    if (userInfo) {
        // Generate the workout plan
        const workoutPlan = generateWorkoutPlan(userInfo);
        // Display the workout plan
        displayWorkoutPlan(workoutPlan);
    }
}

/**
 * Logs the user's workout progress.
 * 
 * @returns {void}
 */
function logProgress() {
    // Get the exercise, sets completed, and reps completed from the input fields
    const exercise = document.getElementById("log-exercise").value;
    const setsCompleted = parseInt(document.getElementById("log-sets").value);
    const repsCompleted = parseInt(document.getElementById("log-reps").value);

    // Check if all fields are filled out
    if (!exercise || isNaN(setsCompleted) || isNaN(repsCompleted)) {
        alert("Please fill out all fields.");
        return;
    }

    // Add the progress to the progressLog array
    progressLog.push({ exercise, setsCompleted, repsCompleted });
    alert("Progress logged!");
    // Clear the input fields
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
    // Get the #progress-display element
    const progressDisplay = document.getElementById("progress-display");
    // Set the innerHTML of the element
    progressDisplay.innerHTML = "<h3>Your Workout Progress:</h3>";
    // Check if there is any progress to display
    if (progressLog.length === 0) {
        progressDisplay.innerHTML += "<p>No progress logged yet.</p>";
    } else {
        // Loop through the progressLog array and add each log to the element
        progressLog.forEach(log => {
            progressDisplay.innerHTML += `<p>${log.exercise}: ${log.setsCompleted} sets of ${log.repsCompleted} reps</p>`;
        });
    }
    // Remove the hidden class from the element
    progressDisplay.classList.remove("hidden");
}