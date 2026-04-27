"use client";

import { useParams } from "next/navigation";

const page = () => {
  const params = useParams<{ id?: string; episode?: string }>();

  const id = params?.id;
  const episode = params?.episode;

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <iframe
        src={`https://megaplay.buzz/stream/ani/${id}/${episode}/dub`}
        width="800"
        height="450"
        allowFullScreen
        className="rounded-lg shadow-lg"
      ></iframe>
    </div>
  );
};

export default page;
