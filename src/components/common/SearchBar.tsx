"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import IconButton from "./IconButton";

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
  }, 300);

  return (
    <div className="bg-light-black sticky top-0 z-50 flex h-16 flex-1 p-2">
      <input
        className="bg-dark-grey peer max-w-96 flex-grow rounded-full p-3 pl-9 pr-5 text-sm text-white focus:outline-none focus:outline-white"
        placeholder="Search for songs, albums, artists, and more"
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={searchParams.get("query")?.toString()}
        onFocus={() => ((window as any).isInputFocused = true)}
        onBlur={() => ((window as any).isInputFocused = false)}
      />
      <IconButton
        iconPath="/assets/search-outlined.svg"
        iconSize={16}
        className="peer-focus:white absolute left-5 top-6"
      />
    </div>
  );
}
