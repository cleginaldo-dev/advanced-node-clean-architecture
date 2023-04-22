import {
  ILoadUserAccountRepository,
  ISaveFacebookAccountRepository,
} from '@/data/contracts/repositories';
import { PgUser } from '@/infra/postgres/entities';
import { getRepository } from 'typeorm';

export class PgUserAccountRepository
  implements ILoadUserAccountRepository, ISaveFacebookAccountRepository
{
  private readonly pgUserRepo = getRepository(PgUser);

  async load(
    params: ILoadUserAccountRepository.Params,
  ): Promise<ILoadUserAccountRepository.Result> {
    const pgUser = await this.pgUserRepo.findOne({
      where: { email: params.email },
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
      const pgUser = await this.pgUserRepo.save({
        email: params.email,
        name: params.name,
        facebook_id: params.facebook_id,
      });
      id = pgUser.id.toString();
    } else {
      await this.pgUserRepo.update(
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
