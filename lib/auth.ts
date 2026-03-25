import { cookies } from "next/headers"
import crypto from "crypto"
import { dbConnect } from "./db"
import VendorAccount, { type IVendorAccount } from "@/models/VendorAccount"

const SECRET = process.env.SESSION_SECRET || "signagescout-dev-secret-change-me"
const COOKIE_NAME = "ss_session"

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.randomBytes(16).toString("hex")
  const hash = crypto
    .pbkdf2Sync(password, salt, 100_000, 64, "sha512")
    .toString("hex")
  return `${salt}:${hash}`
}

export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  const [salt, hash] = stored.split(":")
  const attempt = crypto
    .pbkdf2Sync(password, salt, 100_000, 64, "sha512")
    .toString("hex")
  return hash === attempt
}

function signToken(payload: Record<string, unknown>): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url")
  const sig = crypto
    .createHmac("sha256", SECRET)
    .update(data)
    .digest("base64url")
  return `${data}.${sig}`
}

function verifyToken(token: string): Record<string, unknown> | null {
  const [data, sig] = token.split(".")
  if (!data || !sig) return null
  const expected = crypto
    .createHmac("sha256", SECRET)
    .update(data)
    .digest("base64url")
  if (sig !== expected) return null
  try {
    return JSON.parse(Buffer.from(data, "base64url").toString())
  } catch {
    return null
  }
}

export async function createSession(accountId: string): Promise<void> {
  const token = signToken({ sub: accountId, iat: Date.now() })
  const jar = await cookies()
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })
}

export async function destroySession(): Promise<void> {
  const jar = await cookies()
  jar.delete(COOKIE_NAME)
}

export async function getSessionAccount(): Promise<IVendorAccount | null> {
  const jar = await cookies()
  const token = jar.get(COOKIE_NAME)?.value
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload?.sub) return null

  await dbConnect()
  const account = await VendorAccount.findById(payload.sub).lean()
  return account as IVendorAccount | null
}
