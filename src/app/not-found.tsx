import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-full min-w-full content-center text-center font-bold text-white">
      <h2>404 Not Found!</h2>
      <Link href="/" className="underline">
        Return Home
      </Link>
    </div>
  );
}
