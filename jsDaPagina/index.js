const btnGasto = document.getElementById('btnAddGasto')
const div = document.getElementById('containerGastos')

btnGasto.addEventListener('click' , ()=>{

    const label = document.createElement('label')
    label.textContent = 'Tipo Do Gasto:';

    const tipoDoGasto = document.createElement('input')
    tipoDoGasto.setAttribute('name' , 'tipoDoGasto')

    const br = document.createElement('br')

    const label2 = document.createElement('label')
    label2.textContent = 'Valor do gasto:';

    const valorDoGasto = document.createElement('input')
    valorDoGasto.setAttribute('name' , 'valorDoGasto')

    const br2 = document.createElement('br')

    div.append(br2, label,tipoDoGasto, br ,label2, valorDoGasto )

    

})