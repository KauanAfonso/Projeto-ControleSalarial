const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('id');

fetch(`http://localhost:3001/Visualizar/${userId}`)
.then(response => response.json())
.then(data => {
    const container = document.getElementById('espaco');
    container.innerHTML = ''; // Limpar conteúdo anterior
    console.log(data);

    // Renderizar o nome da pessoa
    const pessoaTitle = document.createElement('h2');
    pessoaTitle.textContent = `Gastos de ${data.pessoa}`;
    container.appendChild(pessoaTitle);

    // Renderizar os meses e gráficos
    data.meses.forEach(mes => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.id = mes.idInfoFinancas;
        
        const mesDiv = document.createElement('div');
        mesDiv.classList.add('mes');
        mesDiv.textContent = `${mes.mes} - Salário: R$${mes.salario}`;
        
        let button = document.createElement('button');
        button.textContent = 'Excluir';
        button.classList.add('bnt_excluir');
        button.id = mes.idInfoFinancas;

        // Adicionar evento diretamente ao botão
        button.addEventListener('click', () => {
            fetch(`http://localhost:3001/delete_tudo/${button.id}`, {
                method: 'DELETE'  // Use o método DELETE
            })
            .then(response => response.json())
            .then(data => {
                alert('Excluído com sucesso');
                card.remove();  // Remove o card do DOM após excluir
            })
            .catch(err => {
                console.log('Erro: ', err);
            });
        });

        card.appendChild(mesDiv);
        card.appendChild(button);

        // Adicionar o gráfico de pizza
        const canvas = document.createElement('canvas');
        card.appendChild(canvas);

        // Preparar os dados para o gráfico de pizza
        const labels = mes.gastos.map(gasto => gasto.tipoGasto);
        const valores = mes.gastos.map(gasto => gasto.valorDoGasto);

        // Calcular as porcentagens dos gastos em relação ao salário
        const porcentagens = valores.map(valor => ((valor / mes.salario) * 100).toFixed(2));

        // Gerar o gráfico de pizza para cada mês
        new Chart(canvas, {
            type: 'pie',
            data: {
                labels: labels.length > 0 ? labels : ['Sem gastos'],
                datasets: [{
                    label: 'Gastos (%)',
                    data: valores.length > 0 ? porcentagens : [100],
                    backgroundColor: valores.length > 0 ? [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)',
                        'rgba(255, 159, 64, 0.2)'
                    ] : ['rgba(201, 201, 201, 0.2)'],
                    borderColor: valores.length > 0 ? [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)',
                        'rgba(255, 159, 64, 1)'
                    ] : ['rgba(201, 201, 201, 1)'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(tooltipItem) {
                                return `${tooltipItem.label}: ${tooltipItem.raw}%`;
                            }
                        }
                    }
                }
            }
        });

        // Adicionar o card ao container
        container.appendChild(card);
    });

})
.catch(err => {
    console.error('Erro ao buscar os dados:', err);
});


let btn_voltar = document.createElement('button')
btn_voltar.textContent = "Voltar"
btn_voltar.addEventListener("click", () =>{
    location.href = `../index.html?id=${userId}`
})
document.body.appendChild(btn_voltar)