const BASE_URL = 'https://danbooru.donmai.us';
const DEFAULT_TAGS = 'yuri rating:s';
const LIMIT = 24;

/**
 * @typedef {Object} DanbooruPost
 * @property {number} id
 * @property {string} file_url
 * @property {string} large_file_url
 * @property {string} preview_file_url
 * @property {number} image_width
 * @property {number} image_height
 * @property {string} tag_string_artist
 * @property {string} tag_string_character
 * @property {string} tag_string_general
 * @property {string} rating
 * @property {number} score
 * @property {string} file_ext
 */

export async function fetchPosts({ page = 1, tags = '' } = {}) {
  const queryTags = tags ? `yuri ${tags}` : DEFAULT_TAGS;
  const url = new URL(`${BASE_URL}/posts.json`);
  url.searchParams.set('tags', queryTags);
  url.searchParams.set('limit', String(LIMIT));
  url.searchParams.set('page', String(page));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Danbooru API error: ${res.status}`);

  const data = /** @type {DanbooruPost[]} */ (await res.json());
  return data.filter(
    (p) =>
      p.file_url &&
      p.large_file_url &&
      ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(p.file_ext),
  );
}

export function getDanbooruUrl(postId) {
  return `${BASE_URL}/posts/${postId}`;
}

export function parseTags(tagString) {
  return tagString
    ? tagString
        .split(' ')
        .filter(Boolean)
        .map((t) => t.replace(/_/g, ' '))
    : [];
}
