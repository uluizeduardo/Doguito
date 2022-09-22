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
        valueMissing: "O campo nome não pode estar vazio"
    },
    email: {
        valueMissing: "O campo email não pode estar vazio",
        typeMismatch: "Este email não é válido"
    },
    senha: {
        valueMissing: "O campo senha não pode estar vazio",
        patternMismatch: "A senha deve conter ao menos um número, letras maiúsculas, minúnsculas, símbolos e no mínimo 9 caracteres"
    },
    dataNascimento: {
        valueMissing: "O campo de data nascimento não pode está vazio",
        customError: "Você precisa ser maior que 18 anos para se cadastrar."
    },
    cpf: {
        valueMissing: 'O campo cpf não pode estar vazio.',
        customError: 'O CPF digitado não é válido.'
    },
    cep: {
        valueMissing: 'O campo CEP não pode estar vazio.',
        patternMismatch: 'O CEP digitado não é válido.'
    }
}
const validadores = {
    dataNascimento:input => validaDataNascimento(input),
    cpf:input => validaCPF(input)
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

function validaCPF(input){
    const cpfFormatado = input.value.replace(/\D/g, '');   
    let mensagem = '';

    if(!checaCPFRepetido(cpfFormatado) || !checaEstruturaCPF(cpfFormatado)){
        mensagem = 'O CPF digitado não é válido.'
    }
    input.setCustomValidity(mensagem);
}

function checaCPFRepetido(cpf){
    const valoresRepetidos = [
        '00000000000',
        '11111111111',
        '22222222222',
        '33333333333',
        '44444444444',
        '55555555555',
        '66666666666',
        '77777777777',
        '88888888888',
        '99999999999'
    ]

    let cpfValido = true;

    valoresRepetidos.forEach(valor => {
        if(valor == cpf){
            cpfValido = false;
        }
    })

    return cpfValido;
}

function checaEstruturaCPF(cpf){
    const multiplicador = 10;

    return checaDigitoVerificador(cpf, multiplicador);

}

function checaDigitoVerificador(cpf, multiplicador){

    if(multiplicador >= 12){
        return true;
    }

    let multiplicadorInicial = multiplicador;
    let soma = 0;
    const cpfSemDigitos = cpf.substr(0, multiplicador - 1).split('');
    const digitoVerificador = cpf.charAt(multiplicador - 1);

    for (let contador = 0; multiplicadorInicial > 1; multiplicadorInicial--) {
        soma = soma + cpfSemDigitos[contador] * multiplicadorInicial
        contador++        
    }

    if(digitoVerificador == confirmaDigito(soma)){
        return checaDigitoVerificador(cpf, multiplicador + 1);
    }
    return false;
}

function confirmaDigito(soma){
    return 11 - (soma % 11);
}