// Results page functionality

// Load results page
function loadResults() {
  // Set up filter
  document.getElementById('results-filter').addEventListener('change', filterResults);
  
  // Load tournament results
  loadTournamentResults();
}

// Load tournament results
function loadTournamentResults() {
  const tournaments = getTournaments();
  const container = document.getElementById('results-container');
  
  // Filter only completed tournaments
  const completedTournaments = tournaments.filter(t => t.status === 'completed');
  
  // Clear container
  container.innerHTML = '';
  
  // Sort tournaments by date (most recent first)
  const sortedTournaments = completedTournaments.sort((a, b) => b.timestamp - a.timestamp);
  
  // Add each tournament result
  sortedTournaments.forEach(tournament => {
    if (tournament.winners) {
      // Create detailed result card for tournaments with winners
      const html = createDetailedResultCard(tournament);
      container.innerHTML += html;
    } else {
      // Create simple result card for tournaments without detailed winners
      const html = createSimpleResultCard(tournament);
      container.innerHTML += html;
    }
  });
  
  // Add event listeners for buttons
  setupResultEventListeners();
}

// Create detailed result card
function createDetailedResultCard(tournament) {
  // Check if it's the Season Finale tournament (first one with full stats)
  if (tournament.id === 't5' && tournament.stats) {
    return createSeasonFinaleCard(tournament);
  }
  
  // Standard detailed card
  const winners = tournament.winners;
  
  return `
    <div class="material-card">
      <div class="mb-4">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h3 class="font-heading font-medium text-xl">${tournament.name}</h3>
          <div class="mt-2 md:mt-0 text-sm flex items-center">
            <span class="material-icons text-primary text-sm mr-1">calendar_today</span>
            <span>${tournament.date}</span>
          </div>
        </div>
        <div class="flex flex-wrap gap-4 mb-4">
          <div class="px-3 py-1 bg-primary/10 rounded-full text-sm flex items-center">
            <span class="material-icons text-primary text-sm mr-1">monetization_on</span>
            <span>${tournament.prize} Prize Pool</span>
          </div>
          <div class="px-3 py-1 bg-primary/10 rounded-full text-sm flex items-center">
            <span class="material-icons text-primary text-sm mr-1">people</span>
            <span>${tournament.teams}</span>
          </div>
          <div class="px-3 py-1 bg-primary/10 rounded-full text-sm flex items-center">
            <span class="material-icons text-primary text-sm mr-1">movie</span>
            <span>3 Matches</span>
          </div>
        </div>
      </div>
      
      <!-- Top 3 in compact view -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        ${winners.map(winner => {
          let bgClass, iconClass;
          
          switch(winner.position) {
            case 1:
              bgClass = 'bg-yellow-50';
              iconClass = 'text-yellow-500';
              break;
            case 2:
              bgClass = 'bg-gray-100';
              iconClass = 'text-gray-500';
              break;
            case 3:
              bgClass = 'bg-orange-50';
              iconClass = 'text-orange-500';
              break;
            default:
              bgClass = 'bg-gray-50';
              iconClass = 'text-gray-400';
          }
          
          return `
            <div class="material-card ${bgClass} p-4 flex items-center">
              <div class="w-12 h-12 rounded-full ${bgClass} flex items-center justify-center mr-4">
                <span class="material-icons ${iconClass}">emoji_events</span>
              </div>
              <div>
                <span class="text-sm font-medium">${winner.position}${getOrdinalSuffix(winner.position)} Place</span>
                <h4 class="font-heading font-bold">${winner.team}</h4>
                <p class="text-primary font-medium text-sm">${winner.prize}</p>
              </div>
            </div>
          `;
        }).join('')}
      </div>
      
      <div class="flex justify-end">
        <button class="material-btn-outlined view-details-btn" data-tournament-id="${tournament.id}">
          <span class="material-icons mr-2">visibility</span>
          View Details
        </button>
      </div>
    </div>
  `;
}

