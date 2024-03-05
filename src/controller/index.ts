import express from 'express'
import filteredResponses from './filteredResponses'

const router = express.Router()
router.use('/', filteredResponses)
router.get('/health', (req, res) => {
  res.status(200).send('OK')
})
router.use('*', (req, res) => {
  res.status(404).send('Not found')
})

export default router
