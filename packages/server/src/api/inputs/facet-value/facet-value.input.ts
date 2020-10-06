import { Field, InputType } from 'type-graphql'
import { FacetValueTranslationInput } from './facet-value-translation'

@InputType()
export class FacetValueInput extends FacetValueTranslationInput {
  @Field()
  code: string
}
