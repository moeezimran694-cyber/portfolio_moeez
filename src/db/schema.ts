import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table (synchronized with Firebase Auth UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Client Inquiries & Custom Budget Quotes
export const inquiries = pgTable('inquiries', {
  id: serial('id').primaryKey(),
  fullName: text('full_name').notNull(),
  email: text('email').notNull(),
  company: text('company'),
  service: text('service').notNull(),
  budget: text('budget'),
  details: text('details').notNull(),
  status: text('status').default('new').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
