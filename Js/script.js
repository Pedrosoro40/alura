let cardContainer = document.querySelector('.card-container');
let searchInput = document.querySelector('campoBusca'); // Adicionado para a busca
let dados = [];

async function iniciarBusca() {
    try {
        let resposta = await fetch('Js/data.json');
        dados = await resposta.json();
        renderizarCards(dados);
    } catch (error) {
        console.error("Falha ao buscar ou processar os dados:", error);
    }
}

function renderizarCards(dados) {
    cardContainer.innerHTML = ''; // Limpa o container antes de renderizar
    for (let dado of dados) {
        let article = document.createElement('article');
        article.classList.add("card");
        // Corrigido: usando 'nome' e 'ano_criacao' do JSON e a sintaxe do link
        article.innerHTML = `<h2>${dado.nome}</h2>
                <p>Ano de criação: ${dado.ano_criacao}</p>
                <p>${dado.descricao}.</p>
                <a href="${dado.link}" target="_blank">Saiba mais</a>`
        cardContainer.appendChild(article);
    }
}

function filtrarDados() {
    const termoBusca = campoBusca.value.toLowerCase();
    const dadosFiltrados = dados.filter(dado => {
        return dado.nome.toLowerCase().includes(termoBusca) ||
               dado.descricao.toLowerCase().includes(termoBusca);
    });
    renderizarCards(dadosFiltrados);
}

// Adiciona o evento de 'input' para buscar em tempo real
searchInput.addEventListener('input', filtrarDados);

iniciarBusca(); // Inicia o carregamento dos dados ao carregar a página
