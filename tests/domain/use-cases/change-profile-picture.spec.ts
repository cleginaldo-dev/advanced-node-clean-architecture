import { MockProxy, mock } from 'jest-mock-extended'

type Setup = (fileStorage: IUploadFile) => ChangeProfilePicture
type Input = { id: string; file: Buffer }
export type ChangeProfilePicture = (input: Input) => Promise<void>

export const setupChangeProfilePicture: Setup =
  fileStorage =>
  async ({ id, file }) => {
    await fileStorage.upload({ file, key: id })
  }

export interface IUploadFile {
  upload: (input: IUploadFile.Input) => Promise<void>
}

export namespace IUploadFile {
  export type Input = { file: Buffer; key: string }
}

describe('ChangeProfilePicture', () => {
  let file: Buffer
  let fileStorage: MockProxy<IUploadFile>
  let sut: ChangeProfilePicture
  beforeAll(() => {
    file = Buffer.from('any_buffer')
    fileStorage = mock()
  })

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage)
  })

  it('Should call IUploadFile with correct input', async () => {
    await sut({ id: 'any_id', file })

    expect(fileStorage.upload).toHaveBeenCalledWith({ file, key: 'any_id' })
    expect(fileStorage.upload).toHaveBeenCalledTimes(1)
  })
})
