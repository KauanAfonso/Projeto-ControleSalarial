const {createData} = require('./create')


const btnGasto = document.getElementById('btnAddGasto');
const div = document.getElementById('containerGastos');

// Função para criar uma label e um input
function criarLabelEInput(labelText, inputName) {
    // Cria a label
    const label = document.createElement('label');
    label.textContent = labelText;

    // Cria o input
    const input = document.createElement('input');
    input.setAttribute('name', inputName);

    return { label, input };
}

// Evento de clique para adicionar gastos
btnGasto.addEventListener('click', () => {
    // Cria o campo para Tipo do Gasto
    const { label: tipoLabel, input: tipoInput } = criarLabelEInput('Tipo Do Gasto:', 'tipoDoGasto');
    const br1 = document.createElement('br');

    // Cria o campo para Valor do Gasto
    const { label: valorLabel, input: valorInput } = criarLabelEInput('Valor do Gasto:', 'valorDoGasto');
    const br2 = document.createElement('br');

    // Adiciona todos os elementos ao container
    div.append(br1, tipoLabel, tipoInput, br2, valorLabel, valorInput);
});
