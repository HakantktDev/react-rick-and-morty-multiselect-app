import React, {useState, useRef, useEffect, useCallback} from "react";
import ErrorBoundary from "./ErrorBoundary";
import {Character} from "../types/apiResponseTypes";

interface MultiSelectProps {
  characters: Character[];
}

const MultiSelectDropdown: React.FC<MultiSelectProps> = ({characters}) => {
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([]);
  const [characterList, setCharacterList] = useState<Character[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Simulate an error for error boundary
  // useEffect(() => {
  //
  //   throw new Error("Error occurred in MultiSelectDropdown component");
  // }, []);

  useEffect(() => {
    if (searchTerm !== "") setIsOpen(true);
  }, [searchTerm]);

  useEffect(() => {
    if (isOpen && listRef.current && characterList.length > 0) {
      const focusedItem = listRef.current.querySelector(".highlighted");
      if (focusedItem) {
        focusedItem.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest",
        });
      }
    }
  }, [highlightedIndex, isOpen, characterList]);

  useEffect(() => {
    const searchInput = dropdownRef.current?.querySelector("input");
    if (searchInput) {
      searchInput.focus();
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const calculateMaxWidth = (): string => {
    if (selectedCharacters.length === 0) {
      return "92%";
    } else if (selectedCharacters.length === 1) {
      return "calc(100% - 150px)";
    } else if (selectedCharacters.length >= 2) {
      return "calc(100% - 280px)";
    } else {
      return "100%";
    }
  };

  const toggleDropdown = (e: React.MouseEvent<HTMLInputElement>) => {
    if (e.target === e.currentTarget) {
      setIsOpen(true);
    }
  };

  const toggleOption = (
    character: Character,
    shouldResetHighlightedIndex = true
  ) => {
    const isSelected = selectedCharacters.some((c) => c.id === character.id);
    if (isSelected) {
      setSelectedCharacters(
        selectedCharacters.filter((c) => c.id !== character.id)
      );
    } else {
      setSelectedCharacters([...selectedCharacters, character]);
    }
    if (shouldResetHighlightedIndex) {
      setHighlightedIndex(-1);
    }
  };

  const removeOption = (character: Character) => {
    setSelectedCharacters(
      selectedCharacters.filter((c) => c.id !== character.id)
    );
  };

  const getFilteredCharacterIds = useCallback(() => {
    if (searchTerm === "") return;
    const filteredOptions = characters?.filter((character) =>
      character.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return filteredOptions.map((character) => character.id);
  }, [characters, searchTerm]);

  const getFilteredCharacterList = (filteredIds: number[] | undefined) => {
    if (!filteredIds) return;
    setLoading(true);
    const apiUrl = `https://rickandmortyapi.com/api/character/[${filteredIds.join(
      ","
    )}]`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data: Character[]) => {
        setCharacterList(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(
          "An error accoured while fetching characters. Please try again later."
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    const filteredIds = getFilteredCharacterIds();
    if (filteredIds && filteredIds.length > 0) {
      getFilteredCharacterList(filteredIds);
    } else if (searchTerm === "") {
      setCharacterList(characters);
    } else {
      setCharacterList([]);
    }
  }, [searchTerm, getFilteredCharacterIds, characters]);

  const boldifyMatchingText = (
    text: string,
    searchTerm: string
  ): JSX.Element => {
    const regex = new RegExp(`(${searchTerm})`, "gi");
    return (
      <span
        dangerouslySetInnerHTML={{
          __html: text.replace(regex, "<strong>$1</strong>"),
        }}
      />
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let searchInput;
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        if (e.target === dropdownRef.current?.querySelector("input")) {
          setHighlightedIndex(-1);
        } else {
          setHighlightedIndex((prevIndex) =>
            prevIndex > 0 ? prevIndex - 1 : characterList.length - 1
          );
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (e.target === dropdownRef.current?.querySelector("input")) {
          setHighlightedIndex(-1);
        } else {
          setHighlightedIndex((prevIndex) =>
            prevIndex < characterList.length - 1 ? prevIndex + 1 : 0
          );
        }
        break;
      case "Enter":
        if (
          e.target === dropdownRef.current?.querySelector("input[type='text']")
        ) {
          setIsOpen(true);
          return;
        }
        e.preventDefault();

        if (characterList.length > 0) {
          toggleOption(characterList[highlightedIndex], false);
        }
        break;
      case "Tab":
        if (isOpen === false) {
          setIsOpen(true);
        }
        if (e.target === dropdownRef.current?.querySelector("input")) {
          setHighlightedIndex(0);
        } else {
          e.preventDefault();
          setHighlightedIndex(-1);

          searchInput = dropdownRef.current?.querySelector("input");
          if (searchInput) {
            searchInput.focus();
          }
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        searchInput = dropdownRef.current?.querySelector("input");
        if (searchInput) {
          searchInput.focus();
        }
        break;
      default:
        break;
    }
  };

  return (
    <div ref={dropdownRef} className="d-contents">
      <div className="search-wrapper">
        {selectedCharacters.length > 0 && (
          <div className="selected-character-list">
            {selectedCharacters.map((character) => (
              <div key={character.id}>
                {character.name}
                <span onClick={() => removeOption(character)}>X</span>
              </div>
            ))}
          </div>
        )}
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClick={(e) => toggleDropdown(e)}
          onKeyDown={handleKeyDown}
          className="search-input"
          style={{
            maxWidth: calculateMaxWidth(),
          }}
        />
        <div className="caret" onClick={() => setIsOpen(!isOpen)}></div>
      </div>
      {isOpen && (
        <div ref={listRef} onKeyDown={handleKeyDown} className="dropdown-list">
          {error && <div className="error">{error}</div>}
          {loading && <div className="loader"></div>}
          {characterList.length === 0 && !error && (
            <div className="no-data">There is no character found</div>
          )}
          {!error &&
            characterList?.map((character, index) => (
              <div
                key={character.id}
                className={
                  index === highlightedIndex
                    ? "highlighted dropdown-list-item"
                    : "dropdown-list-item"
                }
              >
                <input
                  type="checkbox"
                  id={String(character.id)}
                  checked={selectedCharacters.some(
                    (o) => o.id === character.id
                  )}
                  onChange={() => toggleOption(character)}
                />
                <label htmlFor={String(character.id)}>
                  <img src={character.image} alt={character.name} />
                  <div className="ml-8">
                    <p className="list-item-name">
                      {boldifyMatchingText(character.name, searchTerm)}
                    </p>
                    <p className="list-item-content">
                      {character.episode.length} Episodes
                    </p>
                  </div>
                </label>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
export default function MultiSelectDropdownBoundary({
  characters,
}: {
  characters: Character[];
}) {
  return (
    <ErrorBoundary>
      <MultiSelectDropdown characters={characters} />
    </ErrorBoundary>
  );
}