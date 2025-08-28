import { useEffect, useState } from "react";
import ApiClient from "../services/api-client";

const apiClient = ApiClient.getInstance();

function useApiData(endpoint, transform = (transformData) => transformData) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await apiClient.get(endpoint);

        setData(transform(result));
      } catch (err) {
        setError(err);
      }
    }
    fetchData();
  }, [endpoint]);

  return [data, error, setError];
}

export default useApiData;
