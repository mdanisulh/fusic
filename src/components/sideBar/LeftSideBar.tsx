"use client";
import { useUIConfig } from "@/lib/hooks/useUIConfig";
import Link from "next/link";
import { usePathname } from "next/navigation";
import IconButton from "../common/IconButton";
import Library from "./Library";

export default function LeftSideBar() {
  const route = usePathname();
  const { isLSBCollapsed, setLSBCollapsed } = useUIConfig()!;
  return (
    <div className="flex h-full flex-col">
      <div className="mb-1 rounded-lg bg-light-black px-2 py-1">
        <Link href="/">
          <IconButton
            iconPath="/assets/home-outlined.svg"
            altIconPath="/assets/home-filled.svg"
            text={isLSBCollapsed ? undefined : "Home"}
            title="Home"
            className="r-7 m-2 p-2 font-bold"
            spacing={20}
            isActive={route === "/"}
          />
        </Link>
        <Link href="/search">
          <IconButton
            iconPath="/assets/search-outlined.svg"
            altIconPath="/assets/search-filled.svg"
            text={isLSBCollapsed ? undefined : "Search"}
            title="Search"
            className="m-2 p-2 font-bold"
            spacing={20}
            isActive={route === "/search" || route.startsWith("/search/")}
          />
        </Link>
      </div>
      <Library />
    </div>
  );
}
