const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const db = require("./db");
const { sql } = require("drizzle-orm");
const usersTable = require("./contact");
const cors = require("cors");
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/contacts", async (req, res) => {
  try {
    const users = await db.select().from(usersTable).execute();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/contacts", async (req, res) => {
  try {
    const { name, email, phone } = req.body;
    console.log(req.body);

    await db.insert(usersTable).values({ name, email, phone }).execute();

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

app.listen(5101, () => {
  console.log("Server is Running");
});
