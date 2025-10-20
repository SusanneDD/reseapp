import { Suspense } from "react";

import LoadingGrid from "../components/LoadingGrid";

import HomePage from "./home-client";

export default function Page() {
  return (
    <Suspense fallback={<LoadingGrid />}>
      <HomePage />
    </Suspense>
  );
}
