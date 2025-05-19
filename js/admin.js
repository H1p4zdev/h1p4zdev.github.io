// Admin page functionality

// Load admin page
function loadAdminPage() {
  // Check if user is admin
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  if (!user || !isUserAdmin(user)) {
    // Redirect non-admin users to home
    navigateTo('home');
    showToast('You do not have permission to access the admin dashboard', 'error');
    return;
  }
  
  // Set up tab navigation
  setupAdminTabs();
  
  // Load tournaments tab (default)
  loadAdminTournamentsTab();
  
  // Set up new tournament buttons
  document.getElementById('new-tournament-btn').addEventListener('click', showNewTournamentModal);
  document.getElementById('mobile-new-tournament-btn').addEventListener('click', showNewTournamentModal);
  
  // Load stats
  loadAdminStats();
}

// Set up admin tabs
function setupAdminTabs() {
  const tabs = document.querySelectorAll('.admin-tab');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Get the tab id
      const tabId = tab.getAttribute('data-tab');
      
      // Remove active class from all tabs
      tabs.forEach(t => {
        t.classList.remove('text-primary', 'border-primary');
        t.classList.add('border-transparent', 'hover:border-gray-300', 'hover:text-gray-700');
      });
      
      // Add active class to clicked tab
      tab.classList.add('text-primary', 'border-primary');
      tab.classList.remove('border-transparent', 'hover:border-gray-300', 'hover:text-gray-700');
      
      // Hide all tab content
      document.querySelectorAll('.admin-tab-content').forEach(content => {
        content.classList.add('hidden');
      });
      
      // Show selected tab content
      const tabContent = document.getElementById(tabId);
      if (tabContent) {
        tabContent.classList.remove('hidden');
      } else {
        // Load tab content if not exists
        loadTabContent(tabId);
      }
    });
  });
}

// Load tab content
function loadTabContent(tabId) {
  const adminContent = document.getElementById('admin-content');
  
  // Create tab content element
  const tabContent = document.createElement('div');
  tabContent.id = tabId;
  tabContent.className = 'admin-tab-content';
  
  // Load content based on tab id
  switch (tabId) {
    case 'tournaments-tab':
      loadAdminTournamentsTab();
      break;
    case 'registrations-tab':
      tabContent.innerHTML = createRegistrationsTabContent();
      adminContent.appendChild(tabContent);
      loadRegistrationsData();
      break;
    case 'results-tab':
      tabContent.innerHTML = createResultsTabContent();
      adminContent.appendChild(tabContent);
      loadResultsData();
      break;
    case 'users-tab':
      tabContent.innerHTML = createUsersTabContent();
      adminContent.appendChild(tabContent);
      loadUsersData();
      break;
    case 'settings-tab':
      tabContent.innerHTML = createSettingsTabContent();
      adminContent.appendChild(tabContent);
      break;
    default:
      tabContent.innerHTML = '<p>Tab content not found</p>';
      adminContent.appendChild(tabContent);
  }
}

// Load tournaments tab
function loadAdminTournamentsTab() {
  const tournaments = getTournaments();
  const tableBody = document.getElementById('admin-tournaments-table');
  
  if (!tableBody) return;
  
  // Clear table
  tableBody.innerHTML = '';
  
  // Add tournament rows
  tournaments.forEach(tournament => {
    const statusClass = getStatusClass(tournament.status);
    
    const row = `
      <tr data-tournament-id="${tournament.id}">
        <td class="px-6 py-4 whitespace-nowrap">${tournament.name}</td>
        <td class="px-6 py-4 whitespace-nowrap">${tournament.date}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 py-1 bg-${statusClass}-100 text-${statusClass}-800 text-xs rounded-full">${capitalizeFirstLetter(tournament.status)}</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">${tournament.teams}</td>
        <td class="px-6 py-4 whitespace-nowrap">${tournament.prize}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex space-x-2">
            <button class="p-1 text-blue-600 hover:text-blue-800 edit-tournament-btn" data-tournament-id="${tournament.id}">
              <span class="material-icons text-sm">edit</span>
            </button>
            <button class="p-1 text-red-600 hover:text-red-800 delete-tournament-btn" data-tournament-id="${tournament.id}">
              <span class="material-icons text-sm">delete</span>
            </button>
            <button class="p-1 text-green-600 hover:text-green-800 view-registrations-btn" data-tournament-id="${tournament.id}">
              <span class="material-icons text-sm">people</span>
            </button>
          </div>
        </td>
      </tr>
    `;
    
    tableBody.innerHTML += row;
  });
  
  // Update pagination info
  document.getElementById('admin-pagination-info').textContent = `Showing 1-${tournaments.length} of ${tournaments.length} tournaments`;
  
  // Add event listeners to buttons
  document.querySelectorAll('.edit-tournament-btn').forEach(button => {
    button.addEventListener('click', () => {
      const tournamentId = button.getAttribute('data-tournament-id');
      editTournament(tournamentId);
    });
  });
  
  document.querySelectorAll('.delete-tournament-btn').forEach(button => {
    button.addEventListener('click', () => {
      const tournamentId = button.getAttribute('data-tournament-id');
      deleteTournament(tournamentId);
    });
  });
  
  document.querySelectorAll('.view-registrations-btn').forEach(button => {
    button.addEventListener('click', () => {
      const tournamentId = button.getAttribute('data-tournament-id');
      viewTournamentRegistrations(tournamentId);
    });
  });
}

// Create registrations tab content
function createRegistrationsTabContent() {
  return `
    <div class="material-card mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="font-heading font-medium text-xl">Registrations</h2>
        <div class="flex items-center">
          <div class="material-input m-0 p-0 mr-2 w-auto">
            <input type="text" id="registrations-search" placeholder=" ">
            <label for="registrations-search">Search</label>
          </div>
          <button class="p-2 text-primary" id="search-registrations-btn">
            <span class="material-icons">search</span>
          </button>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tournament</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Captain</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200" id="registrations-table">
            <!-- Registrations will be loaded here -->
          </tbody>
        </table>
      </div>
      
      <div class="flex justify-between items-center mt-4">
        <span class="text-sm text-text-secondary-light" id="registrations-pagination-info">
          Showing 0-0 of 0 registrations
        </span>
        <div class="flex space-x-1" id="registrations-pagination">
          <!-- Pagination will be added here -->
        </div>
      </div>
    </div>
    
    <div class="flex justify-end">
      <button class="material-btn-outlined" id="export-registrations-btn">
        <span class="material-icons mr-2">file_download</span>
        Export to CSV
      </button>
    </div>
  `;
}

// Create results tab content
function createResultsTabContent() {
  return `
    <div class="material-card mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="font-heading font-medium text-xl">Tournament Results</h2>
        <div class="flex items-center">
          <div class="material-input m-0 p-0 mr-2 w-auto">
            <select id="results-tournament-filter" class="placeholder:text-transparent">
              <option value="">All Tournaments</option>
              <!-- Tournament options will be added here -->
            </select>
            <label for="results-tournament-filter">Tournament</label>
          </div>
        </div>
      </div>
      
      <div id="admin-results-container" class="space-y-6">
        <!-- Results will be loaded here -->
        <p class="text-center text-text-secondary-light py-4">Select a tournament to manage results</p>
      </div>
    </div>
    
    <div class="flex justify-end">
      <button class="material-btn-primary" id="add-results-btn">
        <span class="material-icons mr-2">add</span>
        Add New Results
      </button>
    </div>
  `;
}

