import { z } from "zod";

// Shared schemas for Firebase data validation and API types

// === COUPLE & AUTH ===
export const coupleSchema = z.object({
  id: z.string(),
  key: z.string(), // The shared secret key
  name1: z.string().optional(),
  name2: z.string().optional(),
  createdAt: z.number(),
});

export const authRequestSchema = z.object({
  key: z.string().min(1, "Key is required"),
});

export const registerRequestSchema = z.object({
  name1: z.string().min(1, "Your name is required"),
  name2: z.string().min(1, "Partner's name is required"),
});

export const authResponseSchema = z.object({
  coupleId: z.string(),
  key: z.string(),
  name1: z.string().optional(),
  name2: z.string().optional(),
  token: z.string().optional(),
});

// === MOOD ===
export const moodSchema = z.object({
  status: z.string().min(1, "Mood status is required"),
  color: z.string(), // Hex code or tailwind class
  icon: z.string(), // Emoji or icon name
  context: z.string().optional(),
  timestamp: z.number(),
  authorName: z.string(), // Who set this mood
});

// === DAILY NOTE ===
export const noteSchema = z.object({
  id: z.string(),
  content: z.string().min(1, "Note cannot be empty"),
  authorName: z.string(), // Who wrote this note
  createdAt: z.number(),
  expiresAt: z.number(), // 24 hours after creation
});

export const createNoteSchema = z.object({
  content: z.string().min(1, "Note cannot be empty"),
  authorName: z.string().optional(),
});

// === LETTER ===
export const letterSchema = z.object({
  id: z.string(),
  content: z.string().min(1, "Letter content cannot be empty"),
  isSealed: z.boolean(),
  isArchived: z.boolean(),
  createdAt: z.number(),
  openedAt: z.number().optional(),
});

export const createLetterSchema = z.object({
  content: z.string().min(1, "Letter content cannot be empty"),
});

// === JOURNAL ===
export const journalEntrySchema = z.object({
  id: z.string(),
  content: z.string().min(1, "Journal entry cannot be empty"),
  date: z.string(), // YYYY-MM-DD
  createdAt: z.number(),
});

export const createJournalSchema = z.object({
  content: z.string().min(1, "Journal entry cannot be empty"),
  date: z.string(),
});

// === EXPORTED TYPES ===
export type Couple = z.infer<typeof coupleSchema>;
export type Mood = z.infer<typeof moodSchema>;
export type Note = z.infer<typeof noteSchema>;
export type Letter = z.infer<typeof letterSchema>;
export type JournalEntry = z.infer<typeof journalEntrySchema>;
export type AuthRequest = z.infer<typeof authRequestSchema>;
export type RegisterRequest = z.infer<typeof registerRequestSchema>;
export type CreateNoteRequest = z.infer<typeof createNoteSchema>;
export type CreateLetterRequest = z.infer<typeof createLetterSchema>;
export type CreateJournalRequest = z.infer<typeof createJournalSchema>;
