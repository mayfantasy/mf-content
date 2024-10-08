import { accountDb } from './db/admin.db'
import { query as q } from 'faunadb'
import { IAccount } from '../../types/account.type'
import {
  ICreateCollectionPayload,
  ICollection,
  IUpdateCollectionPayload
} from '../../types/collection.type'
import { client } from './db/client.db'

export const createCollection = async (
  api_key: string,
  payload: ICreateCollectionPayload
) => {
  const clientDB = client(api_key)

  // Create collection
  const collection: any = await clientDB.query(
    q.Create(q.Collection('collection'), {
      data: payload
    })
  )

  return {
    id: collection.ref.id,
    ...collection.data
  }
}

export const getCollectionList = async (api_key: string) => {
  const clientDB = client(api_key)
  const collections: any = await clientDB.query(
    q.Map(
      q.Paginate(q.Match(q.Index('all_collections')), { size: 500 }),
      q.Lambda('X', q.Get(q.Var('X')))
    )
  )
  return collections.data.map((c: any) => ({
    id: c.ref.id,
    ...c.data
  }))
}

export const updateCollection = async (
  api_key: string,
  payload: IUpdateCollectionPayload
) => {
  const clientDB = client(api_key)

  // Update collection
  const collection: any = await clientDB.query(
    q.Update(q.Ref(q.Collection('collection'), payload.id), {
      data: payload
    })
  )

  return {
    id: collection.ref.id
  }
}

export const getCollectionById = async (api_key: string, id: string) => {
  const clientDB = client(api_key)
  const collection: any = await clientDB.query(
    q.Get(q.Ref(q.Collection('collection'), id))
  )
  return {
    id: collection.ref.id,
    ...collection.data
  }
}

export const deleteCollectionById = async (api_key: string, id: string) => {
  const clientDB = client(api_key)
  const collection: any = await clientDB.query(
    q.Delete(q.Ref(q.Collection('collection'), id))
  )
  return {
    id: collection.ref.id
  }
}