// Create users tab content
function createUsersTabContent() {
  return `
    <div class="material-card mb-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="font-heading font-medium text-xl">Manage Users</h2>
        <div class="flex items-center">
          <div class="material-input m-0 p-0 mr-2 w-auto">
            <input type="text" id="users-search" placeholder=" ">
            <label for="users-search">Search</label>
          </div>
          <button class="p-2 text-primary" id="search-users-btn">
            <span class="material-icons">search</span>
          </button>
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registrations</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200" id="users-table">
            <!-- Users will be loaded here -->
          </tbody>
        </table>
      </div>
      
      <div class="flex justify-between items-center mt-4">
        <span class="text-sm text-text-secondary-light" id="users-pagination-info">
          Showing 0-0 of 0 users
        </span>
        <div class="flex space-x-1" id="users-pagination">
          <!-- Pagination will be added here -->
        </div>
      </div>
    </div>
  `;
}

// Create settings tab content
function createSettingsTabContent() {
  return `
    <div class="material-card mb-6">
      <h2 class="font-heading font-medium text-xl mb-4">Application Settings</h2>
      
      <div class="space-y-6">
        <!-- Tournament Settings -->
        <div>
          <h3 class="font-medium text-lg mb-3">Tournament Settings</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="material-input">
              <input type="number" id="max-teams-per-tournament" min="1" max="100" value="32" placeholder=" ">
              <label for="max-teams-per-tournament">Maximum Teams per Tournament</label>
            </div>
            <div class="material-input">
              <input type="number" id="max-team-size" min="1" max="6" value="4" placeholder=" ">
              <label for="max-team-size">Maximum Team Size</label>
            </div>
          </div>
        </div>
        
        <!-- Notification Settings -->
        <div class="border-t border-gray-200 pt-6">
          <h3 class="font-medium text-lg mb-3">Notification Settings</h3>
          <div class="space-y-3">
            <div class="flex items-center">
              <input type="checkbox" id="notify-new-registration" class="mr-2" checked>
              <label for="notify-new-registration">Notify when new registrations are received</label>
            </div>
            <div class="flex items-center">
              <input type="checkbox" id="notify-upcoming-tournament" class="mr-2" checked>
              <label for="notify-upcoming-tournament">Notify before tournaments start</label>
            </div>
            <div class="material-input">
              <input type="number" id="notification-days" min="1" max="7" value="2" placeholder=" ">
              <label for="notification-days">Days before tournament to send notification</label>
            </div>
          </div>
        </div>
        
        <!-- Firebase Settings -->
        <div class="border-t border-gray-200 pt-6">
          <h3 class="font-medium text-lg mb-3">Firebase Settings</h3>
          <p class="text-text-secondary-light mb-4">Firebase configuration is managed through environment variables.</p>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="text-sm font-medium mb-2">Current Configuration Status:</p>
            <p class="text-sm" id="firebase-status">Firebase Authentication is configured and active.</p>
          </div>
        </div>
      </div>
      
      <div class="flex justify-end mt-6">
        <button class="material-btn-primary" id="save-settings-btn">
          <span class="material-icons mr-2">save</span>
          Save Settings
        </button>
      </div>
    </div>
  `;
}

// Load registrations data
function loadRegistrationsData() {
  const registrations = getRegistrations();
  const tableBody = document.getElementById('registrations-table');
  
  if (!tableBody) return;
  
  // Clear table
  tableBody.innerHTML = '';
  
  if (registrations.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="px-6 py-4 text-center text-text-secondary-light">
          No registrations found
        </td>
      </tr>
    `;
    document.getElementById('registrations-pagination-info').textContent = 'Showing 0-0 of 0 registrations';
    return;
  }
  
  // Add registration rows
  registrations.forEach(registration => {
    const row = `
      <tr data-registration-id="${registration.id}">
        <td class="px-6 py-4 whitespace-nowrap">${registration.teamName}</td>
        <td class="px-6 py-4 whitespace-nowrap">${registration.tournamentName}</td>
        <td class="px-6 py-4 whitespace-nowrap">${registration.captain.name}</td>
        <td class="px-6 py-4 whitespace-nowrap">${formatDate(new Date(registration.timestamp))}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <span class="px-2 py-1 bg-${getRegistrationStatusClass(registration.status)}-100 text-${getRegistrationStatusClass(registration.status)}-800 text-xs rounded-full">${capitalizeFirstLetter(registration.status)}</span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex space-x-2">
            <button class="p-1 text-blue-600 hover:text-blue-800 view-registration-btn" data-registration-id="${registration.id}">
              <span class="material-icons text-sm">visibility</span>
            </button>
            <button class="p-1 text-green-600 hover:text-green-800 approve-registration-btn" data-registration-id="${registration.id}" ${registration.status !== 'pending' ? 'disabled' : ''}>
              <span class="material-icons text-sm">check</span>
            </button>
            <button class="p-1 text-red-600 hover:text-red-800 reject-registration-btn" data-registration-id="${registration.id}" ${registration.status !== 'pending' ? 'disabled' : ''}>
              <span class="material-icons text-sm">close</span>
            </button>
          </div>
        </td>
      </tr>
    `;
    
    tableBody.innerHTML += row;
  });
  
  // Update pagination info
  document.getElementById('registrations-pagination-info').textContent = `Showing 1-${registrations.length} of ${registrations.length} registrations`;
  
  // Add event listeners to buttons
  document.querySelectorAll('.view-registration-btn').forEach(button => {
    button.addEventListener('click', () => {
      const registrationId = button.getAttribute('data-registration-id');
      viewRegistration(registrationId);
    });
  });
  
  document.querySelectorAll('.approve-registration-btn').forEach(button => {
    button.addEventListener('click', () => {
      const registrationId = button.getAttribute('data-registration-id');
      approveRegistration(registrationId);
    });
  });
  
  document.querySelectorAll('.reject-registration-btn').forEach(button => {
    button.addEventListener('click', () => {
      const registrationId = button.getAttribute('data-registration-id');
      rejectRegistration(registrationId);
    });
  });
  
  // Add export button handler
  document.getElementById('export-registrations-btn').addEventListener('click', exportRegistrations);
}

// Load results data
function loadResultsData() {
  const tournaments = getTournaments();
  const completedTournaments = tournaments.filter(t => t.status === 'completed');
  const select = document.getElementById('results-tournament-filter');
  
  if (!select) return;
  
  // Clear options (keep the placeholder)
  const placeholder = select.querySelector('option[value=""]');
  select.innerHTML = '';
  select.appendChild(placeholder);
  
  // Add tournament options
  completedTournaments.forEach(tournament => {
    const option = document.createElement('option');
    option.value = tournament.id;
    option.textContent = tournament.name;
    select.appendChild(option);
  });
  
  // Add event listener to select
  select.addEventListener('change', () => {
    const tournamentId = select.value;
    if (tournamentId) {
      loadTournamentResults(tournamentId);
    } else {
      document.getElementById('admin-results-container').innerHTML = `
        <p class="text-center text-text-secondary-light py-4">Select a tournament to manage results</p>
      `;
    }
  });
  
  // Add event listener to add results button
  document.getElementById('add-results-btn').addEventListener('click', showAddResultsModal);
}

// Load users data
function loadUsersData() {
  const users = getUsers();
  const tableBody = document.getElementById('users-table');
  
  if (!tableBody) return;
  
  // Clear table
  tableBody.innerHTML = '';
  
  if (users.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="px-6 py-4 text-center text-text-secondary-light">
          No users found
        </td>
      </tr>
    `;
    document.getElementById('users-pagination-info').textContent = 'Showing 0-0 of 0 users';
    return;
  }
  
  // Add user rows
  users.forEach(user => {
    // Get user registrations count
    const registrations = getRegistrations().filter(r => r.captainEmail === user.email);
    
    const row = `
      <tr data-user-id="${user.id}">
        <td class="px-6 py-4 whitespace-nowrap">${user.name}</td>
        <td class="px-6 py-4 whitespace-nowrap">${user.email}</td>
        <td class="px-6 py-4 whitespace-nowrap">${registrations.length}</td>
        <td class="px-6 py-4 whitespace-nowrap">${formatDate(new Date(user.createdAt))}</td>
        <td class="px-6 py-4 whitespace-nowrap">
          <div class="flex space-x-2">
            <button class="p-1 text-blue-600 hover:text-blue-800 edit-user-btn" data-user-id="${user.id}">
              <span class="material-icons text-sm">edit</span>
            </button>
            <button class="p-1 text-red-600 hover:text-red-800 delete-user-btn" data-user-id="${user.id}">
              <span class="material-icons text-sm">delete</span>
            </button>
          </div>
        </td>
      </tr>
    `;
    
    tableBody.innerHTML += row;
  });
  
  // Update pagination info
  document.getElementById('users-pagination-info').textContent = `Showing 1-${users.length} of ${users.length} users`;
  
  // Add event listeners to buttons
  document.querySelectorAll('.edit-user-btn').forEach(button => {
    button.addEventListener('click', () => {
      const userId = button.getAttribute('data-user-id');
      editUser(userId);
    });
  });
  
  document.querySelectorAll('.delete-user-btn').forEach(button => {
    button.addEventListener('click', () => {
      const userId = button.getAttribute('data-user-id');
      deleteUser(userId);
    });
  });
}