// Create Season Finale card (with full stats)
function createSeasonFinaleCard(tournament) {
  const winners = tournament.winners;
  const stats = tournament.stats;
  
  return `
    <div class="material-card">
      <div class="mb-4">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h3 class="font-heading font-medium text-xl">${tournament.name}</h3>
          <div class="mt-2 md:mt-0 text-sm flex items-center">
            <span class="material-icons text-primary text-sm mr-1">calendar_today</span>
            <span>${tournament.date}</span>
          </div>
        </div>
        <div class="flex flex-wrap gap-4 mb-4">
          <div class="px-3 py-1 bg-primary/10 rounded-full text-sm flex items-center">
            <span class="material-icons text-primary text-sm mr-1">monetization_on</span>
            <span>${tournament.prize} Prize Pool</span>
          </div>
          <div class="px-3 py-1 bg-primary/10 rounded-full text-sm flex items-center">
            <span class="material-icons text-primary text-sm mr-1">people</span>
            <span>${tournament.teams}</span>
          </div>
          <div class="px-3 py-1 bg-primary/10 rounded-full text-sm flex items-center">
            <span class="material-icons text-primary text-sm mr-1">movie</span>
            <span>4 Matches</span>
          </div>
        </div>
      </div>
      
      <!-- Winner Podium -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <!-- 2nd Place -->
        <div class="material-card bg-gray-100 order-2 md:order-1 flex flex-col items-center py-6">
          <div class="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-2">
            <span class="material-icons text-gray-500">emoji_events</span>
          </div>
          <span class="text-xl font-medium">2nd Place</span>
          <h4 class="font-heading font-bold text-lg">${winners[1].team}</h4>
          <p class="text-primary font-medium">${winners[1].prize}</p>
          <p class="text-sm text-text-secondary-light mt-2">
            ${winners[1].kills} Kills • ${winners[1].points} Points
          </p>
        </div>
        
        <!-- 1st Place -->
        <div class="material-card bg-yellow-50 order-1 md:order-2 flex flex-col items-center py-8">
          <div class="w-20 h-20 rounded-full bg-yellow-100 flex items-center justify-center mb-2">
            <span class="material-icons text-yellow-500 text-3xl">emoji_events</span>
          </div>
          <span class="text-2xl font-medium">Champion</span>
          <h4 class="font-heading font-bold text-xl">${winners[0].team}</h4>
          <p class="text-primary font-bold">${winners[0].prize}</p>
          <p class="text-sm text-text-secondary-light mt-2">
            ${winners[0].kills} Kills • ${winners[0].points} Points
          </p>
          <img src="https://pixabay.com/get/g1893b1058ee7ddf27210a9a01832adfbdb55ed25632e5a29e6dd3f6f8eaa837c2df70b8471070ba59dd21732cf5913c7024629e16460a2261f61dd42a49eda77_1280.jpg" alt="Championship trophy" class="w-32 h-auto mt-4 rounded-lg">
        </div>
        
        <!-- 3rd Place -->
        <div class="material-card bg-orange-50 order-3 flex flex-col items-center py-6">
          <div class="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-2">
            <span class="material-icons text-orange-500">emoji_events</span>
          </div>
          <span class="text-xl font-medium">3rd Place</span>
          <h4 class="font-heading font-bold text-lg">${winners[2].team}</h4>
          <p class="text-primary font-medium">${winners[2].prize}</p>
          <p class="text-sm text-text-secondary-light mt-2">
            ${winners[2].kills} Kills • ${winners[2].points} Points
          </p>
        </div>
      </div>
      
      <!-- Media & Stats -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h4 class="font-medium text-lg mb-3">Tournament Highlights</h4>
          <div class="aspect-video bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
            <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450" alt="Tournament highlights" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <button class="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center watch-highlight-btn">
                <span class="material-icons text-white text-3xl">play_arrow</span>
              </button>
            </div>
          </div>
        </div>
        <div>
          <h4 class="font-medium text-lg mb-3">Tournament Statistics</h4>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span>Most Kills (Single Match)</span>
              <span class="font-medium">${stats.mostKills.player} (${stats.mostKills.value})</span>
            </div>
            <div class="h-1 bg-gray-200 rounded-full">
              <div class="h-1 bg-primary rounded-full" style="width: ${stats.mostKills.percent}%"></div>
            </div>
            
            <div class="flex justify-between items-center">
              <span>Highest Damage</span>
              <span class="font-medium">${stats.highestDamage.team} (${stats.highestDamage.value})</span>
            </div>
            <div class="h-1 bg-gray-200 rounded-full">
              <div class="h-1 bg-primary rounded-full" style="width: ${stats.highestDamage.percent}%"></div>
            </div>
            
            <div class="flex justify-between items-center">
              <span>Most Booyahs</span>
              <span class="font-medium">${stats.mostBooyahs.team} (${stats.mostBooyahs.value})</span>
            </div>
            <div class="h-1 bg-gray-200 rounded-full">
              <div class="h-1 bg-primary rounded-full" style="width: ${stats.mostBooyahs.percent}%"></div>
            </div>
            
            <div class="flex justify-between items-center">
              <span>Average Survival Time</span>
              <span class="font-medium">${stats.avgSurvivalTime.value}</span>
            </div>
            <div class="h-1 bg-gray-200 rounded-full">
              <div class="h-1 bg-primary rounded-full" style="width: ${stats.avgSurvivalTime.percent}%"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="mt-6 flex justify-end">
        <button class="material-btn-outlined download-results-btn" data-tournament-id="${tournament.id}">
          <span class="material-icons mr-2">download</span>
          Full Results
        </button>
      </div>
    </div>
  `;
}

