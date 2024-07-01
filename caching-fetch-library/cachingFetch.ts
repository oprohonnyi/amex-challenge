// You may edit this file, add new files to support this file,
// and/or add new dependencies to the project as you see fit.
// However, you must not change the surface API presented from this file,
// and you should not need to change any other files in the project to complete the challenge

import { useEffect, useState } from 'react';

type UseCachingFetch = (url: string) => {
  isLoading: boolean;
  data: unknown;
  error: Error | null;
};

type CacheItem = {
  data: unknown;
  isLoading: boolean;
  error: Error | null;
};

type Cache = {
  [key: string]: CacheItem | undefined;
};

/**
 * 1. Implement a caching fetch hook. The hook should return an object with the following properties:
 * - isLoading: a boolean that is true when the fetch is in progress and false otherwise
 * - data: the data returned from the fetch, or null if the fetch has not completed
 * - error: an error object if the fetch fails, or null if the fetch is successful
 *
 * This hook is called three times on the client:
 *  - 1 in App.tsx
 *  - 2 in Person.tsx
 *  - 3 in Name.tsx
 *
 * Acceptance Criteria:
 * 1. The application at /appWithoutSSRData should properly render, with JavaScript enabled, you should see a list of people.
 * 2. You should only see 1 network request in the browser's network tab when visiting the /appWithoutSSRData route.
 * 3. You have not changed any code outside of this file to achieve this.
 * 4. This file passes a type-check.
 *
 */
let cache: Cache = {};

const DEFAULT_STATE_DATA = null;
const DEFAULT_STATE_IS_LOADING = false;
const DEFAULT_STATE_ERROR = null;

export const useCachingFetch: UseCachingFetch = (url: String) => {
  // Check if rendered on server
  const isSSR = typeof window === 'undefined';

  const [data, setData] = useState<unknown | null>(
    isSSR && cache[url.toString()]?.data
      ? cache[url.toString()]?.data
      : DEFAULT_STATE_DATA
  );
  const [error, setError] = useState<Error | null>(DEFAULT_STATE_ERROR);
  const [isLoading, setIsLoading] = useState<boolean>(DEFAULT_STATE_IS_LOADING);

  const getData = async (url: String) => {
    setIsLoading(true);

    const response = await fetch(url.toString());

    if (!response.ok) {
      /**
       * @todo improve error handling by passing the error message from the server response
       */
      const serverError = new Error('Failed to fetch data');

      cache[url.toString()] = undefined;

      setError(serverError);

      setData(DEFAULT_STATE_DATA);
      setIsLoading(DEFAULT_STATE_IS_LOADING);
    }

    const people = await response.json();

    cache[url.toString()] = {
      data: people,
      isLoading: DEFAULT_STATE_IS_LOADING,
      error: DEFAULT_STATE_ERROR,
    };

    setData(people);

    setIsLoading(DEFAULT_STATE_IS_LOADING);
    setError(DEFAULT_STATE_ERROR);
  };

  useEffect(() => {
    if (!url) return;

    if (!cache[url.toString()]) {
      console.info('data requested from the api');

      getData(url);
    } else {
      console.info('data returned from cache');

      setData(cache[url.toString()]?.data);

      /**
       * @todo add caching of isLoading, error (if needed)
       */
      setIsLoading(DEFAULT_STATE_IS_LOADING);
      setError(DEFAULT_STATE_ERROR);
    }
  }, [url]);

  return {
    data,
    error,
    isLoading,
  };
};

/**
 * 2. Implement a preloading caching fetch function. The function should fetch the data.
 *
 * This function will be called once on the server before any rendering occurs.
 *
 * Any subsequent call to useCachingFetch should result in the returned data being available immediately.
 * Meaning that the page should be completely serverside rendered on /appWithSSRData
 *
 * Acceptance Criteria:
 * 1. The application at /appWithSSRData should properly render, with JavaScript disabled, you should see a list of people.
 * 2. You have not changed any code outside of this file to achieve this.
 * 3. This file passes a type-check.
 *
 */
export const preloadCachingFetch = async (url: string): Promise<void> => {
  await new Promise(async (resolve, reject) => {
    const response = await fetch(url.toString());

    if (!response.ok) {
      /**
       * @todo improve error handling by passing the error message from the server response
       */
      const serverError = new Error('Failed to fetch data');
      reject(serverError);
    }

    const people = await response.json();

    console.log('data preloaded and stored to cache');

    // store into cache to be returned by the useCachingFetch on demand
    cache[url.toString()] = {
      data: people,
      isLoading: DEFAULT_STATE_IS_LOADING,
      error: DEFAULT_STATE_ERROR,
    };

    resolve('Success');
  });
};

/**
 * 3.1 Implement a serializeCache function that serializes the cache to a string.
 * 3.2 Implement an initializeCache function that initializes the cache from a serialized cache string.
 *
 * Together, these two functions will help the framework transfer your cache to the browser.
 *
 * The framework will call `serializeCache` on the server to serialize the cache to a string and inject it into the dom.
 * The framework will then call `initializeCache` on the browser with the serialized cache string to initialize the cache.
 *
 * Acceptance Criteria:
 * 1. The application at /appWithSSRData should properly render, with JavaScript enabled, you should see a list of people.
 * 2. You should not see any network calls to the people API when visiting the /appWithSSRData route.
 * 3. You have not changed any code outside of this file to achieve this.
 * 4. This file passes a type-check.
 *
 */
export const serializeCache = (): string => {
  /**
   * add checks and error handling
   */
  return JSON.stringify(cache);
};

export const initializeCache = (serializedCache: string): void => {
  /**
   * add checks and error handling
   */
  cache = JSON.parse(serializedCache);
};

export const wipeCache = (): void => {
  cache = {};
};