// Load tournament results for a specific tournament
function loadTournamentResults(tournamentId) {
  const tournaments = getTournaments();
  const tournament = tournaments.find(t => t.id === tournamentId);
  
  if (!tournament) return;
  
  const container = document.getElementById('admin-results-container');
  
  // Display results if available
  if (tournament.winners) {
    container.innerHTML = `
      <div class="mb-4">
        <h3 class="font-heading font-medium text-lg mb-2">${tournament.name} Results</h3>
        <p class="text-text-secondary-light mb-4">Results have already been added for this tournament.</p>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prize</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kills</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Points</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              ${tournament.winners.map(winner => `
                <tr>
                  <td class="px-6 py-4 whitespace-nowrap">${winner.position}</td>
                  <td class="px-6 py-4 whitespace-nowrap">${winner.team}</td>
                  <td class="px-6 py-4 whitespace-nowrap">${winner.prize}</td>
                  <td class="px-6 py-4 whitespace-nowrap">${winner.kills || 'N/A'}</td>
                  <td class="px-6 py-4 whitespace-nowrap">${winner.points || 'N/A'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
        
        <div class="flex justify-end mt-4">
          <button class="material-btn-outlined mr-2 edit-results-btn" data-tournament-id="${tournament.id}">
            <span class="material-icons mr-1">edit</span>
            Edit Results
          </button>
          <button class="material-btn-primary download-results-btn" data-tournament-id="${tournament.id}">
            <span class="material-icons mr-1">download</span>
            Download CSV
          </button>
        </div>
      </div>
    `;
    
    // Add event listeners
    document.querySelector('.edit-results-btn').addEventListener('click', () => {
      editTournamentResults(tournamentId);
    });
    
    document.querySelector('.download-results-btn').addEventListener('click', () => {
      downloadTournamentResults(tournamentId);
    });
  } else {
    // No results yet, show form to add results
    container.innerHTML = `
      <div class="mb-4">
        <h3 class="font-heading font-medium text-lg mb-2">${tournament.name} Results</h3>
        <p class="text-text-secondary-light mb-4">No results have been added for this tournament yet.</p>
        
        <button class="material-btn-primary add-results-for-tournament-btn" data-tournament-id="${tournament.id}">
          <span class="material-icons mr-1">add</span>
          Add Results
        </button>
      </div>
    `;
    
    // Add event listeners
    document.querySelector('.add-results-for-tournament-btn').addEventListener('click', () => {
      addTournamentResults(tournamentId);
    });
  }
}

// Load admin stats
function loadAdminStats() {
  const tournaments = getTournaments();
  const registrations = getRegistrations();
  const users = getUsers();
  
  // Calculate stats
  const activeTournaments = tournaments.filter(t => t.status === 'upcoming' || t.status === 'ongoing').length;
  const registeredTeams = registrations.length;
  const totalPrizeMoney = tournaments.reduce((sum, t) => sum + t.prizeAmount, 0);
  const registeredUsers = users.length;
  
  // Update DOM
  document.getElementById('stats-active-tournaments').textContent = activeTournaments;
  document.getElementById('stats-registered-teams').textContent = registeredTeams;
  document.getElementById('stats-prize-money').textContent = formatCurrency(totalPrizeMoney);
  document.getElementById('stats-registered-users').textContent = registeredUsers;
}

// Show new tournament modal
function showNewTournamentModal() {
  // Create modal HTML
  const modalHTML = `
    <div id="tournament-form-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div class="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 class="font-heading font-semibold text-xl">New Tournament</h2>
          <button id="close-tournament-modal" class="text-gray-500 hover:text-gray-700">
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="p-4">
          <form id="tournament-form">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="material-input">
                <input type="text" id="tournament-name" placeholder=" " required>
                <label for="tournament-name">Tournament Name</label>
              </div>
              
              <div class="material-input">
                <select id="tournament-status" class="placeholder:text-transparent" required>
                  <option value="">Select status</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                </select>
                <label for="tournament-status">Status</label>
              </div>
              
              <div class="material-input">
                <input type="date" id="tournament-date" placeholder=" " required>
                <label for="tournament-date">Date</label>
              </div>
              
              <div class="material-input">
                <input type="text" id="tournament-time" placeholder=" " required>
                <label for="tournament-time">Time (e.g. 6:00 PM UTC)</label>
              </div>
              
              <div class="material-input">
                <input type="number" id="tournament-prize" min="0" placeholder=" " required>
                <label for="tournament-prize">Prize Pool ($)</label>
              </div>
              
              <div class="material-input">
                <input type="text" id="tournament-fee" placeholder=" " required>
                <label for="tournament-fee">Entry Fee (e.g. $25 or Free)</label>
              </div>
              
              <div class="material-input">
                <select id="tournament-fee-category" class="placeholder:text-transparent" required>
                  <option value="">Select fee category</option>
                  <option value="free">Free</option>
                  <option value="low">Low ($1-$10)</option>
                  <option value="medium">Medium ($11-$50)</option>
                  <option value="high">High ($50+)</option>
                </select>
                <label for="tournament-fee-category">Fee Category</label>
              </div>
              
              <div class="material-input">
                <input type="number" id="tournament-max-teams" min="1" placeholder=" " required>
                <label for="tournament-max-teams">Maximum Teams</label>
              </div>
              
              <div class="material-input md:col-span-2">
                <textarea id="tournament-rules" rows="3" placeholder=" " required></textarea>
                <label for="tournament-rules">Rules</label>
              </div>
              
              <div class="material-input md:col-span-2">
                <textarea id="tournament-format" rows="3" placeholder=" " required></textarea>
                <label for="tournament-format">Tournament Format</label>
              </div>
              
              <div class="material-input md:col-span-2">
                <input type="text" id="tournament-image" placeholder=" " required>
                <label for="tournament-image">Image URL</label>
              </div>
            </div>
            
            <div class="flex justify-end mt-4">
              <button type="button" class="material-btn-outlined mr-2" id="cancel-tournament-btn">Cancel</button>
              <button type="submit" class="material-btn-primary">Save Tournament</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  
  // Append modal to body
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Add event listeners
  document.getElementById('close-tournament-modal').addEventListener('click', closeTournamentModal);
  document.getElementById('cancel-tournament-btn').addEventListener('click', closeTournamentModal);
  document.getElementById('tournament-form').addEventListener('submit', saveTournament);
  
  // Set default values
  document.getElementById('tournament-max-teams').value = "32";
  document.getElementById('tournament-status').value = "upcoming";
}

// Close tournament modal
function closeTournamentModal() {
  const modal = document.getElementById('tournament-form-modal');
  if (modal) {
    modal.remove();
  }
}

// Save tournament
function saveTournament(e) {
  e.preventDefault();
  
  // Get form values
  const name = document.getElementById('tournament-name').value;
  const status = document.getElementById('tournament-status').value;
  const date = document.getElementById('tournament-date').value;
  const time = document.getElementById('tournament-time').value;
  const prizeAmount = parseFloat(document.getElementById('tournament-prize').value);
  const fee = document.getElementById('tournament-fee').value;
  const feeCategory = document.getElementById('tournament-fee-category').value;
  const maxTeams = parseInt(document.getElementById('tournament-max-teams').value);
  const rules = document.getElementById('tournament-rules').value;
  const format = document.getElementById('tournament-format').value;
  const image = document.getElementById('tournament-image').value;
  
  // Create timestamp from date
  const timestamp = new Date(date).getTime();
  
  // Format date for display
  const formattedDate = formatDate(new Date(date));
  
  // Create tournament object
  const tournament = {
    id: generateId('t'),
    name,
    date: formattedDate,
    timestamp,
    time,
    status,
    prize: `$${prizeAmount.toLocaleString()}`,
    prizeAmount,
    fee,
    feeCategory,
    teams: `0/${maxTeams}`,
    maxTeams,
    currentTeams: 0,
    rules,
    format,
    image
  };
  
  // Get existing tournaments
  const tournaments = getTournaments();
  
  // Add new tournament
  tournaments.push(tournament);
  
  // Save to localStorage
  saveTournaments(tournaments);
  
  // Close modal
  closeTournamentModal();
  
  // Reload tournaments tab
  loadAdminTournamentsTab();
  
  // Update stats
  loadAdminStats();
  
  // Show success message
  showToast('Tournament created successfully');
}

// Edit tournament
function editTournament(tournamentId) {
  const tournaments = getTournaments();
  const tournament = tournaments.find(t => t.id === tournamentId);
  
  if (!tournament) return;
  
  // Create modal HTML (similar to new tournament but with existing values)
  const modalHTML = `
    <div id="tournament-form-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div class="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 class="font-heading font-semibold text-xl">Edit Tournament</h2>
          <button id="close-tournament-modal" class="text-gray-500 hover:text-gray-700">
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="p-4">
          <form id="tournament-form">
            <input type="hidden" id="tournament-id" value="${tournament.id}">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="material-input">
                <input type="text" id="tournament-name" placeholder=" " value="${tournament.name}" required>
                <label for="tournament-name">Tournament Name</label>
              </div>
              
              <div class="material-input">
                <select id="tournament-status" class="placeholder:text-transparent" required>
                  <option value="">Select status</option>
                  <option value="upcoming" ${tournament.status === 'upcoming' ? 'selected' : ''}>Upcoming</option>
                  <option value="ongoing" ${tournament.status === 'ongoing' ? 'selected' : ''}>Ongoing</option>
                  <option value="completed" ${tournament.status === 'completed' ? 'selected' : ''}>Completed</option>
                </select>
                <label for="tournament-status">Status</label>
              </div>
              
              <div class="material-input">
                <input type="date" id="tournament-date" placeholder=" " value="${new Date(tournament.timestamp).toISOString().split('T')[0]}" required>
                <label for="tournament-date">Date</label>
              </div>
              
              <div class="material-input">
                <input type="text" id="tournament-time" placeholder=" " value="${tournament.time}" required>
                <label for="tournament-time">Time</label>
              </div>
              
              <div class="material-input">
                <input type="number" id="tournament-prize" min="0" placeholder=" " value="${tournament.prizeAmount}" required>
                <label for="tournament-prize">Prize Pool ($)</label>
              </div>
              
              <div class="material-input">
                <input type="text" id="tournament-fee" placeholder=" " value="${tournament.fee}" required>
                <label for="tournament-fee">Entry Fee</label>
              </div>
              
              <div class="material-input">
                <select id="tournament-fee-category" class="placeholder:text-transparent" required>
                  <option value="">Select fee category</option>
                  <option value="free" ${tournament.feeCategory === 'free' ? 'selected' : ''}>Free</option>
                  <option value="low" ${tournament.feeCategory === 'low' ? 'selected' : ''}>Low ($1-$10)</option>
                  <option value="medium" ${tournament.feeCategory === 'medium' ? 'selected' : ''}>Medium ($11-$50)</option>
                  <option value="high" ${tournament.feeCategory === 'high' ? 'selected' : ''}>High ($50+)</option>
                </select>
                <label for="tournament-fee-category">Fee Category</label>
              </div>
              
              <div class="material-input">
                <input type="number" id="tournament-max-teams" min="1" placeholder=" " value="${tournament.maxTeams}" required>
                <label for="tournament-max-teams">Maximum Teams</label>
              </div>
              
              <div class="material-input md:col-span-2">
                <textarea id="tournament-rules" rows="3" placeholder=" " required>${tournament.rules}</textarea>
                <label for="tournament-rules">Rules</label>
              </div>
              
              <div class="material-input md:col-span-2">
                <textarea id="tournament-format" rows="3" placeholder=" " required>${tournament.format}</textarea>
                <label for="tournament-format">Tournament Format</label>
              </div>
              
              <div class="material-input md:col-span-2">
                <input type="text" id="tournament-image" placeholder=" " value="${tournament.image}" required>
                <label for="tournament-image">Image URL</label>
              </div>
            </div>
            
            <div class="flex justify-end mt-4">
              <button type="button" class="material-btn-outlined mr-2" id="cancel-tournament-btn">Cancel</button>
              <button type="submit" class="material-btn-primary">Update Tournament</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  
  // Append modal to body
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Add event listeners
  document.getElementById('close-tournament-modal').addEventListener('click', closeTournamentModal);
  document.getElementById('cancel-tournament-btn').addEventListener('click', closeTournamentModal);
  document.getElementById('tournament-form').addEventListener('submit', updateTournament);
}

// Update tournament
function updateTournament(e) {
  e.preventDefault();
  
  // Get form values
  const id = document.getElementById('tournament-id').value;
  const name = document.getElementById('tournament-name').value;
  const status = document.getElementById('tournament-status').value;
  const date = document.getElementById('tournament-date').value;
  const time = document.getElementById('tournament-time').value;
  const prizeAmount = parseFloat(document.getElementById('tournament-prize').value);
  const fee = document.getElementById('tournament-fee').value;
  const feeCategory = document.getElementById('tournament-fee-category').value;
  const maxTeams = parseInt(document.getElementById('tournament-max-teams').value);
  const rules = document.getElementById('tournament-rules').value;
  const format = document.getElementById('tournament-format').value;
  const image = document.getElementById('tournament-image').value;
  
  // Create timestamp from date
  const timestamp = new Date(date).getTime();
  
  // Format date for display
  const formattedDate = formatDate(new Date(date));
  
  // Get existing tournaments
  const tournaments = getTournaments();
  const tournamentIndex = tournaments.findIndex(t => t.id === id);
  
  if (tournamentIndex === -1) {
    showToast('Tournament not found', 'error');
    return;
  }
  
  // Get current teams count
  const currentTeams = tournaments[tournamentIndex].currentTeams || 0;
  
  // Create updated tournament object
  const updatedTournament = {
    ...tournaments[tournamentIndex],
    name,
    date: formattedDate,
    timestamp,
    time,
    status,
    prize: `$${prizeAmount.toLocaleString()}`,
    prizeAmount,
    fee,
    feeCategory,
    teams: `${currentTeams}/${maxTeams}`,
    maxTeams,
    rules,
    format,
    image
  };
  
  // Update tournament
  tournaments[tournamentIndex] = updatedTournament;
  
  // Save to localStorage
  saveTournaments(tournaments);
  
  // Close modal
  closeTournamentModal();
  
  // Reload tournaments tab
  loadAdminTournamentsTab();
  
  // Update stats
  loadAdminStats();
  
  // Show success message
  showToast('Tournament updated successfully');
}

// Delete tournament
function deleteTournament(tournamentId) {
  // Show confirmation dialog
  if (!confirm('Are you sure you want to delete this tournament? This action cannot be undone.')) {
    return;
  }
  
  // Get existing tournaments
  const tournaments = getTournaments();
  const tournamentIndex = tournaments.findIndex(t => t.id === tournamentId);
  
  if (tournamentIndex === -1) {
    showToast('Tournament not found', 'error');
    return;
  }
  
  // Remove tournament
  tournaments.splice(tournamentIndex, 1);
  
  // Save to localStorage
  saveTournaments(tournaments);
  
  // Reload tournaments tab
  loadAdminTournamentsTab();
  
  // Update stats
  loadAdminStats();
  
  // Show success message
  showToast('Tournament deleted successfully');
}

// View tournament registrations
function viewTournamentRegistrations(tournamentId) {
  const tournaments = getTournaments();
  const tournament = tournaments.find(t => t.id === tournamentId);
  
  if (!tournament) return;
  
  // Get registrations for this tournament
  const registrations = getRegistrations().filter(r => r.tournamentId === tournamentId);
  
  // Create modal HTML
  const modalHTML = `
    <div id="registrations-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div class="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 class="font-heading font-semibold text-xl">Registrations for ${tournament.name}</h2>
          <button id="close-registrations-modal" class="text-gray-500 hover:text-gray-700">
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="p-4">
          <p class="mb-4">Total Registrations: ${registrations.length} / ${tournament.maxTeams}</p>
          
          ${registrations.length > 0 ? `
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Captain</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team Size</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                  ${registrations.map(reg => `
                    <tr>
                      <td class="px-6 py-4 whitespace-nowrap">${reg.teamName}</td>
                      <td class="px-6 py-4 whitespace-nowrap">${reg.captain.name}</td>
                      <td class="px-6 py-4 whitespace-nowrap">${reg.captain.email}</td>
                      <td class="px-6 py-4 whitespace-nowrap">${reg.teamSize}</td>
                      <td class="px-6 py-4 whitespace-nowrap">${formatDate(new Date(reg.timestamp))}</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 py-1 bg-${getRegistrationStatusClass(reg.status)}-100 text-${getRegistrationStatusClass(reg.status)}-800 text-xs rounded-full">${capitalizeFirstLetter(reg.status)}</span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
            
            <div class="flex justify-end mt-4">
              <button class="material-btn-outlined" id="export-tournament-registrations-btn" data-tournament-id="${tournamentId}">
                <span class="material-icons mr-2">file_download</span>
                Export to CSV
              </button>
            </div>
          ` : `
            <p class="text-center text-text-secondary-light py-8">No registrations for this tournament yet</p>
          `}
        </div>
      </div>
    </div>
  `;
  
  // Append modal to body
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Add event listeners
  document.getElementById('close-registrations-modal').addEventListener('click', closeRegistrationsModal);
  
  if (registrations.length > 0) {
    document.getElementById('export-tournament-registrations-btn').addEventListener('click', () => {
      exportTournamentRegistrations(tournamentId);
    });
  }
}

// Close registrations modal
function closeRegistrationsModal() {
  const modal = document.getElementById('registrations-modal');
  if (modal) {
    modal.remove();
  }
}

// View registration details
function viewRegistration(registrationId) {
  const registrations = getRegistrations();
  const registration = registrations.find(r => r.id === registrationId);
  
  if (!registration) return;
  
  // Create modal HTML
  const modalHTML = `
    <div id="registration-details-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div class="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 class="font-heading font-semibold text-xl">Registration Details</h2>
          <button id="close-registration-details-modal" class="text-gray-500 hover:text-gray-700">
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="p-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 class="font-medium mb-2">Team Information</h3>
              <div class="space-y-2">
                <p><span class="font-medium">Team Name:</span> ${registration.teamName}</p>
                <p><span class="font-medium">Tournament:</span> ${registration.tournamentName}</p>
                <p><span class="font-medium">Team Size:</span> ${registration.teamSize}</p>
                <p><span class="font-medium">Registration Date:</span> ${formatDateTime(new Date(registration.timestamp))}</p>
                <p><span class="font-medium">Status:</span> <span class="px-2 py-1 bg-${getRegistrationStatusClass(registration.status)}-100 text-${getRegistrationStatusClass(registration.status)}-800 text-xs rounded-full">${capitalizeFirstLetter(registration.status)}</span></p>
              </div>
            </div>
            <div>
              <h3 class="font-medium mb-2">Captain Information</h3>
              <div class="space-y-2">
                <p><span class="font-medium">Name:</span> ${registration.captain.name}</p>
                <p><span class="font-medium">Free Fire ID:</span> ${registration.captain.ffId}</p>
                <p><span class="font-medium">Email:</span> ${registration.captain.email}</p>
                <p><span class="font-medium">Phone:</span> ${registration.captain.phone}</p>
              </div>
            </div>
          </div>
          
          ${registration.teamMembers.length > 0 ? `
            <div class="mt-6">
              <h3 class="font-medium mb-2">Team Members</h3>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member #</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Free Fire ID</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200">
                    ${registration.teamMembers.map((member, index) => `
                      <tr>
                        <td class="px-6 py-4 whitespace-nowrap">${index + 1}</td>
                        <td class="px-6 py-4 whitespace-nowrap">${member.name}</td>
                        <td class="px-6 py-4 whitespace-nowrap">${member.ffId}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          ` : ''}
          
          ${registration.teamExperience ? `
            <div class="mt-6">
              <h3 class="font-medium mb-2">Team Experience</h3>
              <p class="text-text-secondary-light">${registration.teamExperience}</p>
            </div>
          ` : ''}
          
          ${registration.status === 'pending' ? `
            <div class="flex justify-end mt-6">
              <button class="material-btn-outlined mr-2" id="reject-registration-btn" data-registration-id="${registration.id}">
                <span class="material-icons mr-1">close</span>
                Reject
              </button>
              <button class="material-btn-primary" id="approve-registration-btn" data-registration-id="${registration.id}">
                <span class="material-icons mr-1">check</span>
                Approve
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    </div>
  `;
  
  // Append modal to body
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Add event listeners
  document.getElementById('close-registration-details-modal').addEventListener('click', closeRegistrationDetailsModal);
  
  if (registration.status === 'pending') {
    document.getElementById('approve-registration-btn').addEventListener('click', () => {
      approveRegistration(registrationId);
      closeRegistrationDetailsModal();
    });
    
    document.getElementById('reject-registration-btn').addEventListener('click', () => {
      rejectRegistration(registrationId);
      closeRegistrationDetailsModal();
    });
  }
}

// Close registration details modal
function closeRegistrationDetailsModal() {
  const modal = document.getElementById('registration-details-modal');
  if (modal) {
    modal.remove();
  }
}

// Approve registration
function approveRegistration(registrationId) {
  const registrations = getRegistrations();
  const registrationIndex = registrations.findIndex(r => r.id === registrationId);
  
  if (registrationIndex === -1) {
    showToast('Registration not found', 'error');
    return;
  }
  
  // Update status
  registrations[registrationIndex].status = 'approved';
  
  // Save to localStorage
  saveRegistrations(registrations);
  
  // Reload registrations tab
  loadRegistrationsData();
  
  // Show success message
  showToast('Registration approved successfully');
}

// Reject registration
function rejectRegistration(registrationId) {
  const registrations = getRegistrations();
  const registrationIndex = registrations.findIndex(r => r.id === registrationId);
  
  if (registrationIndex === -1) {
    showToast('Registration not found', 'error');
    return;
  }
  
  // Update status
  registrations[registrationIndex].status = 'rejected';
  
  // Save to localStorage
  saveRegistrations(registrations);
  
  // Reload registrations tab
  loadRegistrationsData();
  
  // Show success message
  showToast('Registration rejected successfully');
}

// Export registrations to CSV
function exportRegistrations() {
  const registrations = getRegistrations();
  
  if (registrations.length === 0) {
    showToast('No registrations to export', 'error');
    return;
  }
  
  // Create CSV data
  const csvData = [
    {
      ID: 'Registration ID',
      Team: 'Team Name',
      Tournament: 'Tournament',
      Captain: 'Captain Name',
      Email: 'Email',
      Phone: 'Phone',
      TeamSize: 'Team Size',
      Date: 'Registration Date',
      Status: 'Status'
    },
    ...registrations.map(reg => ({
      ID: reg.id,
      Team: reg.teamName,
      Tournament: reg.tournamentName,
      Captain: reg.captain.name,
      Email: reg.captain.email,
      Phone: reg.captain.phone,
      TeamSize: reg.teamSize,
      Date: formatDate(new Date(reg.timestamp)),
      Status: capitalizeFirstLetter(reg.status)
    }))
  ];
  
  // Download CSV
  downloadCSV(csvData, 'tournament-registrations.csv');
}

// Export tournament registrations to CSV
function exportTournamentRegistrations(tournamentId) {
  const tournaments = getTournaments();
  const tournament = tournaments.find(t => t.id === tournamentId);
  
  if (!tournament) return;
  
  // Get registrations for this tournament
  const registrations = getRegistrations().filter(r => r.tournamentId === tournamentId);
  
  if (registrations.length === 0) {
    showToast('No registrations to export', 'error');
    return;
  }
  
  // Create CSV data
  const csvData = [
    {
      ID: 'Registration ID',
      Team: 'Team Name',
      Captain: 'Captain Name',
      FFID: 'Free Fire ID',
      Email: 'Email',
      Phone: 'Phone',
      TeamSize: 'Team Size',
      Date: 'Registration Date',
      Status: 'Status'
    },
    ...registrations.map(reg => ({
      ID: reg.id,
      Team: reg.teamName,
      Captain: reg.captain.name,
      FFID: reg.captain.ffId,
      Email: reg.captain.email,
      Phone: reg.captain.phone,
      TeamSize: reg.teamSize,
      Date: formatDate(new Date(reg.timestamp)),
      Status: capitalizeFirstLetter(reg.status)
    }))
  ];
  
  // Download CSV
  downloadCSV(csvData, `${tournament.name.replace(/\s+/g, '-').toLowerCase()}-registrations.csv`);
}

// Show add results modal
function showAddResultsModal() {
  // Get completed tournaments without results
  const tournaments = getTournaments();
  const completedTournaments = tournaments.filter(t => t.status === 'completed' && !t.winners);
  
  if (completedTournaments.length === 0) {
    showToast('No completed tournaments without results', 'error');
    return;
  }
  
  // Create modal HTML
  const modalHTML = `
    <div id="add-results-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div class="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 class="font-heading font-semibold text-xl">Add Tournament Results</h2>
          <button id="close-add-results-modal" class="text-gray-500 hover:text-gray-700">
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="p-4">
          <div class="material-input mb-4">
            <select id="results-tournament-select" class="placeholder:text-transparent" required>
              <option value="">Select a tournament</option>
              ${completedTournaments.map(t => `
                <option value="${t.id}">${t.name}</option>
              `).join('')}
            </select>
            <label for="results-tournament-select">Tournament</label>
          </div>
          
          <div id="results-form-container" class="hidden">
            <!-- Results form will be added here -->
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Append modal to body
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Add event listeners
  document.getElementById('close-add-results-modal').addEventListener('click', closeAddResultsModal);
  document.getElementById('results-tournament-select').addEventListener('change', showResultsForm);
}

// Close add results modal
function closeAddResultsModal() {
  const modal = document.getElementById('add-results-modal');
  if (modal) {
    modal.remove();
  }
}

// Show results form
function showResultsForm() {
  const tournamentId = document.getElementById('results-tournament-select').value;
  
  if (!tournamentId) {
    document.getElementById('results-form-container').classList.add('hidden');
    return;
  }
  
  const tournaments = getTournaments();
  const tournament = tournaments.find(t => t.id === tournamentId);
  
  if (!tournament) return;
  
  // Create form HTML
  const formHTML = `
    <form id="results-form">
      <input type="hidden" id="results-tournament-id" value="${tournamentId}">
      
      <div class="mb-4">
        <h3 class="font-medium mb-2">Top 3 Winners</h3>
      </div>
      
      ${[1, 2, 3].map(position => `
        <div class="p-4 ${position === 1 ? 'bg-yellow-50' : position === 2 ? 'bg-gray-100' : 'bg-orange-50'} rounded-lg mb-4">
          <h4 class="font-medium mb-2">${position}${getOrdinalSuffix(position)} Place</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="material-input">
              <input type="text" id="winner-${position}-team" placeholder=" " required>
              <label for="winner-${position}-team">Team Name</label>
            </div>
            <div class="material-input">
              <input type="text" id="winner-${position}-prize" placeholder=" " required>
              <label for="winner-${position}-prize">Prize (e.g. $5,000)</label>
            </div>
            <div class="material-input">
              <input type="number" id="winner-${position}-kills" placeholder=" " min="0">
              <label for="winner-${position}-kills">Total Kills</label>
            </div>
            <div class="material-input">
              <input type="number" id="winner-${position}-points" placeholder=" " min="0">
              <label for="winner-${position}-points">Total Points</label>
            </div>
          </div>
        </div>
      `).join('')}
      
      <div class="material-input">
        <textarea id="results-notes" rows="3" placeholder=" "></textarea>
        <label for="results-notes">Additional Notes</label>
      </div>
      
      <div class="flex justify-end mt-4">
        <button type="button" class="material-btn-outlined mr-2" id="cancel-results-btn">Cancel</button>
        <button type="submit" class="material-btn-primary">Save Results</button>
      </div>
    </form>
  `;
  
  // Add form to container
  document.getElementById('results-form-container').innerHTML = formHTML;
  document.getElementById('results-form-container').classList.remove('hidden');
  
  // Add event listeners
  document.getElementById('cancel-results-btn').addEventListener('click', closeAddResultsModal);
  document.getElementById('results-form').addEventListener('submit', saveResults);
}

// Save results
function saveResults(e) {
  e.preventDefault();
  
  const tournamentId = document.getElementById('results-tournament-id').value;
  
  // Create winners array
  const winners = [];
  
  for (let i = 1; i <= 3; i++) {
    const team = document.getElementById(`winner-${i}-team`).value;
    const prize = document.getElementById(`winner-${i}-prize`).value;
    const kills = document.getElementById(`winner-${i}-kills`).value ? parseInt(document.getElementById(`winner-${i}-kills`).value) : null;
    const points = document.getElementById(`winner-${i}-points`).value ? parseInt(document.getElementById(`winner-${i}-points`).value) : null;
    
    winners.push({
      position: i,
      team,
      prize,
      kills,
      points
    });
  }
  
  // Get existing tournaments
  const tournaments = getTournaments();
  const tournamentIndex = tournaments.findIndex(t => t.id === tournamentId);
  
  if (tournamentIndex === -1) {
    showToast('Tournament not found', 'error');
    return;
  }
  
  // Update tournament with winners
  tournaments[tournamentIndex].winners = winners;
  
  // Add stats if not exist
  if (!tournaments[tournamentIndex].stats) {
    tournaments[tournamentIndex].stats = {
      mostKills: { player: winners[0].team + ' Player', value: winners[0].kills || 8, percent: 80 },
      highestDamage: { team: winners[0].team, value: winners[0].kills ? winners[0].kills * 150 : 1200, percent: 90 },
      mostBooyahs: { team: winners[0].team, value: Math.floor(Math.random() * 3) + 1, percent: 75 },
      avgSurvivalTime: { value: `${Math.floor(Math.random() * 5) + 10}m ${Math.floor(Math.random() * 60)}s`, percent: 65 }
    };
  }
  
  // Save to localStorage
  saveTournaments(tournaments);
  
  // Close modal
  closeAddResultsModal();
  
  // Reload results tab
  document.getElementById('results-tournament-filter').value = tournamentId;
  loadTournamentResults(tournamentId);
  
  // Show success message
  showToast('Results saved successfully');
}

// Add tournament results
function addTournamentResults(tournamentId) {
  const tournaments = getTournaments();
  const tournament = tournaments.find(t => t.id === tournamentId);
  
  if (!tournament) return;
  
  // Create modal HTML
  const modalHTML = `
    <div id="add-results-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div class="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 class="font-heading font-semibold text-xl">Add Results for ${tournament.name}</h2>
          <button id="close-add-results-modal" class="text-gray-500 hover:text-gray-700">
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="p-4">
          <form id="results-form">
            <input type="hidden" id="results-tournament-id" value="${tournamentId}">
            
            <div class="mb-4">
              <h3 class="font-medium mb-2">Top 3 Winners</h3>
            </div>
            
            ${[1, 2, 3].map(position => `
              <div class="p-4 ${position === 1 ? 'bg-yellow-50' : position === 2 ? 'bg-gray-100' : 'bg-orange-50'} rounded-lg mb-4">
                <h4 class="font-medium mb-2">${position}${getOrdinalSuffix(position)} Place</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="material-input">
                    <input type="text" id="winner-${position}-team" placeholder=" " required>
                    <label for="winner-${position}-team">Team Name</label>
                  </div>
                  <div class="material-input">
                    <input type="text" id="winner-${position}-prize" placeholder=" " required>
                    <label for="winner-${position}-prize">Prize (e.g. $5,000)</label>
                  </div>
                  <div class="material-input">
                    <input type="number" id="winner-${position}-kills" placeholder=" " min="0">
                    <label for="winner-${position}-kills">Total Kills</label>
                  </div>
                  <div class="material-input">
                    <input type="number" id="winner-${position}-points" placeholder=" " min="0">
                    <label for="winner-${position}-points">Total Points</label>
                  </div>
                </div>
              </div>
            `).join('')}
            
            <div class="material-input">
              <textarea id="results-notes" rows="3" placeholder=" "></textarea>
              <label for="results-notes">Additional Notes</label>
            </div>
            
            <div class="flex justify-end mt-4">
              <button type="button" class="material-btn-outlined mr-2" id="cancel-results-btn">Cancel</button>
              <button type="submit" class="material-btn-primary">Save Results</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  
  // Append modal to body
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Add event listeners
  document.getElementById('close-add-results-modal').addEventListener('click', closeAddResultsModal);
  document.getElementById('cancel-results-btn').addEventListener('click', closeAddResultsModal);
  document.getElementById('results-form').addEventListener('submit', saveResults);
}

// Edit tournament results
function editTournamentResults(tournamentId) {
  const tournaments = getTournaments();
  const tournament = tournaments.find(t => t.id === tournamentId);
  
  if (!tournament || !tournament.winners) return;
  
  // Create modal HTML
  const modalHTML = `
    <div id="edit-results-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto m-4">
        <div class="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 class="font-heading font-semibold text-xl">Edit Results for ${tournament.name}</h2>
          <button id="close-edit-results-modal" class="text-gray-500 hover:text-gray-700">
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="p-4">
          <form id="edit-results-form">
            <input type="hidden" id="edit-results-tournament-id" value="${tournamentId}">
            
            <div class="mb-4">
              <h3 class="font-medium mb-2">Top 3 Winners</h3>
            </div>
            
            ${tournament.winners.map((winner, index) => `
              <div class="p-4 ${winner.position === 1 ? 'bg-yellow-50' : winner.position === 2 ? 'bg-gray-100' : 'bg-orange-50'} rounded-lg mb-4">
                <h4 class="font-medium mb-2">${winner.position}${getOrdinalSuffix(winner.position)} Place</h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="material-input">
                    <input type="text" id="edit-winner-${winner.position}-team" placeholder=" " value="${winner.team}" required>
                    <label for="edit-winner-${winner.position}-team">Team Name</label>
                  </div>
                  <div class="material-input">
                    <input type="text" id="edit-winner-${winner.position}-prize" placeholder=" " value="${winner.prize}" required>
                    <label for="edit-winner-${winner.position}-prize">Prize</label>
                  </div>
                  <div class="material-input">
                    <input type="number" id="edit-winner-${winner.position}-kills" placeholder=" " min="0" value="${winner.kills || ''}">
                    <label for="edit-winner-${winner.position}-kills">Total Kills</label>
                  </div>
                  <div class="material-input">
                    <input type="number" id="edit-winner-${winner.position}-points" placeholder=" " min="0" value="${winner.points || ''}">
                    <label for="edit-winner-${winner.position}-points">Total Points</label>
                  </div>
                </div>
              </div>
            `).join('')}
            
            <div class="flex justify-end mt-4">
              <button type="button" class="material-btn-outlined mr-2" id="cancel-edit-results-btn">Cancel</button>
              <button type="submit" class="material-btn-primary">Update Results</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  
  // Append modal to body
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Add event listeners
  document.getElementById('close-edit-results-modal').addEventListener('click', closeEditResultsModal);
  document.getElementById('cancel-edit-results-btn').addEventListener('click', closeEditResultsModal);
  document.getElementById('edit-results-form').addEventListener('submit', updateResults);
}

// Close edit results modal
function closeEditResultsModal() {
  const modal = document.getElementById('edit-results-modal');
  if (modal) {
    modal.remove();
  }
}

// Update results
function updateResults(e) {
  e.preventDefault();
  
  const tournamentId = document.getElementById('edit-results-tournament-id').value;
  
  // Create winners array
  const winners = [];
  
  for (let i = 1; i <= 3; i++) {
    const team = document.getElementById(`edit-winner-${i}-team`).value;
    const prize = document.getElementById(`edit-winner-${i}-prize`).value;
    const kills = document.getElementById(`edit-winner-${i}-kills`).value ? parseInt(document.getElementById(`edit-winner-${i}-kills`).value) : null;
    const points = document.getElementById(`edit-winner-${i}-points`).value ? parseInt(document.getElementById(`edit-winner-${i}-points`).value) : null;
    
    winners.push({
      position: i,
      team,
      prize,
      kills,
      points
    });
  }
  
  // Get existing tournaments
  const tournaments = getTournaments();
  const tournamentIndex = tournaments.findIndex(t => t.id === tournamentId);
  
  if (tournamentIndex === -1) {
    showToast('Tournament not found', 'error');
    return;
  }
  
  // Update tournament with winners
  tournaments[tournamentIndex].winners = winners;
  
  // Save to localStorage
  saveTournaments(tournaments);
  
  // Close modal
  closeEditResultsModal();
  
  // Reload results tab
  loadTournamentResults(tournamentId);
  
  // Show success message
  showToast('Results updated successfully');
}

// Edit user
function editUser(userId) {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  
  if (!user) return;
  
  // Create modal HTML
  const modalHTML = `
    <div id="edit-user-modal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto m-4">
        <div class="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 class="font-heading font-semibold text-xl">Edit User</h2>
          <button id="close-edit-user-modal" class="text-gray-500 hover:text-gray-700">
            <span class="material-icons">close</span>
          </button>
        </div>
        <div class="p-4">
          <form id="edit-user-form">
            <input type="hidden" id="edit-user-id" value="${user.id}">
            
            <div class="material-input">
              <input type="text" id="edit-user-name" placeholder=" " value="${user.name}" required>
              <label for="edit-user-name">Name</label>
            </div>
            
            <div class="material-input">
              <input type="email" id="edit-user-email" placeholder=" " value="${user.email}" required>
              <label for="edit-user-email">Email</label>
            </div>
            
            <div class="material-input">
              <input type="password" id="edit-user-password" placeholder=" ">
              <label for="edit-user-password">New Password (leave blank to keep current)</label>
            </div>
            
            <div class="flex justify-end mt-4">
              <button type="button" class="material-btn-outlined mr-2" id="cancel-edit-user-btn">Cancel</button>
              <button type="submit" class="material-btn-primary">Update User</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;
  
  // Append modal to body
  document.body.insertAdjacentHTML('beforeend', modalHTML);
  
  // Add event listeners
  document.getElementById('close-edit-user-modal').addEventListener('click', closeEditUserModal);
  document.getElementById('cancel-edit-user-btn').addEventListener('click', closeEditUserModal);
  document.getElementById('edit-user-form').addEventListener('submit', updateUser);
}

// Close edit user modal
function closeEditUserModal() {
  const modal = document.getElementById('edit-user-modal');
  if (modal) {
    modal.remove();
  }
}

// Update user
function updateUser(e) {
  e.preventDefault();
  
  const userId = document.getElementById('edit-user-id').value;
  const name = document.getElementById('edit-user-name').value;
  const email = document.getElementById('edit-user-email').value;
  const password = document.getElementById('edit-user-password').value;
  
  // Get existing users
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    showToast('User not found', 'error');
    return;
  }
  
  // Check if email is changed and already exists
  if (email !== users[userIndex].email && users.some(u => u.email === email)) {
    showToast('Email is already in use', 'error');
    return;
  }
  
  // Update user
  users[userIndex].name = name;
  users[userIndex].email = email;
  
  // Update password if provided
  if (password) {
    users[userIndex].password = password;
  }
  
  // Save to localStorage
  saveUsers(users);
  
  // Close modal
  closeEditUserModal();
  
  // Reload users tab
  loadUsersData();
  
  // Show success message
  showToast('User updated successfully');
}

// Delete user
function deleteUser(userId) {
  // Show confirmation dialog
  if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
    return;
  }
  
  // Get existing users
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    showToast('User not found', 'error');
    return;
  }
  
  // Remove user
  users.splice(userIndex, 1);
  
  // Save to localStorage
  saveUsers(users);
  
  // Reload users tab
  loadUsersData();
  
  // Update stats
  loadAdminStats();
  
  // Show success message
  showToast('User deleted successfully');
}

// Get registration status class
function getRegistrationStatusClass(status) {
  switch (status) {
    case 'pending':
      return 'yellow';
    case 'approved':
      return 'green';
    case 'rejected':
      return 'red';
    default:
      return 'gray';
  }
}

// Make functions accessible globally
window.loadAdminPage = loadAdminPage;

