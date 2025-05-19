// Utility functions for the application

// Get tournaments from localStorage
function getTournaments() {
  return JSON.parse(localStorage.getItem('tournaments') || '[]');
}

// Save tournaments to localStorage
function saveTournaments(tournaments) {
  localStorage.setItem('tournaments', JSON.stringify(tournaments));
}

// Get users from localStorage
function getUsers() {
  return JSON.parse(localStorage.getItem('users') || '[]');
}

// Save users to localStorage
function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

// Get registrations from localStorage
function getRegistrations() {
  return JSON.parse(localStorage.getItem('registrations') || '[]');
}

// Save registrations to localStorage
function saveRegistrations(registrations) {
  localStorage.setItem('registrations', JSON.stringify(registrations));
}

// Get user registrations
function getUserRegistrations(userEmail) {
  const registrations = getRegistrations();
  return registrations.filter(reg => reg.captainEmail === userEmail);
}

// Format date
function formatDate(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// Format date with time
function formatDateTime(timestamp) {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Generate random ID
function generateId(prefix = '') {
  return prefix + Math.random().toString(36).substr(2, 9);
}

// Validate email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate Free Fire ID
function validateFreeFireId(id) {
  // Free Fire IDs are typically 6-10 digits
  const re = /^\d{6,10}$/;
  return re.test(id);
}

// Validate phone number
function validatePhone(phone) {
  // Simple phone validation
  const re = /^\+?[0-9]{8,15}$/;
  return re.test(phone);
}

// Format currency
function formatCurrency(amount) {
  return '$' + amount.toLocaleString('en-US');
}

// Format prize
function formatPrize(prize) {
  if (typeof prize === 'string') {
    return prize;
  }
  return formatCurrency(prize);
}

// Get status class for styling
function getStatusClass(status) {
  switch (status) {
    case 'upcoming':
      return 'yellow';
    case 'ongoing':
      return 'blue';
    case 'completed':
      return 'green';
    default:
      return 'gray';
  }
}

// Capitalize first letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Download data as CSV
function downloadCSV(data, filename) {
  // Convert array of objects to CSV
  const csvContent = convertToCSV(data);
  
  // Create a download link
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Convert array of objects to CSV
function convertToCSV(data) {
  if (data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const headerRow = headers.join(',');
  
  const rows = data.map(obj => {
    return headers.map(header => {
      let value = obj[header];
      // Handle values that contain commas or quotes
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        value = `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',');
  });
  
  return [headerRow, ...rows].join('\n');
}

// Format time remaining
function formatTimeRemaining(endDate) {
  const now = new Date();
  const end = new Date(endDate);
  const diffTime = end - now;
  
  if (diffTime <= 0) return 'Ended';
  
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} remaining`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} remaining`;
  } else {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} remaining`;
  }
}

// Show toast message
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-4 right-4 p-4 rounded-lg shadow-elevation-3 z-50 ${type === 'error' ? 'bg-red-500' : 'bg-primary'} text-white`;
  toast.innerHTML = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.classList.add('opacity-0');
    toast.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 500);
  }, 3000);
}

// Check if user is admin
function isUserAdmin(user) {
  // In a real app, this would check user roles from the database
  // For this demo, we'll consider users with admin@example.com as admin
  return user && user.email === 'admin@example.com';
}
