import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../skynapse.db');

const db = new Database(':memory:');

// Initialize Schema
export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS incidents (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      location TEXT NOT NULL,
      lat REAL NOT NULL,
      lng REAL NOT NULL,
      severity TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      status TEXT DEFAULT 'Active'
    );

    CREATE TABLE IF NOT EXISTS training_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      model_name TEXT NOT NULL,
      status TEXT NOT NULL,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE TABLE IF NOT EXISTS predictions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      location_id INTEGER,
      hour INTEGER,
      density INTEGER,
      threat_level INTEGER,
      confidence REAL,
      timestamp TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed initial data if empty
  const count = db.prepare('SELECT count(*) as count FROM incidents').get() as { count: number };
  if (count.count === 0) {
    console.log("Seeding database with synthetic data...");
    const locations = ["Hitech City", "Charminar", "Banjara Hills", "Secunderabad", "Gachibowli"];
    const types = ["Theft", "Arson", "Fighting", "Suspicious Activity", "Traffic Violation"];
    const severities = ["Low", "Medium", "High", "Critical"];
    
    // Base coordinates for Hyderabad
    const baseLat = 17.3850;
    const baseLng = 78.4867;

    const insert = db.prepare(`
      INSERT INTO incidents (type, location, lat, lng, severity, timestamp)
      VALUES (@type, @location, @lat, @lng, @severity, @timestamp)
    `);

    const insertMany = db.transaction((incidents) => {
      for (const incident of incidents) insert.run(incident);
    });

    const seedData = [];
    for (let i = 0; i < 50; i++) {
      seedData.push({
        type: types[Math.floor(Math.random() * types.length)],
        location: locations[Math.floor(Math.random() * locations.length)],
        lat: baseLat + (Math.random() * 0.1 - 0.05),
        lng: baseLng + (Math.random() * 0.1 - 0.05),
        severity: severities[Math.floor(Math.random() * severities.length)],
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString()
      });
    }

    insertMany(seedData);
    console.log("Database seeded.");
  }
}

export default db;
