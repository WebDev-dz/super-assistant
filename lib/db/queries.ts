import db from '@/db';
import { AppSchema } from '@/instant.schema';
import { UpdateParams } from '@instantdb/react';
import z, { object } from 'zod';
import { PartialDeep } from '../types';

type EntityTypes = keyof AppSchema['entities'];

export function updateQuery<EType extends EntityTypes>(
  etype: EType,
  args: UpdateParams<AppSchema, EType>,
) {
    // const entities: EType[] = ["goals", "users", "tasks", "projects"];
    // console.log(Object.keys(db.tx));
    // const validName = z.enum(Object.keys(db.tx)).safeParse(etype);
    // if (!validName.success) {
    //     throw new Error(`Invalid entity type: ${etype}`);
    // }
    // @ts-ignore
    return db.tx[etype][args.id]?.update(args);
}

export function deleteQuery<EType extends EntityTypes>(
  etype: EType,
  id: string,
) {
    // const validName = z.enum(Object.keys(db.tx)).safeParse(etype);
    // if (!validName.success) {
    //     throw new Error(`Invalid entity type: ${etype}`);
    // }
    // @ts-ignore
    return db.tx[etype][id]?.delete();
}


export function createQuery<EType extends EntityTypes>(
  etype: EType,
  data: PartialDeep<AppSchema['entities'][EType]>,
) {
    // const validName = z.enum(Object.keys(db.tx)).safeParse(etype);
    // if (!validName.success) {
    //     throw new Error(`Invalid entity type: ${etype}`);
    // }
    // @ts-ignore
    return db.tx[etype].create(data);
}








