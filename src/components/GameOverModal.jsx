function GameOverModal({ score, best, onRestart }) {
  return (
    <div className="modal-overlay modal-lost">
      <div className="modal animate-fade-in-up">
        <div className="modal-icon">💀</div>

        <h2>Game Over!</h2>

        <p>You clicked the same Pokémon twice.</p>

        <p className="final-score">
          Score: <strong>{score}</strong> · Best: <strong>{best}</strong>
        </p>

        <button type="button" className="modal-btn lost" onClick={onRestart}>
          Try Again
        </button>
      </div>
    </div>
  );
}

export default GameOverModal;
