import { ILoadUserAccountRepository } from '@/data/contracts/repositories';
import { newDb } from 'pg-mem';
import { Entity, PrimaryGeneratedColumn, Column, getRepository } from 'typeorm';

@Entity({ name: 'usuarios' })
export class PgUser {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'nome', nullable: true })
  name?: string;

  @Column()
  email!: string;

  @Column({ name: 'id_facebook', nullable: true })
  facebookId?: string;
}

class PgUserAccountRepository implements ILoadUserAccountRepository {
  async load(
    params: ILoadUserAccountRepository.Params,
  ): Promise<ILoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser);
    const pgUser = await pgUserRepo.findOne({ where: { email: params.email } });
    if (pgUser) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined,
      };
    }
  }
}
describe('PgUserAccountRepository', () => {
  beforeAll(() => {});

  beforeEach(() => {});

  it('Should be able call PgUserAccountRepository with correct values', async () => {
    const db = newDb();
    const connection = await db.adapters.createTypeormConnection({
      type: 'postgres',
      entities: [PgUser],
    });
    await connection.synchronize();
    const pgUserRepo = getRepository(PgUser);
    await pgUserRepo.save({ email: 'existing_email' });
    const sut = new PgUserAccountRepository();

    const account = await sut.load({ email: 'existing_email' });

    expect(account).toEqual({ id: '1' });
    await connection.close();
  });
  it('Should return undefined if email does not exists', async () => {
    const db = newDb();
    const connection = await db.adapters.createTypeormConnection({
      type: 'postgres',
      entities: [PgUser],
    });
    await connection.synchronize();
    const sut = new PgUserAccountRepository();

    const account = await sut.load({ email: 'new_email' });

    expect(account).toBeUndefined();
    await connection.close();
  });
});
