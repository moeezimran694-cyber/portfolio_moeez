import { db } from './index.ts';
import { siteSettings } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getSettingsMap() {
  try {
    const list = await db.select().from(siteSettings);
    const map: Record<string, string> = {};
    for (const item of list) {
      map[item.key] = item.value;
    }
    return map;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return {};
  }
}

export async function saveSetting(key: string, value: string) {
  try {
    await db.insert(siteSettings)
      .values({ key, value })
      .onConflictDoUpdate({
        target: siteSettings.key,
        set: { value, updatedAt: new Date() }
      });
    return true;
  } catch (error) {
    console.error(`Error saving setting ${key}:`, error);
    return false;
  }
}
