import Search from "@/components/common/SearchBar";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="overflow-y-hidden scroll-smooth px-3 hover:overflow-y-scroll hover:pr-0"
      style={{ height: "calc(100vh - 96px)" }}
    >
      <Search />
      {children}
    </div>
  );
}
