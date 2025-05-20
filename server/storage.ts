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
} from "@shared/schema"; // Assuming @shared is a path alias configured (e.g., in tsconfig.json)

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
    this.users = new Map();
    this.tournaments = new Map();
    this.teams = new Map();
    this.teamMembers = new Map();
    this.tournamentRegistrations = new Map();
    this.matches = new Map();
    this.matchParticipants = new Map();
    this.userProfiles = new Map();
    this.userActivities = new Map();

    this.userCurrentId = 1;
    this.tournamentCurrentId = 1;
    this.teamCurrentId = 1;
    this.teamMemberCurrentId = 1;
    this.tournamentRegistrationCurrentId = 1;
    this.matchCurrentId = 1;
    this.matchParticipantCurrentId = 1;
    this.userProfileCurrentId = 1;
    this.userActivityCurrentId = 1;

    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample Users
    const user1 = this._createUserSync({
      username: "player1",
      password: "password123", // Note: Passwords should be hashed in a real app
      email: "player1@example.com",
      displayName: "Pro Player 1",
      isAdmin: false
    });

    const user2 = this._createUserSync({
      username: "player2",
      password: "password123",
      email: "player2@example.com",
      displayName: "Pro Player 2",
      isAdmin: false
    });

    // Sample Tournaments
    const tournament1 = this._createTournamentSync({
      name: "FIRE LEGENDS CUP",
      description: "The ultimate Free Fire tournament",
      format: "Battle Royale - Squads",
      teamSize: 4,
      maxParticipants: 128,
      entryFee: 200,
      prizePool: 50000,
      startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      registrationStartDate: new Date().toISOString(),
      registrationEndDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
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

    this._createTournamentSync({
      name: "BATTLEGROUND MASTERS",
      description: "Weekly Free Fire tournament for pros",
      format: "Battle Royale - Squads",
      teamSize: 4,
      maxParticipants: 96,
      entryFee: 0,
      prizePool: 25000,
      startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
      registrationStartDate: new Date().toISOString(),
      registrationEndDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
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
    const team1 = this._createTeamSync({
      name: "Phoenix Squad",
      captain: user1.id,
      tournamentsPlayed: 5,
      badges: ["PRO"]
    });

    const team2 = this._createTeamSync({
      name: "Ghost Warriors",
      captain: user2.id,
      tournamentsPlayed: 3,
      badges: []
    });

    const team3 = this._createTeamSync({
      name: "Elite Snipers",
      captain: user1.id,
      tournamentsPlayed: 8,
      badges: ["CHAMPION"]
    });

    // Sample Team Members
    this._addTeamMemberSync({ teamId: team1.id, userId: user1.id });
    this._addTeamMemberSync({ teamId: team2.id, userId: user2.id });
    this._addTeamMemberSync({ teamId: team3.id, userId: user1.id });

    // Sample Tournament Registrations
    this._registerForTournamentSync({ tournamentId: tournament1.id, teamId: team1.id, paymentStatus: "completed", paymentId: "pay_123456" });
    this._registerForTournamentSync({ tournamentId: tournament1.id, teamId: team2.id, paymentStatus: "completed", paymentId: "pay_123457" });
    this._registerForTournamentSync({ tournamentId: tournament1.id, teamId: team3.id, paymentStatus: "completed", paymentId: "pay_123458" });

    // Sample Matches
    const match1 = this._createMatchSync({
      tournamentId: tournament1.id,
      round: 1,
      matchNumber: 1,
      startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
      status: "completed",
      results: { winner: team1.id, mvp: user1.id }
    });

    const match2 = this._createMatchSync({
      tournamentId: tournament1.id,
      round: 1,
      matchNumber: 2,
      startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
      status: "completed",
      results: { winner: team3.id, mvp: user1.id }
    });

    // Sample Match Participants
    this._addMatchParticipantSync({ matchId: match1.id, teamId: team1.id, position: 1, points: 250, kills: 12 });
    this._addMatchParticipantSync({ matchId: match1.id, teamId: team2.id, position: 5, points: 25, kills: 4 });
    this._addMatchParticipantSync({ matchId: match2.id, teamId: team3.id, position: 1, points: 250, kills: 15 });
    this._addMatchParticipantSync({ matchId: match2.id, teamId: team1.id, position: 2, points: 150, kills: 8 });

    // Sample User Profiles
    this._createUserProfileSync({
      userId: user1.id, level: 42, rank: "Pro Player", verified: true, tournamentsWon: 12, matches: 128, tournaments: 26, kills: 3800,
      stats: { winRate: 24, kdRatio: 3.2, headshotPercentage: 38, avgSurvivalTime: "14:22" },
      achievements: [
        { name: "Tournament Champion", icon: "ri-trophy-fill", colorClass: "from-amber-400 to-amber-600" },
        { name: "Killing Machine", icon: "ri-sword-fill", colorClass: "from-indigo-400 to-indigo-600" },
        { name: "Team Player", icon: "ri-team-fill", colorClass: "from-emerald-400 to-emerald-600" },
        { name: "Community Hero", icon: "ri-heart-fill", colorClass: "from-rose-400 to-rose-600" }
      ]
    });
    this._createUserProfileSync({
      userId: user2.id, level: 28, rank: "Advanced", verified: false, tournamentsWon: 3, matches: 76, tournaments: 12, kills: 1200,
      stats: { winRate: 15, kdRatio: 2.1, headshotPercentage: 25, avgSurvivalTime: "10:34" },
      achievements: [
        { name: "Sharpshooter", icon: "ri-aim-line", colorClass: "from-amber-400 to-amber-600" },
        { name: "Survivor", icon: "ri-shield-star-line", colorClass: "from-emerald-400 to-emerald-600" }
      ]
    });

    // Sample User Activities
    this._createUserActivitySync({ userId: user1.id, text: "Won the Weekend Warriors Tournament", icon: "ri-trophy-line", iconColor: "text-primary" });
    this._createUserActivitySync({ userId: user1.id, text: "Joined Phoenix Squad team", icon: "ri-team-line", iconColor: "text-secondary" });
    this._createUserActivitySync({ userId: user1.id, text: "Reached Level 42", icon: "ri-medal-line", iconColor: "text-warning" });
  }

  // --- Private Synchronous Methods for Internal Use (e.g., Sample Data) ---
  private _createUserSync(user: InsertUser): User {
    const id = this.userCurrentId++;
    const newUser: User = { ...user, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }; // Assuming User schema has createdAt/updatedAt
    this.users.set(id, newUser);
    return newUser;
  }

  private _getTournamentSync(id: number): Tournament | undefined {
    const tournament = this.tournaments.get(id);
    if (tournament) {
      const registrations = Array.from(this.tournamentRegistrations.values())
        .filter(reg => reg.tournamentId === id);
      return { ...tournament, participantsCount: registrations.length };
    }
    return undefined;
  }

  private _createTournamentSync(tournament: InsertTournament): Tournament {
    const id = this.tournamentCurrentId++;
    const newTournament: Tournament = { ...tournament, id, participantsCount: 0, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    this.tournaments.set(id, newTournament);
    return newTournament;
  }

  private _createTeamSync(team: InsertTeam): Team {
    const id = this.teamCurrentId++;
    const newTeam: Team = { ...team, id, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    this.teams.set(id, newTeam);
    return newTeam;
  }

  private _addTeamMemberSync(teamMember: InsertTeamMember): TeamMember {
    const id = this.teamMemberCurrentId++;
    const joinedAt = new Date().toISOString();
    const newTeamMember: TeamMember = { ...teamMember, id, joinedAt };
    this.teamMembers.set(id, newTeamMember);
    return newTeamMember;
  }

  private _registerForTournamentSync(registration: InsertTournamentRegistration): TournamentRegistration {
    const id = this.tournamentRegistrationCurrentId++;
    const registeredAt = new Date().toISOString();
    const newRegistration: TournamentRegistration = { ...registration, id, registeredAt };
    this.tournamentRegistrations.set(id, newRegistration);

    const tournament = this._getTournamentSync(registration.tournamentId);
    if (tournament) {
      this.tournaments.set(tournament.id, {
        ...tournament,
        participantsCount: tournament.participantsCount + 1
      });
    }
    return newRegistration;
  }

  private _createMatchSync(match: InsertMatch): Match {
    const id = this.matchCurrentId++;
    const tournament = this._getTournamentSync(match.tournamentId);
    const tournamentName = tournament ? tournament.name : "Unknown Tournament";
    const newMatch: Match = {
      ...match, id, tournamentName,
      pointsEarned: 0, position: 0, date: new Date().toISOString(), // Assuming schema defaults
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString()
    };
    this.matches.set(id, newMatch);
    return newMatch;
  }

  private _addMatchParticipantSync(participant: InsertMatchParticipant): MatchParticipant {
    const id = this.matchParticipantCurrentId++;
    const newParticipant: MatchParticipant = { ...participant, id };
    this.matchParticipants.set(id, newParticipant);
    return newParticipant;
  }

  private _createUserProfileSync(profile: InsertUserProfile): UserProfile {
    const id = this.userProfileCurrentId++;
    const updatedAt = new Date().toISOString();
    const newProfile: UserProfile = { ...profile, id, updatedAt, createdAt: new Date().toISOString() };
    this.userProfiles.set(id, newProfile);
    return newProfile;
  }

  private _createUserActivitySync(activity: InsertUserActivity): UserActivity {
    const id = this.userActivityCurrentId++;
    const timestamp = new Date().toISOString();
    const newActivity: UserActivity = { ...activity, id, timestamp };
    this.userActivities.set(id, newActivity);
    return newActivity;
  }

  // --- Public Asynchronous Methods (IStorage Implementation) ---
  async getUser(id: number): Promise<User | undefined> {
    return Promise.resolve(this.users.get(id));
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Promise.resolve(Array.from(this.users.values()).find(
      (user) => user.username === username,
    ));
  }

  async createUser(user: InsertUser): Promise<User> {
    return Promise.resolve(this._createUserSync(user));
  }

  async createTournament(tournament: InsertTournament): Promise<Tournament> {
    return Promise.resolve(this._createTournamentSync(tournament));
  }

  async getTournament(id: number): Promise<Tournament | undefined> {
    return Promise.resolve(this._getTournamentSync(id));
  }

  async getAllTournaments(): Promise<Tournament[]> {
    const tournaments = Array.from(this.tournaments.values());
    const result = tournaments.map(t => this._getTournamentSync(t.id) as Tournament); // Cast as Tournament, as _getTournamentSync won't return undefined for existing IDs
    return Promise.resolve(result);
  }

  async createTeam(team: InsertTeam): Promise<Team> {
    return Promise.resolve(this._createTeamSync(team));
  }

  async getTeam(id: number): Promise<Team | undefined> {
    return Promise.resolve(this.teams.get(id));
  }

  async getAllTeams(): Promise<Team[]> {
    return Promise.resolve(Array.from(this.teams.values()));
  }

  async addTeamMember(teamMember: InsertTeamMember): Promise<TeamMember> {
    return Promise.resolve(this._addTeamMemberSync(teamMember));
  }

  async getTeamMembers(teamId: number): Promise<TeamMember[]> {
    return Promise.resolve(Array.from(this.teamMembers.values())
      .filter(member => member.teamId === teamId));
  }

  async registerForTournament(registration: InsertTournamentRegistration): Promise<TournamentRegistration> {
    return Promise.resolve(this._registerForTournamentSync(registration));
  }

  async getTournamentRegistrations(tournamentId: number): Promise<TournamentRegistration[]> {
    return Promise.resolve(Array.from(this.tournamentRegistrations.values())
      .filter(reg => reg.tournamentId === tournamentId));
  }

  async createMatch(match: InsertMatch): Promise<Match> {
    return Promise.resolve(this._createMatchSync(match));
  }

  async getTournamentMatches(tournamentId: number): Promise<Match[]> {
    return Promise.resolve(Array.from(this.matches.values())
      .filter(m => m.tournamentId === tournamentId));
  }

  async addMatchParticipant(participant: InsertMatchParticipant): Promise<MatchParticipant> {
    return Promise.resolve(this._addMatchParticipantSync(participant));
  }

  async getMatchParticipants(matchId: number): Promise<MatchParticipant[]> {
    return Promise.resolve(Array.from(this.matchParticipants.values())
      .filter(p => p.matchId === matchId));
  }

  async createUserProfile(profile: InsertUserProfile): Promise<UserProfile> {
    return Promise.resolve(this._createUserProfileSync(profile));
  }

  async getUserProfile(userId: number): Promise<UserProfile | undefined> {
    return Promise.resolve(Array.from(this.userProfiles.values())
      .find(p => p.userId === userId));
  }

  async createUserActivity(activity: InsertUserActivity): Promise<UserActivity> {
    return Promise.resolve(this._createUserActivitySync(activity));
  }

  async getUserActivities(userId: number): Promise<UserActivity[]> {
    return Promise.resolve(Array.from(this.userActivities.values())
      .filter(act => act.userId === userId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
  }
}

export const storage = new MemStorage();
