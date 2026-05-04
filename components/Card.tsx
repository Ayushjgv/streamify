"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

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
  episodes?: number;
  nextAiringEpisode?: {
    episode: number;
  };
};

const Card = (props: CardProps) => {
  const title = props.title?.english || props.title?.romaji || "Untitled";
  const subtitle = props.nextAiringEpisode?.episode
    ? `Ep ${props.nextAiringEpisode.episode} next`
    : props.episodes
      ? `${props.episodes} episodes`
      : "New to Stream";

  return (
    <Link
      href={`/home/${props.id}`}
      className="group relative block w-[180px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-neutral-900 shadow-[0_18px_40px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-2 hover:border-white/25 hover:shadow-[0_30px_60px_rgba(0,0,0,0.55)] sm:w-[200px] lg:w-[220px]"
    >
      {props.coverImage?.large ? (
        <Image
          src={props.coverImage.large}
          alt={title}
          width={440}
          height={660}
          sizes="(max-width: 640px) 180px, (max-width: 1024px) 200px, 220px"
          className="h-[270px] w-full object-cover transition duration-500 group-hover:scale-105 sm:h-[300px] lg:h-[330px]"
        />
      ) : (
        <div className="h-[270px] w-full bg-neutral-800 sm:h-[300px] lg:h-[330px]" />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 transition duration-300 group-hover:opacity-100" />

      <div className="absolute inset-x-0 bottom-0 p-4">
        <p className="line-clamp-2 text-sm font-semibold text-white sm:text-base">
          {title}
        </p>
        <div className="mt-2 flex items-center justify-between gap-3 text-[11px] uppercase tracking-[0.22em] text-white/70">
          <span>{subtitle}</span>
          {props.averageScore ? <span>{props.averageScore}%</span> : null}
        </div>
      </div>
    </Link>
  );
};

export default Card;
