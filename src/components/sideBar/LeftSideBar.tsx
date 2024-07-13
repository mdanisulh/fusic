"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import IconButton from "../common/IconButton";

export default function LeftSideBar() {
  const route = usePathname();
  return (
    <div className="flex h-full flex-col">
      <div className="mb-1 rounded-lg bg-black-light px-2 py-1">
        <Link href="/">
          <IconButton
            iconPath="/assets/home-outlined.svg"
            altIconPath="/assets/home-filled.svg"
            text="Home"
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
            text="Search"
            title="Search"
            className="m-2 p-2 font-bold"
            spacing={20}
            isActive={route === "/search" || route.startsWith("/search/")}
          />
        </Link>
      </div>
      <div className="mt-1 flex-grow rounded-lg bg-black-light">
        <div className="flex justify-between px-2 py-0">
          <div className="flex-initial self-center">
            <IconButton
              iconPath="/assets/library-filled.svg"
              altIconPath="/assets/library-outlined.svg"
              title="Collapse Your Library"
              text="Your Library"
              className="m-2 p-2 font-bold"
              spacing={10}
            />
          </div>
          <div className="flex-initial self-center">
            <IconButton
              iconPath="/assets/add.svg"
              title="Create Playlist"
              className="m-2 rounded-full p-2 font-bold hover:bg-grey-dark"
              iconSize={16}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
