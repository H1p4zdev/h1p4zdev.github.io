// Tournaments page functionality

// Load tournaments
function loadTournaments() {
  const tournaments = getTournaments();
  const container = document.getElementById('tournaments-container');
  
  // Set up filter handlers
  document.getElementById('apply-filters').addEventListener('click', filterTournaments);
  document.getElementById('reset-filters').addEventListener('click', resetFilters);
  
  // Setup modal close handlers
  document.getElementById('close-modal').addEventListener('click', closeModal);
  document.getElementById('close-modal-btn').addEventListener('click', closeModal);
  
  // Clear container
  container.innerHTML = '';
  
  // Add each tournament
  tournaments.forEach(tournament => {
    const statusClass = getStatusClass(tournament.status);
    
    const html = `
      <div class="material-card tournament-card" data-tournament-id="${tournament.id}" data-status="${tournament.status}" data-fee="${tournament.feeCategory}" data-prize="${tournament.prizeAmount}">
        <div class="flex flex-col md:flex-row">
          <div class="w-full md:w-1/3 h-48 md:h-auto rounded-t-lg md:rounded-l-lg md:rounded-t-none overflow-hidden">
            <img src="${tournament.image}" alt="${tournament.name}" class="w-full h-full object-cover">
          </div>
          <div class="w-full md:w-2/3 p-4">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-heading font-medium text-lg">${tournament.name}</h3>
              <span class="px-2 py-1 bg-${statusClass}-100 text-${statusClass}-800 text-xs rounded-full">${capitalizeFirstLetter(tournament.status)}</span>
            </div>
            <p class="text-text-secondary-light text-sm mb-4">
              ${tournament.rules}
            </p>
            <div class="grid grid-cols-2 gap-2 mb-4">
              <div class="flex items-center text-sm">
                <span class="material-icons text-primary text-sm mr-2">calendar_today</span>
                <span>${tournament.date}</span>
              </div>
              <div class="flex items-center text-sm">
                <span class="material-icons text-primary text-sm mr-2">schedule</span>
                <span>${tournament.time}</span>
              </div>
              <div class="flex items-center text-sm">
                <span class="material-icons text-primary text-sm mr-2">monetization_on</span>
                <span>${tournament.prize} Prize</span>
              </div>
              <div class="flex items-center text-sm">
                <span class="material-icons text-primary text-sm mr-2">payments</span>
                <span>${tournament.fee} Entry Fee</span>
              </div>
            </div>
            <div class="flex justify-between mt-4">
              <button class="material-btn-outlined tournament-details-btn" data-tournament-id="${tournament.id}">
                <span class="material-icons mr-1">info</span>
                Details
              </button>
              ${getTournamentActionButton(tournament)}
            </div>
          </div>
        </div>
      </div>
    `;
    
    container.innerHTML += html;
  });
  
  // Add event listeners for details buttons
  document.querySelectorAll('.tournament-details-btn').forEach(button => {
    button.addEventListener('click', () => {
      const tournamentId = button.getAttribute('data-tournament-id');
      openTournamentDetails(tournamentId);
    });
  });
  
  // Add event listeners for action buttons
  document.querySelectorAll('.tournament-action-btn').forEach(button => {
    button.addEventListener('click', () => {
      const tournamentId = button.getAttribute('data-tournament-id');
      const action = button.getAttribute('data-action');
      
      if (action === 'register') {
        navigateTo('register');
        document.getElementById('tournament-selector').value = tournamentId;
        updateTournamentDetails();
      } else if (action === 'results') {
        navigateTo('results');
      }
    });
  });
}

// Filter tournaments
function filterTournaments() {
  const statusFilter = document.getElementById('status-filter').value;
  const feeFilter = document.getElementById('entry-fee-filter').value;
  const sortBy = document.getElementById('sort-by').value;
  
  const tournamentCards = document.querySelectorAll('.tournament-card');
  let visibleCount = 0;
  
  tournamentCards.forEach(card => {
    let shouldShow = true;
    
    // Apply status filter
    if (statusFilter && card.dataset.status !== statusFilter) {
      shouldShow = false;
    }
    
    // Apply fee filter
    if (feeFilter && card.dataset.fee !== feeFilter) {
      shouldShow = false;
    }
    
    // Show or hide the card
    if (shouldShow) {
      card.style.display = 'block';
      visibleCount++;
    } else {
      card.style.display = 'none';
    }
  });
  
  // Show "no results" message if needed
  const noTournamentsEl = document.getElementById('no-tournaments');
  if (visibleCount === 0) {
    noTournamentsEl.classList.remove('hidden');
  } else {
    noTournamentsEl.classList.add('hidden');
  }
  
  // Apply sorting if selected
  if (sortBy) {
    const container = document.getElementById('tournaments-container');
    const cards = Array.from(document.querySelectorAll('.tournament-card'));
    
    // Sort cards based on selected option
    const sortedCards = sortCards(cards, sortBy);
    
    // Re-append cards in sorted order
    sortedCards.forEach(card => {
      container.appendChild(card);
    });
  }
}

