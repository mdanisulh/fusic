import dynamic from "next/dynamic";
import React from "react";

const NoSSR = ({ children }: { children: React.ReactNode }) => <>{children}</>;

export default dynamic(() => Promise.resolve(NoSSR), {
  ssr: false,
});
