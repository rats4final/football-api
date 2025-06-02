import { desc, eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { people, roles, teams } from "../db/schema.js";

export class TeamService {
  static async createTeam(name: string) {
    const result = await db.insert(teams).values({ name }).returning();
    return result[0];
  }

  static async getAllTeams() {
    return await db.select().from(teams).orderBy(desc(teams.wins));
  }

  static async getTeamById(id: number) {
    return await db.select().from(teams).where(eq(teams.id, id)).get();
  }

  static async getTeamWithPeople(teamId: number) {
    const team = await this.getTeamById(teamId);
    if (!team) return null;

    const teamPeople = await db
      .select({
        id: people.id,
        name: people.name,
        position: people.position,
        dorsal: people.dorsal,
        age: people.age,
        strategy: people.strategy,
        role: roles.name,
      })
      .from(people)
      .innerJoin(roles, eq(people.roleId, roles.id))
      .where(eq(people.teamId, teamId));

    return {
      ...team,
      players: teamPeople.filter((p) => p.role === "player"),
      trainer: teamPeople.find((p) => p.role === "trainer") || null,
    };
  }

  static async updateTeamStats(
    teamId: number,
    wins: number,
    losses: number,
    draws: number
  ) {
    await db
      .update(teams)
      .set({ wins, losses, draws })
      .where(eq(teams.id, teamId));
  }
}
