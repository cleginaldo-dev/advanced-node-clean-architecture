import {
  ILoadUserAccountRepository,
  ISaveFacebookAccountRepository,
} from '@/data/contracts/repositories';
import { PgUser } from '@/infra/postgres/entities';
import { getRepository } from 'typeorm';

export class PgUserAccountRepository
  implements ILoadUserAccountRepository, ISaveFacebookAccountRepository
{
  async load({
    email,
  }: ILoadUserAccountRepository.Params): Promise<ILoadUserAccountRepository.Result> {
    const pgUserRepo = getRepository(PgUser);
    const pgUser = await pgUserRepo.findOne({
      where: { email },
    });
    if (pgUser) {
      return {
        id: pgUser.id.toString(),
        name: pgUser.name ?? undefined,
      };
    }
  }

  async saveWithFacebook(
    params: ISaveFacebookAccountRepository.Params,
  ): Promise<ISaveFacebookAccountRepository.Result> {
    let id: string;
    if (params.id === undefined) {
      const pgUserRepo = getRepository(PgUser);
      const pgUser = await pgUserRepo.save({
        email: params.email,
        name: params.name,
        facebook_id: params.facebook_id,
      });
      id = pgUser.id.toString();
    } else {
      const pgUserRepo = getRepository(PgUser);
      await pgUserRepo.update(
        { id: Number(params.id) },
        {
          name: params.name,
          facebook_id: params.facebook_id,
        },
      );
      id = params.id;
    }
    return { id };
  }
}
