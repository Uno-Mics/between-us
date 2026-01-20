import { db } from "./db";
import {
  type Couple,
  type Note,
  type CreateNoteRequest,
  type Mood,
  type Letter,
  type CreateLetterRequest,
  type JournalEntry,
  type CreateJournalRequest,
  type RegisterRequest
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Auth
  getCouple(key: string): Promise<Couple | undefined>;
  createCouple(req: RegisterRequest): Promise<Couple>;

  // Notes
  getNotes(coupleId: string): Promise<Note[]>;
  createNote(coupleId: string, note: CreateNoteRequest & { authorName: string }): Promise<Note>;
  deleteNote(coupleId: string, noteId: string): Promise<void>;

  // Mood
  getMoods(coupleId: string): Promise<Record<string, Mood>>;
  updateMood(coupleId: string, mood: Omit<Mood, "timestamp">): Promise<Mood>;

  // Letters
  getLetters(coupleId: string): Promise<Letter[]>;
  createLetter(coupleId: string, letter: CreateLetterRequest): Promise<Letter>;
  openLetter(coupleId: string, letterId: string): Promise<Letter | undefined>;
  archiveLetter(coupleId: string, letterId: string): Promise<Letter | undefined>;

  // Journal
  getJournalEntries(coupleId: string): Promise<JournalEntry[]>;
  createJournalEntry(coupleId: string, entry: CreateJournalRequest): Promise<JournalEntry>;
}

export class FirebaseStorage implements IStorage {
  private checkDb() {
    if (!db) {
      throw new Error("Firebase Database not initialized.");
    }
  }

  // === AUTH ===
  async getCouple(key: string): Promise<Couple | undefined> {
    this.checkDb();
    const snapshot = await db.ref(`couples/${key}`).once("value");
    return snapshot.val() || undefined;
  }

  async createCouple(req: RegisterRequest): Promise<Couple> {
    this.checkDb();
    const key = Math.random().toString(36).substring(2, 8).toUpperCase();
    const couple: Couple = {
      id: key,
      key,
      name1: req.name1,
      name2: req.name2,
      createdAt: Date.now(),
    };
    
    const exists = await this.getCouple(key);
    if (exists) return this.createCouple(req);

    await db.ref(`couples/${key}`).set(couple);
    return couple;
  }

  // === NOTES ===
  async getNotes(coupleId: string): Promise<Note[]> {
    this.checkDb();
    const snapshot = await db.ref(`notes/${coupleId}`).once("value");
    const notes: Note[] = [];
    snapshot.forEach((child) => {
      notes.push(child.val());
    });
    
    const now = Date.now();
    return notes.filter(n => n.expiresAt > now).sort((a, b) => b.createdAt - a.createdAt);
  }

  async createNote(coupleId: string, req: CreateNoteRequest & { authorName: string }): Promise<Note> {
    this.checkDb();
    const id = randomUUID();
    const now = Date.now();
    const note: Note = {
      id,
      content: req.content,
      authorName: req.authorName,
      createdAt: now,
      expiresAt: now + 24 * 60 * 60 * 1000,
    };
    await db.ref(`notes/${coupleId}/${id}`).set(note);
    return note;
  }

  async deleteNote(coupleId: string, noteId: string): Promise<void> {
    this.checkDb();
    await db.ref(`notes/${coupleId}/${noteId}`).remove();
  }

  // === MOOD ===
  async getMoods(coupleId: string): Promise<Record<string, Mood>> {
    this.checkDb();
    const snapshot = await db.ref(`moods/${coupleId}`).once("value");
    return snapshot.val() || {};
  }

  async updateMood(coupleId: string, req: Omit<Mood, "timestamp">): Promise<Mood> {
    this.checkDb();
    const mood: Mood = {
      ...req,
      timestamp: Date.now(),
    };
    await db.ref(`moods/${coupleId}/${req.authorName}`).set(mood);
    return mood;
  }

  // === LETTERS ===
  async getLetters(coupleId: string): Promise<Letter[]> {
    this.checkDb();
    const snapshot = await db.ref(`letters/${coupleId}`).once("value");
    const letters: Letter[] = [];
    snapshot.forEach((child) => {
      letters.push(child.val());
    });
    return letters.sort((a, b) => b.createdAt - a.createdAt);
  }

  async createLetter(coupleId: string, req: CreateLetterRequest): Promise<Letter> {
    this.checkDb();
    const id = randomUUID();
    const letter: Letter = {
      id,
      content: req.content,
      isSealed: true,
      isArchived: false,
      createdAt: Date.now(),
    };
    await db.ref(`letters/${coupleId}/${id}`).set(letter);
    return letter;
  }

  async openLetter(coupleId: string, letterId: string): Promise<Letter | undefined> {
    this.checkDb();
    const ref = db.ref(`letters/${coupleId}/${letterId}`);
    const snapshot = await ref.once("value");
    if (!snapshot.exists()) return undefined;

    const letter = snapshot.val() as Letter;
    if (letter.isSealed) {
      const updates = { isSealed: false, openedAt: Date.now() };
      await ref.update(updates);
      return { ...letter, ...updates };
    }
    return letter;
  }

  async archiveLetter(coupleId: string, letterId: string): Promise<Letter | undefined> {
    this.checkDb();
    const ref = db.ref(`letters/${coupleId}/${letterId}`);
    const snapshot = await ref.once("value");
    if (!snapshot.exists()) return undefined;
    
    await ref.update({ isArchived: true });
    return { ...snapshot.val(), isArchived: true };
  }

  // === JOURNAL ===
  async getJournalEntries(coupleId: string): Promise<JournalEntry[]> {
    this.checkDb();
    const snapshot = await db.ref(`journal/${coupleId}`).once("value");
    const entries: JournalEntry[] = [];
    snapshot.forEach((child) => {
      entries.push(child.val());
    });
    return entries.sort((a, b) => b.createdAt - a.createdAt);
  }

  async createJournalEntry(coupleId: string, req: CreateJournalRequest): Promise<JournalEntry> {
    this.checkDb();
    const id = randomUUID();
    const entry: JournalEntry = {
      id,
      content: req.content,
      date: req.date,
      createdAt: Date.now(),
    };
    await db.ref(`journal/${coupleId}/${id}`).set(entry);
    return entry;
  }
}

export const storage = new FirebaseStorage();
