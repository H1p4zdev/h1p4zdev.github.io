import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
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

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  displayName: true,
  photoURL: true,
  phoneNumber: true,
  isAdmin: true
});

// Tournaments table
export const tournaments = pgTable("tournaments", {
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

export const insertTournamentSchema = createInsertSchema(tournaments).pick({
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

// Teams table
export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  captain: integer("captain").references(() => users.id),
  logo: text("logo"),
  tournamentsPlayed: integer("tournaments_played").default(0),
  badges: text("badges").array(),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertTeamSchema = createInsertSchema(teams).pick({
  name: true,
  captain: true,
  logo: true,
  tournamentsPlayed: true,
  badges: true
});

// Team Members table
export const teamMembers = pgTable("team_members", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  joinedAt: timestamp("joined_at").defaultNow()
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).pick({
  teamId: true,
  userId: true
});

// Tournament Registrations table
export const tournamentRegistrations = pgTable("tournament_registrations", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").references(() => tournaments.id).notNull(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  registeredAt: timestamp("registered_at").defaultNow(),
  paymentStatus: text("payment_status").default("pending"),
  paymentId: text("payment_id")
});

export const insertTournamentRegistrationSchema = createInsertSchema(tournamentRegistrations).pick({
  tournamentId: true,
  teamId: true,
  paymentStatus: true,
  paymentId: true
});

// Matches table
export const matches = pgTable("matches", {
  id: serial("id").primaryKey(),
  tournamentId: integer("tournament_id").references(() => tournaments.id).notNull(),
  round: integer("round").notNull(),
  matchNumber: integer("match_number").notNull(),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  status: text("status").default("scheduled"),
  results: jsonb("results")
});

export const insertMatchSchema = createInsertSchema(matches).pick({
  tournamentId: true,
  round: true,
  matchNumber: true,
  startTime: true,
  endTime: true,
  status: true,
  results: true
});

// Match Participants table
export const matchParticipants = pgTable("match_participants", {
  id: serial("id").primaryKey(),
  matchId: integer("match_id").references(() => matches.id).notNull(),
  teamId: integer("team_id").references(() => teams.id).notNull(),
  position: integer("position"),
  points: integer("points").default(0),
  kills: integer("kills").default(0)
});

export const insertMatchParticipantSchema = createInsertSchema(matchParticipants).pick({
  matchId: true,
  teamId: true,
  position: true,
  points: true,
  kills: true
});

// User Profiles table
export const userProfiles = pgTable("user_profiles", {
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

export const insertUserProfileSchema = createInsertSchema(userProfiles).pick({
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

// User Activities table
export const userActivities = pgTable("user_activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  text: text("text").notNull(),
  icon: text("icon"),
  iconColor: text("icon_color"),
  timestamp: timestamp("timestamp").defaultNow()
});

export const insertUserActivitySchema = createInsertSchema(userActivities).pick({
  userId: true,
  text: true,
  icon: true,
  iconColor: true
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Tournament = typeof tournaments.$inferSelect & {
  participantsCount: number;
};
export type InsertTournament = z.infer<typeof insertTournamentSchema>;

export type Team = typeof teams.$inferSelect;
export type InsertTeam = z.infer<typeof insertTeamSchema>;

export type TeamMember = typeof teamMembers.$inferSelect;
export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;

export type TournamentRegistration = typeof tournamentRegistrations.$inferSelect;
export type InsertTournamentRegistration = z.infer<typeof insertTournamentRegistrationSchema>;

export type Match = typeof matches.$inferSelect & {
  tournamentName: string;
  pointsEarned: number;
  position: number;
  date: string;
};
export type InsertMatch = z.infer<typeof insertMatchSchema>;

export type MatchParticipant = typeof matchParticipants.$inferSelect;
export type InsertMatchParticipant = z.infer<typeof insertMatchParticipantSchema>;

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;

export type UserActivity = typeof userActivities.$inferSelect;
export type InsertUserActivity = z.infer<typeof insertUserActivitySchema>;
