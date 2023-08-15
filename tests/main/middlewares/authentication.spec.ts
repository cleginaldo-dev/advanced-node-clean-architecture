import { ForbiddenError } from '@/application/errors'
import { app } from '@/main/config/app'
import { auth } from '@/main/middlewares'
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
})
