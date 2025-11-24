const gameSpace = document.querySelector('.game-space');
const difficultBlock = document.querySelector('.difficult-block');
const startScreen = document.querySelector('.start-screen');
const background = document.querySelector('.background');
const flipPhone = document.querySelector('.flip-phone');
const imgMass = ["taylor_1.png","taylor_2.png","taylor_3.png","taylor_4.png","taylor_5.png","taylor_6.png","taylor_7.png","taylor_8.png","taylor_9.png","taylor_10.png"];
const difficult = {
    easy: ['game-space-easy', 6, 1500],
    mid: ['game-space-mid', 12, 2500],
    hard: ['game-space-hard', 20, 4500]
}
const difficultButtons = document.querySelector('.difficult-buttons');
const victoryScreen = document.querySelector('.victory-screen');
const playAgain = document.querySelector('.play-again-button');

let gameImgMass = [];

// Função de transição para a próxima tela
function aminationItem (hideItem, openItem) {
    openItem.style.opacity = 1;
    hideItem.style.opacity = 0;
    setTimeout(function () {
        openItem.style.top = 0;
        hideItem.style.top = 100 + '%';
    }, 500);
}

// Mensagem intermitente na tela inicial
setInterval(function(){
    document.querySelector('.start-screen-message').style.opacity = 1 - document.querySelector('.start-screen-message').style.opacity;
},750);

// Início do jogo a partir da tela inicial
startScreen.addEventListener('click', function () {    
    // Seletor de nível de dificuldade
    difficultButtons.addEventListener('click', clickDiffcult);
    aminationItem (startScreen, difficultBlock);
}) 

// Construção da estrutura da grade do jogo e inserção dos elementos visuais e interativos
let difficultValue = '';
function chooseMode (lvl) {
    // Valor atribuído à variável dos níveis de dificuldade
    difficultValue = difficult[lvl];
    // Slicing do array referente
    for (let i = 0; i < difficultValue[1]/2; i++){
        gameImgMass.push(imgMass[i]);
    }
    gameImgMass = gameImgMass.concat(gameImgMass);
    shuffle(gameImgMass);
    // Criação da grade do jogo
    gameSpace.classList.add(difficultValue[0]);
    // Geração de grids de jogo
    for (let i = 1; i <= difficultValue[1]; i++) {
        let gameItem = document.createElement("div");
        gameItem.className = 'game-item';
        gameItem.id = i;
        gameItem.dataset.status = 'disabled';
        gameSpace.append(gameItem);
    }
    difficultButtons.removeEventListener('click', clickDiffcult);
    fullGameSpace();
}

// Randomização da ordem das imagens a serem utilizadas nos cards
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Carregando as imagens nos cards do jogo e iniciando a partida
function fullGameSpace () {
    let img = '';
    let imgCover = '';
    for (let i = 0; i < gameImgMass.length; i++) {
        // Criação dos cards com as imagens carregadas
        img = document.createElement("IMG");
        img.src = gameImgMass[i];
        img.classList = 'back-img';
        img.style.transform = 'rotateY(360deg)';
        gameSpace.children[i].append(img);
        // Renderização das imagens
        setTimeout(function () {
            imgCover = document.createElement("IMG");
            imgCover.src = './trumb.png';
            imgCover.classList = 'front-img';
            imgCover.style.transform = 'rotateY(180deg)';
            gameSpace.children[i].append(imgCover);
        }, 0)
    }
    // Flip horizontal dos cards para iniciarem virados para trás
    setTimeout(function () {
        for (let i = 0; i < gameImgMass.length; i++) {
            gameSpace.children[i].lastChild.style.transform = 'rotateY(0deg)';
            gameSpace.children[i].firstChild.style.transform = 'rotateY(180deg)';
        }
    }, difficultValue[2]);
    aminationItem (difficultBlock, gameSpace);
    // Listener dos cards
    gameSpace.addEventListener('click', clickElem);
}

// Event listener que aguardará o jogador selecionar os cards
function clickDiffcult(event) {
    let target = event.target;
    if (target.tagName != 'BUTTON') return;
    chooseMode (target.dataset.lvlOfDifficult);
}

// Função para interação do usuário com os elementos do jogo
let count = 0;
function clickElem(event) {
    let target = event.target;
    if (target.tagName != 'IMG' || target.parentElement.dataset.status == 'done') return;
    // Desvirar cards selecionados
    if (target.parentElement.dataset.status !== 'active' && count < 2) {
        target.parentElement.lastChild.style.transform = "rotateY(180deg)";
        target.parentElement.firstChild.style.transform = "rotateY(360deg)";
        // Manter cards desvirados na jogada do turno atual
        target.parentElement.dataset.status = 'active';
        // Verifica e conta a quantidade de cards desvirados na lista (array)
        count++;
    }
    // Verificar a correspondência das imagens quando dois cards estiverem desviradas no turno atual.
    if (count == 2) {
        checkElem ();
    }
}

