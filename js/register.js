// Registration page functionality

// Load register page
function loadRegisterPage() {
  // Load tournament options
  loadTournamentOptions();
  
  // Set up event listeners
  setupRegistrationEventListeners();
}

// Load tournament options for the selector
function loadTournamentOptions() {
  const tournaments = getTournaments();
  const selector = document.getElementById('tournament-selector');
  
  // Filter only upcoming and ongoing tournaments
  const availableTournaments = tournaments.filter(t => 
    t.status === 'upcoming' || t.status === 'ongoing'
  );
  
  // Clear previous options (keep the placeholder)
  const placeholder = selector.querySelector('option[value=""]');
  selector.innerHTML = '';
  selector.appendChild(placeholder);
  
  // Add tournament options
  availableTournaments.forEach(tournament => {
    const option = document.createElement('option');
    option.value = tournament.id;
    option.textContent = `${tournament.name} (${tournament.date})`;
    selector.appendChild(option);
  });
}

// Set up event listeners for registration form
function setupRegistrationEventListeners() {
  // Tournament selector
  const tournamentSelector = document.getElementById('tournament-selector');
  if (tournamentSelector) {
    tournamentSelector.addEventListener('change', updateTournamentDetails);
  }
  
  // Team size selector
  const teamSizeSelector = document.getElementById('team-size');
  if (teamSizeSelector) {
    teamSizeSelector.addEventListener('change', updateTeamMembersFields);
  }
  
  // Registration form
  const registrationForm = document.getElementById('registration-form');
  if (registrationForm) {
    registrationForm.addEventListener('submit', handleRegistrationSubmit);
  }
  
  // Download confirmation button
  const downloadConfirmation = document.getElementById('download-confirmation');
  if (downloadConfirmation) {
    downloadConfirmation.addEventListener('click', downloadRegistrationConfirmation);
  }
}

// Update tournament details when selection changes
function updateTournamentDetails() {
  const tournamentId = document.getElementById('tournament-selector').value;
  const detailsContainer = document.getElementById('tournament-details');
  const feeNotice = document.getElementById('registration-fee-notice');
  
  if (tournamentId) {
    const tournaments = getTournaments();
    const tournament = tournaments.find(t => t.id === tournamentId);
    
    if (tournament) {
      // Update details
      document.getElementById('selected-tournament-name').textContent = tournament.name;
      
      const statusElement = document.getElementById('selected-tournament-status');
      statusElement.textContent = capitalizeFirstLetter(tournament.status);
      
      const statusClass = getStatusClass(tournament.status);
      statusElement.className = `px-2 py-1 bg-${statusClass}-100 text-${statusClass}-800 text-xs rounded-full`;
      
      document.getElementById('selected-tournament-date').textContent = tournament.date;
      document.getElementById('selected-tournament-time').textContent = tournament.time;
      document.getElementById('selected-tournament-prize').textContent = tournament.prize;
      document.getElementById('selected-tournament-fee').textContent = tournament.fee;
      document.getElementById('selected-tournament-rules').textContent = tournament.rules;
      
      // Show details container
      detailsContainer.classList.remove('hidden');
      
      // Show fee notice if not free
      if (tournament.fee !== 'Free' && tournament.feeCategory !== 'free') {
        document.getElementById('fee-amount').textContent = tournament.fee;
        feeNotice.classList.remove('hidden');
      } else {
        feeNotice.classList.add('hidden');
      }
    }
  } else {
    detailsContainer.classList.add('hidden');
    feeNotice.classList.add('hidden');
  }
}

// Update team members fields based on team size
function updateTeamMembersFields() {
  const teamSize = parseInt(document.getElementById('team-size').value);
  const teamMembersSection = document.getElementById('team-members-section');
  const teamMembersContainer = document.getElementById('team-members-container');
  
  // Clear existing fields
  teamMembersContainer.innerHTML = '';
  
  if (teamSize > 1) {
    // Add fields for team members (excluding captain)
    for (let i = 1; i < teamSize; i++) {
      const memberHtml = `
        <div class="mb-6">
          <h4 class="font-medium mb-2">Team Member ${i}</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <div class="material-input">
              <input type="text" id="member-${i}-name" placeholder=" " required>
              <label for="member-${i}-name">Full Name</label>
            </div>
            <div class="material-input">
              <input type="text" id="member-${i}-ff-id" placeholder=" " required>
              <label for="member-${i}-ff-id">Free Fire ID</label>
            </div>
          </div>
        </div>
      `;
      teamMembersContainer.insertAdjacentHTML('beforeend', memberHtml);
    }
    
    teamMembersSection.classList.remove('hidden');
  } else {
    teamMembersSection.classList.add('hidden');
  }
}

// Handle registration form submission
function handleRegistrationSubmit(e) {
  e.preventDefault();
  
  // Validate form
  if (!validateRegistrationForm()) {
    return;
  }
  
  const progress = document.getElementById('submit-progress');
  
  // Show progress
  progress.style.width = '30%';
  
  setTimeout(() => {
    progress.style.width = '70%';
    
    setTimeout(() => {
      progress.style.width = '100%';
      
      // Save registration
      saveRegistration();
      
      // Hide form and show success message
      document.getElementById('registration-form').closest('.material-card').classList.add('hidden');
      document.getElementById('registration-success').classList.remove('hidden');
    }, 500);
  }, 500);
}

