function DifficultySelector({
  difficulties,
  difficulty,
  onDifficultyChange,
}) {
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      {difficulties.map((difficultyOption) => {
        const isActive = difficulty === difficultyOption.id;

        return (
          <button
            key={difficultyOption.id}
            type="button"
            onClick={() => onDifficultyChange(difficultyOption.id)}
            className={`difficulty-btn ${
              isActive
                ? `bg-linear-to-r ${difficultyOption.gradient} border-transparent text-white`
                : "border-border bg-card text-muted hover:border-primary/40 hover:text-text"
            }`}
          >
            {difficultyOption.label}
            <span>{difficultyOption.cards} cards</span>
          </button>
        );
      })}
    </div>
  );
}

export default DifficultySelector;
