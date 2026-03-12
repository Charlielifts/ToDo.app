const express = require("express")
const cors = require("cors")
const { Pool } = require("pg")

const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

app.get("/todos", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM todos ORDER BY number_of_list DESC"
    )
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

app.post("/todos", async (req, res) => {
  try {
    const { text } = req.body

    const result = await pool.query(
      "INSERT INTO todos (todo_list, completed) VALUES ($1,$2) RETURNING *",
      [text, false]
    )

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { completed } = req.body

    const result = await pool.query(
      "UPDATE todos SET completed=$1 WHERE number_of_list=$2 RETURNING *",
      [completed, id]
    )

    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params

    await pool.query(
      "DELETE FROM todos WHERE number_of_list=$1",
      [id]
    )

    res.json({ message: "deleted" })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

app.get("/", (req, res) => {
  res.send("Todo API running")
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
