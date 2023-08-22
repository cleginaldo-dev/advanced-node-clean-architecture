import { MockProxy, mock } from 'jest-mock-extended'

type Setup = (
  fileStorage: IUploadFile,
  crypto: IUuidGenerator
) => ChangeProfilePicture
type Input = { id: string; file: Buffer }
export type ChangeProfilePicture = (input: Input) => Promise<void>

export const setupChangeProfilePicture: Setup =
  (fileStorage, crypto) =>
  async ({ id, file }) => {
    await fileStorage.upload({ file, key: crypto.uuid({ key: id }) })
  }

export interface IUploadFile {
  upload: (input: IUploadFile.Input) => Promise<void>
}

export namespace IUploadFile {
  export type Input = { file: Buffer; key: string }
}

export interface IUuidGenerator {
  uuid: (input: IUuidGenerator.Input) => IUuidGenerator.Output
}

export namespace IUuidGenerator {
  export type Input = { key: string }
  export type Output = string
}

describe('ChangeProfilePicture', () => {
  let file: Buffer
  let uuid: string
  let crypto: MockProxy<IUuidGenerator>
  let fileStorage: MockProxy<IUploadFile>
  let sut: ChangeProfilePicture
  beforeAll(() => {
    file = Buffer.from('any_buffer')
    uuid = 'any_unique_id'
    fileStorage = mock()
    crypto = mock()
    crypto.uuid.mockReturnValue(uuid)
  })

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, crypto)
  })

  it('Should call IUploadFile with correct input', async () => {
    await sut({ id: 'any_id', file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: uuid })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})