// Sort tournament cards
function sortCards(cards, sortBy) {
  return cards.sort((a, b) => {
    switch (sortBy) {
      case 'date-asc':
        return parseFloat(a.dataset.tournament?.timestamp || 0) - parseFloat(b.dataset.tournament?.timestamp || 0);
      case 'date-desc':
        return parseFloat(b.dataset.tournament?.timestamp || 0) - parseFloat(a.dataset.tournament?.timestamp || 0);
      case 'prize-asc':
        return parseFloat(a.dataset.prize || 0) - parseFloat(b.dataset.prize || 0);
      case 'prize-desc':
        return parseFloat(b.dataset.prize || 0) - parseFloat(a.dataset.prize || 0);
      default:
        return 0;
    }
  });
}

// Reset filters
function resetFilters() {
  document.getElementById('status-filter').value = '';
  document.getElementById('entry-fee-filter').value = '';
  document.getElementById('sort-by').value = '';
  
  document.querySelectorAll('.tournament-card').forEach(card => {
    card.style.display = 'block';
  });
  
  document.getElementById('no-tournaments').classList.add('hidden');
}

// Open tournament details modal
function openTournamentDetails(tournamentId) {
  const tournaments = getTournaments();
  const tournament = tournaments.find(t => t.id === tournamentId);
  
  if (tournament) {
    const modal = document.getElementById('tournament-details-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    const modalActionBtn = document.getElementById('modal-action-btn');
    
    modalTitle.textContent = tournament.name;
    
    // Build content
    const statusClass = getStatusClass(tournament.status);
    let content = `
      <div class="mb-4">
        <span class="px-2 py-1 bg-${statusClass}-100 text-${statusClass}-800 text-xs rounded-full">${capitalizeFirstLetter(tournament.status)}</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <h3 class="font-medium mb-2">Tournament Details</h3>
          <div class="space-y-2">
            <div class="flex items-center text-sm">
              <span class="material-icons text-primary text-sm mr-2">calendar_today</span>
              <span>${tournament.date}</span>
            </div>
            <div class="flex items-center text-sm">
              <span class="material-icons text-primary text-sm mr-2">schedule</span>
              <span>${tournament.time}</span>
            </div>
            <div class="flex items-center text-sm">
              <span class="material-icons text-primary text-sm mr-2">monetization_on</span>
              <span>${tournament.prize} Prize Pool</span>
            </div>
            <div class="flex items-center text-sm">
              <span class="material-icons text-primary text-sm mr-2">payments</span>
              <span>${tournament.fee} Entry Fee</span>
            </div>
            <div class="flex items-center text-sm">
              <span class="material-icons text-primary text-sm mr-2">people</span>
              <span>${tournament.teams} Teams Registered</span>
            </div>
          </div>
        </div>
        <div>
          <h3 class="font-medium mb-2">Rules</h3>
          <p class="text-sm text-text-secondary-light">${tournament.rules}</p>
        </div>
      </div>
      <div class="border-t border-gray-200 pt-4">
        <h3 class="font-medium mb-2">Format</h3>
        <p class="text-sm text-text-secondary-light mb-4">
          ${tournament.format}
        </p>
      </div>
    `;
    
    modalContent.innerHTML = content;
    
    // Update action button
    if (tournament.status === 'upcoming') {
      modalActionBtn.textContent = 'Register';
      modalActionBtn.onclick = function() {
        closeModal();
        navigateTo('register');
        document.getElementById('tournament-selector').value = tournamentId;
        updateTournamentDetails();
      };
    } else if (tournament.status === 'ongoing') {
      modalActionBtn.textContent = 'Watch Live';
      modalActionBtn.onclick = function() {
        window.open('https://www.youtube.com/results?search_query=free+fire+tournament+live', '_blank');
      };
    } else {
      modalActionBtn.textContent = 'View Results';
      modalActionBtn.onclick = function() {
        closeModal();
        navigateTo('results');
      };
    }
    
    // Show modal
    modal.classList.remove('hidden');
  }
}

// Close tournament details modal
function closeModal() {
  document.getElementById('tournament-details-modal').classList.add('hidden');
}

// Get tournament action button
function getTournamentActionButton(tournament) {
  if (tournament.status === 'upcoming') {
    return `
      <button class="material-btn-primary tournament-action-btn" data-tournament-id="${tournament.id}" data-action="register">
        <span class="material-icons mr-1">how_to_reg</span>
        Register
      </button>
    `;
  } else if (tournament.status === 'ongoing') {
    return `
      <button class="material-btn-secondary tournament-action-btn" data-tournament-id="${tournament.id}" data-action="watch">
        <span class="material-icons mr-1">live_tv</span>
        Watch Live
      </button>
    `;
  } else {
    return `
      <button class="material-btn-primary tournament-action-btn" data-tournament-id="${tournament.id}" data-action="results">
        <span class="material-icons mr-1">emoji_events</span>
        View Results
      </button>
    `;
  }
}

// Make openTournamentDetails available globally
window.openTournamentDetails = openTournamentDetails;
