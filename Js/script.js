let dados = [];

async function iniciarBusca() {
    let resposta = await fetch('Js/data.json');
    dados = await resposta.json();
    console.log(dados);
}