import express, { json } from 'express'
import cors from 'cors'

const PORT = 3500
const app = express()

let data = []

app.use(cors())

app.use(express.json())

app.post('/', (req, res) => {
  const newData = req.body
  data.push(newData)
  res.status(200).json({ message: 'Data added', data })
})

app.put('/:index', (req, res) => {
  const { index } = req.params
  const updatedPlane = req.body

  if (data[index]) {
    data[index] = updatedPlane
    res.status(200).json({ message: "Plane updated", data })
  } else {
    res.status(404).json({ message: "Plane not found" })
  }
})

app.get('/', (req, res) => {
  res.status(200).json(data)
})

app.delete('/:index', (req, res) => {
  const { index } = req.params

  if (data[index]) {
    data.splice(Number(index), 1)
    res.status(200).json({ message: 'Plane deleted', data })
  } else {
    res.status(404).json({ message: "Plane not found" })
  }
})

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
