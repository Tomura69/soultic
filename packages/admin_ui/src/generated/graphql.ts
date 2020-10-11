export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any
}

export type Query = {
  __typename?: 'Query'
  users: UserList
  user?: Maybe<User>
  me: User
  product?: Maybe<Product>
  products: ProductList
  facets: Array<Facet>
}

export type QueryUsersArgs = {
  options: UserListOptions
}

export type QueryUserArgs = {
  id: Scalars['Int']
}

export type QueryProductArgs = {
  id: Scalars['Int']
}

export type QueryProductsArgs = {
  options: ProductListOptions
}

export type UserList = {
  __typename?: 'UserList'
  items: Array<User>
  totalCount: Scalars['Int']
}

export type User = {
  __typename?: 'User'
  id: Scalars['Int']
  createdAt: Scalars['String']
  updatedAt: Scalars['String']
  deletedAt?: Maybe<Scalars['String']>
  email: Scalars['String']
  firstname: Scalars['String']
  lastname: Scalars['String']
  roles: Array<Role>
  confirmed: Scalars['Boolean']
}

/** System roles */
export enum Role {
  Admin = 'ADMIN',
  Employee = 'EMPLOYEE',
}

export type UserListOptions = {
  take: Scalars['Int']
  skip: Scalars['Int']
  filter: UserFilterParameters
  sort: UserSortParameters
}

export type UserFilterParameters = {
  updatedAt?: Maybe<DateOperators>
  createdAt?: Maybe<DateOperators>
  deletedAt?: Maybe<DateOperators>
  email?: Maybe<StringOperators>
  confirmed?: Maybe<BoolOperators>
  withDeleted?: Maybe<Scalars['Boolean']>
}

export type DateOperators = {
  before?: Maybe<Scalars['DateTime']>
  after?: Maybe<Scalars['DateTime']>
  eq?: Maybe<Scalars['DateTime']>
  neq?: Maybe<Scalars['DateTime']>
}

export type StringOperators = {
  eq?: Maybe<Scalars['String']>
  contains?: Maybe<Scalars['String']>
  in?: Maybe<Array<Scalars['String']>>
  nin?: Maybe<Array<Scalars['String']>>
}

export type BoolOperators = {
  eq?: Maybe<Scalars['Boolean']>
}

export type UserSortParameters = {
  id?: Maybe<SortOperators>
  createdAt?: Maybe<SortOperators>
  updatedAt?: Maybe<SortOperators>
  deletedAt?: Maybe<SortOperators>
}

export enum SortOperators {
  Asc = 'ASC',
  Desc = 'DESC',
}

export type Product = {
  __typename?: 'Product'
  id: Scalars['Int']
  createdAt: Scalars['String']
  updatedAt: Scalars['String']
  deletedAt?: Maybe<Scalars['String']>
  variants: Array<ProductVariant>
  translations: Array<ProductTranslation>
  languageCode: LanguageCode
  slug: Scalars['String']
  title: Scalars['String']
  description?: Maybe<Scalars['String']>
}

export type ProductVariant = {
  __typename?: 'ProductVariant'
  id: Scalars['Int']
  createdAt: Scalars['String']
  updatedAt: Scalars['String']
  deletedAt?: Maybe<Scalars['String']>
  price: Scalars['Int']
  sku: Scalars['String']
  facetValues: Array<FacetValue>
}

export type FacetValue = {
  __typename?: 'FacetValue'
  id: Scalars['Int']
  createdAt: Scalars['String']
  updatedAt: Scalars['String']
  deletedAt?: Maybe<Scalars['String']>
  code: Scalars['String']
  name: Scalars['String']
  facet: Facet
  translations: Array<FacetValueTranslation>
}

export type Facet = {
  __typename?: 'Facet'
  id: Scalars['Int']
  createdAt: Scalars['String']
  updatedAt: Scalars['String']
  deletedAt?: Maybe<Scalars['String']>
  code: Scalars['String']
  languageCode: LanguageCode
  name: Scalars['String']
  values?: Maybe<Array<FacetValue>>
  translations: Array<FacetTranslation>
}

/** Available language codes */
export enum LanguageCode {
  Lt = 'lt',
  En = 'en',
}

export type FacetTranslation = {
  __typename?: 'FacetTranslation'
  id: Scalars['Int']
  createdAt: Scalars['String']
  updatedAt: Scalars['String']
  deletedAt?: Maybe<Scalars['String']>
  languageCode: LanguageCode
  name: Scalars['String']
}

export type FacetValueTranslation = {
  __typename?: 'FacetValueTranslation'
  id: Scalars['Int']
  createdAt: Scalars['String']
  updatedAt: Scalars['String']
  deletedAt?: Maybe<Scalars['String']>
  languageCode: LanguageCode
  name: Scalars['String']
}

