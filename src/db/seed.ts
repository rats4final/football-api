import { db } from "./index.js";
import { roles } from "./schema.js";

export async function seedDatabase() {
  await db.insert(roles).values([
    {name: "player", description: "Jugador del equipo"},
    {name: "trainer", description: "Entrenador del equipo"},
  ]).onConflictDoNothing();
  console.log("Base de datos sembrada con roles iniciales");
}

seedDatabase().then(() => {
  console.log("Sembrado completado");
}).catch((error) => {
  console.error("Error al sembrar la base de datos:", error);
});