import { and, eq } from "drizzle-orm";
import { people, roles } from "../db/schema.js";
import { db } from "../db/index.js";

export class PeopleService {
  static async createPerson(data: {
    name: string;
    age: number;
    teamId: number;
    roleId: number;
    position?: string;
    dorsal?: string;
    strategy?: string;
  }) {
    if (data.roleId === 2) {
      const existingTrainer = await db
        .select()
        .from(people)
        .where(and(eq(people.teamId, data.teamId), eq(people.roleId, 2)))
        .get();

      if (existingTrainer) {
        throw new Error("Ya existe un entrenador para este equipo");
      }
    }

    const result = await db.insert(people).values(data).returning();
    return result[0];
  }

  static async getPlayersByPosition(position: string) {
    return await db
      .select({
        id: people.id,
        name: people.name,
        position: people.position,
        dorsal: people.dorsal,
        age: people.age,
        teamId: people.teamId,
      })
      .from(people)
      .innerJoin(roles, eq(people.roleId, roles.id))
      .where(and(eq(roles.name, "player"), eq(people.position, position)));
  }

  static async getAllRoles() {
    return await db.select().from(roles);
  }
}
