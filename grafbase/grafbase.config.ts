// Welcome to Grafbase!
// Define your data models, integrate auth, permission rules, custom resolvers, search, and more with Grafbase.
// Integrate Auth
// https://grafbase.com/docs/auth
//
// const authProvider = auth.OpenIDConnect({
//   issuer: process.env.ISSUER_URL ?? ''
// })
//
// Define Data Models
// https://grafbase.com/docs/database

import { g, config, auth } from '@grafbase/sdk'

const User = g.model('User', {
  id: g.id(),
  name: g.string().optional(),
  email: g.email().optional().unique(),
  emailVerified: g.dateTime().optional(),
  image: g.string().optional(),
  hashedPassword: g.string().optional(),
  createdAt: g.dateTime().default('now'),
  updatedAt: g.dateTime(),
  conversationIds: g.string().list(),
  seenMessageIds: g.string().list(),
}).auth((rules) => {
  rules.public().read()
  rules.private().create().delete().update()
})

const Account = g.model('Account', {
  id: g.id(),
  userId: g.id(),
  type: g.string(),
  provider: g.string(),
  providerAccountId: g.string(),
  refresh_token: g.string().optional(),
  access_token: g.string().optional(),
  expires_at: g.int().optional(),
  token_type: g.string().optional(),
  scope: g.string().optional(),
  id_token: g.string().optional(),
  session_state: g.string().optional(),
  user: g.ref('User')
}).auth((rules) => {
  rules.public().read()
  rules.private().create().delete().update()
})

const Conversation = g.model('Conversation', {
  id: g.id(),
  createdAt: g.dateTime().default('now'),
  lastMessageAt: g.dateTime().default('now'),
  name: g.string().optional(),
  isGroup: g.boolean().optional(),
  backgroundImage: g.string().optional(),
  messagesIds: g.string().list(),
  userIds: g.string().list(),
}).auth((rules) => {
  rules.public().read()
  rules.private().create().delete().update()
})

const Message = g.model('Message', {
  id: g.id(),
  body: g.string().optional(),
  image: g.string().optional(),
  createdAt: g.dateTime().default('now'),
  seenIds: g.string().list(),
  conversationId: g.id(),
  senderId: g.id(),
}).auth((rules) => {
  rules.public().read()
  rules.private().create().delete().update()
})

const jwt = auth.JWT({
  issuer: 'grafbase',
  secret: g.env('NEXTAUTH_SECRET')
})

export default config({
  schema: g,
  auth: {
    providers: [jwt],
    rules: (rules) => rules.private()
  },
})

  // Integrate Auth
  // https://grafbase.com/docs/auth
  // auth: {
  //   providers: [authProvider],
  //   rules: (rules) => {
  //     rules.private()
  //   }
  // }

