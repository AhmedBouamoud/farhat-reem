import { createClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://hjkdeaynmbgkacjqjudg.supabase.co';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-5.6-luna';
const YOUTUBE_HANDLE = process.env.YOUTUBE_HANDLE || '@farhate-reem';

const CATEGORY_META = {
  medical: { cat: 'أبحاث طبية', tag: 'علمي', tagType: 'blue', icon: '🧬' },
  psychological: { cat: 'النمو والمعرفة', tag: 'تطوري', tagType: 'yellow', icon: '🧠' },
  care: { cat: 'الرعاية اليومية', tag: 'عملي', tagType: 'blue', icon: '💛' },
  awareness: { cat: 'ارفع وعيك', tag: 'وعي', tagType: 'yellow', icon: '📖' },
};

function getResponseText(payload) {
  for (const item of payload?.output || []) {
    for (const content of item?.content || []) {
      if (content?.type === 'output_text' && content.text) return content.text;
    }
  }
  return '';
}

function parseJsonObject(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end <= start) throw new Error('لم يُرجع نموذج التلخيص JSON صالحاً');
  return JSON.parse(text.slice(start, end + 1));
}

function cleanText(value, maxLength = 900) {
  return String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function europePmcUrl(paper) {
  const source = paper.source || (paper.pmid ? 'MED' : 'PMC');
  const id = paper.id || paper.pmid || paper.pmcid;
  return `https://europepmc.org/article/${encodeURIComponent(source)}/${encodeURIComponent(id)}`;
}

async function fetchLatestPapers() {
  const query = 'TITLE_ABS:"Down syndrome"';
  const params = new URLSearchParams({
    query,
    format: 'json',
    resultType: 'core',
    pageSize: '8',
    sort: 'P_PDATE_D desc',
  });
  const response = await fetch(`https://www.ebi.ac.uk/europepmc/webservices/rest/search?${params}`);
  if (!response.ok) throw new Error(`Europe PMC: ${response.status}`);
  const payload = await response.json();
  return (payload?.resultList?.result || []).filter((paper) => paper.title && paper.abstractText);
}

async function summarizePaperInArabic(paper) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const sourceText = [
    `العنوان: ${cleanText(paper.title, 500)}`,
    `الملخص الأصلي: ${cleanText(paper.abstractText, 5000)}`,
    `المجلة: ${cleanText(paper.journalTitle || 'Europe PMC', 200)}`,
    `تاريخ النشر: ${paper.firstPublicationDate || paper.firstIndexDate || ''}`,
  ].join('\n');

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      reasoning: { effort: 'low' },
      input: [
        {
          role: 'system',
          content: [{
            type: 'input_text',
            text: 'أنت محرر علمي عربي لمنصة أسر أطفال متلازمة داون. لخص النص المرفق فقط دون إضافة حقائق أو نصائح علاجية غير موجودة. استخدم لغة عربية واضحة ومحترمة، واذكر أن المحتوى للتوعية ولا يغني عن الطبيب عند الحاجة. أعد JSON فقط بالمفاتيح: title, excerpt, category, readTime. يجب أن تكون category واحدة من medical أو psychological أو care أو awareness.',
          }],
        },
        {
          role: 'user',
          content: [{ type: 'input_text', text: sourceText }],
        },
      ],
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`OpenAI: ${response.status} ${message.slice(0, 180)}`);
  }

  const payload = await response.json();
  const parsed = parseJsonObject(getResponseText(payload));
  const category = CATEGORY_META[parsed.category] ? parsed.category : 'awareness';

  return {
    title: cleanText(parsed.title, 220),
    excerpt: cleanText(parsed.excerpt, 900),
    category,
    readTime: cleanText(parsed.readTime, 40) || '5 دقائق',
  };
}

function formatDuration(iso = '') {
  const match = iso.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
  if (!match) return '';
  const hours = Number(match[1] || 0);
  const minutes = Number(match[2] || 0);
  const seconds = Number(match[3] || 0);
  return hours
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${minutes}:${String(seconds).padStart(2, '0')}`;
}

async function youtubeJson(path, params) {
  const query = new URLSearchParams({ ...params, key: process.env.YOUTUBE_API_KEY });
  const response = await fetch(`https://www.googleapis.com/youtube/v3/${path}?${query}`);
  if (!response.ok) throw new Error(`YouTube ${path}: ${response.status}`);
  return response.json();
}

