import Search from "@/components/common/SearchBar";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="group/a h-full overflow-y-hidden scroll-smooth rounded-lg pl-3 hover:overflow-y-scroll">
      <Search />
      {children}
    </div>
  );
}
