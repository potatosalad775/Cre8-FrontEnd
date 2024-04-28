import { useState } from "react";
import TestSection from "./components/Test/TestSection.jsx";
import RedisTestSection from "./components/Test/RedisTestSection.jsx";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <main>
        <h1>Cre8 Demo</h1>
        <div>
          <button onClick={() => setCount((count) => count + 1)}> count {count} </button>
        </div>
        <section id="test-section">
          <TestSection />
          <RedisTestSection />
        </section>
      </main>
    </div>
  );
}

export default App;
