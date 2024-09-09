//? SEE MY STUDY BOOK FOR MORE INDEPTH NOTES
//! Import our packages:
import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

//! enabling the imported packages:
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

//! connecting to our db:
const db = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});

//! Start the server:
app.listen(8080, () => {
    console.log("app is running on 8080fm...jokes Port obvs")
});

//! making a GET home endpoint
app.get("/", (request, response) => {
    response.json("This is the home route! Get out immediately!")
});

//! making a GET endpoint for the db, using our db name:
app.get("/medievalscroll", async (request, response) => {
    const medievalscroll = await db.query("SELECT * FROM medievalscroll")
    response.json(medievalscroll.rows);
});

//! making a POST to add new entries to our db:

app.post("/medievalscroll", async (request, response) => {
    const speaker = request.body.speaker;
    const title = request.body.title;
    const town = request.body.title;
    const stead = request.body.title;
    const message = request.body.message;
    const newMessage = await db.query(
        "INSERT INTO medievalscroll (speaker, title, town, stead, message, likes, dislikes) VALUES ($1, $2, $3, $4, $5, 0, 0) RETURNING *",
        [speaker, title, town, stead, message]
    )
    response.json(newMessage[0]);
})

// New route for likes
app.post("/medievalscroll/:id/like", async (request, response) => {
    const { id } = request.params;
    const updatedMessage = await db.query(
        "UPDATE medievalscroll SET likes = COALESCE(likes, 0) + 1 WHERE id = $1 RETURNING *",
        [id]
    );
    response.json(updatedMessage.rows[0]);
});

// New route for dislikes
app.post("/medievalscroll/:id/dislike", async (request, response) => {
    const { id } = request.params;
    const updatedMessage = await db.query(
        "UPDATE medievalscroll SET dislikes = COALESCE(dislikes, 0) + 1 WHERE id = $1 RETURNING *",
        [id]
    );
    response.json(updatedMessage.rows[0]);
});