// Create simple result card
function createSimpleResultCard(tournament) {
  return `
    <div class="material-card">
      <div class="mb-4">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h3 class="font-heading font-medium text-xl">${tournament.name}</h3>
          <div class="mt-2 md:mt-0 text-sm flex items-center">
            <span class="material-icons text-primary text-sm mr-1">calendar_today</span>
            <span>${tournament.date}</span>
          </div>
        </div>
        <div class="flex flex-wrap gap-4 mb-4">
          <div class="px-3 py-1 bg-primary/10 rounded-full text-sm flex items-center">
            <span class="material-icons text-primary text-sm mr-1">monetization_on</span>
            <span>${tournament.prize} Prize Pool</span>
          </div>
          <div class="px-3 py-1 bg-primary/10 rounded-full text-sm flex items-center">
            <span class="material-icons text-primary text-sm mr-1">people</span>
            <span>${tournament.teams}</span>
          </div>
        </div>
        <p class="text-text-secondary-light mb-4">
          This tournament has been completed. Detailed results will be available soon.
        </p>
      </div>
      
      <div class="flex justify-end">
        <button class="material-btn-outlined view-details-btn" data-tournament-id="${tournament.id}">
          <span class="material-icons mr-2">visibility</span>
          View Details
        </button>
      </div>
    </div>
  `;
}

// Set up event listeners for buttons
function setupResultEventListeners() {
  // View details buttons
  document.querySelectorAll('.view-details-btn').forEach(button => {
    button.addEventListener('click', () => {
      const tournamentId = button.getAttribute('data-tournament-id');
      viewTournamentDetails(tournamentId);
    });
  });
  
  // Download results buttons
  document.querySelectorAll('.download-results-btn').forEach(button => {
    button.addEventListener('click', () => {
      const tournamentId = button.getAttribute('data-tournament-id');
      downloadTournamentResults(tournamentId);
    });
  });
  
  // Watch highlight buttons
  document.querySelectorAll('.watch-highlight-btn').forEach(button => {
    button.addEventListener('click', () => {
      window.open('https://www.youtube.com/results?search_query=free+fire+tournament+highlights', '_blank');
    });
  });
}

// Filter results
function filterResults() {
  const filterValue = document.getElementById('results-filter').value;
  const tournaments = getTournaments();
  const container = document.getElementById('results-container');
  
  // Filter only completed tournaments
  let completedTournaments = tournaments.filter(t => t.status === 'completed');
  
  // Apply additional filters
  if (filterValue === 'recent') {
    // Sort by date (most recent first)
    completedTournaments = completedTournaments.sort((a, b) => b.timestamp - a.timestamp);
  } else if (filterValue === 'prize') {
    // Sort by prize (highest first)
    completedTournaments = completedTournaments.sort((a, b) => b.prizeAmount - a.prizeAmount);
  } else if (filterValue === 'teams') {
    // Sort by number of teams (most first)
    completedTournaments = completedTournaments.sort((a, b) => b.currentTeams - a.currentTeams);
  }
  
  // Clear container
  container.innerHTML = '';
  
  // Add each tournament result
  completedTournaments.forEach(tournament => {
    if (tournament.winners) {
      // Create detailed result card for tournaments with winners
      const html = createDetailedResultCard(tournament);
      container.innerHTML += html;
    } else {
      // Create simple result card for tournaments without detailed winners
      const html = createSimpleResultCard(tournament);
      container.innerHTML += html;
    }
  });
  
  // Add event listeners for buttons
  setupResultEventListeners();
}

// View tournament details
function viewTournamentDetails(tournamentId) {
  const tournaments = getTournaments();
  const tournament = tournaments.find(t => t.id === tournamentId);
  
  if (tournament) {
    // If we have winners data, show a modal with detailed results
    if (tournament.winners) {
      showResultsModal(tournament);
    } else {
      // Otherwise, just show a toast
      showToast('Detailed results are not available for this tournament yet.');
    }
  }
}

// Show results modal
function showResultsModal(tournament) {
  alert(`Detailed results for ${tournament.name}:\n\n${tournament.winners.map(winner => `${winner.position}. ${winner.team} - ${winner.prize}`).join('\n')}`);
}

// Download tournament results
function downloadTournamentResults(tournamentId) {
  const tournaments = getTournaments();
  const tournament = tournaments.find(t => t.id === tournamentId);
  
  if (tournament && tournament.winners) {
    // Create CSV data for winning teams
    const csvData = [
      {
        Position: 'Rank',
        Team: 'Team Name',
        Prize: 'Prize',
        Kills: 'Kills',
        Points: 'Total Points'
      },
      ...tournament.winners.map(winner => ({
        Position: winner.position,
        Team: winner.team,
        Prize: winner.prize,
        Kills: winner.kills || 'N/A',
        Points: winner.points || 'N/A'
      }))
    ];
    
    // Download as CSV
    downloadCSV(csvData, `${tournament.name.replace(/\s+/g, '-').toLowerCase()}-results.csv`);
  } else {
    showToast('Detailed results are not available for download yet.');
  }
}

// Get ordinal suffix for number
function getOrdinalSuffix(num) {
  const j = num % 10;
  const k = num % 100;
  
  if (j === 1 && k !== 11) {
    return 'st';
  }
  if (j === 2 && k !== 12) {
    return 'nd';
  }
  if (j === 3 && k !== 13) {
    return 'rd';
  }
  return 'th';
}

// Make functions available globally
window.viewTournamentDetails = viewTournamentDetails;
window.downloadTournamentResults = downloadTournamentResults;
