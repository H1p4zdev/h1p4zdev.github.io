/**
 * Firebase Implementation
 * 
 * This file handles Firebase authentication and related functionality.
 * The Firebase configuration is imported from firebase-config.js
 */

// Firebase configuration is loaded from firebase-config.js
// Make sure firebase-config.js is included before this file in your HTML

// Initialize Firebase
let firebaseInitialized = false;

function initializeFirebase() {
  if (typeof firebase !== 'undefined' && !firebaseInitialized) {
    firebase.initializeApp(firebaseConfig);
    firebaseInitialized = true;
    console.log('Firebase initialized');
    
    // Set up authentication state listener
    firebase.auth().onAuthStateChanged(handleAuthStateChange);
    
    return true;
  }
  return false;
}

// Authentication state handler
function handleAuthStateChange(user) {
  if (user) {
    // User is signed in
    console.log('User signed in:', user.email);
    saveUserToLocalStorage(user);
    updateUIForSignedInUser(user);
  } else {
    // User is signed out
    console.log('User signed out');
    clearUserFromLocalStorage();
    updateUIForSignedOutUser();
  }
}

// Save user data to localStorage
function saveUserToLocalStorage(user) {
  if (!user) return;
  
  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email.split('@')[0],
    photoURL: user.photoURL,
    isAdmin: user.email === 'admin@example.com' // Simple admin check
  };
  
  localStorage.setItem('fireUser', JSON.stringify(userData));
}

// Clear user data from localStorage
function clearUserFromLocalStorage() {
  localStorage.removeItem('fireUser');
}

// Get user data from localStorage
function getUserFromLocalStorage() {
  const userData = localStorage.getItem('fireUser');
  return userData ? JSON.parse(userData) : null;
}

// Update UI elements for signed-in user
function updateUIForSignedInUser(user) {
  const userSection = document.getElementById('userSection');
  if (!userSection) return;
  
  const userData = user.providerData ? user : getUserFromLocalStorage();
  if (!userData) return;
  
  const displayName = userData.displayName || userData.email.split('@')[0];
  
  userSection.innerHTML = `
    <div class="flex items-center">
      <span class="mr-2">${displayName}</span>
      <button class="material-btn-outlined" id="logout-button">
        <span class="material-icons mr-1">logout</span>
        Logout
      </button>
    </div>
  `;
  
  // Add logout handler
  document.getElementById('logout-button').addEventListener('click', signOut);
  
  // Show admin section if applicable
  if (userData.isAdmin || userData.email === 'admin@example.com') {
    document.querySelectorAll('[data-navigate="admin"]').forEach(el => {
      el.classList.remove('hidden');
    });
  }
}

// Update UI elements for signed-out user
function updateUIForSignedOutUser() {
  const userSection = document.getElementById('userSection');
  if (!userSection) return;
  
  userSection.innerHTML = `
    <a href="#" class="material-btn-primary" data-navigate="login">
      <span class="material-icons mr-1">login</span>
      Login
    </a>
  `;
  
  // Hide admin section
  document.querySelectorAll('[data-navigate="admin"]').forEach(el => {
    el.classList.add('hidden');
  });
  
  // Make sure navigation still works
  document.querySelectorAll('[data-navigate]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.getAttribute('data-navigate'));
    });
  });
}

// Sign in with Google
function signInWithGoogle() {
  if (!firebaseInitialized) {
    initializeFirebase();
  }
  
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      console.log('Google sign-in successful');
      // Navigate to home page after successful sign-in
      navigateTo('home');
    })
    .catch((error) => {
      console.error('Google sign-in error:', error);
      showToast('Sign-in failed: ' + error.message, 'error');
    });
}

// Sign in with email and password
function signInWithEmail(email, password) {
  if (!firebaseInitialized) {
    initializeFirebase();
  }
  
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      console.log('Email sign-in successful');
      // Navigate to home page after successful sign-in
      navigateTo('home');
    })
    .catch((error) => {
      console.error('Email sign-in error:', error);
      showToast('Sign-in failed: ' + error.message, 'error');
      
      // Fall back to localStorage authentication if Firebase auth fails
      signInWithLocalStorage(email, password);
    });
}

// Create a new user with email and password
function createUserWithEmail(name, email, password) {
  if (!firebaseInitialized) {
    initializeFirebase();
  }
  
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      
      // Update profile with display name
      return user.updateProfile({
        displayName: name
      }).then(() => {
        console.log('User created successfully');
        // Navigate to home page after successful registration
        navigateTo('home');
        showToast('Account created successfully!');
      });
    })
    .catch((error) => {
      console.error('Create user error:', error);
      showToast('Registration failed: ' + error.message, 'error');
      
      // Fall back to local user creation
      createLocalUser(name, email, password);
    });
}

// Sign out 
function signOut() {
  if (!firebaseInitialized) {
    initializeFirebase();
  }
  
  firebase.auth().signOut()
    .then(() => {
      console.log('Sign-out successful');
      clearUserFromLocalStorage();
      navigateTo('home');
    })
    .catch((error) => {
      console.error('Sign-out error:', error);
      showToast('Logout failed: ' + error.message, 'error');
    });
}

// Initialize firebase on page load
document.addEventListener('DOMContentLoaded', function() {
  // Try to initialize Firebase
  const success = initializeFirebase();
  
  // If Firebase initialization failed, check local storage
  if (!success) {
    const user = getUserFromLocalStorage();
    if (user) {
      updateUIForSignedInUser(user);
    } else {
      updateUIForSignedOutUser();
    }
  }
});