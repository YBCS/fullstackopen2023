import { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [countries, setCountries] = useState(null);
  const [filterName, setFilterName] = useState("");

  useEffect(() => {
    console.log("effect 1");
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        let data = response.data.map((country, i) => {
          return {
            country: country.name.common,
            id: i,
          };
        });
        setCountries(data);
      });
  }, []);

  const countryToShow = filterName
    ? countries.filter((c) =>
        c.country.toLowerCase().includes(filterName.toLowerCase())
      )
    : countries;

  return (
    <>
      find countries{" "}
      <input
        value={filterName}
        onChange={({ target }) => setFilterName(target.value)}
      />
      <div>
        <Countries countries={countryToShow} filter={filterName} />
      </div>
    </>
  );
};

const Countries = ({ countries, filter }) => {
  /* it took me way too much time to come up with this */
  if (!countries) return "loading countries...";
  if (filter && countries.length > 10) {
    /* bruh why did I thought and operator is & and not && */
    return "Too many matches, specify another filter";
  }
  if (filter && countries.length === 1) {
    return <Country country={countries[0]} />;
  }
  // notice that we are still not handling the condition when contries is just 0 elements empty array
  return countries.map((c) => <div key={c.id}>{c.country} <button>show</button></div>);
};

const Country = ({ country }) => {
  const [data, setData] = useState(null);
  console.log(country, "received ");
  const baseUrl = `https://studies.cs.helsinki.fi/restcountries/api/name/${country.country}`;
  useEffect(() => {
    axios.get(baseUrl).then((response) => {
      console.log(response);
      setData(response.data);
    });
  }, []);
  if (!data) return null;
  return (
    <div>
      <h1>{data.name.common}</h1>
      <div>capital {data.capital}</div>
      <div>area {data.area}</div>
      <h3>languages:</h3>
      <ul>
        {Object.entries(data.languages).map(([key, value]) => {
          return <li key={key}> {value} </li>;
        })}
      </ul>
      <img src={data.flags.png} width={200}></img>
    </div>
  );
};

export default App;
