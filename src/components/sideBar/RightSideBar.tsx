"use client";
import { useUIConfig } from "@/lib/hooks/useUIConfig";
import QueueView from "./QueueView";

export default function RightSideBar() {
  const { rsbView } = useUIConfig()!;
  return rsbView === "queue" && <QueueView />;
}