export type ProductTranslation = {
  __typename?: 'ProductTranslation'
  id: Scalars['Int']
  createdAt: Scalars['String']
  updatedAt: Scalars['String']
  deletedAt?: Maybe<Scalars['String']>
  languageCode: LanguageCode
  title: Scalars['String']
  slug: Scalars['String']
  description?: Maybe<Scalars['String']>
}

export type ProductList = {
  __typename?: 'ProductList'
  items: Array<Product>
  totalCount: Scalars['Int']
}

export type ProductListOptions = {
  take: Scalars['Int']
  skip: Scalars['Int']
  filter: ProductFilterParameters
  sort: ProductSortParameters
}

export type ProductFilterParameters = {
  updatedAt?: Maybe<DateOperators>
  createdAt?: Maybe<DateOperators>
  deletedAt?: Maybe<DateOperators>
  slug?: Maybe<StringOperators>
  languageCode?: Maybe<StringOperators>
}

export type ProductSortParameters = {
  id?: Maybe<SortOperators>
  createdAt?: Maybe<SortOperators>
  updatedAt?: Maybe<SortOperators>
  deletedAt?: Maybe<SortOperators>
}

export type Mutation = {
  __typename?: 'Mutation'
  deleteUser: Scalars['Boolean']
  restoreUser: Scalars['Boolean']
  updateUser?: Maybe<Scalars['Boolean']>
  login?: Maybe<User>
  logout: Scalars['Boolean']
  createProduct: Product
  deleteProduct: Scalars['Boolean']
  restoreProduct: Scalars['Boolean']
  addProductTranslation: ProductTranslation
  generateProductTranslationSlug: Scalars['String']
  updateOrCreateProductTranslation: Scalars['Boolean']
  deleteProductTranslation: Scalars['Boolean']
  removeProduct: Scalars['Boolean']
  createFacet: Facet
  createFacetValue: FacetValue
  addFacetTranslation: FacetTranslation
  addFacetValueTranslation: FacetTranslation
  addProductVariant: ProductVariant
  updateProductVariant: ProductVariant
}

export type MutationDeleteUserArgs = {
  id: Scalars['Int']
}

export type MutationRestoreUserArgs = {
  id: Scalars['Int']
}

export type MutationUpdateUserArgs = {
  input: UserUpdateInput
  id: Scalars['Int']
}

export type MutationLoginArgs = {
  input: LoginInput
}

export type MutationCreateProductArgs = {
  input: ProductInput
}

export type MutationDeleteProductArgs = {
  id: Scalars['Int']
}

export type MutationRestoreProductArgs = {
  id: Scalars['Int']
}

export type MutationAddProductTranslationArgs = {
  input: ProductTranslationInput
  id: Scalars['Int']
}

export type MutationGenerateProductTranslationSlugArgs = {
  id?: Maybe<Scalars['Int']>
  title: Scalars['String']
}

export type MutationUpdateOrCreateProductTranslationArgs = {
  input: ProductTranslationUpdateInput
  id?: Maybe<Scalars['Int']>
}

export type MutationDeleteProductTranslationArgs = {
  id: Scalars['Int']
}

export type MutationRemoveProductArgs = {
  id: Scalars['Int']
}

export type MutationCreateFacetArgs = {
  input: FacetInput
}

export type MutationCreateFacetValueArgs = {
  input: FacetValueInput
  id: Scalars['Int']
}

export type MutationAddFacetTranslationArgs = {
  input: FacetTranslationInput
  id: Scalars['Int']
}

export type MutationAddFacetValueTranslationArgs = {
  input: FacetValueTranslationInput
  id: Scalars['Int']
}

export type MutationAddProductVariantArgs = {
  input: ProductVariantInput
  id: Scalars['Int']
}

export type MutationUpdateProductVariantArgs = {
  input: ProductVariantInput
  id: Scalars['Int']
}

export type UserUpdateInput = {
  roles?: Maybe<Array<Role>>
  confirmed?: Maybe<Scalars['Boolean']>
  deletedAt?: Maybe<Scalars['String']>
}

export type LoginInput = {
  email: Scalars['String']
  password: Scalars['String']
}

export type ProductInput = {
  title: Scalars['String']
  languageCode?: Maybe<LanguageCode>
  description?: Maybe<Scalars['String']>
}

export type ProductTranslationInput = {
  languageCode: LanguageCode
  title: Scalars['String']
  description?: Maybe<Scalars['String']>
}

export type ProductTranslationUpdateInput = {
  id?: Maybe<Scalars['Int']>
  slug?: Maybe<Scalars['String']>
  languageCode?: Maybe<LanguageCode>
  title?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
}

export type FacetInput = {
  languageCode: LanguageCode
  name: Scalars['String']
  code: Scalars['String']
}

export type FacetValueInput = {
  languageCode: LanguageCode
  name: Scalars['String']
  code: Scalars['String']
}

