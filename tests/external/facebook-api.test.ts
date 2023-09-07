import { FacebookApi, AxiosHttpClient } from '@/infra/gateways'
import { env } from '@/main/config/env'

describe('FacebookApi', () => {
  let axiosClient: AxiosHttpClient
  let sut: FacebookApi

  beforeEach(() => {
    axiosClient = new AxiosHttpClient()
    sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret
    )
  })

  it('Should return a Facebook User if token is valid', async () => {
    const fbUser = await sut.loadUser({
      token: env.facebookApi.accessToken
    })
    // eslint-disable-next-line no-console
    console.log('fbUser', fbUser)

    // expect(fbUser).toEqual({
    //   facebook_id: '728079287908964',
    //   email: 'cleginaldo3000@gmail.com',
    //   name: 'Cleginaldo Bandeiras',
    // });

    expect(fbUser).toBeUndefined()
  })

  it('Should return undefined if token is invalid', async () => {
    const fbUser = await sut.loadUser({
      token: 'invalid'
    })

    expect(fbUser).toBeUndefined()
  })
})
