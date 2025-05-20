import {
  User,
  InsertUser,
  Tournament,
  InsertTournament,
  Team,
  InsertTeam,
  TeamMember,
  InsertTeamMember,
  TournamentRegistration,
  InsertTournamentRegistration,
  Match,
  InsertMatch,
  MatchParticipant,
  InsertMatchParticipant,
  UserProfile,
  InsertUserProfile,
  UserActivity,
  InsertUserActivity
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Tournament methods
  createTournament(tournament: InsertTournament): Promise<Tournament>;
  getTournament(id: number): Promise<Tournament | undefined>;
  getAllTournaments(): Promise<Tournament[]>;
  
  // Team methods
  createTeam(team: InsertTeam): Promise<Team>;
  getTeam(id: number): Promise<Team | undefined>;
  getAllTeams(): Promise<Team[]>;
  
  // Team Member methods
  addTeamMember(teamMember: InsertTeamMember): Promise<TeamMember>;
  getTeamMembers(teamId: number): Promise<TeamMember[]>;
  
  // Tournament Registration methods
  registerForTournament(registration: InsertTournamentRegistration): Promise<TournamentRegistration>;
  getTournamentRegistrations(tournamentId: number): Promise<TournamentRegistration[]>;
  
  // Match methods
  createMatch(match: InsertMatch): Promise<Match>;
  getTournamentMatches(tournamentId: number): Promise<Match[]>;
  
  // Match Participant methods
  addMatchParticipant(participant: InsertMatchParticipant): Promise<MatchParticipant>;
  getMatchParticipants(matchId: number): Promise<MatchParticipant[]>;
  
  // User Profile methods
  createUserProfile(profile: InsertUserProfile): Promise<UserProfile>;
  getUserProfile(userId: number): Promise<UserProfile | undefined>;
  
  // User Activity methods
  createUserActivity(activity: InsertUserActivity): Promise<UserActivity>;
  getUserActivities(userId: number): Promise<UserActivity[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tournaments: Map<number, Tournament>;
  private teams: Map<number, Team>;
  private teamMembers: Map<number, TeamMember>;
  private tournamentRegistrations: Map<number, TournamentRegistration>;
  private matches: Map<number, Match>;
  private matchParticipants: Map<number, MatchParticipant>;
  private userProfiles: Map<number, UserProfile>;
  private userActivities: Map<number, UserActivity>;
  
  private userCurrentId: number;
  private tournamentCurrentId: number;
  private teamCurrentId: number;
  private teamMemberCurrentId: number;
  private tournamentRegistrationCurrentId: number;
  private matchCurrentId: number;
  private matchParticipantCurrentId: number;
  private userProfileCurrentId: number;
  private userActivityCurrentId: number;

  constructor() {
    // Initialize maps
    this.users = new Map();
    this.tournaments = new Map();
    this.teams = new Map();
    this.teamMembers = new Map();
    this.tournamentRegistrations = new Map();
    this.matches = new Map();
    this.matchParticipants = new Map();
    this.userProfiles = new Map();
    this.userActivities = new Map();
    
    // Initialize ID counters
    this.userCurrentId = 1;
    this.tournamentCurrentId = 1;
    this.teamCurrentId = 1;
    this.teamMemberCurrentId = 1;
    this.tournamentRegistrationCurrentId = 1;
    this.matchCurrentId = 1;
    this.matchParticipantCurrentId = 1;
    this.userProfileCurrentId = 1;
    this.userActivityCurrentId = 1;
    
    // Add some sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample Users
    const user1 = this.createUser({
      username: "player1",
      password: "password123",
      email: "player1@example.com",
      displayName: "Pro Player 1",
      isAdmin: false
    });
    
    const user2 = this.createUser({
      username: "player2",
      password: "password123",
      email: "player2@example.com",
      displayName: "Pro Player 2",
      isAdmin: false
    });

    // Sample Tournaments
    const tournament1 = this.createTournament({
      name: "FIRE LEGENDS CUP",
      description: "The ultimate Free Fire tournament",
      format: "Battle Royale - Squads",
      teamSize: 4,
      maxParticipants: 128,
      entryFee: 200,
      prizePool: 50000,
      startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
      registrationStartDate: new Date().toISOString(),
      registrationEndDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      registrationOpen: true,
      rules: [
        "All players must be at least 16 years old.",
        "Teams must check in 30 minutes before their scheduled match time.",
        "Use of unauthorized programs or hacks will result in immediate disqualification.",
        "Tournament officials' decisions are final in all disputes.",
        "All matches will be played on the latest version of Free Fire."
      ],
      createdBy: user1.id
    });
    
    const tournament2 = this.createTournament({
      name: "BATTLEGROUND MASTERS",
      description: "Weekly Free Fire tournament for pros",
      format: "Battle Royale - Squads",
      teamSize: 4,
      maxParticipants: 96,
      entryFee: 0,
      prizePool: 25000,
      startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
      endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days from now
      registrationStartDate: new Date().toISOString(),
      registrationEndDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
      registrationOpen: true,
      rules: [
        "No emulators allowed, only mobile devices.",
        "All players must use their registered in-game name.",
        "Teams must be present 15 minutes before match start.",
        "Bad sportsmanship will result in disqualification.",
        "Matches will be played in custom rooms with tournament password."
      ],
      createdBy: user1.id
    });
    
    // Sample Teams
    const team1 = this.createTeam({
      name: "Phoenix Squad",
      captain: user1.id,
      tournamentsPlayed: 5,
      badges: ["PRO"]
    });
    
    const team2 = this.createTeam({
      name: "Ghost Warriors",
      captain: user2.id,
      tournamentsPlayed: 3,
      badges: []
    });
    
    const team3 = this.createTeam({
      name: "Elite Snipers",
      captain: user1.id,
      tournamentsPlayed: 8,
      badges: ["CHAMPION"]
    });
    
    // Sample Team Members
    this.addTeamMember({
      teamId: team1.id,
      userId: user1.id
    });
    
    this.addTeamMember({
      teamId: team2.id,
      userId: user2.id
    });
    
    this.addTeamMember({
      teamId: team3.id,
      userId: user1.id
    });
    
    // Sample Tournament Registrations
    this.registerForTournament({
      tournamentId: tournament1.id,
      teamId: team1.id,
      paymentStatus: "completed",
      paymentId: "pay_123456"
    });
    
    this.registerForTournament({
      tournamentId: tournament1.id,
      teamId: team2.id,
      paymentStatus: "completed",
      paymentId: "pay_123457"
    });
    
    this.registerForTournament({
      tournamentId: tournament1.id,
      teamId: team3.id,
      paymentStatus: "completed",
      paymentId: "pay_123458"
    });
    
    // Sample Matches
    const match1 = this.createMatch({
      tournamentId: tournament1.id,
      round: 1,
      matchNumber: 1,
      startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(), // 30 minutes after start
      status: "completed",
      results: {
        winner: team1.id,
        mvp: user1.id
      }
    });
    
    const match2 = this.createMatch({
      tournamentId: tournament1.id,
      round: 1,
      matchNumber: 2,
      startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(), // 30 minutes after start
      status: "completed",
      results: {
        winner: team3.id,
        mvp: user1.id
      }
    });
    
    // Sample Match Participants
    this.addMatchParticipant({
      matchId: match1.id,
      teamId: team1.id,
      position: 1,
      points: 250,
      kills: 12
    });
    
    this.addMatchParticipant({
      matchId: match1.id,
      teamId: team2.id,
      position: 5,
      points: 25,
      kills: 4
    });
    
    this.addMatchParticipant({
      matchId: match2.id,
      teamId: team3.id,
      position: 1,
      points: 250,
      kills: 15
    });
    
    this.addMatchParticipant({
      matchId: match2.id,
      teamId: team1.id,
      position: 2,
      points: 150,
      kills: 8
    });
    
    // Sample User Profiles
    this.createUserProfile({
      userId: user1.id,
      level: 42,
      rank: "Pro Player",
      verified: true,
      tournamentsWon: 12,
      matches: 128,
      tournaments: 26,
      kills: 3800,
      stats: {
        winRate: 24,
        kdRatio: 3.2,
        headshotPercentage: 38,
        avgSurvivalTime: "14:22"
      },
      achievements: [
        {
          name: "Tournament Champion",
          icon: "ri-trophy-fill",
          colorClass: "from-amber-400 to-amber-600"
        },
        {
          name: "Killing Machine",
          icon: "ri-sword-fill",
          colorClass: "from-indigo-400 to-indigo-600"
        },
        {
          name: "Team Player",
          icon: "ri-team-fill",
          colorClass: "from-emerald-400 to-emerald-600"
        },
        {
          name: "Community Hero",
          icon: "ri-heart-fill",
          colorClass: "from-rose-400 to-rose-600"
        }
      ]
    });
    
    this.createUserProfile({
      userId: user2.id,
      level: 28,
      rank: "Advanced",
      verified: false,
      tournamentsWon: 3,
      matches: 76,
      tournaments: 12,
      kills: 1200,
      stats: {
        winRate: 15,
        kdRatio: 2.1,
        headshotPercentage: 25,
        avgSurvivalTime: "10:34"
      },
      achievements: [
        {
          name: "Sharpshooter",
          icon: "ri-aim-line",
          colorClass: "from-amber-400 to-amber-600"
        },
        {
          name: "Survivor",
          icon: "ri-shield-star-line",
          colorClass: "from-emerald-400 to-emerald-600"
        }
      ]
    });
    
    // Sample User Activities
    this.createUserActivity({
      userId: user1.id,
      text: "Won the Weekend Warriors Tournament",
      icon: "ri-trophy-line",
      iconColor: "text-primary"
    });
    
    this.createUserActivity({
      userId: user1.id,
      text: "Joined Phoenix Squad team",
      icon: "ri-team-line",
      iconColor: "text-secondary"
    });
    
    this.createUserActivity({
      userId: user1.id,
      text: "Reached Level 42",
      icon: "ri-medal-line",
      iconColor: "text-warning"
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userCurrentId++;
    const newUser: User = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }
  
  // Tournament methods
  async createTournament(tournament: InsertTournament): Promise<Tournament> {
    const id = this.tournamentCurrentId++;
    const newTournament: Tournament = { 
      ...tournament, 
      id,
      participantsCount: 0 // Start with 0 participants
    };
    this.tournaments.set(id, newTournament);
    return newTournament;
  }
  
  async getTournament(id: number): Promise<Tournament | undefined> {
    const tournament = this.tournaments.get(id);
    if (tournament) {
      // Calculate participants count
      const registrations = Array.from(this.tournamentRegistrations.values())
        .filter(reg => reg.tournamentId === id);
      
      return {
        ...tournament,
        participantsCount: registrations.length
      };
    }
    return undefined;
  }
  
  async getAllTournaments(): Promise<Tournament[]> {
    const tournaments = Array.from(this.tournaments.values());
    
    // Calculate participants count for each tournament
    return tournaments.map(tournament => {
      const registrations = Array.from(this.tournamentRegistrations.values())
        .filter(reg => reg.tournamentId === tournament.id);
      
      return {
        ...tournament,
        participantsCount: registrations.length
      };
    });
  }
  
  // Team methods
  async createTeam(team: InsertTeam): Promise<Team> {
    const id = this.teamCurrentId++;
    const newTeam: Team = { ...team, id };
    this.teams.set(id, newTeam);
    return newTeam;
  }
  
  async getTeam(id: number): Promise<Team | undefined> {
    return this.teams.get(id);
  }
  
  async getAllTeams(): Promise<Team[]> {
    return Array.from(this.teams.values());
  }
  
  // Team Member methods
  async addTeamMember(teamMember: InsertTeamMember): Promise<TeamMember> {
    const id = this.teamMemberCurrentId++;
    const joinedAt = new Date().toISOString();
    const newTeamMember: TeamMember = { ...teamMember, id, joinedAt };
    this.teamMembers.set(id, newTeamMember);
    return newTeamMember;
  }
  
  async getTeamMembers(teamId: number): Promise<TeamMember[]> {
    return Array.from(this.teamMembers.values())
      .filter(member => member.teamId === teamId);
  }
  
  // Tournament Registration methods
  async registerForTournament(registration: InsertTournamentRegistration): Promise<TournamentRegistration> {
    const id = this.tournamentRegistrationCurrentId++;
    const registeredAt = new Date().toISOString();
    const newRegistration: TournamentRegistration = { ...registration, id, registeredAt };
    this.tournamentRegistrations.set(id, newRegistration);
    
    // Update participants count for the tournament
    const tournament = await this.getTournament(registration.tournamentId);
    if (tournament) {
      this.tournaments.set(tournament.id, {
        ...tournament,
        participantsCount: tournament.participantsCount + 1
      });
    }
    
    return newRegistration;
  }
  
  async getTournamentRegistrations(tournamentId: number): Promise<TournamentRegistration[]> {
    return Array.from(this.tournamentRegistrations.values())
      .filter(registration => registration.tournamentId === tournamentId);
  }
  
  // Match methods
  async createMatch(match: InsertMatch): Promise<Match> {
    const id = this.matchCurrentId++;
    
    // Get tournament name for the match
    const tournament = await this.getTournament(match.tournamentId);
    const tournamentName = tournament ? tournament.name : "Unknown Tournament";
    
    const newMatch: Match = { 
      ...match, 
      id,
      tournamentName,
      pointsEarned: 0,
      position: 0,
      date: new Date().toISOString()
    };
    
    this.matches.set(id, newMatch);
    return newMatch;
  }
  
  async getTournamentMatches(tournamentId: number): Promise<Match[]> {
    return Array.from(this.matches.values())
      .filter(match => match.tournamentId === tournamentId);
  }
  
  // Match Participant methods
  async addMatchParticipant(participant: InsertMatchParticipant): Promise<MatchParticipant> {
    const id = this.matchParticipantCurrentId++;
    const newParticipant: MatchParticipant = { ...participant, id };
    this.matchParticipants.set(id, newParticipant);
    return newParticipant;
  }
  
  async getMatchParticipants(matchId: number): Promise<MatchParticipant[]> {
    return Array.from(this.matchParticipants.values())
      .filter(participant => participant.matchId === matchId);
  }
  
  // User Profile methods
  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    const id = this.userProfileCurrentId++;
    const updatedAt = new Date().toISOString();
    const newProfile: UserProfile = { ...profile, id, updatedAt };
    this.userProfiles.set(id, newProfile);
    return newProfile;
  }
  
  async getUserProfile(userId: number): Promise<UserProfile | undefined> {
    return Array.from(this.userProfiles.values())
      .find(profile => profile.userId === userId);
  }
  
  // User Activity methods
  async createUserActivity(activity: InsertUserActivity): Promise<UserActivity> {
    const id = this.userActivityCurrentId++;
    const timestamp = new Date().toISOString();
    const newActivity: UserActivity = { ...activity, id, timestamp };
    this.userActivities.set(id, newActivity);
    return newActivity;
  }
  
  async getUserActivities(userId: number): Promise<UserActivity[]> {
    return Array.from(this.userActivities.values())
      .filter(activity => activity.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}

export const storage = new MemStorage();
