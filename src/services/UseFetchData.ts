import { useState, useEffect } from 'react';
import ApiService from './ApiService';

const useFetchData = (fetchFunction: () => Promise<any>, initialData: any[] = []) => {
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchFunction();
        setData(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [fetchFunction]);

  return { data, isLoading, error };
};

export default useFetchData;
