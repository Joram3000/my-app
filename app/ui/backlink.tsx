"use client";

import Link from "next/link";
import { BiLeftArrowAlt } from "react-icons/bi";
import shared from "@/ui/detail-page.module.css";
import { useSam } from "@/hooks/use-sam";

interface BacklinkProps {
  label: string;
  href: string;
}

export function Backlink({ label, href }: BacklinkProps) {
  const { speak } = useSam({ speed: 72 });

  return (
    <Link href={href} className={shared.backLink} onClick={() => speak(label)}>
      <BiLeftArrowAlt /> {label}
    </Link>
  );
}