// Contador de cards corretamente desvirados
let winCount = 0;
// Verificação de correspondência da imagem dos cards selecionados
function checkElem () {
    let checkMass = [];
    // Remoção do event listener durante a execução da função
    gameSpace.removeEventListener('click', clickElem);
    // Inserção dos cards ativos num vetor
    for (let elem of document.querySelector('.game-space').children) {
        if (elem.dataset.status == 'active') {
            checkMass.push(elem.firstChild);
        }
    }
    // Verifica se os cards são iguais
    if (checkMass[0].src == checkMass[1].src) {
        // Se sim, o status dos cards são definidos como "concluídos"
        checkMass[0].parentElement.dataset.status = 'done';
        checkMass[1].parentElement.dataset.status = 'done';
        // A cada iteração do loop, adicionamos a quantidade de cards encontrados ao contador de itens processados
        winCount = winCount + 2;
        /* Aqui reiniciamos o contador definindo a variável em zero,
        o vetor de cards retorna ao seu estado original e retornamos
        o listener aos cards. */
        count = 0;
        checkMass = [];
        gameSpace.addEventListener('click', clickElem);
    } else {
        // Senão, o card será ocultado e voltará a ser exibido após um tempo pré-definido. 
        setTimeout(function () {
        checkMass[0].style.transform = "rotateY(180deg)";
        checkMass[0].nextSibling.style.transform = "rotateY(0deg)";
        checkMass[0].parentElement.dataset.status = 'disabled';
        checkMass[1].style.transform = "rotateY(180deg)";
        checkMass[1].nextSibling.style.transform = "rotateY(0deg)";
        checkMass[1].parentElement.dataset.status = 'disabled';
        /* Aqui reiniciamos o contador definindo a variável em zero,
        o vetor de cards retorna ao seu estado original e retornamos
        o listener aos cards. */
        count = 0;
        checkMass = [];
        gameSpace.addEventListener('click', clickElem);
        }, 1100);
    }
    // Verifica se todos os cards foram virados
    if (winCount == gameImgMass.length) {
        console.log('you win!');
        winCount = 0;
        setTimeout(function () {
            congrats();
        }, 2000);
    }
}

// A função victoryScreen() inicia a tela de vitória e exibe o botão 'Jogar Novamente'
function congrats () {
    aminationItem (gameSpace, victoryScreen);
    // Ao final de cada jogo, o botão "Jogar Novamente" é exibido
    victoryScreen.children[2].style.display = 'flex';
    setTimeout(function () {
        victoryScreen.children[2].style.opacity = 1;
        playAgain.addEventListener('click', toStart);
    }, 2000);
}

// Função para iniciar um novo jogo
function toStart() {
    // Reiniciar os cards (jogar novamente)
    gameSpace.innerHTML = '';
    gameSpace.classList = 'game-space';
    gameImgMass = [];
    playAgain.removeEventListener('click', toStart);
    // Mostrar a tela de escolha de dificuldade
    difficultButtons.addEventListener('click', clickDiffcult);
    setTimeout(function () {
        victoryScreen.children[2].style.display = 'none';
        victoryScreen.children[2].style.opacity = 0;
    }, 500);
    aminationItem (victoryScreen, difficultBlock);
}

// Funcionalidade de seleção de modo de exibição do jogo
function chooseVersionOfGame (event) {
    let screenHeight = 0;
    let screenWidth = 0;
    // Registro da altura e largura corretas da tela em dispositivos portáteis
    if (event) {
        screenHeight = event.target.innerHeight;
        screenWidth = event.target.innerWidth;
    } else {
        screenHeight = window.outerHeight;
        screenWidth = window.outerWidth;
    }

    if(window.screen.width <= 1200){
        // Versão Móvel
        background.firstElementChild.hidden = true;
        background.lastElementChild.hidden = false;
        difficultButtons.lastElementChild.disabled = true;
        //Ativar a detecção de orientação da tela
        flipDevice(screenHeight, screenWidth);
    } else {
        // Versão para Desktop
        background.firstElementChild.hidden = false;
        background.lastElementChild.hidden = true;
        difficultButtons.lastElementChild.disabled = false;
    }
}
chooseVersionOfGame ();
// Detecção do redimensionamento da janela do navegador
window.addEventListener('resize', chooseVersionOfGame);

// Detecção da orientação da tela
function flipDevice(mobileScreenHeight, mobileScreenWidth) {
    mobileScreenHeight > mobileScreenWidth ?
    flipPhone.style.display = 'flex' :
    flipPhone.style.display = 'none';
}