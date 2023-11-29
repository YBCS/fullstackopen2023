import { useState } from "react";

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const all = good + neutral + bad;
  const positive = (good / all) * 100;
  return (
    <div>
      <h1>give feedback</h1>
      <div>
        <button onClick={() => setGood((old) => old + 1)}>good</button>
        <button onClick={() => setNeutral((old) => old + 1)}>neutral</button>
        <button onClick={() => setBad((old) => old + 1)}>bad</button>
      </div>
      <h1>statistics</h1>
      <div>
        {/* there should be empty line here */}
        <div>good {" " + good}</div>
        <div>neutral {" " + neutral}</div>
        <div>bad {" " + bad}</div>
        <div>all {" " + all}</div>
        <div>average {" " + all / 3}</div> {/* idk what kinda formula is used here */}
        <div>positive {" " + positive + " %"}</div>
      </div>
    </div>
  );
};

export default App;
