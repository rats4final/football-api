import type { Context } from "hono";
import { TeamService } from "../services/teamService.js";

export class TeamController {
  static async createTeam(c: Context) {
    try {
      const { name } = await c.req.json();
      const team = await TeamService.createTeam(name);
      return c.json(team, 201);
    } catch (error) {
      return c.json({ error: "Error al crear el equipo" }, 400);
    }
  }

  static async getAllTeams(c: Context) {
    try {
      const teams = await TeamService.getAllTeams();
      return c.json(teams);
    } catch (error) {
      return c.json({ error: "Fallo al obtener los equipos" }, 500);
    }
  }

  static async getTeamWithPeople(c: Context) {
    try {
      const teamId = parseInt(c.req.param("id"));
      const team = await TeamService.getTeamWithPeople(teamId);

      if (!team) {
        return c.json({ error: "Equipo no encontrado" }, 404);
      }

      return c.json(team);
    } catch (error) {
      return c.json({ error: "Fallo al obtener equipo" }, 500);
    }
  }
}
