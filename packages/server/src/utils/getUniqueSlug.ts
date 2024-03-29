import slugify from 'slugify'
import { getRepository, Raw, ObjectType, Not } from 'typeorm'

async function getUniqueSlug<T extends { slug: string }>(
  entity: ObjectType<T>,
  value: string,
  whereIdNot?: number
) {
  const slug = slugify(value, { lower: true })

  const result = await getRepository(entity).find({
    where: {
      ...(whereIdNot ? { id: Not(whereIdNot) } : {}),
      slug: Raw((alias) => `${alias} ~ '^${slug}-\\d+$|^${slug}$'`),
    },
    select: ['slug'],
    withDeleted: true,
  })

  if (!result.length) return slug

  const numArray = result
    .map((entity) => parseInt(entity.slug.replace(slug, '') || '0', 10))
    .sort((a, b) => b - a)

  let count = 1

  for (let num of numArray) {
    if (num !== --count) return `${slug}${count || ''}`
  }

  return `${slug}${--count}`
}

export { getUniqueSlug }
