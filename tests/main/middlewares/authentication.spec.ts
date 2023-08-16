import { ForbiddenError } from '@/application/errors'
import { app } from '@/main/config/app'
import { env } from '@/main/config/env'
import { auth } from '@/main/middlewares'
import { sign } from 'jsonwebtoken'
import request from 'supertest'

describe('Authentication Middleware', () => {
  it('Should return 403 if authentication header was not provided', async () => {
    app.get('/test', auth, (req, res) => {
      res.json(req.locals)
    })

    const { status, body } = await request(app).get('/test')

    expect(status).toBe(403)
    expect(body.error).toBe(new ForbiddenError().message)
  })

  test('should return 200 if authorization header is valid', async () => {
    const authorization = sign({ key: 'any_user_id' }, env.jwtSecret)

    app.get('/test', auth, (req, res) => {
      res.json(req.locals)
    })

    const { status, body } = await request(app)
      .get('/test')
      .set({ authorization })

    expect(status).toBe(200)
    expect(body).toEqual({ userId: 'any_user_id' })
  })
})
