export const InstructionsList = () => {
  return (
    <div className="d-flex-center">
      <ul className="instructions-list">
        <li>
          <kbd>TAB</kbd>: User can navigate around search and list items.
        </li>
        <li>
          <kbd>ENTER</kbd>: User can select a list item and add it to the search
          as a badge, and remove it in the same way.
        </li>
        <li>
          <kbd>ESC</kbd>: User can close the dropdown.
        </li>
        <li>
          <kbd>ARROWUP</kbd> / <kbd>ARROWDOWN</kbd>: If the user is in the list,
          they can navigate through list items and select/unselect items.
        </li>
      </ul>
    </div>
  );
};
