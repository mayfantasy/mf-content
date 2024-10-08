import Koa from 'koa'
import { ILoginPayload } from '../../types/auth.type'
import {
  getAccountByEmail,
  getAccountByEmailAndPassword
} from '../services/auth.service'
import { sign, varify } from '../jwt'
import { IBasicAccountInfo } from '../../types/account.type'
import {
  loginPayloadSchema,
  loginWithTokenSchema
} from '../validators/auth.validator'
import { validatePayload } from '../validators'

export const loginRoute = (tier: number) => async (ctx: Koa.Context) => {
  const payload = ctx.request.body as ILoginPayload

  /** Validator */
  validatePayload(loginPayloadSchema, payload)

  const { email, password } = payload
  const account = await getAccountByEmailAndPassword(email, password)

  const token = sign(account)

  ctx.body = {
    result: {
      token,
      account: {
        email: account.email,
        username: account.username,
        tier: account.tier
      } as IBasicAccountInfo
    }
  }
}

export const loginWithTokenRoute = (tier: number) => async (
  ctx: Koa.Context
) => {
  const payload = ctx.request.body as {
    token: string
  }
  /** Validation */
  validatePayload(loginWithTokenSchema, payload)

  const token = payload.token
  const user = varify(token)

  const email = ((user as any).data as ILoginPayload).email
  const account = await getAccountByEmail(email)

  ctx.body = {
    result: {
      account: {
        email: account.email,
        username: account.username,
        tier: account.tier
      } as IBasicAccountInfo
    }
  }
}
