import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Router() {
  const router = useRouter();
  const [canGoBack, setCanGoBack] = useState(true);
  const [canGoForward, setCanGoForward] = useState(true);

  useEffect(() => {
    const checkNavigation = () => {};

    checkNavigation();
    window.addEventListener("popstate", checkNavigation);

    return () => {
      window.removeEventListener("popstate", checkNavigation);
    };
  }, []);

  return (
    <div className="flex w-[72px] justify-between">
      <div
        className={`h-8 w-8 rounded-full ${canGoBack ? "bg-black" : "bg-dark-grey"} p-2`}
        onClick={() => canGoBack && router.back()}
      >
        <Image
          src="/assets/back.svg"
          height={16}
          width={16}
          alt=""
          className={canGoBack ? "invert" : "invert-[0.7]"}
          style={{ cursor: canGoBack ? "pointer" : "not-allowed" }}
        />
      </div>
      <div
        className={`h-8 w-8 rounded-full ${canGoForward ? "bg-black" : "bg-dark-grey"} p-2`}
        onClick={() => canGoForward && router.forward()}
      >
        <Image
          src="/assets/next.svg"
          height={16}
          width={16}
          alt=""
          className={canGoForward ? "invert" : "invert-[0.7]"}
          style={{ cursor: canGoForward ? "pointer" : "not-allowed" }}
        />
      </div>
    </div>
  );
}
