async function carregarDados() {
  // Suponha que o ID da pessoa seja 1 (ou passe o ID conforme necessário)
  const idPessoa = 1;
  
  try {
      const response = await fetch(`http://localhost:3001/Visualizar/${idPessoa}`);
      
      // Verificar se a resposta foi bem-sucedida (status 200)
      if (!response.ok) {
          throw new Error(`Erro na API: ${response.statusText}`);
      }

      const data = await response.json();
      
      const saudacao = document.getElementById("saudacao");
      saudacao.innerHTML = `<h2>Olá, ${data.pessoa}!</h2>`;
      
      const espaco = document.getElementById("espaco");
      espaco.innerHTML = '';  // Limpar os dados anteriores
      
      data.meses.forEach(mesObj => {
          const mesCard = document.createElement('div');
          mesCard.classList.add('card');
          
          const mesDiv = document.createElement('div');
          mesDiv.classList.add('mes');
          mesDiv.textContent = mesObj.mes;
          
          const salarioDiv = document.createElement('div');
          salarioDiv.classList.add('salario');
          salarioDiv.textContent = `Salário: R$ ${mesObj.salario}`;
          
          const canvas = document.createElement('canvas');
          mesCard.appendChild(mesDiv);
          mesCard.appendChild(salarioDiv);
          mesCard.appendChild(canvas);
          
          espaco.appendChild(mesCard);
          
          // Preparar os dados para o gráfico
          const gastos = mesObj.gastos;
          const labels = gastos.map(gasto => gasto.tipoGasto);
          const valores = gastos.map(gasto => gasto.valorDoGasto);
          
          // Adiciona o gráfico de pizza usando o Chart.js
          new Chart(canvas, {
              type: 'pie',
              data: {
                  labels: labels,
                  datasets: [{
                      label: 'Gastos',
                      data: valores,
                      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#78948'],
                      borderColor: '#fff',
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
                                  const gasto = tooltipItem.raw;
                                  return `R$ ${gasto.toFixed(2)} (${((gasto / mesObj.salario) * 100).toFixed(2)}%)`;
                              }
                          }
                      }
                  }
              }
          });
      });
      
  } catch (error) {
      console.error('Erro ao carregar os dados:', error);
  }
}

// Carregar os dados quando a página for carregada
window.onload = carregarDados;
