let btnGasto = document.getElementById('btnAddGasto');
const div = document.getElementById('containerGastos');
const formulario = document.getElementById('gastoForm')

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');


if (userId === undefined || isNaN(userId) || userId === null || userId === "") {
    window.location.href = "../pages/login.html"; // Usando '=' para atribuir o redirecionamento
}

// Verifique o valor do ID no console
console.log("ID do usuário:", userId);



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



formulario.addEventListener('submit', (ev) => {
    ev.preventDefault();
    
    const nome = document.getElementById('nome').value;
    const salario = document.getElementById("salario").value;
    const mes = document.getElementById('mes').value;

    // Coleta os gastos
    const nome_do_gasto = document.querySelectorAll("input[name='tipoGasto']");
    const valor_do_gasto = document.querySelectorAll("input[name='valorDoGasto']");

    let lista_gastos = [];
    lista_gastos.push({ Nome: nome, Salario: salario, Mes: mes });

    // Prepara os dados dos gastos
    let gastos = [];
    for (let i = 0; i < nome_do_gasto.length; i++) {
        const gasto = nome_do_gasto[i].value;
        const valorGasto = parseFloat(valor_do_gasto[i].value); // Convertendo para número

        // Adiciona cada gasto na lista de gastos
        gastos.push({ tipoGasto: gasto, valorDoGasto: valorGasto });
    }

    // Organiza o objeto a ser enviado ao backend
    const dataToSend = {
        salario: salario,
        mes: mes,
        gastos: gastos,
        idPessoa: userId// Assumindo que o ID da pessoa está disponível
    };

    console.log(dataToSend); // Verifique os dados antes de enviar para o backend

    // Envia a requisição para o backend
    fetch('http://localhost:3001/criar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Resposta do servidor:', data);
    })
    .catch((err) => console.log('Erro:', err));
});
