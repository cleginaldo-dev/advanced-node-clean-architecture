import { IUploadFile } from '@/domain/contracts/gateways'
import { S3, config } from 'aws-sdk'

jest.mock('aws-sdk')

export class AwsS3FileStorage implements IUploadFile {
  constructor(
    accessKey: string,
    secret: string,
    private readonly bucket: string
  ) {
    config.update({
      credentials: { accessKeyId: accessKey, secretAccessKey: secret }
    })
  }

  async upload({ file, key }: IUploadFile.Input): Promise<IUploadFile.Output> {
    const s3 = new S3()
    await s3
      .putObject({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ACL: 'public-read'
      })
      .promise()
    return `https://${this.bucket}.s3.amazonaws.com/${encodeURIComponent(key)}`
  }
}

describe('AwsS3FileStorage', () => {
  let accessKey: string
  let secret: string
  let Bucket: string
  let Key: string
  let file: Buffer
  let putObjectPromiseSpy: jest.Mock
  let putObjectSpy: jest.Mock
  let sut: AwsS3FileStorage
  beforeAll(() => {
    accessKey = 'any_access_key'
    secret = 'any_secret'
    Bucket = 'any_bucket'
    Key = 'any_key'
    file = Buffer.from('any_buffer')
    putObjectPromiseSpy = jest.fn()
    putObjectSpy = jest.fn().mockImplementation(() => ({
      promise: putObjectPromiseSpy
    }))
    jest.mocked(S3).mockImplementation(
      jest.fn().mockImplementation(() => ({
        putObject: putObjectSpy
      }))
    )
  })

  beforeEach(() => {
    sut = new AwsS3FileStorage(accessKey, secret, Bucket)
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

  it('Should call putObject with correct input', async () => {
    await sut.upload({ file, key: Key })

    expect(putObjectSpy).toHaveBeenCalledWith({
      Bucket,
      Key,
      Body: file,
      ACL: 'public-read'
    })
    expect(putObjectSpy).toHaveBeenCalledTimes(1)
    expect(putObjectPromiseSpy).toHaveBeenCalledTimes(1)
  })

  it('Should return imageUrl', async () => {
    const imageUrl = await sut.upload({ file, key: Key })

    expect(imageUrl).toBe(`https://${Bucket}.s3.amazonaws.com/${Key}`)
  })

  it('Should return encoded imageUrl', async () => {
    const imageUrl = await sut.upload({ file, key: 'any key' })

    expect(imageUrl).toBe(`https://${Bucket}.s3.amazonaws.com/any%20key`)
  })
})
