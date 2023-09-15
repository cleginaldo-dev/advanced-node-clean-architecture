import { IDeleteFile, IUploadFile } from '@/domain/contracts/gateways'
import { S3, config } from 'aws-sdk'

export class AwsS3FileStorage implements IUploadFile, IDeleteFile {
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

  async delete({ key }: IDeleteFile.Input): Promise<void> {
    const s3 = new S3()
    await s3.deleteObject({ Bucket: this.bucket, Key: key }).promise()
  }
}
