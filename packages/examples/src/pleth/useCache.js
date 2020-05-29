import { useCallback, useReducer } from 'react';

// Inspired by:
//  * https://reactjs.org/docs/hooks-reference.html#usereducer
//  * https://redux.js.org/advanced/async-actions
const reducer = (cache, action) => {
  switch (action.type) {
    case 'request':
      return { ...cache, [action.cacheKey]: 'pending' };
    case 'receive':
      return { ...cache, [action.cacheKey]: action.response };
    default:
      throw new Error();
  }
};

// Exposes a single function: get,
// which will fetch if needed, then cache.
export const useCache = () => {
  // cache[cacheKey] represents an entry for a potential fetch.
  // Initially, it is not defined, meaning the data has not been fetched.
  // When it is in the process of being fetched, the value is pending.
  // After the data is loaded, the value is the parsed JSON response.
  const [cache, dispatch] = useReducer(reducer, {});

  //console.log(cache);

  // This function requests data for a specific region ID.
  //
  // Accepts a cacheKey string and a "onCacheMiss" function.
  // The "onCacheMiss" function is only invoked in the case of a cache miss.
  // The "onCacheMiss" function is expected to return a Promise
  // that resolves to the data to cache.
  //
  //  * Returns null if the data is loading.
  //  * Returns the cached data if data has loaded.
  const get = useCallback(
    ({ cacheKey, onCacheMiss }) => {
      const cached = cache[cacheKey];

      // If this request is already pending, do nothing.
      if (cached === 'pending') {
        //console.log('cache pending on ' + cacheKey);
        return null;
      }

      // Return the cached value if available.
      if (cached) {
        //console.log('cache hit on ' + cacheKey);
        return cached;
      }

      // At this point, we need to initiate a fetch for the data.

      // First, mark this request as being en route.
      dispatch({ type: 'request', cacheKey });

      // Then, kick off an async fetch.
      //console.log('cache miss on ' + cacheKey);
      onCacheMiss().then((response) => {
        dispatch({ type: 'receive', cacheKey, response });
      });
    },
    [cache, dispatch]
  );

  return { get };
};
