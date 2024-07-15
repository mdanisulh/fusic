"use client";
import { useUIConfig } from "@/lib/hooks/useUIConfig";
import Link from "next/link";
import { usePathname } from "next/navigation";
import IconButton from "../common/IconButton";

export default function LeftSideBar() {
  const route = usePathname();
  const { isLSBCollapsed, setLSBCollapsed } = useUIConfig()!;
  return (
    <div className="flex h-full flex-col">
      <div className="bg-light-black mb-1 rounded-lg px-2 py-1">
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
      <div className="bg-light-black mt-1 flex-grow rounded-lg">
        <div className="flex justify-between px-2 py-0">
          <div className="flex-initial self-center">
            <IconButton
              iconPath="/assets/library-filled.svg"
              altIconPath="/assets/library-outlined.svg"
              title={`${isLSBCollapsed ? "Expand" : "Collapse"} Your Library`}
              text={isLSBCollapsed ? undefined : "Your Library"}
              className="m-2 p-2 font-bold"
              spacing={10}
              onClick={() => setLSBCollapsed(!isLSBCollapsed)}
            />
          </div>
          {!isLSBCollapsed && (
            <div className="flex-initial self-center">
              <IconButton
                iconPath="/assets/add.svg"
                title="Create Playlist"
                className="hover:bg-dark-grey m-2 rounded-full p-2 font-bold"
                iconSize={16}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
