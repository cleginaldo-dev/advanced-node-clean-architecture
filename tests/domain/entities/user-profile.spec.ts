import { UserProfile } from '@/domain/entities'

describe('UserProfile', () => {
  let sut: UserProfile
  beforeEach(() => {
    sut = new UserProfile('any_id')
  })
  it('Should create with empty initials when pictureUrl and name is provided', () => {
    sut.setPicture({ pictureUrl: 'any_url', name: 'any_name' })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: undefined
    })
  })

  it('Should create with empty initials when pictureUrl is provided and not name', () => {
    sut.setPicture({ pictureUrl: 'any_url' })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: 'any_url',
      initials: undefined
    })
  })

  it('Should create initials with first two letters of first name', () => {
    sut.setPicture({ name: 'cleginaldo' })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'CL'
    })
  })

  it('Should create initials with first letter', () => {
    sut.setPicture({ name: 'c' })

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: 'C'
    })
  })

  it('Should create with empty initials when name and pictureUrl are not provided', () => {
    sut.setPicture({})

    expect(sut).toEqual({
      id: 'any_id',
      pictureUrl: undefined,
      initials: undefined
    })
  })
})
