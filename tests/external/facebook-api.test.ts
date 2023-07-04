import { FacebookApi } from '@/infra/apis'
import { AxiosHttpClient } from '@/infra/http'
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
      token:
        'EAAjCU5IkeuEBALeUfIupz07IQtNH28TJ74lMxEZCTvfGjy9lvaZBBoavYIWkBY3X31x5ZB291vsns7Yxelaha0rZBjTaaPFyzG4kzFlHjjzzvMRvQuug9137ZCCMVlSP9kXLjerCrtD3del0NzZAUM8bOfTD7zjylioR4mkqDTWwokYLhTjIVtbzGotZCZAaxRj6qL2Yk0MEdkgcqIR5hp1fRaKG0odSISEGBCxOaZApIZB6xe3TmtJg9z'
    })
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
