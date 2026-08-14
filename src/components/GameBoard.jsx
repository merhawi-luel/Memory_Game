import Card from "./Card";

function GameBoard({ cards, onCardClick, animating, difficulty }) {
  return (
    <div className={`game-grid grid-${difficulty} mt-8`}>
      {cards.map((pokemon) => (
        <Card
          key={pokemon.id}
          pokemon={pokemon}
          onClick={() => onCardClick(pokemon.id)}
          animating={animating}
        />
      ))}
    </div>
  );
}

export default GameBoard;
