import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHadithSchema, insertBookmarkSchema, insertUserPreferencesSchema } from "@shared/schema";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Hadith Collections
  app.get("/api/collections", async (req, res) => {
    try {
      const collections = await storage.getHadithCollections();
      res.json(collections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch collections" });
    }
  });

  app.get("/api/collections/:id", async (req, res) => {
    try {
      const collection = await storage.getHadithCollection(req.params.id);
      if (!collection) {
        return res.status(404).json({ message: "Collection not found" });
      }
      res.json(collection);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch collection" });
    }
  });

  // Hadiths
  app.get("/api/hadiths", async (req, res) => {
    try {
      const { collectionId, search, limit, offset } = req.query;
      const hadiths = await storage.getHadiths({
        collectionId: collectionId as string,
        search: search as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });
      res.json(hadiths);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hadiths" });
    }
  });

  app.get("/api/hadiths/:id", async (req, res) => {
    try {
      const hadith = await storage.getHadith(req.params.id);
      if (!hadith) {
        return res.status(404).json({ message: "Hadith not found" });
      }
      res.json(hadith);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hadith" });
    }
  });

  app.get("/api/search", async (req, res) => {
    try {
      const { q, collection } = req.query;
      if (!q) {
        return res.status(400).json({ message: "Search query is required" });
      }
      const results = await storage.searchHadiths(q as string, collection as string);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Search failed" });
    }
  });

  // Daily Hadith
  app.get("/api/daily-hadith", async (req, res) => {
    try {
      const hadiths = await storage.getHadiths({ limit: 1 });
      const dailyHadith = hadiths[0] || null;
      res.json(dailyHadith);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch daily hadith" });
    }
  });

  // Bookmarks (simplified - without user authentication for now)
  app.get("/api/bookmarks", async (req, res) => {
    try {
      const userId = "default-user"; // In real app, get from auth
      const bookmarks = await storage.getUserBookmarks(userId);
      res.json(bookmarks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookmarks" });
    }
  });

  app.post("/api/bookmarks", async (req, res) => {
    try {
      const userId = "default-user"; // In real app, get from auth
      const bookmarkData = { ...req.body, userId };
      const result = insertBookmarkSchema.safeParse(bookmarkData);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid bookmark data" });
      }

      const bookmark = await storage.createBookmark(result.data);
      res.json(bookmark);
    } catch (error) {
      res.status(500).json({ message: "Failed to create bookmark" });
    }
  });

  app.delete("/api/bookmarks/:hadithId", async (req, res) => {
    try {
      const userId = "default-user"; // In real app, get from auth
      const success = await storage.deleteBookmark(userId, req.params.hadithId);
      if (!success) {
        return res.status(404).json({ message: "Bookmark not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete bookmark" });
    }
  });

  // User Preferences
  app.get("/api/preferences", async (req, res) => {
    try {
      const userId = "default-user"; // In real app, get from auth
      const preferences = await storage.getUserPreferences(userId);
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch preferences" });
    }
  });

  app.put("/api/preferences", async (req, res) => {
    try {
      const userId = "default-user"; // In real app, get from auth
      const result = insertUserPreferencesSchema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({ message: "Invalid preferences data" });
      }

      const preferences = await storage.updateUserPreferences(userId, result.data);
      res.json(preferences);
    } catch (error) {
      res.status(500).json({ message: "Failed to update preferences" });
    }
  });

  // Visitor tracking
  const visitorsFilePath = join(process.cwd(), "server", "visitors.json");

  // Helper functions for visitor tracking
  const getVisitorData = () => {
    try {
      if (existsSync(visitorsFilePath)) {
        const data = readFileSync(visitorsFilePath, "utf-8");
        return JSON.parse(data);
      }
    } catch (error) {
      console.error("Error reading visitors.json:", error);
    }
    return { count: 1, visitors: [] };
  };

  const saveVisitorData = (data: any) => {
    try {
      writeFileSync(visitorsFilePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error writing visitors.json:", error);
    }
  };

  // Track visitor endpoint
  app.post("/api/visitors/track", async (req, res) => {
    try {
      const { visitorId } = req.body;

      if (!visitorId) {
        return res.status(400).json({ message: "Visitor ID is required" });
      }

      const data = getVisitorData();

      // Check if this visitor has been tracked before
      if (!data.visitors.includes(visitorId)) {
        data.visitors.push(visitorId);
        data.count = data.visitors.length;
        saveVisitorData(data);
      }

      res.json({ count: data.count });
    } catch (error) {
      res.status(500).json({ message: "Failed to track visitor" });
    }
  });

  // Stats
  app.get("/api/stats", async (req, res) => {
    try {
      const collections = await storage.getHadithCollections();
      const allHadiths = await storage.getHadiths();
      const visitorData = getVisitorData();

      const stats = {
        totalHadiths: allHadiths.length,
        collections: collections.length,
        languages: 4, // Arabic, English, Urdu, Roman Urdu
        users: visitorData.count // Dynamic visitor count
      };

      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
