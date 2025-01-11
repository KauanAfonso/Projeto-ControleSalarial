let btnGasto = document.getElementById('btnAddGasto');
const div = document.getElementById('containerGastos');
const formulario = document.getElementById('gastoForm');

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');

if (!userId || isNaN(userId)) {
    alert('ID do usuário inválido. Redirecionando para a página de login.');
    window.location.href = "../pages/login.html";
}

// Verifique o valor do ID no console
console.log("ID do usuário:", userId);

function criarLabelEInput() {
    const label = document.createElement('label');
    label.textContent = 'Tipo do Gasto';
    const input = document.createElement('input');
    input.setAttribute('name', 'tipoGasto');
    input.setAttribute('required', 'true');

    const label2 = document.createElement('label');
    label2.textContent = 'Valor do Gasto';
    const input2 = document.createElement('input');
    input2.setAttribute('name', 'valorDoGasto');
    input2.setAttribute('type', 'number');
    input2.setAttribute('required', 'true');

    return { label, input, label2, input2 };
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

    const nome = document.getElementById('nome').value.trim();
    const salario = parseFloat(document.getElementById('salario').value);
    const mes_selector = document.getElementById('mes')
    const mes = document.getElementById('mes').value.trim();

    for (let i = 0; i < mes_selector.options.length; i++) {
        const mes_selecionado = mes_selector.options[i];

        if (mes_selecionado.value == mes){
            mes_selector.remove(i)
            break
        }
        
    }
y
    if (!nome || isNaN(salario) || !mes) {
        alert("Por favor, preencha todos os campos obrigatórios.");
        return;
    }

    // Coleta os gastos
    const nome_do_gasto = document.querySelectorAll("input[name='tipoGasto']");
    const valor_do_gasto = document.querySelectorAll("input[name='valorDoGasto']");

    let gastos = [];
    for (let i = 0; i < nome_do_gasto.length; i++) {
        const tipoGasto = nome_do_gasto[i].value.trim();
        const valorDoGasto = parseFloat(valor_do_gasto[i].value);

        if (!tipoGasto || isNaN(valorDoGasto)) {
            alert("Por favor, preencha corretamente os campos de gastos.");
            return;
        }

        gastos.push({ tipoGasto, valorDoGasto });
    }

    // Organiza o objeto a ser enviado ao backend
    const dataToSend = {
        salario,
        mes,
        gastos,
        idPessoa: userId
    };

    console.log("Dados enviados para o backend:", dataToSend);

    // Envia a requisição para o backend
    fetch('http://localhost:3001/criar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na requisição');
            }
            return response.json();
        })
        .then(data => {
            console.log('Resposta do servidor:', data);
            alert("Dados salvos com sucesso!");
            window.location.href = `../pages/visuallizar_graficos.html?id=${userId}`;
        })
        .catch((err) => {
            console.error('Erro:', err);
            alert("Ocorreu um erro ao salvar os dados. Tente novamente mais tarde.");
        });
});
