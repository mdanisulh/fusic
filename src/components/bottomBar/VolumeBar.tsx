"use client";
import { useAudio } from "@/lib/hooks/useAudio";
import IconButton from "../common/IconButton";
import Slider from "../common/Slider";

export default function VolumeBar() {
  const { volume, setVolume } = useAudio()!;
  const icons = [
    "/assets/volume-off.svg",
    "/assets/volume-low.svg",
    "/assets/volume-medium.svg",
    "/assets/volume-high.svg",
  ];
  const iconPath =
    volume == 0 ? icons[0] : icons[Math.min(Math.floor(volume * 3) + 1, 3)];

  return (
    <div className="grey flex max-w-36 grow p-1">
      <IconButton
        iconPath={iconPath}
        iconSize={16}
        className="m-1 mr-2"
        title="Volume"
      />
      <Slider
        range={1}
        value={volume}
        minWidth={24}
        maxWidth={100}
        onChange={setVolume}
      />
    </div>
  );
}
