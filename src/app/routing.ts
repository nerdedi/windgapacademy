import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

/**
 * useRoute - centralizes navigation logic and logs routing events.
 * Returns a route(path, options) function.
 */
function useRoute() {
  const navigate = useNavigate();

  const route = useCallback(
    (path: string, opts: any = {}) => {
      // Log navigation for analytics/debugging
      // eslint-disable-next-line no-console
      console.log(`Routing to path: ${path}`, opts);

      // support passing state and replace via opts
      const { state, replace } = opts;
      navigate(path, { state, replace });
    },
    [navigate],
  );

  return route;
}

export default useRoute;
