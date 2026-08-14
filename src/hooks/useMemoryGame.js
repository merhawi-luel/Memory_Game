import { useCallback, useEffect, useRef, useState } from "react";

export const POKEMON_POOL_SIZE = 20;
export const INITIAL_DIFFICULTY = "medium";

export const DIFFICULTIES = [
  { id: "easy", label: "Easy", cards: 8, gradient: "from-emerald-400 to-teal-500" },
  { id: "medium", label: "Medium", cards: 12, gradient: "from-indigo-400 to-violet-500" },
  { id: "hard", label: "Hard", cards: 20, gradient: "from-rose-400 to-red-500" },
];

/*
  Builds the PokéAPI official artwork URL from a Pokémon ID.
*/
function spriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

/*
  Fisher-Yates shuffle algorithm.
*/
function shuffle(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[i],
    ];
  }

  return shuffled;
}

/*
  Game state and rules for the memory card game.
*/
export default function useMemoryGame() {
  const [difficulty, setDifficulty] = useState(INITIAL_DIFFICULTY);

  const [pool, setPool] = useState([]);
  const [cards, setCards] = useState([]);

  const [clicked, setClicked] = useState(() => new Set());
  const [score, setScore] = useState(0);
  const [streakCount, setStreakCount] = useState(0);

  const [best, setBest] = useState(() => {
    const savedScore = localStorage.getItem("bestScore");
    return savedScore ? Number(savedScore) : 0;
  });

  const [status, setStatus] = useState("loading");
  const [animating, setAnimating] = useState(null);
  const [error, setError] = useState(null);

  const wrongTimer = useRef(null);

  /*
    Start a fresh round: pick N random Pokémon from the given pool,
    shuffle them, and reset all game state.
  */
  const startGame = useCallback((difficultyId, poolToUse) => {
    if (poolToUse.length === 0) return;

    const setting = DIFFICULTIES.find((d) => d.id === difficultyId);

    setCards(shuffle(poolToUse).slice(0, setting.cards));
    setClicked(new Set());
    setScore(0);
    setStreakCount(0);
    setStatus("playing");
    setAnimating(null);

    if (wrongTimer.current) {
      clearTimeout(wrongTimer.current);
      wrongTimer.current = null;
    }
  }, []);

  /*
    Fetch a pool of Pokémon (with types) once, then start the first game.
  */
  useEffect(() => {
    let cancelled = false;

    async function loadPool() {
      try {
        const urls = Array.from(
          { length: POKEMON_POOL_SIZE },
          (_, index) => `https://pokeapi.co/api/v2/pokemon/${index + 1}`
        );

        const responses = await Promise.all(
          urls.map((url) => fetch(url))
        );

        if (responses.some((response) => !response.ok)) {
          throw new Error("Failed to fetch Pokémon data.");
        }

        const data = await Promise.all(
          responses.map((response) => response.json())
        );

        if (cancelled) return;

        const pokemonData = data.map((pokemon) => ({
          id: pokemon.id,
          name: pokemon.name,
          type: pokemon.types?.[0]?.type?.name ?? "normal",
          image: spriteUrl(pokemon.id),
        }));

        setPool(pokemonData);
        startGame(INITIAL_DIFFICULTY, pokemonData);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Something went wrong.");
          setStatus("error");
        }
      }
    }

    loadPool();

    return () => {
      cancelled = true;
    };
  }, [startGame]);

  /*
    Persist the best score.
  */
  useEffect(() => {
    localStorage.setItem("bestScore", best);
  }, [best]);

  /*
    Main game logic.
  */
  function handleCardClick(id) {
    // Ignore clicks while the wrong-pick shake is playing.
    if (status !== "playing" || animating?.kind === "wrong") {
      return;
    }

    /*
      Wrong pick: same Pokémon clicked twice.
    */
    if (clicked.has(id)) {
      setStreakCount(0);
      setAnimating({ id, kind: "wrong" });

      if (score > best) {
        setBest(score);
      }

      // Let the shake play before showing the game-over modal.
      wrongTimer.current = setTimeout(() => {
        setStatus("lost");
        setAnimating(null);
        wrongTimer.current = null;
      }, 650);

      return;
    }

    /*
      Correct pick: add to clicked set, bump score & streak.
    */
    const nextClicked = new Set(clicked);
    nextClicked.add(id);

    const nextScore = score + 1;

    setClicked(nextClicked);
    setScore(nextScore);
    setStreakCount((count) => count + 1);
    setAnimating({ id, kind: "click" });

    setTimeout(() => setAnimating(null), 400);

    if (nextScore > best) {
      setBest(nextScore);
    }

    /*
      Check if the player clicked every card.
    */
    if (nextClicked.size === cards.length) {
      setStatus("won");
      return;
    }

    /*
      Shuffle the remaining cards after every successful click.
    */
    setCards((currentCards) => shuffle(currentCards));
  }

  /*
    Change difficulty and start a new game.
  */
  function handleDifficultyChange(newDifficulty) {
    if (newDifficulty === difficulty) return;

    setDifficulty(newDifficulty);
    startGame(newDifficulty, pool);
  }

  /*
    Restart the current round with the current difficulty.
  */
  const restart = useCallback(() => {
    startGame(difficulty, pool);
  }, [startGame, difficulty, pool]);

  const progressPct = cards.length
    ? Math.round((clicked.size / cards.length) * 100)
    : 0;

  return {
    difficulty,
    cards,
    clicked,
    score,
    best,
    status,
    animating,
    error,
    streakCount,
    progressPct,
    handleCardClick,
    handleDifficultyChange,
    restart,
  };
}
