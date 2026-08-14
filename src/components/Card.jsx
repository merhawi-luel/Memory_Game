/*
  Maps each Pokémon type to a CSS class that sets --type-color
  (border + badge) and --type-glow (hover glow).
*/
const TYPE_STYLES = {
  fire: "type-fire",
  water: "type-water",
  grass: "type-grass",
  bug: "type-bug",
  flying: "type-flying",
  normal: "type-normal",
  poison: "type-poison",
  electric: "type-electric",
  ground: "type-ground",
  ice: "type-ice",
  fairy: "type-fairy",
  psychic: "type-psychic",
  fighting: "type-fighting",
  rock: "type-rock",
  ghost: "type-ghost",
  dragon: "type-dragon",
  dark: "type-dark",
  steel: "type-steel",
};

function Card({ pokemon, onClick, animating }) {
  const typeClass = TYPE_STYLES[pokemon.type] ?? "type-default";

  const isClicking =
    animating?.id === pokemon.id && animating.kind === "click";
  const isWrong = animating?.id === pokemon.id && animating.kind === "wrong";

  return (
    <button
      type="button"
      className={`card ${typeClass} ${isClicking ? "animate-card-click" : ""} ${
        isWrong ? "animate-wrong-shake" : ""
      }`}
      onClick={onClick}
      onMouseEnter={(event) => {
        event.currentTarget.style.boxShadow = "0 0 30px var(--type-glow)";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.boxShadow = "";
      }}
    >
      <span className="type-badge">{pokemon.type}</span>

      <img
        className="card-sprite"
        src={pokemon.image}
        alt={pokemon.name}
        loading="lazy"
      />

      <span className="card-name">{pokemon.name}</span>

      <span className="dex-number">
        #{String(pokemon.id).padStart(3, "0")}
      </span>
    </button>
  );
}

export default Card;
