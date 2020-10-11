import { Ctx, FieldResolver, Resolver, Root } from 'type-graphql'
import { Inject } from 'typedi'

import { Facet } from '../../../entities/facet/facet.entity'
import { FacetValueService } from '../../../service/services/facet-value.service'
import { MyContext } from '../../../types/MyContext'

@Resolver(() => Facet)
export abstract class FacetEntityResolver {
  @Inject()
  private readonly facetValueService: FacetValueService

  // TODO: Attach data loader
  @FieldResolver()
  async values(@Root() facet: Facet, @Ctx() ctx: MyContext) {
    return this.facetValueService.findAll(
      { where: { base: { id: facet.id } } },
      ctx.languageCode
    )
  }
}
