import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const hadithCollections = pgTable("hadith_collections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  arabicName: text("arabic_name"),
  compiler: text("compiler").notNull(),
  description: text("description"),
  totalHadiths: integer("total_hadiths").notNull().default(0),
});

export const hadiths = pgTable("hadiths", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  collectionId: varchar("collection_id").notNull().references(() => hadithCollections.id),
  hadithNumber: text("hadith_number").notNull(),
  book: text("book"),
  chapter: text("chapter"),
  arabicText: text("arabic_text").notNull(),
  englishTranslation: text("english_translation").notNull(),
  urduTranslation: text("urdu_translation"),
  romanUrduTranslation: text("roman_urdu_translation"),
  narrator: text("narrator"),
  grade: text("grade"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookmarks = pgTable("bookmarks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  hadithId: varchar("hadith_id").notNull().references(() => hadiths.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userPreferences = pgTable("user_preferences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  fontSize: text("font_size").default("medium"),
  theme: text("theme").default("light"),
  showDiacritics: boolean("show_diacritics").default(true),
  autoPlayAudio: boolean("auto_play_audio").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertHadithCollectionSchema = createInsertSchema(hadithCollections).omit({
  id: true,
});

export const insertHadithSchema = createInsertSchema(hadiths).omit({
  id: true,
  createdAt: true,
});

export const insertBookmarkSchema = createInsertSchema(bookmarks).omit({
  id: true,
  createdAt: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertHadithCollection = z.infer<typeof insertHadithCollectionSchema>;
export type HadithCollection = typeof hadithCollections.$inferSelect;

export type InsertHadith = z.infer<typeof insertHadithSchema>;
export type Hadith = typeof hadiths.$inferSelect;

export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
export type Bookmark = typeof bookmarks.$inferSelect;

export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;
