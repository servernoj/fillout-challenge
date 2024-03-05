import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'
import controller from './controller'

dotenv.config()

const app = express()
app.use(cors())
app.use(morgan('tiny'))
app.use('/', controller)
const port = 3000

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
