import express from 'express'

const router = express.Router()

router.get('/', async (req, res): Promise<void> => {
  res.send('helloo')
})

export default router
