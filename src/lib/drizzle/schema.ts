import { pgTable, serial, varchar, text, timestamp, numeric } from 'drizzle-orm/pg-core'

// Remedies table for natural health remedies
export const remedies = pgTable('remedies', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  ingredients: text('ingredients'),
  benefits: text('benefits'),
  categoryId: varchar('category_id', { length: 100 }),
  price: numeric('price', { precision: 10, scale: 2 }).default('0'),
  images: text('images'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Types for TypeScript
export type Remedy = typeof remedies.$inferSelect
export type NewRemedy = typeof remedies.$inferInsert
