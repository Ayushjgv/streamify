import { NextResponse } from "next/server";
import { fetchAniListWithCache } from "@/lib/anilist";

type Anime = {
  id: number;
  title: {
    romaji?: string;
    english?: string;
  };
  coverImage: {
    large: string;
  };
  episodes?: number;
  averageScore?: number;
  nextAiringEpisode?: {
    episode: number;
  };
};

type HomePayload = {
  trending: { media: Anime[] };
  top: { media: Anime[] };
  airing: { media: Anime[] };
  popular: { media: Anime[] };
  upcoming: { media: Anime[] };
};

const HOME_QUERY = `
  query {
    trending: Page(perPage: 100) {
      media(sort: TRENDING_DESC, type: ANIME) {
        id
        title {
          romaji
          english
        }
        coverImage {
          large
        }
        episodes
        averageScore
        nextAiringEpisode {
          episode
        }
      }
    }
    top: Page(perPage: 100) {
      media(sort: SCORE_DESC, type: ANIME) {
        id
        episodes
        title {
          romaji
          english
        }
        averageScore
        coverImage {
          large
        }
      }
    }
    airing: Page(perPage: 100) {
      media(status: RELEASING, type: ANIME) {
        id
        title {
          romaji
          english
        }
        nextAiringEpisode {
          episode
        }
        averageScore
        coverImage {
          large
        }
      }
    }
    popular: Page(perPage: 100) {
      media(sort: POPULARITY_DESC, type: ANIME) {
        id
        title {
          romaji
          english
        }
        coverImage {
          large
        }
        episodes
        averageScore
      }
    }
    upcoming: Page(perPage: 100) {
      media(status: NOT_YET_RELEASED, type: ANIME) {
        id
        title {
          romaji
          english
        }
        coverImage {
          large
        }
        episodes
      }
    }
  }
`;

export async function GET() {
  try {
    const data = await fetchAniListWithCache<HomePayload>(
      "home-page",
      HOME_QUERY,
      undefined,
      1000 * 60 * 10,
    );

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=600",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to load home feed",
      },
      { status: 503 },
    );
  }
}

