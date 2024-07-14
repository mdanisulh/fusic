import Search from "@/components/common/SearchBar";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full overflow-y-hidden scroll-smooth px-3 hover:overflow-y-scroll hover:pr-0">
      <Search />
      {children}
    </div>
  );
}
