import axios from 'axios'
import express, { RequestHandler } from 'express'

const router = express.Router()

const setAxios: RequestHandler = async (req, res, next) => {
  const axiosInstance = axios.create({
    baseURL: `${process.env.BASE_URL}/${process.env.FORM_ID}`
  })
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${process.env.API_KEY}`
  req.axios = axiosInstance
  next()
}
router.use(setAxios)
router.get('/', async (req, res) => {
  const submissions = await req.axios.get('submissions').then(({ data }) => data)
  res.json(submissions)
})

export default router
