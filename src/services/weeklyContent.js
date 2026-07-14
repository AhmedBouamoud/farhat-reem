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

async function fetchContentFeed() {
  const response = await fetch('/.netlify/functions/content-feed', {
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`تعذر تحميل المحتوى الأسبوعي: ${response.status}`);
  return response.json();
}

export async function fetchWeeklyArticles() {
  const content = await fetchContentFeed();
  return (content.articles || []).map((article) => ({
    ...article,
    date: formatArabicDate(article.publishedAt || article.date),
    automated: true,
  }));
}

export async function fetchWeeklyVideos() {
  const content = await fetchContentFeed();
  return (content.videos || []).map((video) => ({
    ...video,
    automated: true,
  }));
}
