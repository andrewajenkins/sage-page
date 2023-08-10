// const sqlite3 = require("sqlite3").verbose();
//
// const db = new sqlite3.Database("./sqlite3.db");
// db.close();
//
// function createTable(schema, name) {
//   const db = new sqlite3.Database("./db.sqlite3");
//   db.run(
//     "CREATE TABLE IF NOT EXISTS ?.? (id INT, name TEXT)",
//     [schema, name],
//     (err) => {
//       if (err) console.error("Error creating folders table:", err);
//       else console.log("Folders table created");
//     }
//   );
//   db.close();
// }
//
// // make sure schema exists
// createTable("sqlite_master", "folders");
// createTable("sqlite_master", "files");
// createTable("sqlite_master", "conversations");
// createTable("sqlite_master", "fild_contents");
// createTable("sqlite_master", "convo_contents");
//
//
//
// // fill with dummy data
// db.run('INSERT INTO folders (id, name) VALUES (1, "folder1")', (err) => {}
