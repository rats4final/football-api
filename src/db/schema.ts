import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { eq, sql } from "drizzle-orm";

export const roles = sqliteTable("roles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  description: text("description"),
});

export const teams = sqliteTable("teams", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  wins: integer("wins").notNull().default(0),
  losses: integer("losses").notNull().default(0),
  draws: integer("draws").notNull().default(0),
  createdAt: text("created_at").default("datetime('now')"),
});

export const people = sqliteTable(
  "people",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    position: text("position"), //jugador
    dorsal: text("dorsal"), //jugador
    age: integer("age").notNull(),
    strategy: text("strategy"), //entrenador
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    roleId: integer("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "cascade" }),
  },
  (table) => ({
    uniqueTrainerPerTeam: uniqueIndex("unique_trainer_per_team")
      .on(table.teamId, table.roleId)
      .where(sql`${table.roleId} = 2`), // Only enforce uniqueness for trainers (roleId = 2)
  })
);

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: text("created_at").default("datetime('now')"),
});

export const matches = sqliteTable("matches", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  date: text("date").notNull(),
  homeTeamId: integer("home_team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  awayTeamId: integer("away_team_id")
    .notNull()
    .references(() => teams.id, { onDelete: "cascade" }),
  homeScore: integer("home_score").notNull().default(0),
  awayScore: integer("away_score").notNull().default(0),
  winnerId: integer("winner_id").references(() => teams.id),
  createdAt: text("created_at").default("datetime('now')"),
});

export const insertTeamSchema = createInsertSchema(teams);
export const selectTeamSchema = createSelectSchema(teams);
export const insertUserSchema = createInsertSchema(users);
export const insertRoleSchema = createInsertSchema(roles);
export const selectRoleSchema = createSelectSchema(roles);
export const insertPeopleSchema = createInsertSchema(people);
export const selectPeopleSchema = createSelectSchema(people);
export const insertMatchSchema = createInsertSchema(matches);
export const selectMatchSchema = createSelectSchema(matches);
