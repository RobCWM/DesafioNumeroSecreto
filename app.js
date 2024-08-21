let numeroAleatorio = Math.floor(Math.random() * 100) + 1;
let tentativas = 0;
let animacaoEmAndamento = false;
let intervalId; 

const inputEntrada = document.getElementById('entrada');
const botao = document.getElementById('botao');
const novoJogo = document.getElementById('novoJogo');
const tentativasDisplay = document.getElementById('tentativas');
const resultadotexto = document.getElementById('resultadotexto');
const consegueaAdvinhar = document.getElementById('consegueAdvinhar');
const tituloJogo = document.getElementById('tituloMudanca');
const textoPensamento = 'Consegue advinhar o número que estou pensando?';
const fotoDela = document.getElementById('iaMulher');
let index = 0;
const velocidade = 10;
const boasVindas = 'Desafio do número Secreto, Consegue advinhar o número que estou pensando?';

function iniciarFala() {
    responsiveVoice.speak(boasVindas, 'Brazilian Portuguese Female', {rate: 1.2});
}

function digitar() {
    animacaoEmAndamento = true;
    intervalId = setInterval(() => {
        if (index < textoPensamento.length) {
            consegueaAdvinhar.textContent += textoPensamento.charAt(index);
            index++;
        } else {
            clearInterval(intervalId);
            animacaoEmAndamento = false;
        }
    }, velocidade);
}

function pararAnimacao() {
    clearInterval(intervalId); 
    animacaoEmAndamento = false; 
    consegueaAdvinhar.textContent = ''; 
    index = 0; 
}

function iaVoice(texto, callback) {
    const synth = window.speechSynthesis;
    const carregarVoices = () => {
        const voices = synth.getVoices();
        const vozFeminina = voices.find(voice => 
            voice.name.includes('Maria') && voice.lang === 'pt-BR');
        const vozFallback = voices.find(voice => voice.lang === 'pt-BR');
        const utterance = new SpeechSynthesisUtterance(texto);
        
        utterance.lang = 'pt-BR';
        utterance.voice = vozFeminina || vozFallback || voices[0];
        utterance.rate = 2;
        utterance.pitch = 2; 
        utterance.volume = 1; 

        synth.speak(utterance);

        if (callback) {
            utterance.onend = callback;
        }
    };

    if (synth.getVoices().length) {
        carregarVoices();
    } else {
        synth.onvoiceschanged = carregarVoices;
    }
}

window.onload = function() {

    window.speechSynthesis.onvoiceschanged = function() {
        iaVoice(boasVindas);
    }
    digitar();
    atualizarEstadoBotao1(true);
    atualizarEstadoBotao2(false);
    
    
    setTimeout(iniciarFala, 1000); 

    inputEntrada.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            verificarPalpite(); 
        }
    });
}

function verificarPalpite() {
    pararAnimacao(); 
    const entradaJogador = Number(inputEntrada.value);
    
    if (isNaN(entradaJogador) || entradaJogador < 1 || entradaJogador > 100) {
        const mensagemInvalida = 'Por favor, insira um número entre 1 e 10.';
        resultadotexto.textContent = mensagemInvalida;
        resultadotexto.style.color = 'white';
        resultadotexto.style.fontSize = '28px';
        iaVoice(mensagemInvalida); 
        return;
    }
    
    tentativas++;

    if (entradaJogador === numeroAleatorio) {
        
        fotoDela.src = 'imagens/cyborg_mulher_muitoFeliz.png';
        
        const mensagemVitoria = 'Parabéns! Você advinhou! Bom...você me venceu, que tal mais uma rodada?';
        tituloJogo.innerHTML = 'Parabéns! <br> Você advinhou!';
        resultadotexto.textContent = 'Bom... Você me venceu, que tal mais uma rodada?';
        resultadotexto.style.color = 'white'; 
        resultadotexto.style.fontSize = '28px';
        iaVoice(mensagemVitoria); 
        atualizarEstadoBotao1(false);
        atualizarEstadoBotao2(true);    

    } else if (entradaJogador > numeroAleatorio) {
        const mensagemMaior = 'O número que eu estou pensando é menor!';
        resultadotexto.textContent = mensagemMaior;
        resultadotexto.style.color = 'white';
        resultadotexto.style.fontSize = '28px';
        iaVoice(mensagemMaior);

    } else {
        const mensagemMenor = 'O número que eu estou pensando é maior!';
        resultadotexto.textContent = mensagemMenor;
        resultadotexto.style.color = 'white';
        resultadotexto.style.fontSize = '28px';
        iaVoice(mensagemMenor); 
    }

    inputEntrada.value = '';
    tentativasDisplay.textContent = `Seu número de tentativas: ${tentativas}`; 
}

function iniciarNovoJogo() {
    const mensagemNovoJogo = 'Tente me vencer novamente...Consegue advinhar o número que estou pensando desta vez?';
    iaVoice(mensagemNovoJogo);
    numeroAleatorio = Math.floor(Math.random() * 100) + 1;
    tentativas = 0;
    inputEntrada.value = '';
    tituloJogo.innerHTML = 'Desafio do <br> número<br>secreto';
    consegueaAdvinhar.style.marginBottom = '40px'; 
    index = 0;
    setTimeout(digitar, 200);
    resultadotexto.innerHTML = 'Escolha um número entre <span class="escolha__numero__cor">1</span> e <span class="escolha__numero__cor">100</span>';
    resultadotexto.style.fontSize = '25px';
    tentativasDisplay.textContent = '';
    fotoDela.src = 'imagens/cyborg_mulher_sorrindo2.png';
    atualizarEstadoBotao1(true);
    atualizarEstadoBotao2(false);
}

function atualizarEstadoBotao1(ativo) {
    if (ativo) {
        botao.classList.remove('desativado');
        botao.classList.add('ativo');
        botao.disabled = false;
    } else {
        botao.classList.remove('ativo');
        botao.classList.add('desativado');
        botao.disabled = true;
    }
}

function atualizarEstadoBotao2(ativo) {
    if (ativo) {
        novoJogo.classList.remove('desativado');
        novoJogo.classList.add('ativo');
        novoJogo.disabled = false;
    } else {
        novoJogo.classList.remove('ativo');
        novoJogo.classList.add('desativado');
        novoJogo.disabled = true;
    }
}

botao.addEventListener('click', verificarPalpite);
novoJogo.addEventListener('click', iniciarNovoJogo);
