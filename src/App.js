import { useEffect, useMemo, useState } from "react";
import "./App.css";

const initialEmojis = [
  { symbol: "😀", name: "Grinning Face" },
  { symbol: "😁", name: "Beaming Face" },
  { symbol: "😂", name: "Face with Tears of Joy" },
  { symbol: "🤣", name: "Rolling on the Floor Laughing" },
  { symbol: "😍", name: "Smiling Face with Hearts" },
  { symbol: "🥰", name: "Smiling Face with 3 Hearts" },
  { symbol: "😎", name: "Cool Face" },
  { symbol: "🤓", name: "Nerd Face" },
  { symbol: "😭", name: "Crying Face" },
  { symbol: "😡", name: "Angry Face" },
  { symbol: "🤯", name: "Exploding Head" },
  { symbol: "😴", name: "Sleeping Face" },
  { symbol: "🔥", name: "Fire" },
  { symbol: "💯", name: "Hundred Points" },
  { symbol: "👏", name: "Clapping Hands" },
  { symbol: "👍", name: "Thumbs Up" },
  { symbol: "🙏", name: "Folded Hands" },
  { symbol: "🚀", name: "Rocket" },
  { symbol: "❤️", name: "Red Heart" },
  { symbol: "🎉", name: "Party Popper" },
];

function App() {
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [theme, setTheme] = useState("light");
  const [search, setSearch] = useState("");
  const [emojis, setEmojis] = useState(initialEmojis);

const [newSymbol, setNewSymbol] = useState("");
const [newName, setNewName] = useState("");
const [formError, setFormError] = useState("");
function addEmoji(e) {
  e.preventDefault();
  setFormError("");

  const symbol = newSymbol.trim();
  const name = newName.trim();

  if (!symbol || !name) {
    setFormError("write emoji name ✍️");
    return;
  }

  const exists = emojis.some((x) => x.symbol === symbol);
  if (exists) {
    setFormError("this emoji exisit 😅");
    return;
  }

  setEmojis((prev) => [{ symbol, name }, ...prev]);
  setNewSymbol("");
  setNewName("");
}


  const [favorites, setFavorites] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("favorites")) || [];
    } catch {
      return [];
    }
  });

  const [showFavOnly, setShowFavOnly] = useState(false);

  const isDark = theme === "dark";

  const themeLabel = useMemo(() => (isDark ? "Dark" : "Light"), [isDark]);

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  }

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  function toggleFavorite(symbol) {
    setFavorites((prev) =>
      prev.includes(symbol)
        ? prev.filter((s) => s !== symbol)
        : [...prev, symbol]
    );
  }

  function isFavorite(symbol) {
    return favorites.includes(symbol);
  }

  const filteredEmojis = emojis
    .filter((e) => e.name.toLowerCase().includes(search.toLowerCase()))
    .filter((e) => (showFavOnly ? favorites.includes(e.symbol) : true));

  return (
    <div className={`page ${isDark ? "dark" : "light"}`}>
      <div className="topBar">
        <div>
          <h1 className="title">Emoji List</h1>
          <p className="subtitle">choose</p>

          <input
            className="searchInput"
            type="text"
            placeholder="search emoji"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="topActions">
          <button className="themeBtn" onClick={toggleTheme} type="button">
            {isDark ? "☀️ Light" : "🌙 Dark"}
          </button>

          <button
            className="favFilterBtn"
            onClick={() => setShowFavOnly((p) => !p)}
            type="button"
            title="show favorites"
          >
            {showFavOnly ? "⭐ favorite" : "☆ All"}
          </button>
        </div>
      </div>
<form className="addForm" onSubmit={addEmoji}>
  <input
    className="addInput"
    type="text"
    placeholder=""
    value={newSymbol}
    onChange={(e) => setNewSymbol(e.target.value)}
    maxLength={4}
  />
  <input
    className="addInput"
    type="text"
    placeholder=" (emoji name: Happy)"
    value={newName}
    onChange={(e) => setNewName(e.target.value)}
  />
  <button className="addBtn" type="submit">
    ➕ Add
  </button>

  {formError && <div className="formError">{formError}</div>}
</form>

      <div className="emojiGrid">
        {filteredEmojis.map((emoji) => (
          <button
            key={emoji.symbol}
            className={
              selectedEmoji?.symbol === emoji.symbol
                ? "emojiBtn emojiBtnActive"
                : "emojiBtn"
            }
            onClick={() => setSelectedEmoji(emoji)}
            type="button"
            aria-label={emoji.name}
            title={emoji.name}
          >
            <span className="emoji">{emoji.symbol}</span>

            <button
              className={isFavorite(emoji.symbol) ? "favBtn favOn" : "favBtn"}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(emoji.symbol);
              }}
              aria-label="favorite"
              title="Favorite"
            >
              {isFavorite(emoji.symbol) ? "❤️" : "🤍"}
            </button>
          </button>
        ))}
      </div>

      {filteredEmojis.length === 0 && (
        <div className="noResults">try another name</div>
      )}

      <div className="result">
        {selectedEmoji ? (
          <>
            <div className="bigEmoji">{selectedEmoji.symbol}</div>
            <div className="emojiName">{selectedEmoji.name}</div>
          </>
        ) : (
          <div className="hint">choose 👆</div>
        )}
      </div>

      <div className="footerHint">Current Theme: {themeLabel}</div>
    </div>
  );
}

export default App;
