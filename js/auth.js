// Authentication functionality using Firebase

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyBs_8xRRrC5vRZ0ofkl8BQhK-xDY4ZQo7I", // This is a placeholder. In a real app, use environment variables
  authDomain: "firetourneys.firebaseapp.com",
  projectId: "firetourneys",
  storageBucket: "firetourneys.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Initialize Firebase (using compat version for consistency)
if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
}

// Check authentication state on page load
function checkAuthState() {
  // First check if Firebase is available
  if (typeof firebase === 'undefined') {
    console.error('Firebase SDK not loaded. Falling back to local auth.');
    checkLocalAuthState();
    return;
  }

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      // User is signed in
      handleAuthenticatedUser(user);
    } else {
      // User is signed out
      handleSignedOutUser();
    }
  });
}

// Handle authenticated user
function handleAuthenticatedUser(user) {
  // Store user in localStorage as a backup
  const userData = {
    uid: user.uid,
    displayName: user.displayName || user.email.split('@')[0],
    email: user.email,
    photoURL: user.photoURL,
    isLoggedIn: true
  };
  
  localStorage.setItem('user', JSON.stringify(userData));
  
  // Update UI
  updateUserUI(userData);
  
  // Check if user is admin and show admin section if needed
  if (isUserAdmin(userData)) {
    document.querySelectorAll('[data-navigate="admin"]').forEach(el => {
      el.classList.remove('hidden');
    });
  }
}

// Handle signed out user
function handleSignedOutUser() {
  // Clear user from localStorage
  localStorage.removeItem('user');
  
  // Update UI
  updateUserUI(null);
  
  // Hide admin section
  document.querySelectorAll('[data-navigate="admin"]').forEach(el => {
    el.classList.add('hidden');
  });
}

// Update user UI elements
function updateUserUI(user) {
  const userSection = document.getElementById('userSection');
  const mobileUserItem = document.querySelector('.nav-item[data-navigate="login"]');
  
  if (user && user.isLoggedIn) {
    // Update header user section
    userSection.innerHTML = `
      <div class="flex items-center">
        <span class="mr-2">${user.displayName}</span>
        <button class="material-btn-outlined" id="logout-button">
          <span class="material-icons mr-1">logout</span>
          Logout
        </button>
      </div>
    `;
    
    // Update mobile nav
    mobileUserItem.innerHTML = `
      <span class="material-icons">person</span>
      <span class="text-xs">Profile</span>
    `;
    
    // Update user profile section
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const registeredTournaments = document.getElementById('registered-tournaments');
    
    if (profileName && profileEmail) {
      profileName.textContent = user.displayName;
      profileEmail.textContent = user.email;
      
      // Show user profile
      document.getElementById('login-container').classList.add('hidden');
      document.getElementById('register-container').classList.add('hidden');
      document.getElementById('user-profile').classList.remove('hidden');
      
      // Load user's registered tournaments
      loadUserRegistrations(user.email);
    }
    
    // Add logout handler
    document.getElementById('logout-button').addEventListener('click', logoutUser);
  } else {
    // Show login button
    userSection.innerHTML = `
      <a href="#" class="material-btn-primary" data-navigate="login">
        <span class="material-icons mr-1">login</span>
        Login
      </a>
    `;
    
    // Update mobile nav
    mobileUserItem.innerHTML = `
      <span class="material-icons">person</span>
      <span class="text-xs">Login</span>
    `;
    
    // Show login form if on login page
    if (document.getElementById('login').classList.contains('active')) {
      document.getElementById('user-profile').classList.add('hidden');
      document.getElementById('register-container').classList.add('hidden');
      document.getElementById('login-container').classList.remove('hidden');
    }
  }
  
  // Re-attach navigation handlers
  document.querySelectorAll('[data-navigate]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.getAttribute('data-navigate'));
    });
  });
}

// Load user's registered tournaments
function loadUserRegistrations(userEmail) {
  const registrations = getUserRegistrations(userEmail);
  const container = document.getElementById('registered-tournaments');
  
  if (container) {
    // Clear container
    container.innerHTML = '';
    
    if (registrations.length === 0) {
      container.innerHTML = `
        <p class="text-text-secondary-light">You haven't registered for any tournaments yet.</p>
      `;
      return;
    }
    
    // Get tournament details for each registration
    const tournaments = getTournaments();
    
    registrations.forEach(registration => {
      const tournament = tournaments.find(t => t.id === registration.tournamentId);
      
      if (tournament) {
        const statusClass = getStatusClass(tournament.status);
        
        const html = `
          <div class="flex justify-between items-center">
            <div>
              <p class="font-medium">${tournament.name}</p>
              <p class="text-sm text-text-secondary-light">${tournament.date}</p>
            </div>
            <span class="px-2 py-1 bg-${statusClass}-100 text-${statusClass}-800 text-xs rounded-full">${capitalizeFirstLetter(tournament.status)}</span>
          </div>
        `;
        
        container.innerHTML += html;
      }
    });
  }
}

// Initiate Google Sign In
function signInWithGoogle() {
  if (typeof firebase === 'undefined') {
    console.error('Firebase SDK not loaded');
    showToast('Firebase authentication unavailable. Try email login instead.', 'error');
    return;
  }
  
  const provider = new firebase.auth.GoogleAuthProvider();
  
  firebase.auth().signInWithPopup(provider)
    .then(result => {
      // This gives you a Google Access Token
      const credential = result.credential;
      const token = credential.accessToken;
      const user = result.user;
      
      // Handle signed in user
      handleAuthenticatedUser(user);
      
      // Navigate to home page
      navigateTo('home');
    })
    .catch(error => {
      console.error('Google sign in error:', error);
      showToast('Sign in failed: ' + error.message, 'error');
    });
}

