import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([{ name: "Arto Hellas" }]);
  const [newName, setNewName] = useState("");

  const onSubmit = (event) => {
	event.preventDefault();
	const checkName = newName.trim();
	// TODO : do I need to handle lower case ?
	const found = persons.find((person) => person.name === checkName);
	if (found) {
		alert(`${newName} is already added to phonebook`);
		return;
	}
	const newPersons = persons.concat({name: checkName});
	setPersons(newPersons);
  }

  const onChange = (event) => { 
	setNewName(event.target.value);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          name: <input value={newName} onChange={onChange}/>
        </div>
        <div>
          <button type="submit" onClick={onSubmit}>add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      {
		persons.map((person) => (<div key={person.name}>{person.name}</div>))
	  }
    </div>
  );
};

export default App;
