"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import EpisodeCard from "@/components/EpisodeCard";
import axios from "axios";

const page = () => {
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

  const params: { id: string } | null | undefined = useParams<{ id: string }>();
  const id = params?.id;
  const [Episodes, setEpisodes] = useState<number | null>(null);
  const [AnimeDetails, setAnimeDetails] = useState<Anime | null>(null);

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
      }
    }
  `;

  const fetchEpisodes = async () => {
    const res = await axios.post("https://graphql.anilist.co", {
      query: FETCH_QUERY,
      variables: {
        id: parseInt(id || "0"),
      },
    });
    setEpisodes(res.data.data.Media.episodes);
    console.log(res.data.data.Media);
    return res.data.data.Media;
  };

  useEffect(() => {
    if (id) {
      fetchEpisodes().then((data) => {
        setAnimeDetails(data ?? null);
        console.log(data);
      });
    }
  }, [id]);

  return (
    <div className="text-white bg-black w-full h-screen flex items-center justify-center overflow-auto">
      <div className="flex overflow-x-auto gap-4 p-4">
        {new Array(Episodes || 0).fill(0).map((_, index) => (
          <div key={index} className="flex shrink-0">
            <EpisodeCard
              id={id}
              title={AnimeDetails?.title}
              coverImage={AnimeDetails?.coverImage}
              episode={index + 1}
              episodes={Episodes}
              averageScore={AnimeDetails?.averageScore}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
