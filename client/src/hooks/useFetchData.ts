import React, { useState, useEffect } from 'react';
import useCustomFetch from './useCustomFetch';

const useFetchData = (urls: string[], options: any, dependencyArr: any[]) => {
  const _fetch = useCustomFetch();
  const [data, setData] = useState<React.SetStateAction<any>>(null);
  const [error, setError] = useState<React.SetStateAction<any>>(null);
  const [loading, setLoading] = useState<React.SetStateAction<boolean>>(true);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      try {
        const data = await Promise.all(
          urls.map((url) =>
            _fetch(url, { ...options, signal: signal }).then((response) =>
              response?.json()
            )
          )
        );

        setData(data);
        setError(null);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, dependencyArr);

  return { data, loading, error };
};

export default useFetchData;
