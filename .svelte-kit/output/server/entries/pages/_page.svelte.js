import { a6 as ssr_context, a7 as attr, a8 as attr_class, a9 as stringify, aa as store_get, e as escape_html, ab as unsubscribe_stores, ac as ensure_array_like, ad as attr_style, ae as bind_props, af as fallback, ag as head } from "../../chunks/index2.js";
import "clsx";
import { w as writable } from "../../chunks/index.js";
function onDestroy(fn) {
  /** @type {SSRContext} */
  ssr_context.r.on_destroy(fn);
}
const lightboxPost = writable(
  /** @type {import('../utils/danbooru').DanbooruPost | null} */
  null
);
const activeSearch = writable("");
const showFavoritesOnly = writable(false);
function createFavoritesStore() {
  const initial = [];
  const { subscribe, update, set } = writable(
    /** @type {number[]} */
    initial
  );
  function toggle(id) {
    update((ids) => {
      const next = ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id];
      return next;
    });
  }
  function has(id) {
    let result = false;
    subscribe((ids) => result = ids.includes(id))();
    return result;
  }
  function clear() {
    set([]);
  }
  return { subscribe, toggle, has, clear };
}
const favorites = createFavoritesStore();
function Header($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let searchInput = "";
    $$renderer2.push(`<header class="glass sticky top-0 z-40 px-4 py-3"><div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center gap-3"><a href="/" class="flex items-center gap-2 shrink-0 group"><span class="text-2xl font-display italic text-pink-mid group-hover:text-pink-bright transition-colors">百合</span> <span class="text-lg font-display text-pink-soft/80">Gallery</span></a> <div class="flex-1 w-full sm:max-w-md relative"><input type="text"${attr("value", searchInput)} placeholder="Rechercher des tags… (ex: school_uniform)" class="w-full bg-bg-primary/60 border border-purple-mid/30 rounded-full px-4 py-2 text-sm text-pink-soft placeholder:text-pink-soft/30 focus:outline-none focus:border-pink-mid/60 transition-colors pr-8"/> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="flex items-center gap-2 shrink-0"><button${attr_class(`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${stringify(store_get($$store_subs ??= {}, "$showFavoritesOnly", showFavoritesOnly) ? "bg-pink-mid/20 text-pink-mid border-pink-mid/40" : "bg-transparent text-pink-soft/60 border-pink-soft/20 hover:border-pink-mid/30 hover:text-pink-soft")}`)} title="Mes favoris"><span class="text-base">${escape_html(store_get($$store_subs ??= {}, "$showFavoritesOnly", showFavoritesOnly) ? "♥" : "♡")}</span> <span class="hidden sm:inline">Favoris</span> `);
    if (store_get($$store_subs ??= {}, "$favorites", favorites).length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="bg-pink-mid text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">${escape_html(store_get($$store_subs ??= {}, "$favorites", favorites).length > 9 ? "9+" : store_get($$store_subs ??= {}, "$favorites", favorites).length)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></button></div></div></header>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function TagFilter($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let activeTag;
    const PRESET_TAGS = [
      { label: "Toutes", tag: "" },
      { label: "Baiser", tag: "kiss" },
      { label: "Câlin", tag: "hug" },
      { label: "École", tag: "school_uniform" },
      { label: "Fleurs", tag: "flower" },
      { label: "Parapluie", tag: "umbrella" },
      { label: "Pleurant", tag: "crying" },
      { label: "Pluie", tag: "rain" },
      { label: "Mariage", tag: "wedding" },
      { label: "Yukata", tag: "yukata" }
    ];
    activeTag = store_get($$store_subs ??= {}, "$activeSearch", activeSearch);
    $$renderer2.push(`<div class="flex flex-wrap gap-2 px-4 py-3"><!--[-->`);
    const each_array = ensure_array_like(PRESET_TAGS);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let { label, tag } = each_array[$$index];
      $$renderer2.push(`<button${attr_class(`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border ${stringify(activeTag === tag ? "bg-gradient-to-r from-pink-mid to-purple-mid text-white border-transparent shadow-lg shadow-pink-mid/20" : "bg-transparent text-pink-soft/50 border-pink-soft/15 hover:border-pink-mid/40 hover:text-pink-soft")}`)}>${escape_html(label)}</button>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
const BASE_URL = "https://danbooru.donmai.us";
const DEFAULT_TAGS = "yuri rating:s";
const LIMIT = 24;
async function fetchPosts({ page = 1, tags = "" } = {}) {
  const queryTags = tags ? `yuri ${tags}` : DEFAULT_TAGS;
  const url = new URL(`${BASE_URL}/posts.json`);
  url.searchParams.set("tags", queryTags);
  url.searchParams.set("limit", String(LIMIT));
  url.searchParams.set("page", String(page));
  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Danbooru API error: ${res.status}`);
  const data = await res.json();
  return data.filter(
    (p) => p.file_url && p.large_file_url && ["jpg", "jpeg", "png", "gif", "webp"].includes(p.file_ext)
  );
}
function getDanbooruUrl(postId) {
  return `${BASE_URL}/posts/${postId}`;
}
function parseTags(tagString) {
  return tagString ? tagString.split(" ").filter(Boolean) : [];
}
function ImageCard($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let isFavorited, artists;
    let post = $$props["post"];
    let loaded = false;
    isFavorited = store_get($$store_subs ??= {}, "$favorites", favorites).includes(post.id);
    artists = parseTags(post.tag_string_artist).slice(0, 2);
    $$renderer2.push(`<div class="masonry-item group relative svelte-la21wb"><button class="block w-full rounded-xl overflow-hidden relative cursor-zoom-in ring-0 hover:ring-2 ring-pink-mid/60 transition-all duration-300 focus:outline-none focus:ring-2 svelte-la21wb">`);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="w-full bg-bg-card svelte-la21wb"${attr_style(`aspect-ratio: ${stringify(post.image_width)}/${stringify(post.image_height)}; min-height: 120px;`)}><div class="absolute inset-0 overflow-hidden svelte-la21wb"><div class="w-full h-full svelte-la21wb" style="background: linear-gradient(90deg, transparent 0%, rgba(155,93,229,0.08) 50%, transparent 100%); background-size: 200% 100%; animation: shimmer 1.5s infinite;"></div></div></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<img${attr("src", post.preview_file_url)} alt="Yuri artwork" loading="lazy"${attr_class("w-full h-auto block transition-all duration-500 group-hover:scale-[1.02] svelte-la21wb", void 0, { "opacity-0": !loaded, "animate-fade-in": loaded })}/>`);
    }
    $$renderer2.push(`<!--]--> <div class="absolute inset-0 bg-gradient-to-t from-bg-primary/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl svelte-la21wb"><div class="absolute bottom-0 left-0 right-0 p-3 svelte-la21wb">`);
    if (artists.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-pink-mid text-xs font-medium mb-1 truncate svelte-la21wb">${escape_html(artists.join(", "))}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="flex items-center justify-between svelte-la21wb"><span class="text-pink-soft/60 text-xs svelte-la21wb">⭐ ${escape_html(post.score)}</span> <a${attr("href", getDanbooruUrl(post.id))} target="_blank" rel="noopener noreferrer" class="text-pink-soft/50 hover:text-pink-mid text-xs transition-colors svelte-la21wb">Danbooru ↗</a></div></div></div></button> <button${attr_class(
      `absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 z-10 ${stringify(isFavorited ? "bg-pink-mid text-white opacity-100 scale-100" : "bg-bg-primary/70 text-pink-soft/60 opacity-0 group-hover:opacity-100 hover:bg-pink-mid/20 hover:text-pink-mid")}`,
      "svelte-la21wb"
    )}${attr("aria-label", isFavorited ? "Retirer des favoris" : "Ajouter aux favoris")}${attr("title", isFavorited ? "Retirer des favoris" : "Ajouter aux favoris")}>${escape_html(isFavorited ? "♥" : "♡")}</button></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { post });
  });
}
function SkeletonCard($$renderer) {
  const height = 160 + Math.floor(Math.random() * 200);
  $$renderer.push(`<div class="masonry-item rounded-xl overflow-hidden svelte-lx25l7"${attr_style(`height: ${stringify(height)}px;`)}><div class="w-full h-full bg-bg-card relative overflow-hidden svelte-lx25l7"><div class="absolute inset-0 svelte-lx25l7" style="background: linear-gradient(90deg, transparent 0%, rgba(155,93,229,0.08) 50%, transparent 100%); background-size: 200% 100%; animation: shimmer 1.5s infinite;"></div></div></div>`);
}
function Lightbox($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let post, isFavorited, artists, characters, generalTags, currentIndex;
    let posts = fallback($$props["posts"], () => [], true);
    let imageLoaded = false;
    post = store_get($$store_subs ??= {}, "$lightboxPost", lightboxPost);
    isFavorited = post ? store_get($$store_subs ??= {}, "$favorites", favorites).includes(post.id) : false;
    artists = post ? parseTags(post.tag_string_artist) : [];
    characters = post ? parseTags(post.tag_string_character).slice(0, 6) : [];
    generalTags = post ? parseTags(post.tag_string_general).slice(0, 12) : [];
    currentIndex = post ? posts.findIndex((p) => p.id === post.id) : -1;
    if (post) imageLoaded = false;
    if (post) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fixed inset-0 z-50 bg-bg-primary/95 backdrop-blur-md flex items-center justify-center p-4" role="dialog" aria-modal="true" tabindex="-1"><button class="absolute top-4 right-4 w-10 h-10 rounded-full glass flex items-center justify-center text-pink-soft/60 hover:text-pink-mid transition-colors z-10" aria-label="Fermer">✕</button> `);
      if (currentIndex > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<button class="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-pink-soft/60 hover:text-pink-mid transition-colors z-10" aria-label="Précédent">←</button>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (currentIndex < posts.length - 1) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<button class="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full glass flex items-center justify-center text-pink-soft/60 hover:text-pink-mid transition-colors z-10" aria-label="Suivant">→</button>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <div class="flex flex-col lg:flex-row gap-4 max-h-[90vh] w-full max-w-6xl animate-slide-up"><div class="flex-1 flex items-center justify-center min-h-0">`);
      if (!imageLoaded) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="w-full max-h-[80vh] aspect-square bg-bg-card rounded-2xl animate-pulse"></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <img${attr("src", post.large_file_url)} alt="Yuri artwork"${attr_class("max-w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl transition-opacity duration-300", void 0, { "opacity-0": !imageLoaded, "opacity-100": imageLoaded })}/></div> <div class="lg:w-72 shrink-0 glass rounded-2xl p-4 overflow-y-auto max-h-[80vh] flex flex-col gap-4"><div class="flex gap-2"><button${attr_class(`flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${stringify(isFavorited ? "bg-pink-mid/20 text-pink-mid border-pink-mid/40" : "bg-transparent text-pink-soft/60 border-pink-soft/20 hover:border-pink-mid/30 hover:text-pink-mid")}`)}>${escape_html(isFavorited ? "♥ Favoris" : "♡ Ajouter")}</button> <a${attr("href", getDanbooruUrl(post.id))} target="_blank" rel="noopener noreferrer" class="flex items-center justify-center px-3 py-2 rounded-full glass text-pink-soft/60 hover:text-pink-mid text-sm transition-colors border border-pink-soft/10 hover:border-pink-mid/30" title="Voir sur Danbooru">↗</a> <a${attr("href", post.file_url)} target="_blank" rel="noopener noreferrer" download="" class="flex items-center justify-center px-3 py-2 rounded-full glass text-pink-soft/60 hover:text-pink-mid text-sm transition-colors border border-pink-soft/10 hover:border-pink-mid/30" title="Télécharger">⬇</a></div> <div class="text-xs text-pink-soft/40 space-y-1"><div>ID : <span class="text-pink-soft/60">#${escape_html(post.id)}</span></div> <div>Résolution : <span class="text-pink-soft/60">${escape_html(post.image_width)} × ${escape_html(post.image_height)}</span></div> <div>Score : <span class="text-pink-soft/60">⭐ ${escape_html(post.score)}</span></div></div> `);
      if (artists.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div><p class="text-xs font-medium text-pink-mid/80 uppercase tracking-wider mb-2">Artiste</p> <div class="flex flex-wrap gap-1.5"><!--[-->`);
        const each_array = ensure_array_like(artists);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let tag = each_array[$$index];
          $$renderer2.push(`<button class="tag-badge-artist">${escape_html(tag.replace(/_/g, " "))}</button>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (characters.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div><p class="text-xs font-medium text-purple-soft/80 uppercase tracking-wider mb-2">Personnages</p> <div class="flex flex-wrap gap-1.5"><!--[-->`);
        const each_array_1 = ensure_array_like(characters);
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let tag = each_array_1[$$index_1];
          $$renderer2.push(`<button class="tag-badge-character">${escape_html(tag.replace(/_/g, " "))}</button>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (generalTags.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div><p class="text-xs font-medium text-purple-mid/80 uppercase tracking-wider mb-2">Tags</p> <div class="flex flex-wrap gap-1.5"><!--[-->`);
        const each_array_2 = ensure_array_like(generalTags);
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let tag = each_array_2[$$index_2];
          $$renderer2.push(`<button class="tag-badge-general">${escape_html(tag.replace(/_/g, " "))}</button>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
    bind_props($$props, { posts });
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let currentSearch, onlyFavorites, favoritedIds, displayedPosts;
    let posts = [];
    let page = 1;
    let loading = false;
    let hasMore = true;
    let error = "";
    let observer = null;
    async function resetAndLoad() {
      posts = [];
      page = 1;
      hasMore = true;
      error = "";
      await loadMore();
    }
    async function loadMore() {
      if (loading || !hasMore) return;
      loading = true;
      error = "";
      try {
        const newPosts = await fetchPosts({ page, tags: currentSearch });
        if (newPosts.length === 0) {
          hasMore = false;
        } else {
          posts = [...posts, ...newPosts];
          page += 1;
        }
      } catch (e) {
        error = "Erreur lors du chargement des images. Réessaie dans un instant.";
      } finally {
        loading = false;
      }
    }
    onDestroy(() => observer?.disconnect());
    currentSearch = store_get($$store_subs ??= {}, "$activeSearch", activeSearch);
    onlyFavorites = store_get($$store_subs ??= {}, "$showFavoritesOnly", showFavoritesOnly);
    favoritedIds = store_get($$store_subs ??= {}, "$favorites", favorites);
    displayedPosts = onlyFavorites ? posts.filter((p) => favoritedIds.includes(p.id)) : posts;
    {
      resetAndLoad();
    }
    head("1uha8ag", $$renderer2, ($$renderer3) => {
      $$renderer3.title(($$renderer4) => {
        $$renderer4.push(`<title>百合 Gallery</title>`);
      });
    });
    Header($$renderer2);
    $$renderer2.push(`<!----> `);
    TagFilter($$renderer2);
    $$renderer2.push(`<!----> <main class="max-w-7xl mx-auto px-3 pb-16">`);
    if (onlyFavorites && displayedPosts.length === 0 && !loading) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="flex flex-col items-center justify-center py-24 gap-4 animate-slide-up"><p class="text-6xl">♡</p> <p class="text-pink-soft/40 text-center">Tu n'as pas encore de favoris.<br/> <span class="text-pink-soft/20 text-sm">Clique sur ♡ sur une image pour l'ajouter.</span></p></div>`);
    } else if (error && posts.length === 0) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<div class="flex flex-col items-center justify-center py-24 gap-4 animate-slide-up"><p class="text-pink-soft/40 text-center">${escape_html(error)}</p> <button class="btn-primary">Réessayer</button></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="masonry"><!--[-->`);
      const each_array = ensure_array_like(displayedPosts);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let post = each_array[$$index];
        ImageCard($$renderer2, { post });
      }
      $$renderer2.push(`<!--]--> `);
      if (loading) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(Array(8));
        for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
          each_array_1[i];
          SkeletonCard($$renderer2);
        }
        $$renderer2.push(`<!--]-->`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> `);
      if (error) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="text-center py-8"><p class="text-pink-soft/40 text-sm mb-3">${escape_html(error)}</p> <button class="btn-primary">Réessayer</button></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (!hasMore && posts.length > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="text-center py-12"><p class="text-pink-soft/20 text-sm font-display italic">~ Fin de la galerie ~</p></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (!onlyFavorites) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="h-1"></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></main> `);
    Lightbox($$renderer2, { posts });
    $$renderer2.push(`<!---->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
