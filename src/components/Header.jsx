function Header({ score, best }) {
  return (
    <header className="flex flex-col items-center justify-between gap-6 border-b border-border px-[6%] py-6 sm:flex-row">
      <div className="flex items-center gap-3">
        <div className="logo-pill animate-float">G</div>

        <div>
          <h1 className="text-2xl font-extrabold leading-tight">
            Memory Card
          </h1>
          <p className="text-sm text-muted">Test your memory!</p>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="stat-pill">
          <span>Score</span>
          <strong>{score}</strong>
        </div>

        <div className="stat-pill">
          <span>Best</span>
          <strong>{best}</strong>
        </div>
      </div>
    </header>
  );
}

export default Header;
