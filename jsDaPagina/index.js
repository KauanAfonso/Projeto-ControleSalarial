// const create = require('./create')


const btnGasto = document.getElementById('btnAddGasto');
const div = document.getElementById('containerGastos');
const formulario = document.getElementById('gastoForm')


function criarLabelEInput() {
    
    const label = document.createElement('label');
    label.textContent =   'Tipo Do Gasto';

    
    const input = document.createElement('input');
    input.setAttribute('name', 'tipoGasto');

    return { label, input };
}

btnGasto.addEventListener('click', () => {
   
    const { label: tipoLabel, input: tipoInput } = criarLabelEInput();
    const br1 = document.createElement('br');

    const { label: valorLabel, input: valorInput } = criarLabelEInput();
    const br2 = document.createElement('br');


    div.append(br1, tipoLabel, tipoInput, br2, valorLabel, valorInput);
});




formulario.addEventListener('submit', (ev)=>{
        ev.preventDefault()
        nome = document.getElementById('nome').value
        salario = document.getElementById("salario").value

        nome_do_gasto = document.querySelectorAll("input'name[tipoGasto]'")
        valor_do_gasto = document.querySelectorAll("input'name[valorDoGasto]'")

        lista_gastos = []

        //For para iterar a quantidade da informações sobre gastos e adiciona em uma lista de objetivos
        for (let i = 0; i < nome_do_gasto; i++) {
            let gasto = nome_do_gasto[i].value;
            let valorGasto = parseFloat(valor_do_gasto[i]).value
            lista.push({gasto, valorGasto})
            
        }

        mes = document.getElementById('mes').value



        alert(salario)
})