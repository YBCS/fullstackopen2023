import { useState } from "react";

// a proper place to define a component
const Statistics = ({ good, neutral, bad, all, positive }) => {
  return (
    <div>
      {/* there should be empty line here */}
      <StatisticLine stat_name="good" stat_value={good} />
      <StatisticLine stat_name="neutral" stat_value={neutral} />
      <StatisticLine stat_name="bad" stat_value={bad} />
      <StatisticLine stat_name="all" stat_value={all} />
      <StatisticLine stat_name="average" stat_value={all / 3} />{" "}
      {/* idk what kinda formula is used here */}
      <StatisticLine
        stat_name="positive"
        stat_value={positive}
        stat_symbol="%"
      />
    </div>
  );
};

const StatisticLine = ({ stat_name, stat_value, stat_symbol = "" }) => {
  return (
    <div>
      {stat_name} {" " + stat_value + " " + stat_symbol}{" "}
    </div>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const all = good + neutral + bad;
  const positive = (good / all) * 100;
  const isFeedback = good || neutral || bad;
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
        {isFeedback ? (
          <Statistics
            good={good}
            neutral={neutral}
            bad={bad}
            all={all}
            positive={positive}
          />
        ) : (
          <div>
            <p>No feedback given</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
