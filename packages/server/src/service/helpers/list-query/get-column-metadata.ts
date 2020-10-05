import { getConnection } from 'typeorm'
import { ColumnMetadata } from 'typeorm/metadata/ColumnMetadata'

export type EntityRelationsData = { name: string; columns: ColumnMetadata[] }[]

export function getColumnMetadata<T>(entity: new () => T) {
  const connection = getConnection()
  const metadata = connection.getMetadata(entity)
  const columns = metadata.columns

  const relationsData: EntityRelationsData = []

  const relations = metadata.relations

  relations.forEach((r) => {
    const { columns: relationColumns } = connection.getMetadata(r.type)
    relationsData.push({
      name: r.propertyName,
      columns: relationColumns,
    })
  })

  const alias = metadata.name.toLowerCase()
  return { columns, relationsData, alias }
}
