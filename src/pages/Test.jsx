import { useState } from "react";

import PageContent from "../components/PageContent";
import TestSection from "../components/Test/TestSection";
import RedisTestSection from "../components/Test/RedisTestSection";
import LoginTest from "../components/Test/LoginTest";

import { TestEditor } from "../components/Editor";

export default function TestPage() {
  const [count, setCount] = useState(0);

  function cilckHandler() {
    setCount(count + 1);
  }

  return (
    <PageContent title="Test Page">
      <h3>Counter</h3>
      <button onClick={cilckHandler}>Counter - {count}</button>
      <h3>Editor Test Section</h3>
      <TestEditor />
      <LoginTest />
      <TestSection />
      <RedisTestSection />
    </PageContent>
  );
}
