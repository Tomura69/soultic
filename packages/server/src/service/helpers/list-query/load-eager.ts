import { FindManyOptions, FindOptionsUtils, getRepository } from 'typeorm'
import { Base } from '../../../entities/base/base.entity'
import { IEntity } from '../../../types/IEntity'

export const loadEager = <T extends Base>(
  entity: IEntity<T>,
  options?: Partial<T> | FindManyOptions<T>
) => {
  const qb = getRepository(entity).createQueryBuilder(entity.name.toLowerCase())

  FindOptionsUtils.joinEagerRelations(
    qb,
    qb.alias,
    qb.expressionMap.mainAlias!.metadata
  )

  FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, options)

  return qb
}
