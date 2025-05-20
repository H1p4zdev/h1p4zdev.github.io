// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  tournaments;
  teams;
  teamMembers;
  tournamentRegistrations;
  matches;
  matchParticipants;
  userProfiles;
  userActivities;
  userCurrentId;
  tournamentCurrentId;
  teamCurrentId;
  teamMemberCurrentId;
  tournamentRegistrationCurrentId;
  matchCurrentId;
  matchParticipantCurrentId;
  userProfileCurrentId;
  userActivityCurrentId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.tournaments = /* @__PURE__ */ new Map();
    this.teams = /* @__PURE__ */ new Map();
    this.teamMembers = /* @__PURE__ */ new Map();
    this.tournamentRegistrations = /* @__PURE__ */ new Map();
    this.matches = /* @__PURE__ */ new Map();
    this.matchParticipants = /* @__PURE__ */ new Map();
    this.userProfiles = /* @__PURE__ */ new Map();
    this.userActivities = /* @__PURE__ */ new Map();
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
  initializeSampleData() {
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
    const tournament1 = this.createTournament({
      name: "FIRE LEGENDS CUP",
      description: "The ultimate Free Fire tournament",
      format: "Battle Royale - Squads",
      teamSize: 4,
      maxParticipants: 128,
      entryFee: 200,
      prizePool: 5e4,
      startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1e3).toISOString(),
      // 3 days from now
      endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1e3).toISOString(),
      // 5 days from now
      registrationStartDate: (/* @__PURE__ */ new Date()).toISOString(),
      registrationEndDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1e3).toISOString(),
      // 2 days from now
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
      prizePool: 25e3,
      startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1e3).toISOString(),
      // 5 days from now
      endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1e3).toISOString(),
      // 6 days from now
      registrationStartDate: (/* @__PURE__ */ new Date()).toISOString(),
      registrationEndDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1e3).toISOString(),
      // 4 days from now
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
    const match1 = this.createMatch({
      tournamentId: tournament1.id,
      round: 1,
      matchNumber: 1,
      startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3).toISOString(),
      // 2 days ago
      endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1e3 + 30 * 60 * 1e3).toISOString(),
      // 30 minutes after start
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
      startTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1e3).toISOString(),
      // 1 day ago
      endTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1e3 + 30 * 60 * 1e3).toISOString(),
      // 30 minutes after start
      status: "completed",
      results: {
        winner: team3.id,
        mvp: user1.id
      }
    });
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
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(user) {
    const id = this.userCurrentId++;
    const newUser = { ...user, id };
    this.users.set(id, newUser);
    return newUser;
  }
  // Tournament methods
  async createTournament(tournament) {
    const id = this.tournamentCurrentId++;
    const newTournament = {
      ...tournament,
      id,
      participantsCount: 0
      // Start with 0 participants
    };
    this.tournaments.set(id, newTournament);
    return newTournament;
  }
  async getTournament(id) {
    const tournament = this.tournaments.get(id);
    if (tournament) {
      const registrations = Array.from(this.tournamentRegistrations.values()).filter((reg) => reg.tournamentId === id);
      return {
        ...tournament,
        participantsCount: registrations.length
      };
    }
    return void 0;
  }
  async getAllTournaments() {
    const tournaments2 = Array.from(this.tournaments.values());
    return tournaments2.map((tournament) => {
      const registrations = Array.from(this.tournamentRegistrations.values()).filter((reg) => reg.tournamentId === tournament.id);
      return {
        ...tournament,
        participantsCount: registrations.length
      };
    });
  }
  // Team methods
  async createTeam(team) {
    const id = this.teamCurrentId++;
    const newTeam = { ...team, id };
    this.teams.set(id, newTeam);
    return newTeam;
  }
  async getTeam(id) {
    return this.teams.get(id);
  }
  async getAllTeams() {
    return Array.from(this.teams.values());
  }
  // Team Member methods
  async addTeamMember(teamMember) {
    const id = this.teamMemberCurrentId++;
    const joinedAt = (/* @__PURE__ */ new Date()).toISOString();
    const newTeamMember = { ...teamMember, id, joinedAt };
    this.teamMembers.set(id, newTeamMember);
    return newTeamMember;
  }
  async getTeamMembers(teamId) {
    return Array.from(this.teamMembers.values()).filter((member) => member.teamId === teamId);
  }
  // Tournament Registration methods
  async registerForTournament(registration) {
    const id = this.tournamentRegistrationCurrentId++;
    const registeredAt = (/* @__PURE__ */ new Date()).toISOString();
    const newRegistration = { ...registration, id, registeredAt };
    this.tournamentRegistrations.set(id, newRegistration);
    const tournament = await this.getTournament(registration.tournamentId);
    if (tournament) {
      this.tournaments.set(tournament.id, {
        ...tournament,
        participantsCount: tournament.participantsCount + 1
      });
    }
    return newRegistration;
  }
  async getTournamentRegistrations(tournamentId) {
    return Array.from(this.tournamentRegistrations.values()).filter((registration) => registration.tournamentId === tournamentId);
  }
  // Match methods
  async createMatch(match) {
    const id = this.matchCurrentId++;
    const tournament = await this.getTournament(match.tournamentId);
    const tournamentName = tournament ? tournament.name : "Unknown Tournament";
    const newMatch = {
      ...match,
      id,
      tournamentName,
      pointsEarned: 0,
      position: 0,
      date: (/* @__PURE__ */ new Date()).toISOString()
    };
    this.matches.set(id, newMatch);
    return newMatch;
  }
  async getTournamentMatches(tournamentId) {
    return Array.from(this.matches.values()).filter((match) => match.tournamentId === tournamentId);
  }
  // Match Participant methods
  async addMatchParticipant(participant) {
    const id = this.matchParticipantCurrentId++;
    const newParticipant = { ...participant, id };
    this.matchParticipants.set(id, newParticipant);
    return newParticipant;
  }
  async getMatchParticipants(matchId) {
    return Array.from(this.matchParticipants.values()).filter((participant) => participant.matchId === matchId);
  }
  // User Profile methods
  async createUserProfile(profile) {
    const id = this.userProfileCurrentId++;
    const updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    const newProfile = { ...profile, id, updatedAt };
    this.userProfiles.set(id, newProfile);
    return newProfile;
  }
  async getUserProfile(userId) {
    return Array.from(this.userProfiles.values()).find((profile) => profile.userId === userId);
  }
  // User Activity methods
  async createUserActivity(activity) {
    const id = this.userActivityCurrentId++;
    const timestamp2 = (/* @__PURE__ */ new Date()).toISOString();
    const newActivity = { ...activity, id, timestamp: timestamp2 };
    this.userActivities.set(id, newActivity);
    return newActivity;
  }
  async getUserActivities(userId) {
    return Array.from(this.userActivities.values()).filter((activity) => activity.userId === userId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
};
var storage = new MemStorage();

// server/routes.ts
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

// shared/schema.ts
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  displayName: text("display_name"),
  photoURL: text("photo_url"),
  phoneNumber: text("phone_number"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  displayName: true,
  photoURL: true,
  phoneNumber: true,
  isAdmin: true
});
var tournaments = pgTable("tournaments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  format: text("format").notNull(),
  teamSize: integer("team_size").notNull(),
  maxParticipants: integer("max_participants").notNull(),
  entryFee: integer("entry_fee").default(0),
  prizePool: integer("prize_pool").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  registrationStartDate: timestamp("registration_start_date").notNull(),
  registrationEndDate: timestamp("registration_end_date").notNull(),
  registrationOpen: boolean("registration_open").default(true),
  rules: text("rules").array(),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow()
});
var insertTournamentSchema = createInsertSchema(tournaments).pick({
  name: true,
  description: true,
  format: true,
  teamSize: true,
  maxParticipants: true,
  entryFee: true,
  prizePool: true,
  startDate: true,
  endDate: true,
  registrationStartDate: true,
  registrationEndDate: true,
  registrationOpen: true,
  rules: true,
  createdBy: true
});
var teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  captain: integer("captain").references(() => users.id),
  logo: text("logo"),
  tournamentsPlayed: integer("tournaments_played").default(0),
  badges: text("badges").array(),
  createdAt: timestamp("created_at").defaultNow()
});
var insertTeamSchema = createInsertSchema(teams).pick({
  name: true,
  captain: true,
  logo: true,
  tournamentsPlayed: true,
  badges: true
});
var teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  joinedAt: timestamp("joined_at").defaultNow()
});
var insertTeamMemberSchema = createInsertSchema(teamMembers).pick({
  teamId: true,
  userId: true
});
var tournamentRegistrations = pgTable("tournament_registrations", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").references(() => tournaments.id).notNull(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  registeredAt: timestamp("registered_at").defaultNow(),
  paymentStatus: text("payment_status").default("pending"),
  paymentId: text("payment_id")
});
var insertTournamentRegistrationSchema = createInsertSchema(tournamentRegistrations).pick({
  tournamentId: true,
  teamId: true,
  paymentStatus: true,
  paymentId: true
});
var matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").references(() => tournaments.id).notNull(),
  round: integer("round").notNull(),
  matchNumber: integer("match_number").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  status: text("status").default("scheduled"),
  results: jsonb("results")
});
var insertMatchSchema = createInsertSchema(matches).pick({
  tournamentId: true,
  round: true,
  matchNumber: true,
  startTime: true,
  endTime: true,
  status: true,
  results: true
});
var matchParticipants = pgTable("match_participants", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").references(() => matches.id).notNull(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  position: integer("position"),
  points: integer("points").default(0),
  kills: integer("kills").default(0)
});
var insertMatchParticipantSchema = createInsertSchema(matchParticipants).pick({
  matchId: true,
  teamId: true,
  position: true,
  points: true,
  kills: true
});
var userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  level: integer("level").default(1),
  rank: text("rank").default("Rookie"),
  verified: boolean("verified").default(false),
  tournamentsWon: integer("tournaments_won").default(0),
  matches: integer("matches").default(0),
  tournaments: integer("tournaments").default(0),
  kills: integer("kills").default(0),
  stats: jsonb("stats"),
  achievements: jsonb("achievements"),
  updatedAt: timestamp("updated_at").defaultNow()
});
var insertUserProfileSchema = createInsertSchema(userProfiles).pick({
  userId: true,
  level: true,
  rank: true,
  verified: true,
  tournamentsWon: true,
  matches: true,
  tournaments: true,
  kills: true,
  stats: true,
  achievements: true
});
var userActivities = pgTable("user_activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  text: text("text").notNull(),
  icon: text("icon"),
  iconColor: text("icon_color"),
  timestamp: timestamp("timestamp").defaultNow()
});
var insertUserActivitySchema = createInsertSchema(userActivities).pick({
  userId: true,
  text: true,
  icon: true,
  iconColor: true
});

