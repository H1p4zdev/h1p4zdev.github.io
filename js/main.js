// Main JavaScript file
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the app
  initApp();
});

// Initialize app
function initApp() {
  // Set up event listeners
  setupEventListeners();
  
  // Initialize navigation
  setupNavigation();
  
  // Check auth state
  checkAuthState();
  
  // Start countdown timer
  startCountdown();
  
  // Show notification banner
  setTimeout(showNotification, 2000);
  
  // Load initial data
  loadInitialData();
  
  // Check for saved theme
  loadSavedTheme();
}

// Set up event listeners
function setupEventListeners() {
  // Mobile menu toggle
  document.getElementById('mobile-menu-button').addEventListener('click', toggleMobileMenu);
  
  // Dark mode toggles
  document.getElementById('dark-mode-toggle').addEventListener('change', toggleDarkMode);
  document.getElementById('dark-mode-toggle-mobile').addEventListener('change', toggleDarkMode);
  
  // Close notification
  document.getElementById('close-notification').addEventListener('click', () => {
    document.getElementById('notification-banner').classList.add('hidden');
  });
}

// Toggle mobile menu
function toggleMobileMenu() {
  const mobileMenu = document.getElementById('mobile-menu');
  mobileMenu.classList.toggle('hidden');
}

// Toggle dark mode
function toggleDarkMode(e) {
  const isDarkMode = e.target.checked;
  
  // Sync the other toggle
  if (e.target.id === 'dark-mode-toggle') {
    document.getElementById('dark-mode-toggle-mobile').checked = isDarkMode;
  } else {
    document.getElementById('dark-mode-toggle').checked = isDarkMode;
  }
  
  // Apply dark mode
  if (isDarkMode) {
    document.body.classList.add('dark');
    document.body.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark');
    document.body.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  }
}

// Setup navigation
function setupNavigation() {
  // Get all navigation links
  const navLinks = document.querySelectorAll('[data-navigate]');
  
  // Add click event to each link
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.getAttribute('data-navigate'));
    });
  });
}

// Navigate to a page
function navigateTo(pageId) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });
  
  // Show selected page
  document.getElementById(pageId).classList.add('active');
  
  // Update mobile nav
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
  });
  
  // Find the corresponding nav item and activate it
  document.querySelectorAll('.nav-item').forEach(item => {
    if (item.getAttribute('data-navigate') === pageId) {
      item.classList.add('active');
    }
  });
  
  // Scroll to top
  window.scrollTo(0, 0);
  
  // Close mobile menu if open
  document.getElementById('mobile-menu').classList.add('hidden');
  
  // Special actions for specific pages
  if (pageId === 'tournaments') {
    loadTournaments();
  } else if (pageId === 'register') {
    loadRegisterPage();
  } else if (pageId === 'results') {
    loadResults();
  } else if (pageId === 'admin') {
    loadAdminPage();
  }
}

// Start countdown timer
function startCountdown() {
  // Get the next upcoming tournament
  const tournaments = getTournaments();
  const upcomingTournament = tournaments.find(t => t.status === 'upcoming');
  
  if (upcomingTournament) {
    const targetDate = new Date(upcomingTournament.timestamp);
    
    function updateCountdown() {
      const now = new Date().getTime();
      const distance = targetDate - now;
      
      // If the countdown is over, show 0's
      if (distance < 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        return;
      }
      
      // Time calculations
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);
      
      // Display the results
      document.getElementById('days').textContent = days.toString().padStart(2, '0');
      document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
      document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
      document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
    }
    
    // Update countdown immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
}

// Show notification banner
function showNotification() {
  const tournaments = getTournaments();
  const upcomingTournament = tournaments.find(t => t.status === 'upcoming');
  
  if (upcomingTournament) {
    const tournamentDate = new Date(upcomingTournament.timestamp);
    const now = new Date();
    const diffTime = tournamentDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0 && diffDays <= 7) {
      document.getElementById('notification-text').textContent = 
        `${upcomingTournament.name} tournament starts in ${diffDays} day${diffDays > 1 ? 's' : ''}!`;
      document.getElementById('notification-banner').classList.remove('hidden');
    }
  }
}

// Load saved theme
function loadSavedTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.getElementById('dark-mode-toggle').checked = true;
    document.getElementById('dark-mode-toggle-mobile').checked = true;
    document.body.classList.add('dark');
    document.body.setAttribute('data-theme', 'dark');
  }
}

// Load initial data
function loadInitialData() {
  // Initialize data in localStorage if not exists
  if (!localStorage.getItem('tournaments')) {
    initializeData();
  }
  
  // Load recent tournaments on home page
  loadRecentTournaments();
  
  // Load testimonials
  loadTestimonials();
}

