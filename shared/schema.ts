import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// TestProject schema
export const testProjects = pgTable("test_projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  requirements: jsonb("requirements").notNull(),
  testCases: jsonb("test_cases").notNull(),
  includeEdgeCases: boolean("include_edge_cases").default(true).notNull(),
  includeNegativeTests: boolean("include_negative_tests").default(true).notNull(),
  includePerformanceTests: boolean("include_performance_tests").default(false).notNull(),
});

export const insertTestProjectSchema = createInsertSchema(testProjects).omit({
  id: true,
  createdAt: true,
});

// Requirement schema for validation
export const requirementSchema = z.object({
  id: z.string(),
  text: z.string().min(1),
});

// TestCase schema for validation
export const testCaseSchema = z.object({
  id: z.string(),
  description: z.string().min(1),
  type: z.enum(["positive", "negative", "edge_case", "performance"]),
  expectedResult: z.string().min(1),
  requirement: z.string(),
});

// Generation options schema
export const generationOptionsSchema = z.object({
  includeEdgeCases: z.boolean().default(true),
  includeNegativeTests: z.boolean().default(true),
  includePerformanceTests: z.boolean().default(false),
  outputFormat: z.enum(["excel", "csv"]).default("excel"),
});

// Input types
export type InputType = "text" | "file" | "gdoc";

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTestProject = z.infer<typeof insertTestProjectSchema>;
export type TestProject = typeof testProjects.$inferSelect;

export type Requirement = z.infer<typeof requirementSchema>;
export type TestCase = z.infer<typeof testCaseSchema>;
export type GenerationOptions = z.infer<typeof generationOptionsSchema>;
