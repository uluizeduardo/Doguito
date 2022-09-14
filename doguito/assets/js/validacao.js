export function valida(input) {
    const tipoDeInput = input.dataset.tipo

    if(validadores[tipoDeInput]) {
        validadores[tipoDeInput](input)
    }

    if(input.validity.valid){
        input.parentElement.classList.remove('input-container--invalido');
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = '';
    }else{
        input.parentElement.classList.add('input-container--invalido');
        input.parentElement.querySelector('.input-mensagem-erro').innerHTML = mostraMensagemErro(tipoDeInput, input)
    }
}

const tiposDeErro = [
    'valueMissing',
    'patternMismatch',
    'typeMismatch',
    'customError'
]

const mensagemDeErro = {
    nome: {
        valueMissing: "O campo nome não pode está vazio"
    },
    email: {
        valueMissing: "O campo email não pode está vazio",
        typeMismatch: "Este email não é válido"
    },
    senha: {
        valueMissing: "O campo senha não pode está vazio",
        patternMismatch: "A senha deve conter ao menos um número, letras maiúsculas, minúnsculas, símbolos e no mínimo 9 caracteres"
    },
    dataNascimento: {
        valueMissing: "O campo de data nascimento não pode está vazio",
        customError: "Você precisa ser maior que 18 anos para se cadastrar."
    }
}
const validadores = {
    dataNascimento:input => validaDataNascimento(input)
}


function mostraMensagemErro (tipoDeInput, input){
    let mensagem = '';
    tiposDeErro.forEach(erro => {
       if(input.validity[erro]) {
         mensagem = mensagemDeErro[tipoDeInput][erro];
       }
    });

    return mensagem;
}

function validaDataNascimento(input){
    const dataRecebida = new Date(input.value);
    let mensagem = '';
    if(!maiorQue18(dataRecebida)){
        mensagem = 'Você precisa ser maior que 18 anos para se cadastrar.';
    }
    input.setCustomValidity(mensagem);
}

function maiorQue18(data){
    const dataAtual = new Date();
    const dataMaior18 = new Date(data.getUTCFullYear() + 18, data.getUTCMonth(), data.getUTCDate());
    return dataMaior18 <= dataAtual;
}