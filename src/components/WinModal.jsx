function WinModal({ score, best, onRestart }) {
  return (
    <div className="modal-overlay modal-won">
      <div className="modal animate-fade-in-up">
        <div className="modal-icon">🏆</div>

        <h2>You Won!</h2>

        <p>You clicked every Pokémon without repeating one!</p>

        <p className="final-score">
          Score: <strong>{score}</strong> · Best: <strong>{best}</strong>
        </p>

        <button type="button" className="modal-btn won" onClick={onRestart}>
          Play Again
        </button>
      </div>
    </div>
  );
}

export default WinModal;
