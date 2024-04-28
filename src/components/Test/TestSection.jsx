import { useState, useEffect } from "react";

import TestContent from "./TestContent.jsx";
import { fetchTestData, addTestData } from "../../http.js";

export default function TestSection() {
  const [isFetching, setIsFetching] = useState(false);
  const [testData, setTestData] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState();

  useEffect(() => {
    requestTestData();
  }, []);

  async function requestTestData() {
    setIsFetching(true);
    try {
      const resData = await fetchTestData();
      setTestData(resData);
    } catch (e) {
      setError(e);
    }
    setIsFetching(false);
  }

  async function handleSubmit() {
    try {
      await addTestData(inputValue);
    } catch (e) {
      console.log(e);
    }
    requestTestData();
  }
  
  if (error) {
    return <h3>An Error Occurred!</h3>;
  }

  return (
    <section id="test-section">
      <h3>Test Update Section</h3>
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
        title="Test Content Section"
        data={testData}
        isLoading={isFetching}
        loadingText="Loading Data"
        fallbackText="No Data Found"
      />
    </section>
  );
}
