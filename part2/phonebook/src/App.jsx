import { useEffect, useState } from "react";
import personService from "./services/persons";
import axios from "axios";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterName, setFilterName] = useState("");

  useEffect(() => {
    console.log("effect");
    personService.getAll().then((response) => {
      console.log("promise completed");
      setPersons(response.data);
    });
  }, []);

  const onSubmit = (event) => {
    event.preventDefault();
    const checkName = newName.trim();
    const checkNumber = newNumber.trim();
    // TODO : do I need to handle lower case ?
    const foundPerson = persons.find((person) => person.name === checkName);
    const foundNumber = persons.find((person) => person.number === checkNumber);

    if (foundNumber) {
      alert(`${newNumber} is already added to phonebook`);
      return;
    }
    if (foundPerson) {
      if (
        confirm(
          `${newName} is already added to phonebook, replace the old number with a new one ?`
        )
      ) {
        const newPerson = { ...foundPerson, number: checkNumber };
        personService.update(foundPerson.id, newPerson).then((response) => {
          const newPersons = persons.map((person) =>
            person.id !== foundPerson.id ? person : response.data
          );
          setPersons(newPersons);
          setNewName("");
          setNewNumber("");
          setFilterName("");
        });
      }
      return;
    }

    const nameObject = { name: checkName, number: checkNumber };
    personService.create(nameObject).then((response) => {
      // console.log(response);
      const newPersons = persons.concat(response.data);
      setPersons(newPersons);
      setNewName("");
      setNewNumber("");
      setFilterName("");
    });
  };

  const onChange = (event) => {
    setNewName(event.target.value);
  };
  const onChangeNumber = (event) => {
    setNewNumber(event.target.value);
  };
  const onChangeFilter = (event) => {
    setFilterName(event.target.value);
  };
  const onDelete = (person) => {
    if (confirm(`Delete ${person.name} ?`)) {
      personService.remove(person.id).then((response) => {
        const newPersons = persons.filter((p) => p.id !== person.id);
        setPersons(newPersons);
      });
    }
  };

  const personsToShow = filterName
    ? persons.filter((person) =>
        person.name.toLowerCase().includes(filterName.toLowerCase())
      )
    : persons;

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filterName={filterName} onChangeFilter={onChangeFilter} />
      <h2>Add a new</h2>
      <PersonForm
        newName={newName}
        onChange={onChange}
        newNumber={newNumber}
        onChangeNumber={onChangeNumber}
        onSubmit={onSubmit}
      />
      <h2>Numbers</h2>
      <div></div>
      <Persons persons={personsToShow} onDelete={onDelete} />
    </div>
  );
};

const Filter = ({ filterName, onChangeFilter }) => (
  <div>
    {/* how da hello does copilot knows exaclty as it is in material; can it see my browser ? */}
    filter shown with <input value={filterName} onChange={onChangeFilter} />
  </div>
);

const PersonForm = ({
  newName,
  onChange,
  newNumber,
  onChangeNumber,
  onSubmit,
}) => (
  <form>
    <div>
      name: <input value={newName} onChange={onChange} />
    </div>
    <div>
      number: <input value={newNumber} onChange={onChangeNumber} />
    </div>
    <div>
      <button type="submit" onClick={onSubmit}>
        add
      </button>
    </div>
  </form>
);

const Persons = ({ persons, onDelete }) =>
  persons.map((person) => (
    <div key={person.name}>
      {`${person.name} ${person.number} `}
      <button onClick={() => onDelete(person)}> delete </button>
    </div>
  ));

export default App;
