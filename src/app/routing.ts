import { useCallback, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Logger } from "../utils/Logger.js";

/**
 * useRoute - centralizes navigation logic and logs routing events.
 * @param path The path to navigate to.
 * @param opts Optional parameters for navigation.
 * @returns A function that navigates to the specified path with optional parameters.
 */
export function useRoute() {
  // eslint-disable-line react-hooks/rules-of-hooks
  const navigate = useNavigate();

  const route = useCallback(
    (path: string, opts: any = {}) => {
      // eslint-disable-line no-console
      // Log navigation for analytics/debugging
      // TODO: Send to analytics/logger
      Logger.log(`Routing to path: ${path}`, opts);
      // eslint-disable-next-line no-console
      console.log(`Routing to path: ${path}`, opts);

      // Navigate with state and replace options
      const { state, replace } = opts;
      navigate(path, { state, replace });
    },
    [navigate],
  );

  return route;
}

/**
 * useAsync - centralizes async function calls and manages loading state.
 * @param asyncFuncRef The reference to the async function to call
 * @param callOnInit Call the function when the hook gets initiated. Default: true.
 * @param isFetch Specifies if the function performs a fetch call. The JSON response will automatically be fetched.
 */
export function useAsync<T>(
  asyncFuncRef: () => Promise<T>,
  callOnInit: boolean,
  isFetch: boolean = false,
): { asyncFuncCall: () => Promise<void>; loading: boolean; value: T | null; error: Error | null } {
  const [loading, setLoading] = useState<boolean>(false);
  const [value, setValue] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const asyncFuncCall = useCallback(async () => {
    setLoading(true);
    setValue(null);
    setError(null);

    try {
      const data: any = await asyncFuncRef();
      if (isFetch) {
        setValue(await data.json());
      } else {
        setValue(data);
      }
      setLoading(false);
    } catch (e) {
      setError(e as Error);
      setLoading(false);
    }
  }, [asyncFuncRef, isFetch]);

  useEffect(() => {
    if (callOnInit) {
      asyncFuncCall();
    }
  }, [asyncFuncCall, callOnInit]);

  return { asyncFuncCall, loading, value, error };
}

export default useRoute;
