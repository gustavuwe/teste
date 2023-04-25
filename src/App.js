import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [repo, setRepo] = useState("");
  const [repos, setRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedRepos = JSON.parse(localStorage.getItem("savedRepos"));
    console.log(storedRepos)
    if (storedRepos && storedRepos.length > 0) {
      setRepos(storedRepos);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("savedRepos", JSON.stringify(repos));
  }, [repos]);

  const updateRepo = (event) => {
    setRepo(event.target.value);
  };

  const saveRepo = () => {
    if (repo.trim() !== "") {
      setIsLoading(true);
      axios
        .get(`https://api.github.com/repos/${repo}`)
        .then((response) => {
          const newRepo = {
            name: response.data.name,
            description: response.data.description,
            stars: response.data.stargazers_count,
          };
          setRepos([...repos, newRepo]);
          setRepo("");
          setIsLoading(false);
          setError("");
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
          setError("❌ Repositório não encontrado no GitHub");
        });
    }
  };

  return (
    <div>
      <h1>💾 RepoSaver</h1>
      <div>
        <label htmlFor="inputRepo">
          Digite o nome do repositório do GitHub (Ex.: <b>facebook/react</b>):
        </label>
        <br />
        <br />
        <div>
          <b>github.com/</b>
          <input
            type="text"
            id="inputRepo"
            value={repo}
            onChange={updateRepo}
          />
          <button onClick={saveRepo}>Salvar</button>
        </div>
        {isLoading && <p>Carregando...</p>}
        {error && <p>{error}</p>}
      </div>
      <div>
        <h2>Repositórios salvos:</h2>
        {repos.length > 0 ? (
          <ul>
            {repos.map((repo, index) => (
              <li key={index}>
                <strong>{repo.name}</strong> - {repo.description} - {repo.stars}{" "}
                estrelas
              </li>
            ))}
          </ul>
        ) : (
          <p>🕳️ Nenhum repositório salvo</p>
        )}
        <small>
          ⚠️ As informações ficam salvas de forma permanente no navegador, até
          que você apague o histórico de navegação.
        </small>
      </div>
    </div>
  );
}

export default App;
