import type { Express, Request, Response, NextFunction } from "express"; // Added Request, Response, NextFunction for clarity
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import {
  insertUserSchema,
  insertTournamentSchema,
  insertTeamSchema,
  insertTeamMemberSchema,
  insertTournamentRegistrationSchema,
  insertMatchSchema,
  insertMatchParticipantSchema,
  insertUserProfileSchema,
  insertUserActivitySchema
} from "@shared/schema"; // Assuming @shared is a path alias configured in your tsconfig
import * as admin from "firebase-admin";
import { cert } from "firebase-admin/app"; // cert is correctly imported

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Firebase Admin SDK
  try {
    // Check if Firebase Admin SDK is already initialized
    if (admin.apps.length === 0) { // Prevent re-initialization
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      // Ensure privateKey is correctly formatted (especially if coming from env vars)
      const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

      if (projectId && clientEmail && privateKey) {
        const credential = cert({ // Using the imported cert function
          projectId,
          clientEmail,
          privateKey
        });

        admin.initializeApp({ // <<<<<<<<<<<< CORRECTED: Use admin.initializeApp
          credential,
          databaseURL: `https://${projectId}-default-rtdb.asia-southeast1.firebasedatabase.app`
        });

        console.log("Firebase Admin SDK initialized successfully");
      } else {
        console.warn("Firebase Admin credentials (PROJECT_ID, CLIENT_EMAIL, PRIVATE_KEY) not found in environment variables. Firebase features might not work.");
      }
    } else {
      console.log("Firebase Admin SDK already initialized.");
    }
  } catch (error) {
    console.error("Error initializing Firebase Admin SDK:", error);
  }

  // Middleware to handle validation errors
  const validateRequest = (schema: any) => { // Consider more specific types for schema, req, res, next
    return (req: Request, res: Response, next: NextFunction) => {
      try {
        // Attach validatedBody to a custom property on req, ensure req is typed to allow this if needed
        (req as any).validatedBody = schema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          const validationError = fromZodError(error);
          res.status(400).json({ message: "Validation Error", details: validationError.message }); // Provide more structured error
        } else {
          console.error("Unexpected validation error:", error);
          res.status(500).json({ message: "Internal server error during validation" });
        }
      }
    };
  };

  // Authentication middleware
  const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Missing or invalid token format" });
    }

    const token = authHeader.split("Bearer ")[1];

    try {
      if (admin.apps.length === 0) { // Check if Firebase is initialized
        console.error("Firebase Admin SDK not initialized. Cannot verify token.");
        return res.status(503).json({ message: "Service Unavailable: Authentication service not ready."});
      }
      const decodedToken = await admin.auth().verifyIdToken(token); // <<<<<<<<<<<< CORRECTED: Use admin.auth()
      (req as any).user = decodedToken; // Attach user to a custom property on req
      next();
    } catch (error: any) {
      console.error("Authentication error:", error.message);
      // Provide more specific error messages based on Firebase error codes if possible
      if (error.code === 'auth/id-token-expired') {
        res.status(401).json({ message: "Unauthorized: Token expired" });
      } else {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
      }
    }
  };

  // User Routes
  app.post('/api/users', validateRequest(insertUserSchema), async (req, res) => {
    try {
      const user = await storage.createUser((req as any).validatedBody);
      res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Error creating user", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get('/api/users/:id', async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID format" });
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Error fetching user", error: error instanceof Error ? error.message : String(error) });
    }
  });

  // Tournament Routes
  app.post('/api/tournaments', authenticateUser, validateRequest(insertTournamentSchema), async (req, res) => {
    try {
      const tournament = await storage.createTournament((req as any).validatedBody);
      res.status(201).json(tournament);
    } catch (error) {
      console.error("Error creating tournament:", error);
      res.status(500).json({ message: "Error creating tournament", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get('/api/tournaments', async (req, res) => {
    try {
      const tournaments = await storage.getAllTournaments();
      res.json(tournaments);
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      res.status(500).json({ message: "Error fetching tournaments", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get('/api/tournaments/:id', async (req, res) => {
    try {
      const tournamentId = parseInt(req.params.id);
      if (isNaN(tournamentId)) return res.status(400).json({ message: "Invalid tournament ID format" });
      const tournament = await storage.getTournament(tournamentId);
      if (!tournament) {
        return res.status(404).json({ message: "Tournament not found" });
      }
      res.json(tournament);
    } catch (error) {
      console.error("Error fetching tournament:", error);
      res.status(500).json({ message: "Error fetching tournament", error: error instanceof Error ? error.message : String(error) });
    }
  });

  // Team Routes (similar error handling and ID parsing for other routes)
  app.post('/api/teams', authenticateUser, validateRequest(insertTeamSchema), async (req, res) => {
    try {
      const team = await storage.createTeam((req as any).validatedBody);
      res.status(201).json(team);
    } catch (error) {
      console.error("Error creating team:", error);
      res.status(500).json({ message: "Error creating team", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get('/api/teams', async (req, res) => {
    try {
      const teams = await storage.getAllTeams();
      res.json(teams);
    } catch (error) {
      console.error("Error fetching teams:", error);
      res.status(500).json({ message: "Error fetching teams", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get('/api/teams/:id', async (req, res) => {
    try {
      const teamId = parseInt(req.params.id);
      if (isNaN(teamId)) return res.status(400).json({ message: "Invalid team ID format" });
      const team = await storage.getTeam(teamId);
      if (!team) {
        return res.status(404).json({ message: "Team not found" });
      }
      res.json(team);
    } catch (error) {
      console.error("Error fetching team:", error);
      res.status(500).json({ message: "Error fetching team", error: error instanceof Error ? error.message : String(error) });
    }
  });

  // Team Members Routes
  app.post('/api/team-members', authenticateUser, validateRequest(insertTeamMemberSchema), async (req, res) => {
    try {
      const teamMember = await storage.addTeamMember((req as any).validatedBody);
      res.status(201).json(teamMember);
    } catch (error) {
      console.error("Error adding team member:", error);
      res.status(500).json({ message: "Error adding team member", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get('/api/teams/:teamId/members', async (req, res) => {
    try {
      const teamId = parseInt(req.params.teamId);
      if (isNaN(teamId)) return res.status(400).json({ message: "Invalid team ID format" });
      const members = await storage.getTeamMembers(teamId);
      res.json(members);
    } catch (error) {
      console.error("Error fetching team members:", error);
      res.status(500).json({ message: "Error fetching team members", error: error instanceof Error ? error.message : String(error) });
    }
  });

  // Tournament Registration Routes
  app.post('/api/tournament-registrations', authenticateUser, validateRequest(insertTournamentRegistrationSchema), async (req, res) => {
    try {
      const registration = await storage.registerForTournament((req as any).validatedBody);
      res.status(201).json(registration);
    } catch (error) {
      console.error("Error registering for tournament:", error);
      res.status(500).json({ message: "Error registering for tournament", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get('/api/tournaments/:tournamentId/registrations', async (req, res) => {
    try {
      const tournamentId = parseInt(req.params.tournamentId);
      if (isNaN(tournamentId)) return res.status(400).json({ message: "Invalid tournament ID format" });
      const registrations = await storage.getTournamentRegistrations(tournamentId);
      res.json(registrations);
    } catch (error) {
      console.error("Error fetching tournament registrations:", error);
      res.status(500).json({ message: "Error fetching tournament registrations", error: error instanceof Error ? error.message : String(error) });
    }
  });

  // Match Routes
  app.post('/api/matches', authenticateUser, validateRequest(insertMatchSchema), async (req, res) => {
    try {
      const match = await storage.createMatch((req as any).validatedBody);
      res.status(201).json(match);
    } catch (error) {
      console.error("Error creating match:", error);
      res.status(500).json({ message: "Error creating match", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get('/api/tournaments/:tournamentId/matches', async (req, res) => {
    try {
      const tournamentId = parseInt(req.params.tournamentId);
      if (isNaN(tournamentId)) return res.status(400).json({ message: "Invalid tournament ID format" });
      const matches = await storage.getTournamentMatches(tournamentId);
      res.json(matches);
    } catch (error) {
      console.error("Error fetching tournament matches:", error);
      res.status(500).json({ message: "Error fetching tournament matches", error: error instanceof Error ? error.message : String(error) });
    }
  });

  // Match Participants Routes
  app.post('/api/match-participants', authenticateUser, validateRequest(insertMatchParticipantSchema), async (req, res) => {
    try {
      const participant = await storage.addMatchParticipant((req as any).validatedBody);
      res.status(201).json(participant);
    } catch (error) {
      console.error("Error adding match participant:", error);
      res.status(500).json({ message: "Error adding match participant", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get('/api/matches/:matchId/participants', async (req, res) => {
    try {
      const matchId = parseInt(req.params.matchId);
      if (isNaN(matchId)) return res.status(400).json({ message: "Invalid match ID format" });
      const participants = await storage.getMatchParticipants(matchId);
      res.json(participants);
    } catch (error) {
      console.error("Error fetching match participants:", error);
      res.status(500).json({ message: "Error fetching match participants", error: error instanceof Error ? error.message : String(error) });
    }
  });

  // User Profile Routes
  app.post('/api/user-profiles', authenticateUser, validateRequest(insertUserProfileSchema), async (req, res) => {
    try {
      const profile = await storage.createUserProfile((req as any).validatedBody);
      res.status(201).json(profile);
    } catch (error) {
      console.error("Error creating user profile:", error);
      res.status(500).json({ message: "Error creating user profile", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get('/api/users/:userId/profile', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID format" });
      const profile = await storage.getUserProfile(userId);
      if (!profile) {
        return res.status(404).json({ message: "User profile not found" });
      }
      res.json(profile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Error fetching user profile", error: error instanceof Error ? error.message : String(error) });
    }
  });

  // User Activity Routes
  app.post('/api/user-activities', authenticateUser, validateRequest(insertUserActivitySchema), async (req, res) => {
    try {
      const activity = await storage.createUserActivity((req as any).validatedBody);
      res.status(201).json(activity);
    } catch (error) {
      console.error("Error creating user activity:", error);
      res.status(500).json({ message: "Error creating user activity", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get('/api/users/:userId/activities', async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID format" });
      const activities = await storage.getUserActivities(userId);
      res.json(activities);
    } catch (error) {
      console.error("Error fetching user activities:", error);
      res.status(500).json({ message: "Error fetching user activities", error: error instanceof Error ? error.message : String(error) });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
