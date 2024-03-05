import { AxiosInstance } from 'axios'

declare global {
  namespace Express {
    export interface Request {
      axios: AxiosInstance,
    }
  }
}
