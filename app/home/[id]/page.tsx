"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import EpisodeCard from "@/components/EpisodeCard";
import axios from "axios";

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

const Page = () => {
  const { id } = useParams<{ id: string }>(); // ✅ correct typing

  const [animeDetails, setAnimeDetails] = useState<Anime | null>(null);

  const FETCH_QUERY = `
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

  const fetchAnime = async () => {
    const res = await axios.post("https://graphql.anilist.co", {
      query: FETCH_QUERY,
      variables: {
        id: Number(id), // ✅ safer than parseInt
      },
    });

    setAnimeDetails(res.data.data.Media);
  };

  useEffect(() => {
    if (!id) return;

    const load = async () => {
      await fetchAnime();
    };

    load();
  }, [id]);

  return (
    <div className="text-white bg-black w-full min-h-screen flex items-center justify-center overflow-auto">
      <div className="flex overflow-x-auto gap-4 p-4">
        {animeDetails &&
          Array.from({ length: animeDetails.episodes || 0 }).map((_, index) => (
            <div key={index} className="flex shrink-0">
              <EpisodeCard
                id={animeDetails.id} // ✅ always defined
                title={animeDetails.title}
                coverImage={animeDetails.coverImage}
                episode={index + 1}
                averageScore={animeDetails.averageScore}
              />
            </div>
          ))}
      </div>
    </div>
  );
};

export default Page;