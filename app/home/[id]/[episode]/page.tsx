"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams<{ id?: string; episode?: string }>();

  const id = params?.id;
  const episode = params?.episode;

  // ✅ Guard: don’t render iframe until params exist
  if (!id || !episode) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#070707] text-white">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(229,9,20,0.18),_transparent_24%),linear-gradient(180deg,_#090909_0%,_#040404_100%)] text-white">
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
        <div className="mb-6 flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/6 p-5 backdrop-blur-md sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#e50914]">
              Now playing
            </p>
            <h1 className="mt-2 text-3xl font-black text-white sm:text-4xl">
              Episode {episode}
            </h1>
            <p className="mt-3 text-sm text-white/56">
              Stream in a focused player view with quick access back to the episode list.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/home/${id}`}
              className="rounded-md border border-white/18 bg-white/8 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/14"
            >
              All Episodes
            </Link>
            <a
              href={`https://megaplay.buzz/stream/ani/${id}/${episode}/dub`}
              target="_blank"
              rel="noreferrer"
              className="rounded-md bg-[#e50914] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#f6121d]"
            >
              Open Source
            </a>
          </div>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-[#050505] shadow-[0_35px_90px_rgba(0,0,0,0.45)]">
          <div className="flex items-center justify-between border-b border-white/10 bg-white/6 px-5 py-3 text-xs uppercase tracking-[0.24em] text-white/48">
            <span>Dub Stream</span>
            <span>Fullscreen Ready</span>
          </div>
          <div className="p-3 sm:p-4 lg:p-5">
            <div className="relative aspect-video overflow-hidden rounded-[22px] bg-black">
              <iframe
                src={`https://megaplay.buzz/stream/ani/${id}/${episode}/dub`}
                className="absolute inset-0 h-full w-full"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
