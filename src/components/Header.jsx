function Header({ title, description, totalCards }) {
  return (
    <header className="app-header">
      <h1>{title}</h1>
      <p className="description">{description}</p>
      <p className="card-count">Total Cards: {totalCards}</p>
    </header>
  );
}

export default Header;