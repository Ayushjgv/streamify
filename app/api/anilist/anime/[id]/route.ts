import { NextRequest, NextResponse } from "next/server";
import { fetchAniListWithCache } from "@/lib/anilist";

type AnimeDetails = {
  Media: {
    episodes?: number;
    id: number;
    title: {
      romaji?: string;
      english?: string;
    };
    coverImage: {
      large: string;
    };
    averageScore?: number;
  };
};

const ANIME_QUERY = `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      episodes
      id
      title {
        romaji
        english
      }
      coverImage {
        large
      }
      averageScore
    }
  }
`;

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
    const data = await fetchAniListWithCache<AnimeDetails>(
      `anime-${id}`,
      ANIME_QUERY,
      { id: Number(id) },
      1000 * 60 * 30,
    );

    return NextResponse.json(data.Media, {
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=1800",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to load anime details",
      },
      { status: 503 },
    );
  }
}

