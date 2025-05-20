import type { Express } from "express";
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
} from "@shared/schema";
import * as admin from "firebase-admin";
import { cert } from "firebase-admin/app";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Firebase Admin SDK 
  try {
    // Check if environment variables are set
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
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

  // Middleware to handle validation errors
  const validateRequest = (schema: any) => {
    return (req: any, res: any, next: any) => {
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

  // Authentication middleware
  const authenticateUser = async (req: any, res: any, next: any) => {
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

  // User Routes
  app.post('/api/users', validateRequest(insertUserSchema), async (req, res) => {
    try {
      const user = await storage.createUser(req.validatedBody);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ message: "Error creating user", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get('/api/users/:id', async (req, res) => {
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

  // Tournament Routes
  app.post('/api/tournaments', authenticateUser, validateRequest(insertTournamentSchema), async (req, res) => {
    try {
      const tournament = await storage.createTournament(req.validatedBody);
      res.status(201).json(tournament);
    } catch (error) {
      res.status(500).json({ message: "Error creating tournament", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get('/api/tournaments', async (req, res) => {
    try {
      const tournaments = await storage.getAllTournaments();
      res.json(tournaments);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tournaments", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get('/api/tournaments/:id', async (req, res) => {
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

  // Team Routes
  app.post('/api/teams', authenticateUser, validateRequest(insertTeamSchema), async (req, res) => {
    try {
      const team = await storage.createTeam(req.validatedBody);
      res.status(201).json(team);
    } catch (error) {
      res.status(500).json({ message: "Error creating team", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get('/api/teams', async (req, res) => {
    try {
      const teams = await storage.getAllTeams();
      res.json(teams);
    } catch (error) {
      res.status(500).json({ message: "Error fetching teams", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get('/api/teams/:id', async (req, res) => {
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

  // Team Members Routes
  app.post('/api/team-members', authenticateUser, validateRequest(insertTeamMemberSchema), async (req, res) => {
    try {
      const teamMember = await storage.addTeamMember(req.validatedBody);
      res.status(201).json(teamMember);
    } catch (error) {
      res.status(500).json({ message: "Error adding team member", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get('/api/teams/:teamId/members', async (req, res) => {
    try {
      const members = await storage.getTeamMembers(parseInt(req.params.teamId));
      res.json(members);
    } catch (error) {
      res.status(500).json({ message: "Error fetching team members", error: error instanceof Error ? error.message : String(error) });
    }
  });

  // Tournament Registration Routes
  app.post('/api/tournament-registrations', authenticateUser, validateRequest(insertTournamentRegistrationSchema), async (req, res) => {
    try {
      const registration = await storage.registerForTournament(req.validatedBody);
      res.status(201).json(registration);
    } catch (error) {
      res.status(500).json({ message: "Error registering for tournament", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get('/api/tournaments/:tournamentId/registrations', async (req, res) => {
    try {
      const registrations = await storage.getTournamentRegistrations(parseInt(req.params.tournamentId));
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tournament registrations", error: error instanceof Error ? error.message : String(error) });
    }
  });

  // Match Routes
  app.post('/api/matches', authenticateUser, validateRequest(insertMatchSchema), async (req, res) => {
    try {
      const match = await storage.createMatch(req.validatedBody);
      res.status(201).json(match);
    } catch (error) {
      res.status(500).json({ message: "Error creating match", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get('/api/tournaments/:tournamentId/matches', async (req, res) => {
    try {
      const matches = await storage.getTournamentMatches(parseInt(req.params.tournamentId));
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tournament matches", error: error instanceof Error ? error.message : String(error) });
    }
  });

  // Match Participants Routes
  app.post('/api/match-participants', authenticateUser, validateRequest(insertMatchParticipantSchema), async (req, res) => {
    try {
      const participant = await storage.addMatchParticipant(req.validatedBody);
      res.status(201).json(participant);
    } catch (error) {
      res.status(500).json({ message: "Error adding match participant", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get('/api/matches/:matchId/participants', async (req, res) => {
    try {
      const participants = await storage.getMatchParticipants(parseInt(req.params.matchId));
      res.json(participants);
    } catch (error) {
      res.status(500).json({ message: "Error fetching match participants", error: error instanceof Error ? error.message : String(error) });
    }
  });

  // User Profile Routes
  app.post('/api/user-profiles', authenticateUser, validateRequest(insertUserProfileSchema), async (req, res) => {
    try {
      const profile = await storage.createUserProfile(req.validatedBody);
      res.status(201).json(profile);
    } catch (error) {
      res.status(500).json({ message: "Error creating user profile", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get('/api/users/:userId/profile', async (req, res) => {
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

  // User Activity Routes
  app.post('/api/user-activities', authenticateUser, validateRequest(insertUserActivitySchema), async (req, res) => {
    try {
      const activity = await storage.createUserActivity(req.validatedBody);
      res.status(201).json(activity);
    } catch (error) {
      res.status(500).json({ message: "Error creating user activity", error: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get('/api/users/:userId/activities', async (req, res) => {
    try {
      const activities = await storage.getUserActivities(parseInt(req.params.userId));
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Error fetching user activities", error: error instanceof Error ? error.message : String(error) });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
