const { json } = require("express");

let btnGasto = document.getElementById('btnAddGasto');
const div = document.getElementById('containerGastos');
const formulario = document.getElementById('gastoForm')


function criarLabelEInput() {
    
    const label = document.createElement('label');
    label.textContent =   'Tipo Do Gasto';

    
    const input = document.createElement('input');
    input.setAttribute('name', 'tipoGasto');

    const label2 = document.createElement('label');
    label2.textContent =   'valor Do Gasto';

    
    const input2 = document.createElement('input');
    input2.setAttribute('name', 'valorDoGasto');


    return { label, input , label2 , input2 };
}

btnGasto.addEventListener('click', () => {
   
    const { label: tipoLabel, input: tipoInput } = criarLabelEInput();
    const br1 = document.createElement('br');

    const { label2: valorLabel2, input2: valorInput2 } = criarLabelEInput();
    const br2 = document.createElement('br');


    div.append(br1, tipoLabel, tipoInput, br2, valorLabel2, valorInput2);
});




formulario.addEventListener('submit', (ev)=>{
        ev.preventDefault()
        nome = document.getElementById('nome').value
        salario = document.getElementById("salario").value
        mes = document.getElementById('mes').value

        nome_do_gasto = document.querySelectorAll("input[name='tipoGasto']")
        valor_do_gasto = document.querySelectorAll("input[name='valorDoGasto']")

       
      
        json = []

        for (let i = 0; i < nome_do_gasto.length; i++) {
            const gasto = nome_do_gasto[i].value;
            const valorGasto = parseFloat(valor_do_gasto[i].value); // Convertendo para número
    
            json.push({ tipoGasto: gasto, valor: valorGasto });
        }

        console.log(json)



})