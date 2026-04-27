"use client";
import React, { use } from 'react';
import { useRouter } from "next/navigation";
import {useParams} from "next/navigation";

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
    const params = useParams();
    const id = params?.id;


    console.log(props);
    return (
        <div key={props.id} className='flex flex-col items-center justify-center m-4 w-fit cursor-pointer' onClick={() => router.push(`/home/${id}/${props.episode}`)}>
            <h2>{props.title?.english || props.title?.romaji || 'Untitled'}</h2>
            {props.coverImage?.large && <img src={props.coverImage.large} alt="" className='w-64 h-96 object-cover' />}
            <p>Episode {props.episode}</p>
        </div>
    )
}

export default EpisodeCard;
