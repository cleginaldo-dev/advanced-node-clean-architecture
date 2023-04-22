import { ILoadUserAccountRepository } from '@/data/contracts/repositories';
import { PgUser } from '@/infra/postgres/entities';
import { getRepository } from 'typeorm';

export class PgUserAccountRepository implements ILoadUserAccountRepository {
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
