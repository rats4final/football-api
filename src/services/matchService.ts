import { eq } from "drizzle-orm";
import { alias } from "drizzle-orm/sqlite-core";
import { db } from "../db/index.js";
import { matches, teams } from "../db/schema.js";
import { TeamService } from "./teamService.js";

export class MatchService {
  static async simulateMatch(homeTeamId: number, awayTeamId: number) {
    const homeTeam = await TeamService.getTeamById(homeTeamId);
    const awayTeam = await TeamService.getTeamById(awayTeamId);

    if (!homeTeam || !awayTeam) {
      throw new Error("Uno o ambos equipos no existen");
    }

    const homeScore = Math.floor(Math.random() * 10);
    const awayScore = Math.floor(Math.random() * 10);

    let winnerId = null; // null si es empate

    if (homeScore > awayScore) {
      winnerId = homeTeamId;
    } else if (awayScore > homeScore) {
      winnerId = awayTeamId;
    }

    const match = await db
      .insert(matches)
      .values({
        date: new Date().toISOString(),
        homeTeamId,
        awayTeamId,
        homeScore,
        awayScore,
        winnerId,
      })
      .returning();

    await this.updateTeamStats(homeTeamId, awayTeamId, homeScore, awayScore);

    return {
      ...match[0],
      homeTeam: homeTeam.name,
      awayTeam: awayTeam.name,
    };
  }

  private static async updateTeamStats(
    homeTeamId: number,
    awayTeamId: number,
    homeScore: number,
    awayScore: number
  ) {
    const homeTeam = await TeamService.getTeamById(homeTeamId);
    const awayTeam = await TeamService.getTeamById(awayTeamId);

    if (homeScore > awayScore) {
      // Home team wins
      await TeamService.updateTeamStats(
        homeTeamId,
        homeTeam!.wins + 1,
        homeTeam!.losses,
        homeTeam!.draws
      );
      await TeamService.updateTeamStats(
        awayTeamId,
        awayTeam!.wins,
        awayTeam!.losses + 1,
        awayTeam!.draws
      );
    } else if (awayScore > homeScore) {
      // Away team wins
      await TeamService.updateTeamStats(
        homeTeamId,
        homeTeam!.wins,
        homeTeam!.losses + 1,
        homeTeam!.draws
      );
      await TeamService.updateTeamStats(
        awayTeamId,
        awayTeam!.wins + 1,
        awayTeam!.losses,
        awayTeam!.draws
      );
    } else {
      // Draw
      await TeamService.updateTeamStats(
        homeTeamId,
        homeTeam!.wins,
        homeTeam!.losses,
        homeTeam!.draws + 1
      );
      await TeamService.updateTeamStats(
        awayTeamId,
        awayTeam!.wins,
        awayTeam!.losses,
        awayTeam!.draws + 1
      );
    }
  }  static async getAllMatches() {
    const homeTeam = alias(teams, 'homeTeam');
    const awayTeam = alias(teams, 'awayTeam');
    
    return await db
      .select({ 
        id: matches.id,
        date: matches.date,
        homeScore: matches.homeScore,
        awayScore: matches.awayScore,
        homeTeam: { id: homeTeam.id, name: homeTeam.name },
        awayTeam: { id: awayTeam.id, name: awayTeam.name },
      })
      .from(matches)
      .leftJoin(homeTeam, eq(matches.homeTeamId, homeTeam.id))
      .leftJoin(awayTeam, eq(matches.awayTeamId, awayTeam.id));
  }
}
