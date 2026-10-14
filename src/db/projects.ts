import { db } from './index.ts';
import { projects } from './schema.ts';
import { desc, eq } from 'drizzle-orm';

export interface ProjectDbItem {
  id?: number;
  projectId: string;
  title: string;
  tagline?: string | null;
  category: string;
  status: string;
  image: string;
  shortDescription: string;
  fullDescription: string;
  clientContext?: string | null;
  tools: string[];
  keyFeatures: string[];
  liveUrl?: string | null;
  githubUrl?: string | null;
  demoType: string;
  createdAt?: Date | null;
}

export async function getAllProjects() {
  try {
    const list = await db.select().from(projects).orderBy(desc(projects.createdAt));
    return list.map((item) => ({
      id: item.projectId,
      title: item.title,
      tagline: item.tagline || '',
      category: item.category,
      status: item.status,
      image: item.image,
      shortDescription: item.shortDescription,
      fullDescription: item.fullDescription,
      clientContext: item.clientContext || undefined,
      tools: Array.isArray(item.tools) ? item.tools : [],
      keyFeatures: Array.isArray(item.keyFeatures) ? item.keyFeatures : [],
      liveUrl: item.liveUrl || null,
      githubUrl: item.githubUrl || null,
      demoType: item.demoType,
    }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

export async function insertOrUpdateProject(item: ProjectDbItem) {
  try {
    const existing = await db.select().from(projects).where(eq(projects.projectId, item.projectId)).limit(1);
    if (existing.length > 0) {
      const updated = await db.update(projects)
        .set({
          title: item.title,
          tagline: item.tagline || null,
          category: item.category,
          status: item.status || 'Live Project',
          image: item.image,
          shortDescription: item.shortDescription,
          fullDescription: item.fullDescription,
          clientContext: item.clientContext || null,
          tools: item.tools,
          keyFeatures: item.keyFeatures,
          liveUrl: item.liveUrl || null,
          githubUrl: item.githubUrl || null,
        })
        .where(eq(projects.projectId, item.projectId))
        .returning();
      return updated[0];
    } else {
      const created = await db.insert(projects).values({
        projectId: item.projectId,
        title: item.title,
        tagline: item.tagline || null,
        category: item.category,
        status: item.status || 'Live Project',
        image: item.image,
        shortDescription: item.shortDescription,
        fullDescription: item.fullDescription,
        clientContext: item.clientContext || null,
        tools: item.tools,
        keyFeatures: item.keyFeatures,
        liveUrl: item.liveUrl || null,
        githubUrl: item.githubUrl || null,
        demoType: 'real-project',
      }).returning();
      return created[0];
    }
  } catch (error) {
    console.error('Error saving project to database:', error);
    throw new Error('Database operation failed', { cause: error });
  }
}

export async function deleteProjectById(projectId: string) {
  try {
    await db.delete(projects).where(eq(projects.projectId, projectId));
    return true;
  } catch (error) {
    console.error('Error deleting project from database:', error);
    throw new Error('Database delete failed', { cause: error });
  }
}
