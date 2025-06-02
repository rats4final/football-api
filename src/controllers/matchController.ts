import type { Context } from 'hono';
import { MatchService } from '../services/matchService.js';

export class MatchController {
  static async simulateMatch(c: Context) {
    try {
      const { homeTeamId, awayTeamId } = await c.req.json();
      
      if (homeTeamId === awayTeamId) {
        return c.json({ error: 'Un equipo no puede jugar contra si mismo' }, 400);
      }
      
      const match = await MatchService.simulateMatch(homeTeamId, awayTeamId);
      return c.json(match, 201);
    } catch (error: any) {
      return c.json({ error: error.message || 'Fallo al simular partido' }, 400);
    }
  }

  static async getAllMatches(c: Context) {
    try {
      const matches = await MatchService.getAllMatches();
      return c.json(matches);
    } catch (error) {
      return c.json({ error: 'Fallo al obtener partidos' }, 500);
    }
  }
}