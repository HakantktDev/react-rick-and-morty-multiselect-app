import React, {useState, useEffect} from "react";
import MultiSelectDropdown from "./components/MultiSelectDropdown";
import {ApiResponse, Character} from "./types/apiResponseTypes";
import InstructionsList from "./components/InstructionsList";

const App: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacters = async (page = 1) => {
      try {
        let newCharacters: Character[];
        const response = await fetch(
          `https://rickandmortyapi.com/api/character?page=${page}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: ApiResponse = await response.json();
        if (data.info.next) {
          newCharacters = data.results;
          setCharacters((prevCharacters) => [
            ...prevCharacters,
            ...newCharacters,
          ]);
          fetchCharacters(page + 1);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching characters:", error);
        setError(
          "An error accoured while fetching characters. Please try again later."
        );
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  return (
    <div className="App">
      <h1 className="text-center">Rick and Morty Multi-Select Dropdown</h1>
      <InstructionsList />
      {error ? (
        <h3 className="error">{error}</h3>
      ) : loading ? (
        <div className="loader"></div>
      ) : (
        <MultiSelectDropdown characters={characters} />
      )}
    </div>
  );
};

export default App;