async function fetchLatestChannelVideos() {
  if (!process.env.YOUTUBE_API_KEY) return [];

  const channelPayload = await youtubeJson('channels', {
    part: 'snippet,contentDetails',
    forHandle: YOUTUBE_HANDLE,
    maxResults: '1',
  });
  const channel = channelPayload?.items?.[0];
  const uploads = channel?.contentDetails?.relatedPlaylists?.uploads;
  if (!uploads) throw new Error(`لم يتم العثور على قناة YouTube بالمعرّف ${YOUTUBE_HANDLE}`);

  const playlistPayload = await youtubeJson('playlistItems', {
    part: 'snippet,contentDetails',
    playlistId: uploads,
    maxResults: '6',
  });
  const items = playlistPayload?.items || [];
  const ids = items.map((item) => item?.contentDetails?.videoId).filter(Boolean);
  if (!ids.length) return [];

  const detailsPayload = await youtubeJson('videos', {
    part: 'contentDetails',
    id: ids.join(','),
    maxResults: '6',
  });
  const durations = new Map(
    (detailsPayload?.items || []).map((item) => [item.id, formatDuration(item?.contentDetails?.duration)])
  );

  return items.map((item) => {
    const videoId = item?.contentDetails?.videoId;
    const snippet = item?.snippet || {};
    return {
      kind: 'video',
      category: 'awareness',
      title: cleanText(snippet.title, 220),
      excerpt: cleanText(snippet.description, 700),
      image_url: snippet?.thumbnails?.high?.url || snippet?.thumbnails?.medium?.url || null,
      source_name: channel?.snippet?.title || 'فرحة ريم',
      source_url: `https://www.youtube.com/watch?v=${videoId}`,
      published_at: snippet.videoPublishedAt || snippet.publishedAt || new Date().toISOString(),
      status: 'published',
      metadata: {
        videoId,
        duration: durations.get(videoId) || '',
        lang: 'AR',
      },
      updated_at: new Date().toISOString(),
    };
  });
}

async function getExistingUrls(supabase, urls) {
  if (!urls.length) return new Set();
  const { data, error } = await supabase
    .from('weekly_content')
    .select('source_url')
    .in('source_url', urls);
  if (error) throw error;
  return new Set((data || []).map((row) => row.source_url));
}

async function buildArticleRows(supabase) {
  if (!process.env.OPENAI_API_KEY) {
    console.warn('OPENAI_API_KEY غير مضبوط؛ تم تجاوز تحديث المقالات مع استمرار تحديث الفيديوهات.');
    return [];
  }

  const papers = await fetchLatestPapers();
  const candidates = papers.map((paper) => ({ paper, url: europePmcUrl(paper) }));
  const existing = await getExistingUrls(supabase, candidates.map((item) => item.url));
  const newCandidates = candidates.filter((item) => !existing.has(item.url)).slice(0, 2);
  const rows = [];

  for (const { paper, url } of newCandidates) {
    const summary = await summarizePaperInArabic(paper);
    if (!summary?.title || !summary?.excerpt) continue;
    const meta = CATEGORY_META[summary.category];
    rows.push({
      kind: 'article',
      category: summary.category,
      title: summary.title,
      excerpt: summary.excerpt,
      image_url: null,
      source_name: cleanText(paper.journalTitle || 'Europe PMC', 180),
      source_url: url,
      published_at: paper.firstPublicationDate || paper.firstIndexDate || new Date().toISOString(),
      status: 'published',
      metadata: {
        ...meta,
        readTime: summary.readTime,
        bg: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)',
        originalTitle: cleanText(paper.title, 500),
        automated: true,
      },
      updated_at: new Date().toISOString(),
    });
  }

  return rows;
}

async function upsertRows(supabase, rows) {
  if (!rows.length) return 0;
  const { error } = await supabase
    .from('weekly_content')
    .upsert(rows, { onConflict: 'source_url' });
  if (error) throw error;
  return rows.length;
}

export default async () => {
  if (process.env.WEEKLY_CONTENT_ENABLED === 'false') {
    console.log('التحديث الأسبوعي متوقف عبر WEEKLY_CONTENT_ENABLED=false');
    return new Response(null, { status: 204 });
  }

  const supabaseUrl = process.env.SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY غير مضبوط في Netlify');

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const results = { articles: 0, videos: 0, warnings: [] };

  try {
    results.articles = await upsertRows(supabase, await buildArticleRows(supabase));
  } catch (error) {
    results.warnings.push(`articles: ${error.message}`);
    console.error(error);
  }

  try {
    results.videos = await upsertRows(supabase, await fetchLatestChannelVideos());
  } catch (error) {
    results.warnings.push(`videos: ${error.message}`);
    console.error(error);
  }

  console.log('نتيجة التحديث الأسبوعي:', results);
  return new Response(JSON.stringify(results), {
    status: results.articles || results.videos ? 200 : 207,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