// Sign in with email/password
function signInWithEmail(email, password) {
  if (typeof firebase === 'undefined') {
    console.log('Firebase SDK not loaded. Using local authentication');
    signInWithLocalStorage(email, password);
    return;
  }
  
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      // Handle signed in user
      const user = userCredential.user;
      handleAuthenticatedUser(user);
      
      // Navigate to home page
      navigateTo('home');
    })
    .catch(error => {
      console.error('Email sign in error:', error);
      showToast('Sign in failed: ' + error.message, 'error');
    });
}

// Local storage fallback for authentication
function signInWithLocalStorage(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    // Create user object similar to Firebase
    const userData = {
      uid: user.id,
      displayName: user.name || email.split('@')[0],
      email: email,
      photoURL: null,
      isLoggedIn: true
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Update UI
    updateUserUI(userData);
    
    // Navigate to home page
    navigateTo('home');
  } else {
    showToast('Invalid email or password', 'error');
  }
}

// Create user with email/password
function createUserWithEmail(name, email, password) {
  if (typeof firebase === 'undefined') {
    console.log('Firebase SDK not loaded. Using local user creation');
    createLocalUser(name, email, password);
    return;
  }
  
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      // Update profile with display name
      const user = userCredential.user;
      return user.updateProfile({
        displayName: name
      }).then(() => user);
    })
    .then(user => {
      // Handle authenticated user
      handleAuthenticatedUser(user);
      
      // Navigate to home page
      navigateTo('home');
      
      showToast('Account created successfully!');
    })
    .catch(error => {
      console.error('Create user error:', error);
      showToast('Registration failed: ' + error.message, 'error');
    });
}

// Create user in localStorage (fallback)
function createLocalUser(name, email, password) {
  const users = getUsers();
  
  // Check if user already exists
  if (users.some(u => u.email === email)) {
    showToast('User with this email already exists', 'error');
    return;
  }
  
  // Create new user
  const newUser = {
    id: generateId('user_'),
    name: name,
    email: email,
    password: password, // In a real app, this should be hashed
    createdAt: new Date().toISOString()
  };
  
  // Add to users
  users.push(newUser);
  saveUsers(users);
  
  // Auto login
  const userData = {
    uid: newUser.id,
    displayName: name,
    email: email,
    photoURL: null,
    isLoggedIn: true
  };
  
  localStorage.setItem('user', JSON.stringify(userData));
  
  // Update UI
  updateUserUI(userData);
  
  // Navigate to home page
  navigateTo('home');
  
  showToast('Account created successfully!');
}

// Check local authentication state
function checkLocalAuthState() {
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  if (user && user.isLoggedIn) {
    updateUserUI(user);
  } else {
    updateUserUI(null);
  }
}

// Logout user
function logoutUser() {
  if (typeof firebase !== 'undefined') {
    firebase.auth().signOut()
      .then(() => {
        // Sign-out successful - UI will update via onAuthStateChanged
        localStorage.removeItem('user');
        navigateTo('home');
      })
      .catch(error => {
        console.error('Sign out error:', error);
      });
  } else {
    // Local logout
    localStorage.removeItem('user');
    updateUserUI(null);
    navigateTo('home');
  }
}

// Initialize login page functionality
document.addEventListener('DOMContentLoaded', () => {
  // Google sign in
  const googleSignInBtn = document.getElementById('google-signin');
  if (googleSignInBtn) {
    googleSignInBtn.addEventListener('click', signInWithGoogle);
  }
  
  // Email sign in
  const loginButton = document.getElementById('login-button');
  if (loginButton) {
    loginButton.addEventListener('click', () => {
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      
      if (!email || !password) {
        showToast('Please enter both email and password', 'error');
        return;
      }
      
      signInWithEmail(email, password);
    });
  }
  
  // Register button
  const registerButton = document.getElementById('register-button');
  if (registerButton) {
    registerButton.addEventListener('click', () => {
      const name = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;
      const confirmPassword = document.getElementById('register-confirm-password').value;
      const termsCheck = document.getElementById('terms-check').checked;
      
      // Validation
      if (!name || !email || !password || !confirmPassword) {
        showToast('Please fill in all fields', 'error');
        return;
      }
      
      if (!validateEmail(email)) {
        showToast('Please enter a valid email address', 'error');
        return;
      }
      
      if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
      }
      
      if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
      }
      
      if (!termsCheck) {
        showToast('You must agree to the terms', 'error');
        return;
      }
      
      // Create user
      createUserWithEmail(name, email, password);
    });
  }
  
  // Switch between login and register
  const switchToRegister = document.getElementById('switch-to-register');
  const switchToLogin = document.getElementById('switch-to-login');
  
  if (switchToRegister) {
    switchToRegister.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('login-container').classList.add('hidden');
      document.getElementById('register-container').classList.remove('hidden');
    });
  }
  
  if (switchToLogin) {
    switchToLogin.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('register-container').classList.add('hidden');
      document.getElementById('login-container').classList.remove('hidden');
    });
  }
  
  // Logout button
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', logoutUser);
  }
});
