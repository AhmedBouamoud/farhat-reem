import { getStore } from '@netlify/blobs';

const STORE_NAME = 'farhat-reem-content';
const CONTENT_KEY = 'weekly-content';
const YOUTUBE_HANDLE_URL = 'https://www.youtube.com/@farhate-reem';
const NEWS_FEED_URL = 'https://news.google.com/rss/search?q=%22%D9%85%D8%AA%D9%84%D8%A7%D8%B2%D9%85%D8%A9+%D8%AF%D8%A7%D9%88%D9%86%22+OR+%22%D8%A7%D9%84%D8%AA%D8%AB%D9%84%D8%AB+%D8%A7%D9%84%D8%B5%D8%A8%D8%BA%D9%8A+21%22&hl=ar&gl=MA&ceid=MA%3Aar';

const CATEGORY_META = {
  medical: { cat: 'صحة وأبحاث', tag: 'صحي', tagType: 'blue', icon: '🧬' },
  psychological: { cat: 'النمو والتعلم', tag: 'تربوي', tagType: 'yellow', icon: '🧠' },
  care: { cat: 'الرعاية اليومية', tag: 'عملي', tagType: 'blue', icon: '💛' },
  awareness: { cat: 'أخبار ووعي', tag: 'جديد', tagType: 'yellow', icon: '📖' },
};

function decodeEntities(value = '') {
  return String(value)
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function cleanText(value = '', maxLength = 600) {
  return decodeEntities(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLength);
}

function tagValue(xml, tag) {
  const escaped = tag.replace(':', '\\:');
  const match = xml.match(new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, 'i'));
  return match ? decodeEntities(match[1]).trim() : '';
}

function tagAttribute(xml, tag, attribute) {
  const escaped = tag.replace(':', '\\:');
  const match = xml.match(new RegExp(`<${escaped}\\b[^>]*\\b${attribute}=["']([^"']+)["'][^>]*>`, 'i'));
  return match ? decodeEntities(match[1]).trim() : '';
}

function blocks(xml, tag) {
  const escaped = tag.replace(':', '\\:');
  return [...xml.matchAll(new RegExp(`<${escaped}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${escaped}>`, 'gi'))]
    .map((match) => match[1]);
}

function categoryFor(text) {
  const value = cleanText(text, 1000);
  if (/(قلب|الغدة|السمع|البصر|النوم|صحة|طبي|دواء|علاج|تشخيص|فحص)/i.test(value)) return 'medical';
  if (/(تعلم|تعليم|مدرس|لغة|نطق|ذاكرة|نمو|إدراك|مهارة)/i.test(value)) return 'psychological';
  if (/(أسرة|أهل|رعاية|تغذية|رياضة|روتين|يومي|نصيحة)/i.test(value)) return 'care';
  return 'awareness';
}

function mergeUnique(newItems, oldItems, keyOf, limit) {
  const seen = new Set();
  return [...newItems, ...oldItems].filter((item) => {
    const key = keyOf(item);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, limit);
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Farhat-Reem-Weekly-Content/1.0',
      Accept: 'application/xml,text/xml,text/html;q=0.9,*/*;q=0.8',
    },
  });
  if (!response.ok) throw new Error(`${url}: ${response.status}`);
  return response.text();
}

async function fetchArabicArticles() {
  const xml = await fetchText(NEWS_FEED_URL);
  return blocks(xml, 'item').slice(0, 12).map((item) => {
    const source = cleanText(tagValue(item, 'source'), 100) || 'مصدر عربي';
    let title = cleanText(tagValue(item, 'title'), 220);
    const suffix = ` - ${source}`;
    if (title.endsWith(suffix)) title = title.slice(0, -suffix.length).trim();
    const description = cleanText(tagValue(item, 'description'), 700);
    const categoryKey = categoryFor(`${title} ${description}`);
    const meta = CATEGORY_META[categoryKey];

    return {
      categoryKey,
      img: null,
      icon: meta.icon,
      bg: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)',
      cat: meta.cat,
      tag: meta.tag,
      tagType: meta.tagType,
      title,
      excerpt: description || `مقال عربي جديد حول ${title}. اضغط لقراءة المادة كاملة من مصدرها الأصلي.`,
      publishedAt: tagValue(item, 'pubDate') || new Date().toISOString(),
      readTime: 'قراءة المصدر',
      source,
      url: tagValue(item, 'link'),
      automated: true,
    };
  }).filter((article) => article.title && article.url);
}

async function resolveYouTubeChannelId() {
  const html = await fetchText(YOUTUBE_HANDLE_URL);
  const patterns = [
    /"channelId":"(UC[\w-]+)"/,
    /"externalId":"(UC[\w-]+)"/,
    /itemprop="channelId"\s+content="(UC[\w-]+)"/,
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return match[1];
  }
  throw new Error('تعذر تحديد معرّف قناة فرحة ريم على YouTube');
}

async function fetchYouTubeVideos() {
  const channelId = await resolveYouTubeChannelId();
  const xml = await fetchText(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
  return blocks(xml, 'entry').slice(0, 9).map((entry) => ({
    id: cleanText(tagValue(entry, 'yt:videoId'), 30),
    org: cleanText(tagValue(entry, 'name'), 120) || 'فرحة ريم',
    title: cleanText(tagValue(entry, 'title'), 220),
    dur: '',
    lang: 'AR',
    publishedAt: tagValue(entry, 'published') || new Date().toISOString(),
    image: tagAttribute(entry, 'media:thumbnail', 'url'),
    automated: true,
  })).filter((video) => video.id && video.title);
}

export function getContentStore() {
  return getStore({ name: STORE_NAME, consistency: 'strong' });
}

export async function readWeeklyContent() {
  return getContentStore().get(CONTENT_KEY, { type: 'json', consistency: 'strong' });
}

export async function refreshWeeklyContent() {
  const previous = await readWeeklyContent().catch(() => null) || { articles: [], videos: [] };
  const warnings = [];
  let freshArticles = [];
  let freshVideos = [];

  try {
    freshArticles = await fetchArabicArticles();
  } catch (error) {
    warnings.push(`articles: ${error.message}`);
  }

  try {
    freshVideos = await fetchYouTubeVideos();
  } catch (error) {
    warnings.push(`videos: ${error.message}`);
  }

  const content = {
    articles: mergeUnique(freshArticles, previous.articles || [], (item) => item.url, 24),
    videos: mergeUnique(freshVideos, previous.videos || [], (item) => item.id, 9),
    updatedAt: new Date().toISOString(),
    warnings,
  };

  await getContentStore().setJSON(CONTENT_KEY, content);
  return content;
}
