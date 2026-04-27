"use client";

import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams<{ id?: string; episode?: string }>();

  const id = params?.id;
  const episode = params?.episode;

  // ✅ Guard: don’t render iframe until params exist
  if (!id || !episode) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      <iframe
        src={`https://megaplay.buzz/stream/ani/${id}/${episode}/dub`}
        className="w-[90%] h-[80%] rounded-lg shadow-lg"
        allowFullScreen
      />
    </div>
  );
};

export default Page;