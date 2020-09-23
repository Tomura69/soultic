import qs from 'qs'
import queryDecoder from '@/utils/queryDecoder'
import { computed, SetupContext } from '@vue/composition-api'

type RouteQuery = Record<string, unknown>

const stringifyQuery = (query: RouteQuery) =>
  qs.stringify(query, { strictNullHandling: true })

const parseQuery = (query: RouteQuery): RouteQuery => {
  return qs.parse(stringifyQuery(query), {
    decoder: queryDecoder(),
    strictNullHandling: true,
  })
}

const updateQuery = (
  query: object,
  currentQuery: object,
  { $route, $router }: SetupContext['root']
) => {
  const queryString = stringifyQuery(parseQuery({ ...currentQuery, ...query }))
  const { path } = $route
  // eslint-disable-next-line
  $router.push(`${path}?${queryString}`).catch(() => {})
}
const useRouter = (root: SetupContext['root']) => {
  const currentQuery = computed(() => parseQuery(root.$route.query))
  const changeQuery = (
    newQuery: RouteQuery,
    oldQuery: RouteQuery = currentQuery.value
  ) => {
    updateQuery(newQuery, oldQuery, root)
  }
  return {
    currentQuery,
    changeQuery,
  }
}

export default useRouter
