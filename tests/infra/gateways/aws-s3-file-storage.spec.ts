import { AwsS3FileStorage } from '@/infra/gateways'
import { S3, config } from 'aws-sdk'

jest.mock('aws-sdk')

describe('AwsS3FileStorage', () => {
  let accessKey: string
  let secret: string
  let Bucket: string
  let Key: string
  let sut: AwsS3FileStorage
  beforeAll(() => {
    accessKey = 'any_access_key'
    secret = 'any_secret'
    Bucket = 'any_bucket'
    Key = 'any_key'
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

  describe('upload', () => {
    let file: Buffer
    let putObjectPromiseSpy: jest.Mock
    let putObjectSpy: jest.Mock

    beforeAll(() => {
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

    it('Should rethrow if putObject throws', async () => {
      const error = new Error('upload_error')
      putObjectPromiseSpy.mockRejectedValueOnce(error)

      const promise = sut.upload({ file, key: 'any key' })

      await expect(promise).rejects.toThrow(error)
    })
  })

  // describe('delete', () => {
  //   let deleteObjectPromiseSpy: jest.Mock
  //   let deleteObjectSpy: jest.Mock

  //   beforeAll(() => {
  //     deleteObjectPromiseSpy = jest.fn()
  //     deleteObjectSpy = jest.fn().mockImplementation(() => ({
  //       promise: deleteObjectPromiseSpy
  //     }))
  //     jest.mocked(S3).mockImplementation(
  //       jest.fn().mockImplementation(() => ({
  //         putObject: deleteObjectSpy
  //       }))
  //     )
  //   })
  //   it('Should call deleteObject with correct input', async () => {
  //     await sut.delete({ key: Key })

  //     expect(deleteObjectSpy).toHaveBeenCalledWith({
  //       Bucket,
  //       Key
  //     })
  //     expect(deleteObjectSpy).toHaveBeenCalledTimes(1)
  //     expect(deleteObjectPromiseSpy).toHaveBeenCalledTimes(1)
  //   })
  // })
})
