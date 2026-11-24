import { getCollection } from 'astro:content';

export async function publishedPosts() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export const tagPath = (tag: string) => '/blog/tags/' + encodeURIComponent(tag) + '/';
