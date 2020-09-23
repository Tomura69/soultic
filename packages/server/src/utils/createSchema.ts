import { buildSchema, BuildSchemaOptions } from 'type-graphql';
import Container from 'typedi';
import { Middleware } from 'type-graphql/dist/interfaces/Middleware';
import { MyContext } from '../types/MyContext';

export async function createSchema(
  resolvers: BuildSchemaOptions['resolvers'],
  globalMiddlewares: Middleware<MyContext>[]
) {
  return buildSchema({
    resolvers,
    container: Container,
    globalMiddlewares,
  });
}
