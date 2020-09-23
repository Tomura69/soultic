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
}

export type QueryUsersArgs = {
  options: UserListOptions
}

export type QueryUserArgs = {
  id: Scalars['ID']
}

export type UserList = {
  __typename?: 'UserList'
  items: Array<User>
  totalCount: Scalars['Int']
}

export type User = Node & {
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

export type Node = {
  id: Scalars['ID']
}

/** System roles */
export enum Role {
  Admin = 'ADMIN',
  Employee = 'EMPLOYEE',
  Customer = 'CUSTOMER',
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

export type Mutation = {
  __typename?: 'Mutation'
  updateUser: Scalars['Boolean']
  login?: Maybe<Scalars['Boolean']>
  logout: Scalars['Boolean']
}

export type MutationUpdateUserArgs = {
  input: UserUpdateInput
  id: Scalars['ID']
}

export type MutationLoginArgs = {
  input: LoginInput
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

export type AdminLoginMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'login'
>

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
