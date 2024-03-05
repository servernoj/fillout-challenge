import express from 'express'
import submissions from './submissions'

const router = express.Router()
router.use('/submissions', submissions)
router.use('*', (req, res) => {
  res.status(404).send('Not found')
})

export default router
