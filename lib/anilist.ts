type CacheEntry<T> = {
  data: T;
  expiresAt: number;
};

type AniListGraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

const ANILIST_URL = "https://graphql.anilist.co";
const DEFAULT_TTL_MS = 1000 * 60 * 10;

const globalCache = globalThis as typeof globalThis & {
  __anilistCache__?: Map<string, CacheEntry<unknown>>;
};

const cacheStore = globalCache.__anilistCache__ ?? new Map<string, CacheEntry<unknown>>();

if (!globalCache.__anilistCache__) {
  globalCache.__anilistCache__ = cacheStore;
}

export async function fetchAniListWithCache<T>(
  cacheKey: string,
  query: string,
  variables?: Record<string, unknown>,
  ttlMs = DEFAULT_TTL_MS,
): Promise<T> {
  const now = Date.now();
  const cachedEntry = cacheStore.get(cacheKey) as CacheEntry<T> | undefined;

  if (cachedEntry && cachedEntry.expiresAt > now) {
    return cachedEntry.data;
  }

  try {
    const response = await fetch(ANILIST_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });

    const payload = (await response.json()) as AniListGraphQLResponse<T>;

    if (!response.ok || payload.errors?.length || !payload.data) {
      throw new Error(
        payload.errors?.[0]?.message || `AniList request failed with ${response.status}`,
      );
    }

    cacheStore.set(cacheKey, {
      data: payload.data,
      expiresAt: now + ttlMs,
    });

    return payload.data;
  } catch (error) {
    if (cachedEntry) {
      return cachedEntry.data;
    }

    throw error;
  }
}

