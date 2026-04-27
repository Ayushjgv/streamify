"use client";

import Card from "@/components/Card";
import React, { useState, useEffect } from "react";

const Home = () => {

    
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

  const [TopList, setTopList] = useState<Anime[]>([]);
  const [AiringList, setAiringList] = useState<Anime[]>([]);
  const [UpcomingList, setUpcomingList] = useState<Anime[]>([]);
  const [PopularList, setPopularList] = useState<Anime[]>([]);
  const [TrendingList, setTrendingList] = useState<Anime[]>([]);

  enum Queries {
    TOP_LIST = `
      query {
      Page(perPage: 100) {
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
    }
    `,
    TRENDING_LIST = `
      query {
      Page(perPage: 100) {
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
        }
      }
    }
    `,
    POPULAR_LIST = `
      query {
      Page(perPage: 100) {
        media(sort: POPULARITY_DESC, type: ANIME) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
          }
        }
      }
    }
    `,
    AIRING_LIST = `
      query {
      Page(perPage: 100) {
        media(status: RELEASING, type: ANIME) {
          id
          title {
            romaji
            english
          }
          nextAiringEpisode {
            episode
          }
          coverImage {
            large
          }
        }
      }
    }
    `,
    UPCOMING_LIST = `
      query {
      Page(perPage: 100) {
        media(status: NOT_YET_RELEASED, type: ANIME) {
          id
          title {
            romaji
            english
          }
          coverImage {
            large
          }
        }
      }
    }
    `,
  }

  async function fetchAnime(
    query: string,
  ): Promise<{ data: { Page: { media: Anime[] } } }> {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const data = await res.json();
    console.log(data);
    return data;
  }

  useEffect(() => {
    fetchAnime(Queries.TOP_LIST).then((data) => {
      setTopList(data?.data?.Page?.media ?? []);
    });
    fetchAnime(Queries.AIRING_LIST).then((data) => {
      setAiringList(data?.data?.Page?.media ?? []);
    });
    fetchAnime(Queries.UPCOMING_LIST).then((data) => {
      setUpcomingList(data?.data?.Page?.media ?? []);
    });
    fetchAnime(Queries.POPULAR_LIST).then((data) => {
      setPopularList(data?.data?.Page?.media ?? []);
    });
    fetchAnime(Queries.TRENDING_LIST).then((data) => {
      setTrendingList(data?.data?.Page?.media ?? []);
    });
  }, []);

  return (
    <div className="bg-black w-full h-screen text-white items-center justify-center overflow-auto">
      {/* toplist */}
      <h2>TOP LIST</h2>

      <div className="flex overflow-x-auto gap-4 p-4">
        {TopList.map((anime) => (
          <div key={anime.id} className="flex shrink-0">
            <Card {...anime} />
          </div>
        ))}
      </div>

      {/* airing list */}
      <h2>AIRING LIST</h2>

      <div className="flex overflow-x-auto gap-4 p-4">
        {AiringList.map((anime) => (
          <div key={anime.id} className="flex shrink-0">
            <Card {...anime} />
          </div>
        ))}
      </div>

      {/* upcoming list */}
      <h2>UPCOMING LIST</h2>

      <div className="flex overflow-x-auto gap-4 p-4">
        {UpcomingList.map((anime) => (
          <div key={anime.id} className="flex shrink-0">
            <Card {...anime} />
          </div>
        ))}
      </div>

      {/* popular list */}
      <h2>POPULAR LIST</h2>

      <div className="flex overflow-x-auto gap-4 p-4">
        {PopularList.map((anime) => (
          <div key={anime.id} className="flex shrink-0">
            <Card {...anime} />
          </div>
        ))}
      </div>

      {/* trending list */}
      <h2>TRENDING LIST</h2>

      <div className="flex overflow-x-auto gap-4 p-4">
        {TrendingList.map((anime) => (
          <div key={anime.id} className="flex shrink-0">
            <Card {...anime} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
