# Backend de la App de Fútbol ⚽

API desarrollada con **Hono** y **Drizzle ORM**, que permite gestionar equipos de fútbol, jugadores y entrenadores.  
Se diseñó con una arquitectura sencilla basada en **servicios** y **controladores**, facilitando la separación de responsabilidades.

## 🛠️ Tecnologías utilizadas

- [Hono](https://hono.dev/) (framework web ultrarrápido para Node.js)  
- [Drizzle ORM](https://orm.drizzle.team/) (ORM ligero y tipado para bases de datos SQL)  
- [TypeScript](https://www.typescriptlang.org/)  

## 🚀 Funcionalidades principales

- Crear equipos con nombre.  
- Añadir jugadores con nombre, posición, número y edad.  
- Asignar entrenadores con estrategia.  
- Listar el equipo completo.  
- Buscar jugadores por posición.  
- Simular partidos entre equipos, con ganador aleatorio.  
- Mostrar el ranking de equipos con más victorias.  

## ▶️ Ejecución del proyecto

Instala dependencias:

```bash
npm install
# o
yarn install
```
Levanta el servidor en modo desarrollo:

```bash
npm run dev
```
El servidor se ejecutará en:
```bash
http://localhost:3000
```
## 📂 Estructura básica

src/\
  controllers/   -> Lógica de endpoints\
  services/      -> Reglas de negocio y conexión a BD\
  db/            -> Configuración de Drizzle ORM\
