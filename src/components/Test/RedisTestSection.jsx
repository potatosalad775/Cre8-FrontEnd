import { useState, useEffect } from "react";

import TestContent from "./TestContent.jsx";
import { fetchRedisTestData, addRedisTestData } from "../../http.js";

export default function RedisTestSection() {
  const [isFetching, setIsFetching] = useState(false);
  const [redisData, setRedisData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState();

  useEffect(() => {
    requestRedisData();
  }, []);

  async function requestRedisData() {
    setIsFetching(true);
    try {
      const resData = await fetchRedisTestData();
      setRedisData(resData);
      console.log(resData);
    } catch (e) {
      setError(e);
    }
    setIsFetching(false);
  }

  async function handleSubmit() {
    try {
      await addRedisTestData(inputValue);
    } catch (e) {
      console.log(e);
    }
    requestRedisData();
  }
  
  if (error) {
    return <h3>An Error Occurred!</h3>;
  }

  return (
    <section id="test-section">
      <h3>Redis Test Update Section</h3>
      <div>
        <label>
          New Data :
          <input
            name="name"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </label>
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
      </div>
      <TestContent
        title="Redis Test Content Section"
        data={redisData}
        isLoading={isFetching}
        loadingText="Loading Data"
        fallbackText="No Data Found"
      />
    </section>
  );
}
