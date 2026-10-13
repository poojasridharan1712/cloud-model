import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import { db } from "./firebase";

function App() {
  const [pets, setPets] = useState([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [editId, setEditId] = useState(null);

  async function fetchPets() {
    const snapshot = await getDocs(collection(db, "pets"));
    setPets(
      snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data()
      }))
    );
  }

  useEffect(() => {
    fetchPets().catch(console.error);
  }, []);

  async function savePet(e) {
    e.preventDefault();

    try {
      const petData = { name, type };

      if (editId) {
        await updateDoc(doc(db, "pets", editId), petData);
        alert("Pet updated successfully!");
      } else {
        await addDoc(collection(db, "pets"), petData);
        alert("Pet added successfully!");
      }

      setName("");
      setType("");
      setEditId(null);
      await fetchPets();
    } catch (error) {
      console.error(error);
      alert("Operation failed. Check Console.");
    }
  }

  function editPet(pet) {
    setName(pet.name);
    setType(pet.type);
    setEditId(pet.id);
  }

  async function removePet(id) {
    if (!window.confirm("Are you sure you want to delete this pet?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "pets", id));
      await fetchPets();
      alert("Pet deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Delete failed. Check Console.");
    }
  }

  function cancelEdit() {
    setName("");
    setType("");
    setEditId(null);
  }

  return (
    <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h1>Pet Compatibility</h1>

      <form onSubmit={savePet}>
        <input
          placeholder="Pet name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          placeholder="Pet type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          required
        />

        <button type="submit">
          {editId ? "Update Pet" : "Add Pet"}
        </button>

        {editId && (
          <button type="button" onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </form>

      <h2>Pet List</h2>

      {pets.length === 0 && <p>No pets added yet.</p>}

      {pets.map((pet) => (
        <div key={pet.id} style={{ marginBottom: "12px" }}>
          <span>
            {pet.name} - {pet.type}
          </span>{" "}
          <button onClick={() => editPet(pet)}>Edit</button>{" "}
          <button onClick={() => removePet(pet.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default App;