import { supabase } from '../lib/supabase';

const VALID_CATEGORIES = new Set(['medical', 'psychological', 'care', 'awareness']);

function formatArabicDate(value) {
  if (!value) return '';
  try {
    return new Intl.DateTimeFormat('ar-MA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date(value));
  } catch {
    return String(value);
  }
}

function metadataOf(row) {
  return row?.metadata && typeof row.metadata === 'object' ? row.metadata : {};
}

function extractYouTubeId(url = '') {
  const match = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([^?&/]+)/i);
  return match?.[1] || '';
}

export async function fetchWeeklyArticles() {
  const { data, error } = await supabase
    .from('weekly_content')
    .select('*')
    .eq('kind', 'article')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(24);

  if (error) throw error;

  return (data || []).map((row) => {
    const meta = metadataOf(row);
    const categoryKey = VALID_CATEGORIES.has(row.category) ? row.category : 'awareness';

    return {
      categoryKey,
      img: row.image_url || null,
      icon: meta.icon || '🧬',
      bg: meta.bg || 'linear-gradient(135deg,#EFF6FF,#DBEAFE)',
      cat: meta.cat || 'جديد هذا الأسبوع',
      tag: meta.tag || 'حديث',
      tagType: meta.tagType === 'yellow' ? 'yellow' : 'blue',
      title: row.title,
      excerpt: row.excerpt,
      date: formatArabicDate(row.published_at),
      readTime: meta.readTime || '5 دقائق',
      source: row.source_name,
      url: row.source_url,
      automated: true,
    };
  });
}

export async function fetchWeeklyVideos() {
  const { data, error } = await supabase
    .from('weekly_content')
    .select('*')
    .eq('kind', 'video')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(9);

  if (error) throw error;

  return (data || [])
    .map((row) => {
      const meta = metadataOf(row);
      return {
        id: meta.videoId || extractYouTubeId(row.source_url),
        org: row.source_name || 'فرحة ريم',
        title: row.title,
        dur: meta.duration || '',
        lang: meta.lang || 'AR',
        publishedAt: row.published_at,
        automated: true,
      };
    })
    .filter((video) => video.id);
}
