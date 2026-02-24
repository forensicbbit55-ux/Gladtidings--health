import { pgTable, serial, varchar, text, timestamp, numeric } from 'drizzle-orm/pg-core'

// Remedies table for natural health remedies
export const remedies = pgTable('remedies', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description'),
  ingredients: text('ingredients'),
  benefits: text('benefits'),
  preparation: text('preparation'),
  category: varchar('category', { length: 100 }), // Back to category (Neon AI corrected this)
  price: numeric('price', { precision: 10, scale: 2 }).default('0'),
  imageUrl: varchar('image_url', { length: 500 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Types for TypeScript
export type Remedy = typeof remedies.$inferSelect
export type NewRemedy = typeof remedies.$inferInsert
