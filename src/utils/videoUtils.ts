/**
 * Helper utilities for parsing and embedding video links
 * Supports YouTube (standard, shorts, share links), Vimeo, and direct MP4/WebM formats
 */

export interface ParsedVideoInfo {
  type: 'youtube' | 'vimeo' | 'mp4';
  embedUrl: string;
  originalUrl: string;
}

export function parseVideoUrl(rawUrl?: string | null): ParsedVideoInfo | null {
  if (!rawUrl || !rawUrl.trim()) return null;
  const trimmed = rawUrl.trim();

  // YouTube matchers: youtu.be/ID, youtube.com/watch?v=ID, youtube.com/embed/ID, youtube.com/shorts/ID
  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`,
      originalUrl: trimmed,
    };
  }

  // Vimeo matchers: vimeo.com/ID
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)/i);
  if (vimeoMatch && (vimeoMatch[3] || vimeoMatch[1])) {
    const vimeoId = vimeoMatch[3] || vimeoMatch[1];
    return {
      type: 'vimeo',
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1`,
      originalUrl: trimmed,
    };
  }

  // Direct video file (mp4, webm, ogg, mov) or data:video base64
  return {
    type: 'mp4',
    embedUrl: trimmed,
    originalUrl: trimmed,
  };
}