// server/routes.ts
import { cert } from "firebase-admin/app";
async function registerRoutes(app2) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
    if (projectId && clientEmail && privateKey) {
      const credential = cert({
        projectId,
        clientEmail,
        privateKey
      });
      initializeApp({
        credential,
        databaseURL: `https://${projectId}-default-rtdb.asia-southeast1.firebasedatabase.app`
      });
      console.log("Firebase Admin SDK initialized successfully");
    } else {
      console.warn("Firebase Admin credentials not found. Some API features might not work.");
    }
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
  }
  const validateRequest = (schema) => {
    return (req, res, next) => {
      try {
        req.validatedBody = schema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          const validationError = fromZodError(error);
          res.status(400).json({ message: validationError.message });
        } else {
          res.status(500).json({ message: "Internal server error during validation" });
        }
      }
    };
  };
  const authenticateUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Missing or invalid token" });
    }
    const token = authHeader.split("Bearer ")[1];
    try {
      const decodedToken = await auth().verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch (error) {
      console.error("Authentication error:", error);
      res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
  };
  app2.post("/api/users", validateRequest(insertUserSchema), async (req, res) => {
    try {
      const user = await storage.createUser(req.validatedBody);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(parseInt(req.params.id));
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.post("/api/tournaments", authenticateUser, validateRequest(insertTournamentSchema), async (req, res) => {
    try {
      const tournament = await storage.createTournament(req.validatedBody);
      res.status(201).json(tournament);
    } catch (error) {
      res.status(500).json({ message: "Error creating tournament", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.get("/api/tournaments", async (req, res) => {
    try {
      const tournaments2 = await storage.getAllTournaments();
      res.json(tournaments2);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tournaments", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.get("/api/tournaments/:id", async (req, res) => {
    try {
      const tournament = await storage.getTournament(parseInt(req.params.id));
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }
      res.json(tournament);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tournament", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.post("/api/teams", authenticateUser, validateRequest(insertTeamSchema), async (req, res) => {
    try {
      const team = await storage.createTeam(req.validatedBody);
      res.status(201).json(team);
    } catch (error) {
      res.status(500).json({ message: "Error creating team", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.get("/api/teams", async (req, res) => {
    try {
      const teams2 = await storage.getAllTeams();
      res.json(teams2);
    } catch (error) {
      res.status(500).json({ message: "Error fetching teams", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.get("/api/teams/:id", async (req, res) => {
    try {
      const team = await storage.getTeam(parseInt(req.params.id));
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      res.json(team);
    } catch (error) {
      res.status(500).json({ message: "Error fetching team", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.post("/api/team-members", authenticateUser, validateRequest(insertTeamMemberSchema), async (req, res) => {
    try {
      const teamMember = await storage.addTeamMember(req.validatedBody);
      res.status(201).json(teamMember);
    } catch (error) {
      res.status(500).json({ message: "Error adding team member", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.get("/api/teams/:teamId/members", async (req, res) => {
    try {
      const members = await storage.getTeamMembers(parseInt(req.params.teamId));
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Error fetching team members", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.post("/api/tournament-registrations", authenticateUser, validateRequest(insertTournamentRegistrationSchema), async (req, res) => {
    try {
      const registration = await storage.registerForTournament(req.validatedBody);
      res.status(201).json(registration);
    } catch (error) {
      res.status(500).json({ message: "Error registering for tournament", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.get("/api/tournaments/:tournamentId/registrations", async (req, res) => {
    try {
      const registrations = await storage.getTournamentRegistrations(parseInt(req.params.tournamentId));
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tournament registrations", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.post("/api/matches", authenticateUser, validateRequest(insertMatchSchema), async (req, res) => {
    try {
      const match = await storage.createMatch(req.validatedBody);
      res.status(201).json(match);
    } catch (error) {
      res.status(500).json({ message: "Error creating match", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.get("/api/tournaments/:tournamentId/matches", async (req, res) => {
    try {
      const matches2 = await storage.getTournamentMatches(parseInt(req.params.tournamentId));
      res.json(matches2);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tournament matches", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.post("/api/match-participants", authenticateUser, validateRequest(insertMatchParticipantSchema), async (req, res) => {
    try {
      const participant = await storage.addMatchParticipant(req.validatedBody);
      res.status(201).json(participant);
    } catch (error) {
      res.status(500).json({ message: "Error adding match participant", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.get("/api/matches/:matchId/participants", async (req, res) => {
    try {
      const participants = await storage.getMatchParticipants(parseInt(req.params.matchId));
      res.json(participants);
    } catch (error) {
      res.status(500).json({ message: "Error fetching match participants", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.post("/api/user-profiles", authenticateUser, validateRequest(insertUserProfileSchema), async (req, res) => {
    try {
      const profile = await storage.createUserProfile(req.validatedBody);
      res.status(201).json(profile);
    } catch (error) {
      res.status(500).json({ message: "Error creating user profile", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.get("/api/users/:userId/profile", async (req, res) => {
    try {
      const profile = await storage.getUserProfile(parseInt(req.params.userId));
      if (!profile) {
        return res.status(404).json({ message: "User profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user profile", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.post("/api/user-activities", authenticateUser, validateRequest(insertUserActivitySchema), async (req, res) => {
    try {
      const activity = await storage.createUserActivity(req.validatedBody);
      res.status(201).json(activity);
    } catch (error) {
      res.status(500).json({ message: "Error creating user activity", error: error instanceof Error ? error.message : String(error) });
    }
  });
  app2.get("/api/users/:userId/activities", async (req, res) => {
    try {
      const activities = await storage.getUserActivities(parseInt(req.params.userId));
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user activities", error: error instanceof Error ? error.message : String(error) });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  base: "/h1p4zdev.github.io/",
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