export type FacetTranslationInput = {
  languageCode: LanguageCode
  name: Scalars['String']
}

export type FacetValueTranslationInput = {
  languageCode: LanguageCode
  name: Scalars['String']
}

export type ProductVariantInput = {
  price: Scalars['Int']
  facetValues: Array<Scalars['Int']>
}

export type CreateProductMutationVariables = Exact<{
  input: ProductInput
}>

export type CreateProductMutation = { __typename?: 'Mutation' } & {
  createProduct: { __typename?: 'Product' } & Pick<
    Product,
    'id' | 'languageCode'
  >
}

export type UpdateOrCreateProductTranslationMutationVariables = Exact<{
  id: Scalars['Int']
  input: ProductTranslationUpdateInput
}>

export type UpdateOrCreateProductTranslationMutation = {
  __typename?: 'Mutation'
} & Pick<Mutation, 'updateOrCreateProductTranslation'>

export type DeleteProductMutationVariables = Exact<{
  id: Scalars['Int']
}>

export type DeleteProductMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'deleteProduct'
>

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['Int']
}>

export type DeleteUserMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'deleteUser'
>

export type GenerateProductTranslationSlugMutationVariables = Exact<{
  id?: Maybe<Scalars['Int']>
  title: Scalars['String']
}>

export type GenerateProductTranslationSlugMutation = {
  __typename?: 'Mutation'
} & Pick<Mutation, 'generateProductTranslationSlug'>

export type AdminLoginMutationVariables = Exact<{
  email: Scalars['String']
  password: Scalars['String']
}>

export type AdminLoginMutation = { __typename?: 'Mutation' } & {
  login?: Maybe<
    { __typename?: 'User' } & Pick<
      User,
      'id' | 'email' | 'firstname' | 'lastname'
    >
  >
}

export type AdminLogoutMutationVariables = Exact<{ [key: string]: never }>

export type AdminLogoutMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'logout'
>

export type RestoreProductMutationVariables = Exact<{
  id: Scalars['Int']
}>

export type RestoreProductMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'restoreProduct'
>

export type RestoreUserMutationVariables = Exact<{
  id: Scalars['Int']
}>

export type RestoreUserMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'restoreUser'
>

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['Int']
  input: UserUpdateInput
}>

export type UpdateUserMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'updateUser'
>

export type AdminMeQueryVariables = Exact<{ [key: string]: never }>

export type AdminMeQuery = { __typename?: 'Query' } & {
  me: { __typename?: 'User' } & Pick<
    User,
    'id' | 'email' | 'firstname' | 'lastname'
  >
}

export type ProductByIdQueryVariables = Exact<{
  id: Scalars['Int']
}>

export type ProductByIdQuery = { __typename?: 'Query' } & {
  product?: Maybe<
    { __typename?: 'Product' } & Pick<
      Product,
      'id' | 'languageCode' | 'createdAt' | 'updatedAt' | 'deletedAt'
    > & {
        translations: Array<
          { __typename?: 'ProductTranslation' } & Pick<
            ProductTranslation,
            'id' | 'languageCode' | 'title' | 'slug' | 'description'
          >
        >
        variants: Array<
          { __typename?: 'ProductVariant' } & Pick<
            ProductVariant,
            'id' | 'price' | 'sku'
          >
        >
      }
  >
}

export type ProductListQueryVariables = Exact<{
  options: ProductListOptions
}>

export type ProductListQuery = { __typename?: 'Query' } & {
  products: { __typename?: 'ProductList' } & Pick<ProductList, 'totalCount'> & {
      items: Array<
        { __typename?: 'Product' } & Pick<
          Product,
          | 'id'
          | 'title'
          | 'slug'
          | 'languageCode'
          | 'createdAt'
          | 'updatedAt'
          | 'deletedAt'
        >
      >
    }
}

export type UserByIdQueryVariables = Exact<{
  id: Scalars['Int']
}>

export type UserByIdQuery = { __typename?: 'Query' } & {
  user?: Maybe<
    { __typename?: 'User' } & Pick<
      User,
      | 'id'
      | 'firstname'
      | 'lastname'
      | 'email'
      | 'roles'
      | 'confirmed'
      | 'createdAt'
      | 'updatedAt'
      | 'deletedAt'
    >
  >
}

export type UsersListQueryVariables = Exact<{
  options: UserListOptions
}>

export type UsersListQuery = { __typename?: 'Query' } & {
  users: { __typename?: 'UserList' } & Pick<UserList, 'totalCount'> & {
      items: Array<
        { __typename?: 'User' } & Pick<
          User,
          | 'id'
          | 'firstname'
          | 'lastname'
          | 'email'
          | 'roles'
          | 'confirmed'
          | 'createdAt'
          | 'updatedAt'
          | 'deletedAt'
        >
      >
    }
}
