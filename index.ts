import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { jwt } from "hono/jwt";
import { db } from "./src/db/index.js";
import { teams } from "./src/db/schema.js";
import { TeamController } from "./src/controllers/teamController.js";
import { PeopleController } from "./src/controllers/peopleController.js";
import { MatchController } from "./src/controllers/matchController.js";

const app = new Hono();

//middleware
app.use("*", cors());
// app.use("/api/teams/*", jwt({ secret: "my-super-secret-key" }));

app.get("/", (c) => {
  return c.text("Hello Hono!");
});


//Teams routes
app.post("/api/teams", TeamController.createTeam);
app.get("/api/teams", TeamController.getAllTeams);
app.get("/api/teams/:id", TeamController.getTeamWithPeople);

// People routes
app.post("/api/people", PeopleController.createPerson);
app.get("/api/players/search", PeopleController.getPlayersByPosition);
app.get("/api/roles", PeopleController.getRoles);

// Match routes
app.post('/api/match/simulate', MatchController.simulateMatch);
app.get('/api/matches', MatchController.getAllMatches);

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
