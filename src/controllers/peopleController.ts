import type { Context } from 'hono';
import { PeopleService } from '../services/peopleService.js';

export class PeopleController {
  static async createPerson(c: Context) {
    try {
      const data = await c.req.json();
      const person = await PeopleService.createPerson(data);
      return c.json(person, 201);
    } catch (error: any) {
      return c.json({ error: error.message || 'Fallo al crear persona' }, 400);
    }
  }

  static async getPlayersByPosition(c: Context) {
    try {
      const position = c.req.query('position');
      if (!position) {
        return c.json({ error: 'Parámetro position requerido' }, 400);
      }
      
      const players = await PeopleService.getPlayersByPosition(position);
      return c.json(players);
    } catch (error) {
      return c.json({ error: 'Fallo al obtener jugadores' }, 500);
    }
  }

  static async getRoles(c: Context) {
    try {
      const roles = await PeopleService.getAllRoles();
      return c.json(roles);
    } catch (error) {
      return c.json({ error: 'Fallo al obtener roles' }, 500);
    }
  }
}