import { pgTable, serial, text, timestamp, jsonb, integer } from 'drizzle-orm/pg-core';

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

// Two-way client <-> admin conversation thread messages (separate inbox per client)
export const conversationMessages = pgTable('conversation_messages', {
  id: serial('id').primaryKey(),
  inquiryId: integer('inquiry_id'),
  clientEmail: text('client_email').notNull(),
  clientName: text('client_name').notNull(),
  sender: text('sender').notNull(), // 'client' | 'admin'
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Real Portfolio Projects managed via Control Panel
export const projects = pgTable('projects', {
  id: serial('id').primaryKey(),
  projectId: text('project_id').notNull().unique(),
  title: text('title').notNull(),
  tagline: text('tagline'),
  category: text('category').notNull(),
  status: text('status').default('Live Project').notNull(),
  image: text('image').notNull(),
  shortDescription: text('short_description').notNull(),
  fullDescription: text('full_description').notNull(),
  clientContext: text('client_context'),
  tools: jsonb('tools').notNull(), // array of strings
  keyFeatures: jsonb('key_features').notNull(), // array of strings
  liveUrl: text('live_url'),
  githubUrl: text('github_url'),
  demoType: text('demo_type').default('real-project').notNull(),
  mediaType: text('media_type').default('website'),
  videoUrl: text('video_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Website Content & Profile Settings
export const siteSettings = pgTable('site_settings', {
  id: serial('id').primaryKey(),
  key: text('key').notNull().unique(),
  value: text('value').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
