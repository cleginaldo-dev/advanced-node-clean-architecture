import { ITokenGenerator } from '@/data/contracts/crypto/token';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

class JwtTokenGenerator {
  constructor(private readonly secret: string) {}
  async generateToken(
    params: ITokenGenerator.Params,
  ): Promise<ITokenGenerator.Result> {
    const expirationInSeconds = params.expirationInMs / 1000;
    return jwt.sign({ key: params.key }, this.secret, {
      expiresIn: expirationInSeconds,
    });
  }
}

describe('JwtTokenGenerator', () => {
  let sut: JwtTokenGenerator;
  let fakeJwt: jest.Mocked<typeof jwt>;
  beforeAll(() => {
    fakeJwt = jwt as jest.Mocked<typeof jwt>;
    fakeJwt.sign.mockImplementation(() => 'any_token');
  });

  beforeEach(() => {
    sut = new JwtTokenGenerator('any_secret');
  });

  it('Should be able call sign with correct values', async () => {
    await sut.generateToken({ key: 'any_key', expirationInMs: 1000 });

    expect(fakeJwt.sign).toHaveBeenCalledWith(
      { key: 'any_key' },
      'any_secret',
      {
        expiresIn: 1,
      },
    );
  });
  it('Should be able a token on success', async () => {
    const token = await sut.generateToken({
      key: 'any_key',
      expirationInMs: 1000,
    });

    expect(token).toBe('any_token');
  });

  it('Should rethrow if sign throws', async () => {
    fakeJwt.sign.mockImplementationOnce(() => {
      throw new Error('token_error');
    });
    const promise = sut.generateToken({ key: 'any_key', expirationInMs: 1000 });

    expect(promise).rejects.toThrow(new Error('token_error'));
  });
});
