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
}

export type QueryUsersArgs = {
  options: UserListOptions
}

export type QueryUserArgs = {
  id: Scalars['ID']
}

export type QueryProductArgs = {
  languageCode?: Maybe<LanguageCode>
  id: Scalars['Float']
}

export type UserList = {
  __typename?: 'UserList'
  items: Array<User>
  totalCount: Scalars['Int']
}

export type User = {
  __typename?: 'User'
  id: Scalars['ID']
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
  neq?: Maybe<Scalars['DateTime']>
}

export type StringOperators = {
  eq?: Maybe<Scalars['String']>
  contains?: Maybe<Scalars['String']>
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
  id: Scalars['ID']
  createdAt: Scalars['String']
  updatedAt: Scalars['String']
  deletedAt?: Maybe<Scalars['String']>
  translations: Array<ProductTranslation>
}

export type ProductTranslation = {
  __typename?: 'ProductTranslation'
  id: Scalars['ID']
  createdAt: Scalars['String']
  updatedAt: Scalars['String']
  deletedAt?: Maybe<Scalars['String']>
  languageCode: LanguageCode
  title: Scalars['String']
  slug: Scalars['String']
}

/** Available language codes */
export enum LanguageCode {
  Lt = 'lt',
  En = 'en',
}

export type Mutation = {
  __typename?: 'Mutation'
  updateUser: Scalars['Boolean']
  login?: Maybe<User>
  logout: Scalars['Boolean']
  createProduct: Product
  addProductTranslation: ProductTranslation
  removeProduct: Scalars['Boolean']
}

export type MutationUpdateUserArgs = {
  input: UserUpdateInput
  id: Scalars['ID']
}

export type MutationLoginArgs = {
  input: LoginInput
}

export type MutationCreateProductArgs = {
  title: Scalars['String']
}

export type MutationAddProductTranslationArgs = {
  languageCode: Scalars['String']
  title: Scalars['String']
  id: Scalars['Float']
}

export type MutationRemoveProductArgs = {
  id: Scalars['Float']
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

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['ID']
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

export type UserByIdQueryVariables = Exact<{
  id: Scalars['ID']
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
