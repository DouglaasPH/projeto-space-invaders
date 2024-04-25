var grade = document.querySelector(".grade");
var resultado = document.querySelector(".resultado");
var largura = 15;
var posicaoDoAtirador = 202;
var alieniginasInvasores = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  15, 16, 17, 18, 19, 20, 21, 22, 23, 24,
  30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
];
var aliensRemovidos = [];
var aliensVaParaDireita = true;
var direcao = 1;
var movendoAliens;

for (let i = 0; i < largura * largura; i++) {
  let divNova = document.createElement("div");
  grade.appendChild(divNova);
  divNova.id = i;
}

var gradeFilhos = document.querySelectorAll(".grade div");
gradeFilhos[posicaoDoAtirador].classList.add("atirador");

function removerAliens() {
  for (let i = 0; i < alieniginasInvasores.length; i++) {
    if (aliensRemovidos.includes(alieniginasInvasores.indexOf(alieniginasInvasores[i]))) {
      gradeFilhos[alieniginasInvasores[i]].classList.remove("alien");
    } else
      gradeFilhos[alieniginasInvasores[i]].classList.remove("alien"); 
  }
}

function adicionarAliens() {
  for (let i = 0; i < alieniginasInvasores.length; i++) {
    if (!aliensRemovidos.includes(alieniginasInvasores.indexOf(alieniginasInvasores[i]))) {
      gradeFilhos[alieniginasInvasores[i]].classList.add("alien");
    } 
  }
}

function moverAliens() {
  let bordaEsquerda = alieniginasInvasores[0] % largura === 0;
  let bordaDireita = alieniginasInvasores[alieniginasInvasores.length - 1] % largura === largura - 1;
  removerAliens();
  vitoriaOuDerrotaMaisPlacar();

  if (aliensVaParaDireita && bordaDireita) {
     for (let i = 0; i < alieniginasInvasores.length; i++) {
       alieniginasInvasores[i] += largura + 1;
       direcao = -1;
       aliensVaParaDireita = false;
  } 
  }

  if (bordaEsquerda && !aliensVaParaDireita) {
    for (let i = 0; i < alieniginasInvasores.length; i++) {
    alieniginasInvasores[i] += largura - 1;
    direcao = 1;
    aliensVaParaDireita = true;      
    }
  }

  for (let i = 0; i < alieniginasInvasores.length; i++) {
    alieniginasInvasores[i] += direcao;
    
  }

  adicionarAliens();
}

movendoAliens = setInterval(() => {
  moverAliens();
}, 800);

function vitoriaOuDerrotaMaisPlacar() {
  resultado.innerHTML = aliensRemovidos.length;

  if (gradeFilhos[posicaoDoAtirador].classList.contains("alien")) {
    document.removeEventListener("keydown", moverAtiradorEmoverBala);
    alert("Você perdeu!");
    clearInterval(movendoAliens);
  } else if (aliensRemovidos.length === 30) {
    document.removeEventListener("keydown", moverAtiradorEmoverBala);
    alert("Parabéns, você ganhou!");
    clearInterval(movendoAliens);
  }
}

function moverAtiradorEmoverBala(event) {
  switch (event.key) {
    case "ArrowLeft":
      if (posicaoDoAtirador > 195) {
        gradeFilhos[posicaoDoAtirador].classList.remove("atirador");
        posicaoDoAtirador -= 1;
        gradeFilhos[posicaoDoAtirador].classList.add("atirador");
      } else return;
      break;
    
    case "ArrowRight":
      if (posicaoDoAtirador < 209) {
        gradeFilhos[posicaoDoAtirador].classList.remove("atirador");
        posicaoDoAtirador += 1;
        gradeFilhos[posicaoDoAtirador].classList.add("atirador");
      } else return;
      break;
    
    case "ArrowUp":
      let posicaoDaBala = posicaoDoAtirador - largura;
      let balaEmMovimento = setInterval(function () {
        if (posicaoDaBala + largura >= 0 && posicaoDaBala + largura <= 14) {
          setTimeout(() => {
            paradaDaBala();
            gradeFilhos[posicaoDaBala + largura].classList.remove("boom");
          }, 100);
        } else {
          gradeFilhos[posicaoDaBala].classList.add("boom");
          (function moverBala() {
            if (gradeFilhos[posicaoDaBala + largura].classList.contains("alien")) {
              gradeFilhos[posicaoDaBala + largura].classList.remove("alien");
              gradeFilhos[posicaoDaBala + largura].classList.remove("boom");                          
              balaNoAlien();
            } else if (gradeFilhos[posicaoDaBala + largura].classList.contains("boom")) {
              gradeFilhos[posicaoDaBala + largura].classList.remove("boom");
            } 
          })();
          posicaoDaBala = posicaoDaBala - largura;
        }
      }, 200);

      function paradaDaBala() {
        clearInterval(balaEmMovimento);
      }

      function balaNoAlien() {
        let matarAlien = setTimeout(() => {
          let indice = alieniginasInvasores.indexOf(posicaoDaBala + largura * 2);
          aliensRemovidos.push(indice);
          gradeFilhos[posicaoDaBala + largura].classList.remove("boom");
          paradaDaBala();
        }, 0);
      }
      break;

    default:
      break;
  }
}

document.addEventListener("keydown", moverAtiradorEmoverBala);