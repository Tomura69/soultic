import { Field, InputType } from 'type-graphql'

import { FacetTranslationInput } from './facet-translation.input'

@InputType()
export class FacetInput extends FacetTranslationInput {
  @Field()
  code: string
}
