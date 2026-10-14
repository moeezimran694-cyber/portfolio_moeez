import { db } from './index.ts';
import { conversationMessages, inquiries } from './schema.ts';
import { eq, desc, asc } from 'drizzle-orm';

export interface MessagePayload {
  inquiryId?: number | null;
  clientEmail: string;
  clientName: string;
  sender: 'client' | 'admin';
  message: string;
}

export async function addMessage(payload: MessagePayload) {
  try {
    const inserted = await db.insert(conversationMessages).values({
      inquiryId: payload.inquiryId || null,
      clientEmail: payload.clientEmail.toLowerCase().trim(),
      clientName: payload.clientName.trim(),
      sender: payload.sender,
      message: payload.message.trim(),
    }).returning();
    return inserted[0];
  } catch (error) {
    console.error('Error adding message:', error);
    throw new Error('Failed to insert message', { cause: error });
  }
}

export async function getMessagesByClientEmail(clientEmail: string) {
  try {
    const emailNorm = clientEmail.toLowerCase().trim();
    const list = await db.select()
      .from(conversationMessages)
      .where(eq(conversationMessages.clientEmail, emailNorm))
      .orderBy(asc(conversationMessages.createdAt));
    return list;
  } catch (error) {
    console.error('Error fetching messages for client:', error);
    return [];
  }
}

export async function getAllThreads() {
  try {
    // 1. Get all inquiries
    const allInquiries = await db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
    
    // 2. Get all messages
    const allMessages = await db.select().from(conversationMessages).orderBy(desc(conversationMessages.createdAt));

    // 3. Group by unique client email
    const threadMap: Record<string, {
      clientEmail: string;
      clientName: string;
      company?: string | null;
      service: string;
      budget?: string | null;
      inquiryId?: number;
      lastMessage: string;
      lastMessageAt: Date | null;
      lastSender: string;
      messages: typeof allMessages;
    }> = {};

    // Seed from inquiries
    for (const inq of allInquiries) {
      const email = inq.email.toLowerCase().trim();
      if (!threadMap[email]) {
        threadMap[email] = {
          clientEmail: email,
          clientName: inq.fullName,
          company: inq.company,
          service: inq.service,
          budget: inq.budget,
          inquiryId: inq.id,
          lastMessage: inq.details,
          lastMessageAt: inq.createdAt,
          lastSender: 'client',
          messages: [],
        };
      }
    }

    // Attach messages and update last message
    for (const msg of allMessages) {
      const email = msg.clientEmail.toLowerCase().trim();
      if (!threadMap[email]) {
        threadMap[email] = {
          clientEmail: email,
          clientName: msg.clientName,
          company: null,
          service: 'General Inquiry',
          budget: 'Flexible',
          inquiryId: msg.inquiryId || undefined,
          lastMessage: msg.message,
          lastMessageAt: msg.createdAt,
          lastSender: msg.sender,
          messages: [],
        };
      }
      threadMap[email].messages.unshift(msg); // keep ascending order
    }

    // Sort threads by latest message timestamp
    const threads = Object.values(threadMap).sort((a, b) => {
      const timeA = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const timeB = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return timeB - timeA;
    });

    return threads;
  } catch (error) {
    console.error('Error fetching threads:', error);
    return [];
  }
}
