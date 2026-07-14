import { refreshWeeklyContent } from './_content-source.mjs';

export default async () => {
  const content = await refreshWeeklyContent();
  console.log('تم تحديث محتوى فرحة ريم الأسبوعي:', {
    articles: content.articles.length,
    videos: content.videos.length,
    warnings: content.warnings,
    updatedAt: content.updatedAt,
  });

  return new Response(null, { status: 204 });
};
