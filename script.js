let posicao = 0;

const container = document.getElementById("cardsContainer");

function atualizar() {
    const larguraCard = document.querySelector(".card").offsetWidth + 20;
    container.style.transform = `translateX(-${posicao * larguraCard}px)`;
}

function mover(direcao) {
    const total = document.querySelectorAll(".card").length;
    const larguraContainer = container.offsetWidth;
    const larguraCard = document.querySelector(".card").offsetWidth + 20;

    const visiveis = Math.floor(larguraContainer / larguraCard);

    posicao += direcao;

    if (posicao < 0) posicao = 0;
    if (posicao > total - visiveis) {
        posicao = total - visiveis;
    }

    atualizar();
}

/* FORMULÁRIO */
document.getElementById("formContato").addEventListener("submit", function(e) {
    e.preventDefault();

    document.getElementById("mensagemSucesso").style.display = "block";
    this.reset();
});