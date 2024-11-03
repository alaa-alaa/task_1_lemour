// Test case 1: Valid email address
console.log(isValidEmail("test@example.com")); // Expected output: true

// Test case 2: Invalid email address
console.log(isValidEmail("invalid-email")); // Expected output: false

// Test case 3: Register a new user
register();
// Expected output: "Registration successful. Please log in."

// Test case 4: Log in with valid credentials
login();
// Expected output: "Login successful!"

// Test case 5: Get user's info
const userInfo = getUserInfo();
console.log(userInfo); // Expected output: { goal: "build muscle", experience: "beginner", equipment: ["weights"] }

// Test case 6: Generate workout plan
const workoutPlan = generateWorkoutPlan(userInfo);
console.log(workoutPlan); // Expected output: [{ exercise: "Push-ups", reps: 10, sets: 3 }, ...]

// Test case 7: Display workout plan
displayWorkoutPlan(workoutPlan);
// Expected output: The workout plan is displayed in the #workout-plan-section element.

// Test case 8: Log workout progress
logProgress();
// Expected output: "Progress logged!"

// Test case 9: View workout progress
viewProgress();
// Expected output: The workout progress is displayed in the #progress-display element.