import { config } from 'aws-sdk'

jest.mock('aws-sdk')

export class AwsS3FileStorage {
  constructor(accessKey: string, secret: string) {
    config.update({
      credentials: { accessKeyId: accessKey, secretAccessKey: secret }
    })
  }
}

describe('AwsS3FileStorage', () => {
  let accessKey: string
  let secret: string
  let sut: AwsS3FileStorage
  beforeAll(() => {
    accessKey = 'any_access_key'
    secret = 'any_secret'
  })

  beforeEach(() => {
    sut = new AwsS3FileStorage(accessKey, secret)
  })

  it('Should config aws credentials on creation', () => {
    accessKey = 'any_access_key'
    secret = 'any_secret'

    expect(sut).toBeDefined()
    expect(config.update).toHaveBeenCalledWith({
      credentials: { accessKeyId: accessKey, secretAccessKey: secret }
    })
    expect(config.update).toHaveBeenCalledTimes(1)
  })
})
