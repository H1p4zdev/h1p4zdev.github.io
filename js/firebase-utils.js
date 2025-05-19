/**
 * Firebase Utilities
 * 
 * Additional helper functions for Firebase operations.
 * These utilities complement the main Firebase functionality.
 */

// Local authentication fallback for when Firebase is not available
function signInWithLocalStorage(email, password) {
  console.log('Attempting localStorage authentication fallback');
  
  // Get users from local storage
  const users = getUsers();
  
  // Find user with matching email and password
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Create a user object that mimics Firebase user object
    const fakeFirebaseUser = {
      uid: user.id,
      email: user.email,
      displayName: user.name,
      photoURL: null,
      isAdmin: user.role === 'admin'
    };
    
    // Save to localStorage
    localStorage.setItem('fireUser', JSON.stringify(fakeFirebaseUser));
    
    // Update UI
    updateUIForSignedInUser(fakeFirebaseUser);
    
    console.log('Local authentication successful');
    showToast('Login successful!');
    
    // Redirect to home page
    navigateTo('home');
    return true;
  } else {
    console.error('Local authentication failed: Invalid credentials');
    showToast('Invalid email or password', 'error');
    return false;
  }
}

// Create local user when Firebase is not available
function createLocalUser(name, email, password) {
  console.log('Creating local user as Firebase fallback');
  
  // Get existing users
  const users = getUsers();
  
  // Check if user with this email already exists
  if (users.find(u => u.email === email)) {
    console.error('Local user creation failed: Email already in use');
    showToast('Email already in use', 'error');
    return false;
  }
  
  // Create new user
  const newUser = {
    id: generateId('user_'),
    name: name,
    email: email,
    password: password, // Note: In a real app, you'd hash this password
    role: 'user',
    registeredDate: new Date().toISOString()
  };
  
  // Add to users array
  users.push(newUser);
  
  // Save updated users array
  saveUsers(users);
  
  // Log in the new user
  signInWithLocalStorage(email, password);
  
  console.log('Local user created successfully');
  showToast('Account created successfully!');
  
  // Redirect to home page
  navigateTo('home');
  return true;
}

// Check for authentication when page loads (local storage fallback)
function checkLocalAuthState() {
  const userData = localStorage.getItem('fireUser');
  
  if (userData) {
    const user = JSON.parse(userData);
    updateUIForSignedInUser(user);
    return user;
  }
  
  return null;
}

// Update mobile menu with user state
function updateMobileMenu(user) {
  const mobileNavLogin = document.querySelector('.mobile-nav [data-navigate="login"]');
  
  if (!mobileNavLogin) return;
  
  if (user) {
    // User is logged in, show profile option
    mobileNavLogin.innerHTML = `
      <span class="material-icons">person</span>
      <span class="text-xs">Profile</span>
    `;
    mobileNavLogin.setAttribute('data-navigate', 'profile');
  } else {
    // User is logged out, show login option
    mobileNavLogin.innerHTML = `
      <span class="material-icons">login</span>
      <span class="text-xs">Login</span>
    `;
    mobileNavLogin.setAttribute('data-navigate', 'login');
  }
}

// Event handler for tournament registration
function handleTournamentRegistration(tournamentId) {
  // Check if user is logged in
  const user = getUserFromLocalStorage();
  
  if (!user) {
    // Not logged in, redirect to login page
    showToast('Please log in to register for tournaments', 'info');
    navigateTo('login');
    return;
  }
  
  // User is logged in, redirect to registration page
  navigateTo('register');
  
  // Pre-select the tournament in the registration form
  const tournamentSelect = document.getElementById('tournamentSelect');
  if (tournamentSelect) {
    tournamentSelect.value = tournamentId;
    // Trigger change event to update form fields
    const event = new Event('change');
    tournamentSelect.dispatchEvent(event);
  }
}

// Format timestamp from Firebase to readable date
function formatFirebaseTimestamp(timestamp) {
  if (!timestamp) return '';
  
  // Convert Firebase timestamp to Date object
  let date;
  if (timestamp.toDate && typeof timestamp.toDate === 'function') {
    // Firestore Timestamp
    date = timestamp.toDate();
  } else if (timestamp._seconds !== undefined) {
    // Serialized Firestore Timestamp
    date = new Date(timestamp._seconds * 1000);
  } else if (typeof timestamp === 'string') {
    // ISO string
    date = new Date(timestamp);
  } else if (typeof timestamp === 'number') {
    // Milliseconds
    date = new Date(timestamp);
  } else {
    // Assume it's already a Date
    date = timestamp;
  }
  
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

// Initialize utilities when document is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Check local auth state as fallback
  if (typeof firebase === 'undefined' || !firebase.apps.length) {
    checkLocalAuthState();
  }
});