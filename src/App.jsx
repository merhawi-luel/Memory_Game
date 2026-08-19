import { useState } from "react";
import useMemoryGame, { DIFFICULTIES } from "./hooks/useMemoryGame";
import Header from "./components/Header";
import DifficultySelector from "./components/DifficultySelector";
import GameBoard from "./components/GameBoard";
import GameOverModal from "./components/GameOverModal";
import WinModal from "./components/WinModal";
import "./App.css";

function App() {
  const {
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
  } = useMemoryGame();

  /*
    Starfield dots: randomized once on mount.
  */
  const [stars] = useState(() =>
    Array.from({ length: 40 }, () => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 2.5 + 1,
      opacity: Math.random() * 0.5 + 0.15,
    }))
  );

  return (
    <div className="relative min-h-screen text-text">
      {/* Starfield background */}
      <div className="starfield" aria-hidden="true">
        {stars.map((star, index) => (
          <span
            key={index}
            className="star"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <Header score={score} best={best} />

        <main className="mx-auto w-[min(1200px,92%)] py-10">
          {/* Hero */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3">
              <span
                className="inline-block animate-star-spin text-3xl text-accent"
                aria-hidden="true"
              >
                ✦
              </span>

              <h1 className="hero-title text-5xl font-black tracking-tight">
                Memory Card
              </h1>
            </div>

            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">
              Click every Pokemon exactly once. The board shuffles after
              each pick.Repeat one and it&apos;s game over!
            </p>
          </div>

          <DifficultySelector
            difficulties={DIFFICULTIES}
            difficulty={difficulty}
            onDifficultyChange={handleDifficultyChange}
          />

          {/* Progress bar */}
          {cards.length > 0 && (
            <div className="mt-10 flex items-center justify-center gap-4">
              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${progressPct}%` }}
                />
              </div>

              <span className="progress-label">
                {clicked.size} / {cards.length}
              </span>
            </div>
          )}

          {/* Loading */}
          {status === "loading" && (
            <div className="flex min-h-[380px] flex-col items-center justify-center gap-4 text-muted">
              <div className="spinner"></div>
              <p>Loading Pokémon...</p>
            </div>
          )}

          {/* Error */}
          {status === "error" && (
            <div className="flex min-h-[380px] flex-col items-center justify-center gap-4 text-muted">
              <div className="text-4xl">Error</div>
              <p>{error}</p>
              <button
                type="button"
                className="modal-btn"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          )}

          {/* Cards */}
          {cards.length > 0 && (
            <GameBoard
              cards={cards}
              onCardClick={handleCardClick}
              animating={animating}
              difficulty={difficulty}
            />
          )}

          {/* Game over modal */}
          {status === "lost" && (
            <GameOverModal
              score={score}
              best={best}
              onRestart={restart}
            />
          )}

          {/* Win modal */}
          {status === "won" && (
            <WinModal
              score={score}
              best={best}
              onRestart={restart}
            />
          )}

          {/* Streak toast */}
          {streakCount >= 3 && (
            <div className="streak-toast animate-pulse-glow">
               {streakCount} streak
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
