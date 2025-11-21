let cardContainer = document.querySelector('.card-container');
let dados = [];

async function iniciarBusca() {
    let resposta = await fetch('Js/data.json');
    dados = await resposta.json();
    renderizarCards(dados);
}

function renderizarCards(dados) {
    for (let dado of dados) {
        let article = document.createElement('article');
        article.classList.add('card');
        article.innerHTML = `<h2>${dado.name}</h2>
                <p>${dado.ano}</p>
                <p>${dado.descricao}.</p>
                <a href="${dado.link}"_blank">Saiba mais</a>`
        cardContainer.appendChild(article);
    }
}