// Initialize sample data
function initializeData() {
  // Sample tournaments
  const sampleTournaments = [
    {
      id: 't1',
      name: 'Battle Royale Championship',
      date: 'July 15, 2023',
      timestamp: new Date('2023-07-15T18:00:00').getTime(),
      time: '6:00 PM UTC',
      status: 'upcoming',
      prize: '$5,000',
      prizeAmount: 5000,
      fee: '$25',
      feeCategory: 'medium',
      teams: '12/32',
      maxTeams: 32,
      currentTeams: 12,
      rules: 'Standard Battle Royale rules. 4 matches will be played with points for placement and eliminations. Each team must have 4 players.',
      format: 'Battle Royale format with 4 matches across 2 maps (Bermuda and Kalahari). Points are awarded for placement (15 for 1st, 12 for 2nd, 10 for 3rd, etc.) and each elimination (1 point). The team with the highest combined points wins.',
      image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      id: 't2',
      name: 'Pro League Invitational',
      date: 'Currently Active',
      timestamp: new Date('2023-06-25T14:00:00').getTime(),
      endTimestamp: new Date('2023-07-08T20:00:00').getTime(),
      time: 'Finals: July 8',
      status: 'ongoing',
      prize: '$10,000',
      prizeAmount: 10000,
      fee: '$75',
      feeCategory: 'high',
      teams: '16/16',
      maxTeams: 16,
      currentTeams: 16,
      rules: 'Invitation-only tournament for professional teams. Double elimination bracket with best-of-three matches.',
      format: 'Professional invitational with a double elimination bracket. Matches are best-of-three in Clash Squad mode. The finals will be a best-of-five series with the team from the winner\'s bracket starting with a 1-0 advantage.',
      image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      id: 't3',
      name: 'Newbie Knockout',
      date: 'July 20, 2023',
      timestamp: new Date('2023-07-20T14:00:00').getTime(),
      time: '2:00 PM UTC',
      status: 'upcoming',
      prize: '$1,000',
      prizeAmount: 1000,
      fee: 'Free',
      feeCategory: 'free',
      teams: '8/32',
      maxTeams: 32,
      currentTeams: 8,
      rules: 'For new players only. Teams must have at least 2 members who have never competed in a tournament before. Squad mode with 3 matches.',
      format: 'Beginner-friendly tournament with 3 matches in squad mode. Special rules include no use of specific weapons (AWM, Groza) and extra points for reviving teammates to encourage teamwork over aggressive play. All matches on Bermuda.',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300'
    },
    {
      id: 't4',
      name: 'Squad Showdown',
      date: 'June 5, 2023',
      timestamp: new Date('2023-06-05T15:00:00').getTime(),
      time: 'Completed',
      status: 'completed',
      prize: '$3,000',
      prizeAmount: 3000,
      fee: '$10',
      feeCategory: 'low',
      teams: '32/32',
      maxTeams: 32,
      currentTeams: 32,
      rules: 'This action-packed tournament featured 32 teams in intense squad battles.',
      format: 'Standard tournament format with 3 matches. Points are awarded for placement and eliminations. The team with the highest points at the end wins.',
      image: 'https://pixabay.com/get/gc0fcbc5862ba283c8f73480ceaf8abf42ed8fd269e7efdedd496db7f722065d148c7b9c6ae9acf496939fcd129a98aa36496d3a1b76bf078b77a906566a467e1_1280.jpg',
      winners: [
        { position: 1, team: 'Death Rangers', prize: '$1,500' },
        { position: 2, team: 'Ninja Warriors', prize: '$1,000' },
        { position: 3, team: 'Ghost Snipers', prize: '$500' }
      ]
    },
    {
      id: 't5',
      name: 'Season Finale Showdown',
      date: 'June 15, 2023',
      timestamp: new Date('2023-06-15T16:00:00').getTime(),
      time: 'Completed',
      status: 'completed',
      prize: '$10,000',
      prizeAmount: 10000,
      fee: '$25',
      feeCategory: 'medium',
      teams: '48/48',
      maxTeams: 48,
      currentTeams: 48,
      rules: 'The ultimate battle where 48 teams competed for a massive prize pool of $10,000.',
      format: 'Tournament with 4 matches across different maps. Teams earn points based on placement and eliminations.',
      image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400',
      winners: [
        { position: 1, team: 'Elite Warriors', prize: '$5,000', kills: 42, points: 210 },
        { position: 2, team: 'Phoenix Squad', prize: '$3,000', kills: 36, points: 185 },
        { position: 3, team: 'Shadow Hunters', prize: '$1,500', kills: 30, points: 164 }
      ],
      stats: {
        mostKills: { player: 'SnipeKing99', value: 12, percent: 80 },
        highestDamage: { team: 'Elite Warriors', value: 3540, percent: 95 },
        mostBooyahs: { team: 'Elite Warriors', value: 3, percent: 75 },
        avgSurvivalTime: { value: '14m 23s', percent: 65 }
      }
    }
  ];
  
  // Sample testimonials
  const testimonials = [
    {
      id: 1,
      name: 'RapidSniper98',
      rating: 5,
      text: 'The organization was flawless. From registration to the final match, everything ran smoothly. Will definitely join again!'
    },
    {
      id: 2,
      name: 'HeadHunterGirl',
      rating: 4.5,
      text: 'The competition was intense but fair. Made some great connections with other teams. The prize distribution was quick and transparent.'
    },
    {
      id: 3,
      name: 'EliteSquadLeader',
      rating: 5,
      text: 'As a team captain, I appreciate how well the rules were enforced. The custom lobbies worked perfectly and the live streaming gave us great exposure!'
    }
  ];
  
  // Store in localStorage
  localStorage.setItem('tournaments', JSON.stringify(sampleTournaments));
  localStorage.setItem('testimonials', JSON.stringify(testimonials));
  localStorage.setItem('registrations', JSON.stringify([]));
  localStorage.setItem('users', JSON.stringify([]));
}

