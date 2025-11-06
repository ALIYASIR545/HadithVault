import {
  type User,
  type InsertUser,
  type HadithCollection,
  type InsertHadithCollection,
  type Hadith,
  type InsertHadith,
  type Bookmark,
  type InsertBookmark,
  type UserPreferences,
  type InsertUserPreferences
} from "@shared/schema";
import { randomUUID } from "crypto";
import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Hadith Collection methods
  getHadithCollections(): Promise<HadithCollection[]>;
  getHadithCollection(id: string): Promise<HadithCollection | undefined>;
  createHadithCollection(collection: InsertHadithCollection): Promise<HadithCollection>;

  // Hadith methods
  getHadiths(params?: {
    collectionId?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Hadith[]>;
  getHadith(id: string): Promise<Hadith | undefined>;
  createHadith(hadith: InsertHadith): Promise<Hadith>;
  searchHadiths(query: string, collectionId?: string): Promise<Hadith[]>;

  // Bookmark methods
  getUserBookmarks(userId: string): Promise<Bookmark[]>;
  createBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  deleteBookmark(userId: string, hadithId: string): Promise<boolean>;

  // User Preferences methods
  getUserPreferences(userId: string): Promise<UserPreferences | undefined>;
  updateUserPreferences(userId: string, preferences: Partial<InsertUserPreferences>): Promise<UserPreferences>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private hadithCollections: Map<string, HadithCollection>;
  private hadiths: Map<string, Hadith>;
  private bookmarks: Map<string, Bookmark>;
  private userPreferences: Map<string, UserPreferences>;

  constructor() {
    this.users = new Map();
    this.hadithCollections = new Map();
    this.hadiths = new Map();
    this.bookmarks = new Map();
    this.userPreferences = new Map();

    // Initialize with data from JSON files
    this.initializeData();
  }

  private initializeData() {
    console.log("Loading hadith data from JSON files...");

    // Define collections metadata
    const collections: HadithCollection[] = [
      {
        id: "bukhari",
        name: "Sahih al-Bukhari",
        arabicName: "صحيح البخاري",
        compiler: "Imam al-Bukhari",
        description: "The most authentic collection of Hadith compiled by Imam al-Bukhari, containing over 7,000 verified narrations.",
        totalHadiths: 7563
      },
      {
        id: "muslim",
        name: "Sahih Muslim",
        arabicName: "صحيح مسلم",
        compiler: "Imam Muslim",
        description: "The second most authentic collection, compiled by Imam Muslim with strict criteria for authenticity.",
        totalHadiths: 7190
      },
      {
        id: "abudawud",
        name: "Sunan Abu Dawood",
        arabicName: "سنن أبي داود",
        compiler: "Imam Abu Dawood",
        description: "A comprehensive collection focusing on legal matters and practical guidance for daily life.",
        totalHadiths: 5274
      },
      {
        id: "tirmidhi",
        name: "Jami` at-Tirmidhi",
        arabicName: "جامع الترمذي",
        compiler: "Imam at-Tirmidhi",
        description: "A collection known for its detailed commentary and grading of Hadith authenticity.",
        totalHadiths: 3956
      },
    ];

    collections.forEach(collection => {
      this.hadithCollections.set(collection.id, collection);
    });

    // Load hadiths from JSON files
    this.loadHadithsFromFile("bukhari");
    this.loadHadithsFromFile("muslim");
    this.loadHadithsFromFile("tirmidhi");
    this.loadHadithsFromFile("abudawud");

    console.log(`Loaded ${this.hadiths.size} hadiths from ${this.hadithCollections.size} collections`);
  }

  private loadHadithsFromFile(collectionId: string) {
    // Try multiple possible locations for the JSON files
    const possiblePaths = [
      join(__dirname, "..", `${collectionId}.json`), // Root directory
      join(__dirname, "..", "client", "src", "data", "hadith-collections", `${collectionId}.json`), // Client data directory
    ];

    let filePath: string | null = null;
    for (const path of possiblePaths) {
      if (existsSync(path)) {
        filePath = path;
        break;
      }
    }

    if (!filePath) {
      console.log(`Warning: ${collectionId}.json not found in any expected location`);
      return;
    }

    try {
      console.log(`Loading ${collectionId}.json...`);
      const fileContent = readFileSync(filePath, "utf-8");

      // Try to parse JSON
      let data;
      try {
        data = JSON.parse(fileContent);
      } catch (parseError) {
        console.error(`JSON parsing error in ${collectionId}.json - skipping this file`);
        console.error(`Error details: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
        return;
      }

      // Get chapters for reference
      const chapters = data.chapters || [];
      const chapterMap = new Map(chapters.map((ch: any) => [ch.id, ch]));

      // Load hadiths
      const hadiths = data.hadiths || [];
      let loadedCount = 0;

      hadiths.forEach((hadithData: any) => {
        try {
          const chapter = chapterMap.get(hadithData.chapterId);

          const hadith: Hadith = {
            id: `${collectionId}-${hadithData.id}`,
            collectionId: collectionId,
            hadithNumber: hadithData.idInBook?.toString() || hadithData.id?.toString() || "0",
            arabicText: hadithData.arabic || "",
            englishTranslation: hadithData.english?.text || "",
            narrator: hadithData.english?.narrator || null,
            book: chapter?.english || null,
            chapter: null,
            urduTranslation: hadithData.urdu || null,
            romanUrduTranslation: hadithData.romanUrdu || null,
            grade: hadithData.grade || "Sahih",
            createdAt: new Date()
          };

          this.hadiths.set(hadith.id, hadith);
          loadedCount++;
        } catch (hadithError) {
          // Skip individual hadiths that fail to parse
          console.error(`Error loading hadith ${hadithData?.id} from ${collectionId}`);
        }
      });

      console.log(`Successfully loaded ${loadedCount} hadiths from ${collectionId}.json`);
    } catch (error) {
      console.error(`Error loading ${collectionId}.json:`, error instanceof Error ? error.message : String(error));
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Hadith Collection methods
  async getHadithCollections(): Promise<HadithCollection[]> {
    return Array.from(this.hadithCollections.values());
  }

  async getHadithCollection(id: string): Promise<HadithCollection | undefined> {
    return this.hadithCollections.get(id);
  }

  async createHadithCollection(insertCollection: InsertHadithCollection): Promise<HadithCollection> {
    const id = randomUUID();
    const collection: HadithCollection = { 
      ...insertCollection, 
      id,
      description: insertCollection.description || null,
      arabicName: insertCollection.arabicName || null,
      totalHadiths: insertCollection.totalHadiths || 0
    };
    this.hadithCollections.set(id, collection);
    return collection;
  }

  // Hadith methods
  async getHadiths(params?: {
    collectionId?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<Hadith[]> {
    let hadiths = Array.from(this.hadiths.values());

    if (params?.collectionId) {
      hadiths = hadiths.filter(hadith => hadith.collectionId === params.collectionId);
    }

    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      const originalSearch = params.search; // Keep original for Arabic search

      hadiths = hadiths.filter(hadith => {
        // Search in English translation
        const englishMatch = hadith.englishTranslation.toLowerCase().includes(searchTerm);

        // Search in Arabic text (case-sensitive for Arabic)
        const arabicMatch = hadith.arabicText.includes(originalSearch);

        // Search in Urdu translation
        const urduMatch = hadith.urduTranslation ? hadith.urduTranslation.includes(originalSearch) : false;

        // Search in Roman Urdu translation
        const romanUrduMatch = hadith.romanUrduTranslation ?
          hadith.romanUrduTranslation.toLowerCase().includes(searchTerm) : false;

        // Search in narrator name
        const narratorMatch = hadith.narrator ?
          hadith.narrator.toLowerCase().includes(searchTerm) : false;

        // Search in book name
        const bookMatch = hadith.book ?
          hadith.book.toLowerCase().includes(searchTerm) : false;

        // Search in chapter name
        const chapterMatch = hadith.chapter ?
          hadith.chapter.toLowerCase().includes(searchTerm) : false;

        // Search in hadith number
        const numberMatch = hadith.hadithNumber.toLowerCase().includes(searchTerm);

        return englishMatch || arabicMatch || urduMatch || romanUrduMatch ||
               narratorMatch || bookMatch || chapterMatch || numberMatch;
      });
    }

    const offset = params?.offset || 0;
    const limit = params?.limit || hadiths.length;

    return hadiths.slice(offset, offset + limit);
  }

  async getHadith(id: string): Promise<Hadith | undefined> {
    return this.hadiths.get(id);
  }

  async createHadith(insertHadith: InsertHadith): Promise<Hadith> {
    const id = randomUUID();
    const hadith: Hadith = { 
      ...insertHadith, 
      id, 
      createdAt: new Date(),
      book: insertHadith.book || null,
      chapter: insertHadith.chapter || null,
      urduTranslation: insertHadith.urduTranslation || null,
      romanUrduTranslation: insertHadith.romanUrduTranslation || null,
      narrator: insertHadith.narrator || null,
      grade: insertHadith.grade || null
    };
    this.hadiths.set(id, hadith);
    return hadith;
  }

  async searchHadiths(query: string, collectionId?: string): Promise<Hadith[]> {
    return this.getHadiths({ search: query, collectionId });
  }

  // Bookmark methods
  async getUserBookmarks(userId: string): Promise<Bookmark[]> {
    return Array.from(this.bookmarks.values()).filter(
      bookmark => bookmark.userId === userId
    );
  }

  async createBookmark(insertBookmark: InsertBookmark): Promise<Bookmark> {
    const id = randomUUID();
    const bookmark: Bookmark = { ...insertBookmark, id, createdAt: new Date() };
    this.bookmarks.set(id, bookmark);
    return bookmark;
  }

  async deleteBookmark(userId: string, hadithId: string): Promise<boolean> {
    const bookmark = Array.from(this.bookmarks.values()).find(
      b => b.userId === userId && b.hadithId === hadithId
    );
    if (bookmark) {
      this.bookmarks.delete(bookmark.id);
      return true;
    }
    return false;
  }

  // User Preferences methods
  async getUserPreferences(userId: string): Promise<UserPreferences | undefined> {
    return Array.from(this.userPreferences.values()).find(
      pref => pref.userId === userId
    );
  }

  async updateUserPreferences(userId: string, preferences: Partial<InsertUserPreferences>): Promise<UserPreferences> {
    let userPrefs = await this.getUserPreferences(userId);
    
    if (!userPrefs) {
      const id = randomUUID();
      userPrefs = {
        id,
        userId,
        fontSize: "medium",
        theme: "light",
        showDiacritics: true,
        autoPlayAudio: false,
        ...preferences
      };
    } else {
      userPrefs = { ...userPrefs, ...preferences };
    }
    
    this.userPreferences.set(userPrefs.id, userPrefs);
    return userPrefs;
  }
}

export const storage = new MemStorage();
