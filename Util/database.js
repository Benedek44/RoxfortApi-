import sqlite from 'sqlite3';

const db = new sqlite.Database('./Data/database.sqlite');

export function dbAll(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);

      else resolve(rows);
    });
  });
}

export function dbGet(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);

      else resolve(row);
    });
  });
}

export function dbRun(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) reject(err);

            else resolve(this);
        });
    });
}

export async function initializeDatabase() {
    await dbRun('DROP TABLE IF EXISTS wizzards');
    await dbRun('CREATE TABLE IF NOT EXISTS wizzards (id INTEGER PRIMARY KEY AUTOINCREMENT, name STRING, magicWandName STRING, houseName STRING)');
    const wizzards = [
      {
        name: "Gandalf",
        magicWandName: "gandalf wand name",
        houseName: "Gandalfs house"
      },
      {
        name: "Dumbledore",
        magicWandName: "Dumledore wand name",
        houseName: "Dumledore house"
      },
      {
        name: "Merlin",
        magicWandName: "Merlin wand name",
        houseName: "Merlin house"
      }
    ];
    
    for (const wizzard of wizzards) {
        await dbRun('INSERT INTO wizzards (name, magicWandName, houseName) VALUES (?, ?, ?)', [wizzard.name, wizzard.magicWandName, wizzard.houseName]);
    }
}