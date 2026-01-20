import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { registerRequestSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  const requireAuth = async (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing or invalid authorization header" });
    }

    const key = authHeader.split(" ")[1];
    try {
      const couple = await storage.getCouple(key);
      if (!couple) {
        return res.status(401).json({ message: "Invalid Couple Key" });
      }
      req.coupleId = couple.id;
      next();
    } catch (error) {
       res.status(500).json({ message: "Internal Auth Error" });
    }
  };

  app.post(api.auth.login.path, async (req, res) => {
    try {
      const input = api.auth.login.input.parse(req.body);
      const couple = await storage.getCouple(input.key);
      if (!couple) return res.status(401).json({ message: "Invalid Couple Key" });
      res.json({ ...couple, token: couple.key, coupleId: couple.id });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  app.post(api.auth.register.path, async (req, res) => {
    try {
      const input = registerRequestSchema.parse(req.body);
      const couple = await storage.createCouple(input);
      res.status(201).json({ ...couple, token: couple.key, coupleId: couple.id });
    } catch (error) {
      res.status(500).json({ message: "Failed to create space" });
    }
  });

  app.get(api.mood.get.path, requireAuth, async (req, res) => {
    try {
      const moods = await storage.getMoods((req as any).coupleId);
      res.json(moods);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mood" });
    }
  });

  app.post(api.mood.update.path, requireAuth, async (req, res) => {
    try {
      const input = api.mood.update.input.parse(req.body);
      const mood = await storage.updateMood((req as any).coupleId, input as any);
      res.json(mood);
    } catch (error) {
      res.status(500).json({ message: "Failed to update mood" });
    }
  });

  app.get(api.notes.list.path, requireAuth, async (req, res) => {
    try {
      const notes = await storage.getNotes((req as any).coupleId);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  app.post(api.notes.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.notes.create.input.parse(req.body);
      const note = await storage.createNote((req as any).coupleId, input as any);
      res.status(201).json(note);
    } catch (error) {
      res.status(500).json({ message: "Failed to create note" });
    }
  });

  app.delete(api.notes.delete.path, requireAuth, async (req, res) => {
    try {
      await storage.deleteNote((req as any).coupleId, req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete note" });
    }
  });

  app.get(api.letters.list.path, requireAuth, async (req, res) => {
    try {
      const letters = await storage.getLetters((req as any).coupleId);
      res.json(letters);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch letters" });
    }
  });

  app.post(api.letters.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.letters.create.input.parse(req.body);
      const letter = await storage.createLetter((req as any).coupleId, input);
      res.status(201).json(letter);
    } catch (error) {
      res.status(500).json({ message: "Failed to create letter" });
    }
  });

  app.post(api.letters.open.path, requireAuth, async (req, res) => {
    try {
      const letter = await storage.openLetter((req as any).coupleId, req.params.id);
      if (!letter) return res.status(404).json({ message: "Not found" });
      res.json(letter);
    } catch (error) {
      res.status(500).json({ message: "Failed" });
    }
  });

  app.post(api.letters.archive.path, requireAuth, async (req, res) => {
    try {
      const letter = await storage.archiveLetter((req as any).coupleId, req.params.id);
      if (!letter) return res.status(404).json({ message: "Not found" });
      res.json(letter);
    } catch (error) {
      res.status(500).json({ message: "Failed" });
    }
  });

  app.get(api.journal.list.path, requireAuth, async (req, res) => {
    try {
      const entries = await storage.getJournalEntries((req as any).coupleId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed" });
    }
  });

  app.post(api.journal.create.path, requireAuth, async (req, res) => {
    try {
      const input = api.journal.create.input.parse(req.body);
      const entry = await storage.createJournalEntry((req as any).coupleId, input);
      res.status(201).json(entry);
    } catch (error) {
      res.status(500).json({ message: "Failed" });
    }
  });

  return httpServer;
}
