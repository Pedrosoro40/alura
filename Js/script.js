// Seletores
const cardContainer = document.querySelector(".card-container");
const campoBusca = document.querySelector("header input");
const btnBuscar = document.querySelector("#botao-busca"); // ID corrigido

let dados = [];
let timeoutBusca;

// Carrega dados apenas uma vez
async function carregarDados() {
  if (dados.length > 0) return;

  try {
    // Mostra loading
    cardContainer.innerHTML = "<p class='loading'>Carregando dados...</p>";
    
    const resposta = await fetch("data.json");
    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }
    dados = await resposta.json();
  } catch (error) {
    console.error("Falha ao buscar dados:", error);
    cardContainer.innerHTML = "<p class='error'>Erro ao carregar dados. Verifique se o servidor está rodando e o arquivo data.json existe.</p>";
  }
}

// Função principal de busca
async function iniciarBusca() {
  await carregarDados();
  if (dados.length === 0) return;

  const termoBusca = campoBusca.value.trim().toLowerCase();

  // Se nada digitado, mostra tudo
  const dadosFiltrados = termoBusca
    ? dados.filter((dado) =>
        dado.nome.toLowerCase().includes(termoBusca) ||
        dado.descricao.toLowerCase().includes(termoBusca) ||
        (dado.tags && dado.tags.some(tag => 
          tag.toLowerCase().includes(termoBusca)
        ))
      )
    : dados;

  renderizarCards(dadosFiltrados);
}

// Busca com debounce para melhor performance
function buscarComDebounce() {
  clearTimeout(timeoutBusca);
  timeoutBusca = setTimeout(iniciarBusca, 300);
}

// Renderiza lista de cards
function renderizarCards(lista) {
  cardContainer.innerHTML = "";

  if (!lista || lista.length === 0) {
    cardContainer.innerHTML = "<p class='no-results'>Nenhum resultado encontrado. Tente usar outros termos de busca.</p>";
    return;
  }

  // Ordena por nome
  const listaOrdenada = [...lista].sort((a, b) => 
    a.nome.localeCompare(b.nome)
  );

  for (const dado of listaOrdenada) {
    const article = document.createElement("article");
    article.classList.add("card");

    // Adiciona tags se existirem
    const tagsHTML = dado.tags && dado.tags.length > 0 
      ? `<div class="tags"><strong>Tags:</strong> ${dado.tags.join(', ')}</div>`
      : '';

    article.innerHTML = `
      <h2>${dado.nome}</h2>
      <p class="ano-criacao"><strong>Ano de criação:</strong> ${dado.data_criacao}</p>
      <p class="descricao">${dado.descricao}</p>
      ${tagsHTML}
      <a href="${dado.link_oficial}" target="_blank" rel="noopener noreferrer" class="saiba-mais">
        Saiba mais
      </a>
    `;

    cardContainer.appendChild(article);
  }
}

// Eventos
btnBuscar.addEventListener("click", iniciarBusca);
campoBusca.addEventListener("input", buscarComDebounce); // Busca em tempo real com debounce
campoBusca.addEventListener("keyup", (e) => {
  if (e.key === "Enter") iniciarBusca();
});

// Carrega tudo na primeira vez
window.addEventListener("DOMContentLoaded", async () => {
  await carregarDados();
  renderizarCards(dados);
});

// Adiciona estilos inline para feedback visual
const style = document.createElement('style');
style.textContent = `
  .loading {
    text-align: center;
    color: #666;
    font-style: italic;
    padding: 2rem;
  }
  
  .error {
    text-align: center;
    color: #d32f2f;
    padding: 2rem;
    background: #ffebee;
    border-radius: 4px;
  }
  
  .no-results {
    text-align: center;
    color: #666;
    padding: 2rem;
  }
  
  .tags {
    margin: 0.5rem 0;
    font-size: 0.9rem;
    color: #555;
  }
  
  .ano-criacao {
    color: #1976d2;
    font-weight: bold;
  }
  
  .descricao {
    margin: 0.5rem 0;
    line-height: 1.4;
  }
  
  .saiba-mais {
    display: inline-block;
    margin-top: 0.5rem;
    color: #1976d2;
    text-decoration: none;
    font-weight: bold;
  }
  
  .saiba-mais:hover {
    text-decoration: underline;
  }
`;
document.head.appendChild(style);