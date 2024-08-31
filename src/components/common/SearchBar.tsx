"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import IconButton from "./IconButton";
import Router from "./Router";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    replace(`${pathname}?${params.toString()}`);
  }, 800);

  return (
    <div className="sticky top-0 z-50 flex h-16 flex-1 bg-light-black p-2 pl-1">
      <div className="py-2 pr-4">
        <Router />
      </div>
      <input
        className="peer max-w-96 flex-grow rounded-full bg-dark-grey p-3 pl-9 pr-5 text-sm text-white focus:outline-none focus:outline-white"
        placeholder="Search for songs, albums, artists, and more"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
        onFocus={() => ((window as any).isInputFocused = true)}
        onBlur={() => ((window as any).isInputFocused = false)}
      />
      <IconButton
        iconPath="/assets/search-outlined.svg"
        iconSize={16}
        className="peer-focus:white absolute left-[104px] top-6"
      />
    </div>
  );
}