// Load recent tournaments on home page
function loadRecentTournaments() {
  const tournaments = getTournaments();
  const container = document.getElementById('recent-tournaments-container');
  
  // Get the two most recent tournaments
  const recentTournaments = tournaments
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 2);
  
  // Clear container
  container.innerHTML = '';
  
  // Add each tournament
  recentTournaments.forEach(tournament => {
    const statusClass = getStatusClass(tournament.status);
    const actionButton = getActionButton(tournament);
    
    const html = `
      <div class="material-card flex flex-col h-full">
        <div class="h-48 rounded-t-lg overflow-hidden">
          <img src="${tournament.image}" alt="${tournament.name}" class="w-full h-full object-cover">
        </div>
        <div class="p-4 flex-grow">
          <div class="flex justify-between items-start mb-2">
            <h3 class="font-heading font-medium text-lg">${tournament.name}</h3>
            <span class="px-2 py-1 bg-${statusClass}-100 text-${statusClass}-800 text-xs rounded-full">${capitalizeFirstLetter(tournament.status)}</span>
          </div>
          <p class="text-text-secondary-light text-sm mb-4">
            ${tournament.rules}
          </p>
          <div class="flex items-center text-sm mb-1">
            <span class="material-icons text-primary text-sm mr-2">calendar_today</span>
            <span>${tournament.date}</span>
          </div>
          <div class="flex items-center text-sm mb-1">
            <span class="material-icons text-primary text-sm mr-2">monetization_on</span>
            <span>${tournament.prize} Prize Pool</span>
          </div>
          <div class="flex items-center text-sm">
            <span class="material-icons text-primary text-sm mr-2">people</span>
            <span>${tournament.teams}</span>
          </div>
        </div>
        <div class="p-4 pt-0 mt-auto">
          ${actionButton}
        </div>
      </div>
    `;
    
    container.innerHTML += html;
  });
  
  // Add click handlers to buttons
  document.querySelectorAll('[data-tournament-action]').forEach(button => {
    button.addEventListener('click', (e) => {
      const action = button.getAttribute('data-tournament-action');
      const tournamentId = button.getAttribute('data-tournament-id');
      
      if (action === 'details') {
        openTournamentDetails(tournamentId);
      } else if (action === 'register') {
        navigateTo('register');
        document.getElementById('tournament-selector').value = tournamentId;
        updateTournamentDetails();
      } else if (action === 'results') {
        navigateTo('results');
      }
    });
  });
}

// Load testimonials
function loadTestimonials() {
  const testimonials = JSON.parse(localStorage.getItem('testimonials') || '[]');
  const container = document.getElementById('testimonials-container');
  
  // Clear container
  container.innerHTML = '';
  
  // Add each testimonial
  testimonials.forEach(testimonial => {
    const stars = getStarsHTML(testimonial.rating);
    
    const html = `
      <div class="material-card">
        <div class="flex items-start mb-4">
          <div class="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
            <span class="material-icons text-gray-500">person</span>
          </div>
          <div>
            <h3 class="font-medium">${testimonial.name}</h3>
            <div class="flex text-yellow-400">
              ${stars}
            </div>
          </div>
        </div>
        <p class="text-text-secondary-light">
          "${testimonial.text}"
        </p>
      </div>
    `;
    
    container.innerHTML += html;
  });
}

// Get stars HTML based on rating
function getStarsHTML(rating) {
  let starsHtml = '';
  
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      starsHtml += '<span class="material-icons text-sm">star</span>';
    } else if (i - 0.5 <= rating) {
      starsHtml += '<span class="material-icons text-sm">star_half</span>';
    } else {
      starsHtml += '<span class="material-icons text-sm">star_border</span>';
    }
  }
  
  return starsHtml;
}

// Get tournaments from localStorage
function getTournaments() {
  return JSON.parse(localStorage.getItem('tournaments') || '[]');
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

// Get action button based on tournament status
function getActionButton(tournament) {
  if (tournament.status === 'upcoming') {
    return `
      <button class="material-btn-primary w-full" data-tournament-action="register" data-tournament-id="${tournament.id}">
        Register Now
      </button>
    `;
  } else if (tournament.status === 'ongoing') {
    return `
      <button class="material-btn-outlined w-full" data-tournament-action="details" data-tournament-id="${tournament.id}">
        View Details
      </button>
    `;
  } else {
    return `
      <button class="material-btn-outlined w-full" data-tournament-action="results" data-tournament-id="${tournament.id}">
        View Results
      </button>
    `;
  }
}

// Makes the navigateTo function globally available
window.navigateTo = navigateTo;
