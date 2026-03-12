const express = require("express")
const cors = require("cors")
const { Pool } = require("pg")

const app = express()
const port = 5000

app.use(cors())
app.use(express.json())


const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "todo_db",
  password: "Admin",
  port: 5432,
})

app.get("/todos", async (req, res) => {
  const result = await pool.query('SELECT * FROM todos ORDER BY "number of list" DESC')
  res.json(result.rows)
})

app.post("/todos", async (req, res) => {
  const { text } = req.body
  const result = await pool.query(
    'INSERT INTO todos ("todo list", completed) VALUES ($1, $2) RETURNING *',
    [text, false]
  )
  res.json(result.rows[0])
})

app.put("/todos/:id", async (req, res) => {
  const { id } = req.params
  const { completed } = req.body

  await pool.query(
    'UPDATE todos SET completed=$1 WHERE "number of list"=$2 RETURNING *',
    [completed, id]
  )

  res.json({ message: "updated" })
})

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params
  await pool.query('DELETE FROM todos WHERE "number of list"=$1', [id])
  res.json({ message: "deleted" })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})