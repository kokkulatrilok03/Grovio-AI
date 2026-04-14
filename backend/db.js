const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, "notes.db");
const db = new sqlite3.Database(dbPath);

const initializeDatabase = () =>
  new Promise((resolve, reject) => {
    db.run(
      `CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        content TEXT
      )`,
      (error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      }
    );
  });

const run = (query, params = []) =>
  new Promise((resolve, reject) => {
    db.run(query, params, function onRun(error) {
      if (error) {
        reject(error);
        return;
      }
      resolve({ id: this.lastID, changes: this.changes });
    });
  });

const all = (query, params = []) =>
  new Promise((resolve, reject) => {
    db.all(query, params, (error, rows) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(rows);
    });
  });

const get = (query, params = []) =>
  new Promise((resolve, reject) => {
    db.get(query, params, (error, row) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(row);
    });
  });

module.exports = {
  initializeDatabase,
  run,
  all,
  get
};
