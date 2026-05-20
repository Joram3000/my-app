"use client";

import Link from "next/link";
import { BiRightArrowAlt } from "react-icons/bi";
import listStyles from "@/ui/episode-list.module.css";
import { useSam } from "@/hooks/use-sam";
import { Episode } from "@/lib/api/rickMorty/rickMorty.types";

export function EpisodeRow({ episode }: { episode: Episode }) {
  const { speak } = useSam({ speed: 72 });

  return (
    <Link
      href={`/episodes/${episode.id}`}
      className={listStyles.row}
      onClick={() => speak(episode.name)}
    >
      <div className={listStyles.episodeCode}>{episode.episode}</div>
      <div className={listStyles.rowInfo}>
        <h3 className={listStyles.rowTitle}>{episode.name}</h3>
        <p className={listStyles.rowDate}>{episode.air_date}</p>
      </div>
      <span className={listStyles.rowArrow}>
        <BiRightArrowAlt />
      </span>
    </Link>
  );
}
