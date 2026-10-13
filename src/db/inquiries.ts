import { db } from './index.ts';
import { inquiries } from './schema.ts';
import { desc } from 'drizzle-orm';

export interface NewInquiryInput {
  fullName: string;
  email: string;
  company?: string;
  service: string;
  budget?: string;
  details: string;
}

export async function createInquiry(input: NewInquiryInput) {
  try {
    const result = await db.insert(inquiries).values({
      fullName: input.fullName,
      email: input.email,
      company: input.company || null,
      service: input.service,
      budget: input.budget || null,
      details: input.details,
    }).returning();
    return result[0];
  } catch (error) {
    console.error('Failed to insert inquiry into database:', error);
    throw new Error('Database insertion failed', { cause: error });
  }
}

export async function getInquiries() {
  try {
    return await db.select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(50);
  } catch (error) {
    console.error('Failed to fetch inquiries:', error);
    throw new Error('Database query failed', { cause: error });
  }
}
