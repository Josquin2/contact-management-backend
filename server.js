const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const db = require("./db");
const { sql } = require("drizzle-orm");
const usersTable = require("./contact");
const cors = require("cors");
dotenv.config();
// Creating server

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Handling GET / request
app.get("/", (req, res) => {
  res.send("This is the express server");
});

// Handling GET /hello request
app.get("/contacts", async (req, res) => {
  try {
    const users = await db.select().from(usersTable).execute();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/contacts/:id", async (req, res) => {
  try {
    const user = await db
      .select()
      .from(usersTable)
      .where((tbl) => tbl.id.equals(req.params.id))
      .execute();

    if (user.length) {
      res.json(user[0]);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

app.post("/contacts", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    console.log(req.body);

    const [id] = await db
      .insert(usersTable)
      .values({ name, email, phone })
      .execute();

    res.status(200).json(await db.select().from(usersTable));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/contacts", async (req, res) => {
  try {
    const { id, name, email, phone } = req.body;

    const user = await db
      .select()
      .from(usersTable)
      .where(sql`id = ${id}`)
      .execute();

    if (user.length > 0) {
      await db
        .update(usersTable)
        .set({ name: name, email: email, phone: phone })
        .where(sql`id = ${id}`)
        .execute();
      res.status(200).json(await db.select().from(usersTable));
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/contacts", async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const user = await db
      .select()
      .from(usersTable)
      .where(sql`id = ${id}`)
      .execute();

    if (user.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    await db
      .delete(usersTable)
      .where(sql`id = ${id}`)
      .execute();

    res.status(200).json(await db.select().from(usersTable));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Server listening to port 3000
app.listen(5101, () => {
  console.log("Server is Running");
});
