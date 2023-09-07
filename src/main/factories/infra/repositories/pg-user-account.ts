import { PgUserAccountRepository } from '@/infra/repositories/postgres'

export const makePgUserAccountRepository = (): PgUserAccountRepository => {
  return new PgUserAccountRepository()
}
