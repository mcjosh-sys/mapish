// useActivatedRoute.ts (Custom Hook)
import { useLocation, useParams, useMatches } from "react-router-dom";

export function useActivatedRoute() {
  const location = useLocation();
  const params = useParams();
  const matches = useMatches();

  // Get current matched route with `handle` if defined
  const currentMatch = matches[matches.length - 1];
  console.log({ matches });

  return {
    path: location.pathname,
    search: location.search,
    hash: location.hash,
    params,
    meta: currentMatch?.handle ?? {},
  };
}
