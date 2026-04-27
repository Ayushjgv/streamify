"use client";
import React, { use } from 'react';
import { useRouter } from "next/navigation";

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

const Card = (props: CardProps) => {
    const router = useRouter();

    console.log(props);
    return (
        <div key={props.id} className='flex flex-col items-center justify-center m-4 w-fit cursor-pointer' onClick={() => router.push(`/home/${props.id}`)}>
            <h2>{props.title?.english || props.title?.romaji || 'Untitled'}</h2>
            {props.coverImage?.large && <img src={props.coverImage.large} alt="" className='w-64 h-96 object-cover' />}
            <p>Average Score: {props.averageScore}</p>
        </div>
    )
}

export default Card;
