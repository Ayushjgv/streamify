"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import EpisodeCard from "@/components/EpisodeCard";

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
};

const ANIME_CACHE_TTL_MS = 1000 * 60 * 30;

function readAnimeCache<T>(key: string): T | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(key);

  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as { expiresAt: number; data: T };

    if (parsed.expiresAt < Date.now()) {
      window.localStorage.removeItem(key);
      return null;
    }

    return parsed.data;
  } catch {
    window.localStorage.removeItem(key);
    return null;
  }
}

function writeAnimeCache<T>(key: string, data: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    key,
    JSON.stringify({
      expiresAt: Date.now() + ANIME_CACHE_TTL_MS,
      data,
    }),
  );
}

const Page = () => {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [animeDetails, setAnimeDetails] = useState<Anime | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const episodesList = Array.from(
    { length: animeDetails?.episodes ?? 0 },
    (_, index) => index + 1,
  );

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      const cacheKey = `streamer-anime-${id}`;
      const cachedAnime = readAnimeCache<Anime>(cacheKey);

      if (cachedAnime) {
        setAnimeDetails(cachedAnime);
      }

      try {
        const response = await fetch(`/api/anilist/anime/${id}`);
        const payload = (await response.json()) as Anime & { error?: string };

        if (!response.ok) {
          throw new Error(payload.error || "Failed to load anime details");
        }

        setAnimeDetails(payload);
        writeAnimeCache(cacheKey, payload);
        setLoadError(null);
      } catch (error) {
        setLoadError(
          error instanceof Error
            ? error.message
            : "AniList is rate limiting requests right now.",
        );
      }
    };

    void load();
  }, [id]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(229,9,20,0.18),_transparent_25%),linear-gradient(180deg,_#0b0b0b_0%,_#070707_100%)] text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10">
        {animeDetails?.coverImage?.large ? (
          <Image
            src={animeDetails.coverImage.large}
            alt={animeDetails.title.english || animeDetails.title.romaji || "Anime"}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-25"
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(7,7,7,0.96)_8%,_rgba(7,7,7,0.78)_48%,_rgba(7,7,7,0.94)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(7,7,7,0.1)_0%,_rgba(7,7,7,0.84)_70%,_#070707_100%)]" />

        <div className="relative mx-auto grid min-h-[56vh] max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:px-10 lg:py-16">
          <div className="relative mx-auto aspect-[2/3] w-[220px] overflow-hidden rounded-3xl border border-white/12 shadow-[0_28px_80px_rgba(0,0,0,0.45)] sm:w-[240px] lg:mx-0 lg:w-full">
            {animeDetails?.coverImage?.large ? (
              <Image
                src={animeDetails.coverImage.large}
                alt={animeDetails.title.english || animeDetails.title.romaji || "Anime"}
                fill
                sizes="(max-width: 1024px) 240px, 260px"
                className="object-cover"
              />
            ) : null}
          </div>

          <div className="flex flex-col justify-end">
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#e50914]">
              Series overview
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-black leading-none text-white sm:text-5xl lg:text-6xl">
              {animeDetails?.title?.english || animeDetails?.title?.romaji || "Loading"}
            </h1>
            <div className="mt-6 flex flex-wrap gap-3 text-xs font-medium uppercase tracking-[0.24em] text-white/72">
              <span className="rounded-full border border-white/14 bg-white/7 px-4 py-2">
                {animeDetails?.averageScore
                  ? `${animeDetails.averageScore}% Match`
                  : "Fan Favorite"}
              </span>
              <span className="rounded-full border border-white/14 bg-white/7 px-4 py-2">
                {animeDetails?.episodes ? `${animeDetails.episodes} Episodes` : "Episodes loading"}
              </span>
              <span className="rounded-full border border-white/14 bg-white/7 px-4 py-2">
                HD Stream
              </span>
            </div>
            <p className="mt-6 max-w-2xl text-sm leading-7 text-white/66 sm:text-base">
              Browse the full episode lineup in a cleaner streaming layout and jump
              straight into the next watch session without the old card wall feel.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
        {loadError ? (
          <div className="mb-6 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-5 py-4 text-sm text-amber-100">
            {loadError} Cached series details will be used when available.
          </div>
        ) : null}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/42">
              Episode library
            </p>
            <h2 className="mt-2 text-3xl font-bold text-white">All Episodes</h2>
          </div>
          <p className="text-sm text-white/48">
            {episodesList.length} episodes available
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {animeDetails
            ? episodesList.map((episodeNumber) => (
                <EpisodeCard
                  key={episodeNumber}
                  id={animeDetails.id}
                  title={animeDetails.title}
                  coverImage={animeDetails.coverImage}
                  episode={episodeNumber}
                  averageScore={animeDetails.averageScore}
                />
              ))
            : Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="aspect-[16/10] animate-pulse rounded-2xl border border-white/10 bg-white/6"
                />
              ))}
        </div>
      </section>
    </main>
  );
};

export default Page;
