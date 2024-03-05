import express from 'express'
import submissions from './submissions'

const router = express.Router()
router.use('/submissions', submissions)

export default router