// Validate registration form
function validateRegistrationForm() {
  // Check tournament selection
  const tournamentId = document.getElementById('tournament-selector').value;
  if (!tournamentId) {
    showToast('Please select a tournament', 'error');
    return false;
  }
  
  // Check captain details
  const captainName = document.getElementById('captain-name').value;
  const captainFfId = document.getElementById('captain-ff-id').value;
  const captainEmail = document.getElementById('captain-email').value;
  const captainPhone = document.getElementById('captain-phone').value;
  
  if (!captainName || !captainFfId || !captainEmail || !captainPhone) {
    showToast('Please fill in all captain details', 'error');
    return false;
  }
  
  // Validate email
  if (!validateEmail(captainEmail)) {
    showToast('Please enter a valid email address', 'error');
    return false;
  }
  
  // Validate Free Fire ID
  if (!validateFreeFireId(captainFfId)) {
    showToast('Please enter a valid Free Fire ID (6-10 digits)', 'error');
    return false;
  }
  
  // Validate phone
  if (!validatePhone(captainPhone)) {
    showToast('Please enter a valid phone number', 'error');
    return false;
  }
  
  // Check team details
  const teamName = document.getElementById('team-name').value;
  const teamSize = document.getElementById('team-size').value;
  
  if (!teamName || !teamSize) {
    showToast('Please fill in all team details', 'error');
    return false;
  }
  
  // Check team members if applicable
  if (parseInt(teamSize) > 1) {
    for (let i = 1; i < parseInt(teamSize); i++) {
      const memberName = document.getElementById(`member-${i}-name`).value;
      const memberFfId = document.getElementById(`member-${i}-ff-id`).value;
      
      if (!memberName || !memberFfId) {
        showToast(`Please fill in all details for team member ${i}`, 'error');
        return false;
      }
      
      // Validate Free Fire ID
      if (!validateFreeFireId(memberFfId)) {
        showToast(`Please enter a valid Free Fire ID for team member ${i} (6-10 digits)`, 'error');
        return false;
      }
    }
  }
  
  // Check agreements
  const termsAgree = document.getElementById('terms-agree').checked;
  const ageVerify = document.getElementById('age-verify').checked;
  
  if (!termsAgree || !ageVerify) {
    showToast('Please agree to all terms and conditions', 'error');
    return false;
  }
  
  return true;
}

// Save registration to localStorage
function saveRegistration() {
  const tournamentId = document.getElementById('tournament-selector').value;
  const tournaments = getTournaments();
  const tournament = tournaments.find(t => t.id === tournamentId);
  
  // Get team members
  const teamSize = parseInt(document.getElementById('team-size').value);
  const teamMembers = [];
  
  if (teamSize > 1) {
    for (let i = 1; i < teamSize; i++) {
      teamMembers.push({
        name: document.getElementById(`member-${i}-name`).value,
        ffId: document.getElementById(`member-${i}-ff-id`).value
      });
    }
  }
  
  const registration = {
    id: generateId('reg_'),
    tournamentId: tournamentId,
    tournamentName: tournament ? tournament.name : 'Unknown Tournament',
    teamName: document.getElementById('team-name').value,
    teamSize: teamSize,
    teamExperience: document.getElementById('team-experience').value,
    captain: {
      name: document.getElementById('captain-name').value,
      ffId: document.getElementById('captain-ff-id').value,
      email: document.getElementById('captain-email').value,
      phone: document.getElementById('captain-phone').value,
    },
    captainEmail: document.getElementById('captain-email').value, // For easy filtering
    teamMembers: teamMembers,
    timestamp: new Date().toISOString(),
    status: 'pending' // pending, approved, rejected
  };
  
  // Get existing registrations or initialize empty array
  const existingRegistrations = getRegistrations();
  existingRegistrations.push(registration);
  
  // Save to localStorage
  saveRegistrations(existingRegistrations);
  
  // Update tournament registration count
  if (tournament) {
    // Parse current/max teams
    const [current, max] = tournament.teams.split('/').map(n => parseInt(n));
    
    // Update current teams count
    tournament.currentTeams = current + 1;
    tournament.teams = `${current + 1}/${max}`;
    
    // Update tournaments in localStorage
    const updatedTournaments = tournaments.map(t => 
      t.id === tournamentId ? tournament : t
    );
    
    saveTournaments(updatedTournaments);
  }
}

// Download registration confirmation
function downloadRegistrationConfirmation() {
  // Get the most recent registration
  const registrations = getRegistrations();
  const latestRegistration = registrations[registrations.length - 1];
  
  if (!latestRegistration) {
    showToast('No registration found', 'error');
    return;
  }
  
  // Create confirmation text
  const confirmationText = `
Free Fire Tournament Registration Confirmation

Tournament: ${latestRegistration.tournamentName}
Registration Date: ${new Date(latestRegistration.timestamp).toLocaleString()}
Registration ID: ${latestRegistration.id}

Team Information:
- Team Name: ${latestRegistration.teamName}
- Team Size: ${latestRegistration.teamSize} player(s)
- Experience: ${latestRegistration.teamExperience || 'None specified'}

Captain Information:
- Name: ${latestRegistration.captain.name}
- Free Fire ID: ${latestRegistration.captain.ffId}
- Email: ${latestRegistration.captain.email}
- Phone: ${latestRegistration.captain.phone}

${latestRegistration.teamMembers.length > 0 ? 'Team Members:' : ''}
${latestRegistration.teamMembers.map((member, index) => 
  `- Member ${index + 1}: ${member.name} (FF ID: ${member.ffId})`
).join('\n')}

Status: ${capitalizeFirstLetter(latestRegistration.status)}

Thank you for registering for the tournament!
Please keep this confirmation for your records.
  `;
  
  // Create a blob and download
  const blob = new Blob([confirmationText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `tournament-registration-${latestRegistration.id}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Make functions accessible globally
window.updateTournamentDetails = updateTournamentDetails;
window.updateTeamMembersFields = updateTeamMembersFields;
window.downloadRegistrationConfirmation = downloadRegistrationConfirmation;
