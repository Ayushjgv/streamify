"use client";

import Card from "@/components/Card";
import Image from "next/image";
import React, { useState, useEffect } from "react";

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

type HomeFeed = {
  trending: { media: Anime[] };
  top: { media: Anime[] };
  airing: { media: Anime[] };
  popular: { media: Anime[] };
  upcoming: { media: Anime[] };
};

const HOME_CACHE_KEY = "streamer-home-feed-v1";
const HOME_CACHE_TTL_MS = 1000 * 60 * 10;

function readCache<T>(key: string): T | null {
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

function writeCache<T>(key: string, data: T, ttlMs: number) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    key,
    JSON.stringify({
      expiresAt: Date.now() + ttlMs,
      data,
    }),
  );
}

function easeInOutCubic(progress: number) {
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
}

const Home = () => {
  const [TopList, setTopList] = useState<Anime[]>([]);
  const [AiringList, setAiringList] = useState<Anime[]>([]);
  const [UpcomingList, setUpcomingList] = useState<Anime[]>([]);
  const [PopularList, setPopularList] = useState<Anime[]>([]);
  const [TrendingList, setTrendingList] = useState<Anime[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const applyHomeFeed = (payload: HomeFeed) => {
    setTrendingList(payload.trending?.media ?? []);
    setTopList(payload.top?.media ?? []);
    setAiringList(payload.airing?.media ?? []);
    setPopularList(payload.popular?.media ?? []);
    setUpcomingList(payload.upcoming?.media ?? []);
  };

  useEffect(() => {
    let isMounted = true;

    async function loadHome() {
      const cachedFeed = readCache<HomeFeed>(HOME_CACHE_KEY);

      if (cachedFeed && isMounted) {
        applyHomeFeed(cachedFeed);
        setIsLoading(false);
      }

      try {
        const response = await fetch("/api/anilist/home");
        const payload = (await response.json()) as HomeFeed & { error?: string };

        if (!response.ok) {
          throw new Error(payload.error || "Failed to load home feed");
        }

        if (!isMounted) return;

        applyHomeFeed(payload);
        writeCache(HOME_CACHE_KEY, payload, HOME_CACHE_TTL_MS);
        setLoadError(null);
      } catch (error) {
        if (!isMounted) return;

        setLoadError(
          error instanceof Error
            ? error.message
            : "AniList is rate limiting requests right now.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadHome();

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredAnime = TrendingList[0] ?? TopList[0] ?? PopularList[0];
  const featuredTitle =
    featuredAnime?.title?.english || featuredAnime?.title?.romaji || "Anime Night";
  const featuredEpisode = featuredAnime?.nextAiringEpisode?.episode;
  const spotlightStats = [
    featuredAnime?.averageScore ? `${featuredAnime.averageScore}% Match` : "Hot Pick",
    featuredAnime?.episodes ? `${featuredAnime.episodes} Episodes` : "Fresh Season",
    featuredEpisode ? `Episode ${featuredEpisode} Incoming` : "Binge Ready",
  ];
  const rows = [
    { title: "Trending Now", items: TrendingList },
    { title: "Top Rated", items: TopList },
    { title: "Now Airing", items: AiringList },
    { title: "Popular This Week", items: PopularList },
    { title: "Coming Soon", items: UpcomingList },
  ];

  const renderSkeletons = () =>
    Array.from({ length: 6 }).map((_, index) => (
      <div
        key={index}
        className="h-[270px] w-[180px] shrink-0 animate-pulse rounded-xl border border-white/10 bg-white/8 sm:h-[300px] sm:w-[200px] lg:h-[330px] lg:w-[220px]"
      />
    ));

  const scrollToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);

    if (!target) return;

    const startY = window.scrollY;
    const targetY = target.getBoundingClientRect().top + window.scrollY - 24;
    const distance = targetY - startY;
    const duration = 900;
    const startTime = performance.now();

    const step = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);

      window.scrollTo(0, startY + distance * easedProgress);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(229,9,20,0.22),_transparent_28%),linear-gradient(180deg,_#111111_0%,_#090909_46%,_#050505_100%)] text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10">
        {featuredAnime?.coverImage?.large ? (
          <Image
            src={featuredAnime.coverImage.large}
            alt={featuredTitle}
            fill
            priority
            sizes="100vw"
            className="absolute inset-0 h-full w-full object-cover opacity-30"
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(5,5,5,0.98)_10%,_rgba(5,5,5,0.7)_45%,_rgba(5,5,5,0.9)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(5,5,5,0.1)_0%,_rgba(5,5,5,0.75)_68%,_#050505_100%)]" />

        <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-between px-5 pb-12 pt-6 sm:px-8 lg:px-10">
          <header className="flex items-center justify-between gap-4">
            <div className="text-2xl font-black tracking-[0.38em] text-[#e50914]">
              STREAMER
            </div>
            <nav className="hidden items-center gap-6 text-sm text-white/65 md:flex">
              <button
                type="button"
                onClick={() => scrollToSection("trending-now")}
                className="cursor-pointer transition hover:text-white"
              >
                Trending
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("top-rated")}
                className="cursor-pointer transition hover:text-white"
              >
                Top Rated
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("coming-soon")}
                className="cursor-pointer transition hover:text-white"
              >
                Coming Soon
              </button>
            </nav>
          </header>

          <div className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div className="max-w-3xl">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[#e50914]">
                Anime streaming, reimagined
              </p>
              <h1 className="max-w-2xl text-5xl font-black leading-none text-white sm:text-6xl lg:text-7xl">
                {featuredTitle}
              </h1>
              <div className="mt-6 flex flex-wrap gap-3 text-xs font-medium uppercase tracking-[0.24em] text-white/70">
                {spotlightStats.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/15 bg-white/6 px-4 py-2 backdrop-blur-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
                Discover cinematic anime collections with richer rows, sharper cards,
                and a darker streaming-first layout built for long browsing sessions.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={featuredAnime ? `/home/${featuredAnime.id}` : "/"}
                  className="rounded-md bg-[#e50914] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#f6121d]"
                >
                  Play Now
                </a>
                <button
                  type="button"
                  onClick={() => scrollToSection("top-rated")}
                  className="rounded-md border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/16"
                >
                  Browse Library
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/12 bg-white/6 p-6 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/55">
                Tonight&apos;s lineup
              </p>
              <div className="mt-6 space-y-4">
                {rows.slice(0, 3).map((row) => {
                  const firstAnime = row.items[0];
                  const label =
                    firstAnime?.title?.english ||
                    firstAnime?.title?.romaji ||
                    "Loading";

                  return (
                    <div
                      key={row.title}
                      className="rounded-2xl border border-white/10 bg-black/30 px-4 py-4"
                    >
                      <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">
                        {row.title}
                      </p>
                      <p className="mt-2 text-lg font-semibold text-white">{label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl space-y-10 px-5 py-10 sm:px-8 lg:px-10 lg:py-12">
        {loadError ? (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/10 px-5 py-4 text-sm text-amber-100">
            {loadError} Cached results will be used when available.
          </div>
        ) : null}
        {rows.map((row) => (
          <div
            key={row.title}
            id={row.title.toLowerCase().replace(/\s+/g, "-")}
            className="space-y-4"
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white sm:text-3xl">
                  {row.title}
                </h2>
                <p className="mt-1 text-sm text-white/50">
                  Scroll through curated picks with a cleaner streaming layout.
                </p>
              </div>
              <span className="hidden text-xs uppercase tracking-[0.28em] text-white/35 md:block">
                {row.items.length || 100} titles
              </span>
            </div>

            <div className="no-scrollbar flex gap-5 overflow-x-auto pb-3">
              {isLoading
                ? renderSkeletons()
                : row.items.map((anime) => <Card key={anime.id} {...anime} />)}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Home;
