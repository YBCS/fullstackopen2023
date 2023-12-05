import { useEffect, useState } from "react";
import personService from "./services/persons";
import "./index.css";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [filterName, setFilterName] = useState("");
  const [successMessage, setSuccessMessage] = useState(null); /* NOTE how does the model solution handles this two case  */
  const [errorMessage, setErrorMessage] = useState(null);

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
      alert(`${newNumber} is already added to phonebook`); // this is only client side check
      return;
    }
    if (foundPerson) {
      if (
        confirm(
          `${newName} is already added to phonebook, replace the old number with a new one ?`
        )
      ) {
        const newPerson = { ...foundPerson, number: checkNumber };
        personService
          .update(foundPerson.id, newPerson)
          .then((response) => {
            const newPersons = persons.map((person) =>
              person.id !== foundPerson.id ? person : response.data
            );
            setPersons(newPersons);
            setNewName("");
            setNewNumber("");
            setFilterName("");
            setSuccessMessage(`Updated ${newPerson.name}`);
            setTimeout(() => {
              setSuccessMessage(null);
            }, 5000);
          })
          .catch((error) => {
            setErrorMessage(
              `Information of ${newPerson.name} has already been removed from server`
            );
            setTimeout(() => {
              setErrorMessage(null);
            }, 5000);
            setPersons(persons.filter((p) => p.id !== newPerson.id));
          });
      }
      return;
    }

    const nameObject = { name: checkName, number: checkNumber };
    personService.create(nameObject).then((response) => { /* NOTE does the model answer have a .catch for this. i think not */
      // console.log(response);
      const newPersons = persons.concat(response.data);
      setPersons(newPersons);
      setNewName("");
      setNewNumber("");
      setFilterName("");
      setSuccessMessage(`Added ${response.data.name}`);
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
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
      personService
        .remove(person.id)
        .then((response) => {
          const newPersons = persons.filter((p) => p.id !== person.id);
          setPersons(newPersons);
        })
        .catch((error) => {
          setErrorMessage(
            `Information of ${person.name} has already been removed from server`
          );
          setTimeout(() => {
            setErrorMessage(null);
          }, 5000);
          setPersons(persons.filter((p) => p.id !== person.id));
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
      <Notification message={successMessage} status={"success"} />
      <Notification message={errorMessage} status={"error"} />
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

const Notification = ({ message, status }) => {
  if (message === null) return null;
  return <div className={status}>{message}</div>;
};

export default App;
