"use client";
import Image from "next/image";
import React from "react";
import { useParams, useRouter } from "next/navigation";

type CardProps = {
  id: number | string;
  title?: {
    romaji?: string;
    english?: string;
  };
  coverImage?: {
    large: string;
  };
  averageScore?: number;
  episode?: number;
};

const EpisodeCard = (props: CardProps) => {
  const router = useRouter();
  const params = useParams<{ id?: string }>();
  const id = params?.id;
  const title = props.title?.english || props.title?.romaji || "Untitled";

  return (
    <button
      type="button"
      key={props.id}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/6 text-left shadow-[0_18px_50px_rgba(0,0,0,0.28)] transition duration-300 hover:-translate-y-1.5 hover:border-white/20 hover:bg-white/10 hover:shadow-[0_28px_60px_rgba(0,0,0,0.42)]"
      onClick={() => router.push(`/home/${id}/${props.episode}`)}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-900">
        {props.coverImage?.large ? (
          <Image
            src={props.coverImage.large}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        ) : null}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(10,10,10,0.04)_0%,_rgba(10,10,10,0.7)_72%,_rgba(10,10,10,0.96)_100%)]" />
        <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/78 backdrop-blur-sm">
          Episode {props.episode}
        </div>
      </div>

      <div className="space-y-2 p-5">
        <h2 className="line-clamp-1 text-lg font-semibold text-white">{title}</h2>
        <div className="flex items-center justify-between gap-4 text-xs uppercase tracking-[0.22em] text-white/48">
          <span>Watch now</span>
          {props.averageScore ? <span>{props.averageScore}% Match</span> : null}
        </div>
      </div>
    </button>
  );
};

export default EpisodeCard;
