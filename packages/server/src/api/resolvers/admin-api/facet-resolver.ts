import { Arg, Int, Mutation, Query, Resolver } from 'type-graphql'
import { Inject } from 'typedi'

import { FacetTranslation } from '../../../entities/facet/facet-translation.entity'
import { FacetValue } from '../../../entities/facet-value/facet-value.entity'
import { Facet } from '../../../entities/facet/facet.entity'
import { FacetValueService } from '../../../service/services/facet-value.service'
import { FacetService } from '../../../service/services/facet.service'
import { FacetTranslationInput } from '../../inputs/facet/facet-translation.input'
import { FacetValueTranslationInput } from '../../inputs/facet-value/facet-value-translation'
import { FacetValueInput } from '../../inputs/facet-value/facet-value.input'
import { FacetInput } from '../../inputs/facet/facet.input'

@Resolver()
export class FacetResolver {
  @Inject()
  private readonly facetService: FacetService

  @Inject()
  private readonly facetValueService: FacetValueService

  @Mutation(() => Facet)
  createFacet(@Arg('input') input: FacetInput) {
    return this.facetService.create(input)
  }

  @Mutation(() => FacetValue)
  createFacetValue(
    @Arg('id', () => Int) id: number,
    @Arg('input') input: FacetValueInput
  ) {
    return this.facetValueService.create(id, input)
  }

  @Mutation(() => FacetTranslation)
  addFacetTranslation(
    @Arg('id', () => Int) id: number,
    @Arg('input') input: FacetTranslationInput
  ) {
    return this.facetService.addTranslation(id, input)
  }

  @Mutation(() => FacetTranslation)
  addFacetValueTranslation(
    @Arg('id', () => Int) id: number,
    @Arg('input') input: FacetValueTranslationInput
  ) {
    return this.facetValueService.addTranslation(id, input)
  }

  @Query(() => [Facet])
  facets() {
    return this.facetService.findAll()
  }
}
