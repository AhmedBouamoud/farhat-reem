import { readWeeklyContent, refreshWeeklyContent } from './_content-source.mjs';

export default async () => {
  let content = await readWeeklyContent().catch(() => null);

  // في أول تشغيل فقط، نملأ المخزن مباشرة حتى لا تبقى المعاينة فارغة.
  if (!content?.articles?.length && !content?.videos?.length) {
    content = await refreshWeeklyContent();
  }

  return new Response(JSON.stringify(content || { articles: [], videos: [] }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
