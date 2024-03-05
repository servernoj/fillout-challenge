import axios from 'axios'
import express, { RequestHandler } from 'express'
import { toPairs, fromPairs } from 'lodash'
import querystring from 'node:querystring'

const router = express.Router()

type SubmissionsQuery = {
  limit: number
  afterDate: string
  beforeDate: string
  offset: number
  status: string
  includeEditLink: boolean
  sort: 'asc' | 'desc'
  filters: string
}

const passThroughQueryKeys = ['afterDate', 'beforeDate', 'status', 'includeEditLink', 'sort'] as const
type PassThroughQuery = {
  [key in typeof passThroughQueryKeys[number]]: SubmissionsQuery[key]
}
type LandedQuery = Omit<SubmissionsQuery, typeof passThroughQueryKeys[number]>

type FilterClauseType = {
  id: string
  condition: 'equals' | 'does_not_equal' | 'greater_than' | 'less_than'
  value: number | string
}

type Submissions = {
  responses: Array<{
    questions: Array<{
      id: string
      name: string,
      type: string,
      value: number | string
    }>
  }>
}

const setAxios: RequestHandler = async (req, res, next) => {
  const axiosInstance = axios.create({
    baseURL: `${process.env.BASE_URL}`
  })
  axiosInstance.defaults.headers.common.Authorization = `Bearer ${process.env.API_KEY}`
  req.axios = axiosInstance
  next()
}
router.use(setAxios)

router.get('/:formId/filteredResponses', async (req, res) => {
  const formId = req.params.formId
  const passThroughQuery = querystring.stringify(
    fromPairs(
      toPairs(req.query).filter(
        ([k]) => passThroughQueryKeys.includes(k as any)
      )
    ) as unknown as PassThroughQuery
  )
  const { limit, offset = 0, filters } = req.query as unknown as LandedQuery
  const filtersParsed = [] as Array<FilterClauseType>
  try {
    filtersParsed.push(...JSON.parse(filters ?? '[]'))
  } catch (e) {
    res.status(400).json({ msg: 'unable to process \'filters\' query param' })
    return
  }

  const submissions = await req.axios.get<Submissions>(`${formId}/submissions?${passThroughQuery}`).then(({ data }) => data)
  const responsesFiltered = submissions.responses.filter(
    s => s.questions.every(
      q => {
        const filter = filtersParsed.find(
          f => f.id === q.id
        )
        if (!filter) {
          return true
        }
        switch (filter.condition) {
          case 'equals': return q.value === filter.value
          case 'does_not_equal': return q.value !== filter.value
          case 'greater_than': return q.type === 'DatePicker'
            ? new Date(q.value) > new Date(filter.value)
            : q.value > filter.value
          case 'less_than': return q.type === 'DatePicker'
            ? new Date(q.value) < new Date(filter.value)
            : q.value < filter.value
          default: return false
        }
      }
    )
  )
  res.json({
    responses: limit
      ? responsesFiltered.slice(offset, offset + limit)
      : responsesFiltered.slice(offset),
    totalResponses: responsesFiltered.length,
    pageCount: limit
      ? Math.ceil(responsesFiltered.length / limit)
      : 1
  })
})

export default router
