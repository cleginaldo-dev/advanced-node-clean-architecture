import { PgUser } from '@/infra/postgres/entities';
import { PgUserAccountRepository } from '@/infra/postgres/repositories';
import { makeFackDb } from '@/tests/infra/postgres/mocks';
import { IBackup } from 'pg-mem';
import { getRepository, Repository, getConnection } from 'typeorm';

describe('PgUserAccountRepository', () => {
  let sut: PgUserAccountRepository;
  let pgUserRepo: Repository<PgUser>;
  let backup: IBackup;
  beforeAll(async () => {
    const db = await makeFackDb();
    backup = db.backup();
    pgUserRepo = getRepository(PgUser);
  });

  beforeEach(() => {
    backup.restore();
    sut = new PgUserAccountRepository();
  });

  afterAll(async () => {
    await getConnection().close();
  });

  describe('load', () => {
    it('Should be able call PgUserAccountRepository with correct values', async () => {
      await pgUserRepo.save({ email: 'existing_email' });

      const account = await sut.load({ email: 'existing_email' });

      expect(account).toEqual({ id: '1' });
    });
    it('Should return undefined if email does not exists', async () => {
      const account = await sut.load({ email: 'new_email' });

      expect(account).toBeUndefined();
    });
  });

  describe('saveWithFacebook', () => {
    it('Should create an account if id is undefined', async () => {
      await sut.saveWithFacebook({
        email: 'any_email',
        name: 'any_name',
        facebook_id: 'any_facebook_id',
      });
      const pgUser = await sut.load({ email: 'any_email' });

      expect(pgUser?.id).toBe('1');
    });
  });
});
