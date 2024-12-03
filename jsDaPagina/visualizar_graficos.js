const getId = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('id');
  return userId;
};

const id_usuario = getId();
const espaco = document.getElementById("espaco");

fetch(`http://localhost:3001/Visualizar/${id_usuario}`, {
  method: 'GET',
  headers: {
      'Content-Type': 'application/json',
  },
})
  .then(response => response.json())
  .then(data => {
      console.log(data); // Depuração dos dados recebidos
      
      // Atualizando a saudação
      if (data.pessoa) {
          document.getElementById('saudacao').innerHTML = `<h2>Seja bem-vindo, ${data.pessoa}</h2>`;
      } else {
          document.getElementById('saudacao').innerHTML = `<h2>Usuário não encontrado</h2>`;
      }

      // Verifica se existem meses com dados
      if (data.meses && data.meses.length > 0) {
          data.meses.forEach(element => {
              console.log(element);

              // Criando o card para o mês
              espaco.innerHTML += `
              <div class="card">
                  <div class="mes">Mês: ${element.mes}</div>
                  <div class="salario">Salário: R$ ${element.salario.toFixed(2)}</div>
                  <div>
                      <canvas class="myChart"></canvas>
                      <div><button class='btn_excluir'>Excluir</button></div>
                  </div>
              </div>
              `;

              // Preparando os dados para o gráfico
              const lista_tipo_gasto = [];
              const lista_valor_gasto = [];

              element.gastos.forEach(gasto => {
                  lista_tipo_gasto.push(gasto.tipoGasto);
                  lista_valor_gasto.push(gasto.valorDoGasto);
              });

              // Seleciona o último canvas inserido
              const ctx = espaco.querySelectorAll('.myChart');
              const currentChart = ctx[ctx.length - 1];

              // Criando o gráfico de pizza
              if (lista_tipo_gasto.length > 0) {
                  new Chart(currentChart, {
                      type: 'pie',
                      data: {
                          labels: lista_tipo_gasto,
                          datasets: [{
                              label: 'Gastos',
                              data: lista_valor_gasto,
                              borderWidth: 1,
                              backgroundColor: [
                                  'rgba(255, 99, 132, 0.2)',
                                  'rgba(54, 162, 235, 0.2)',
                                  'rgba(255, 206, 86, 0.2)',
                                  'rgba(75, 192, 192, 0.2)',
                                  'rgba(153, 102, 255, 0.2)',
                                  'rgba(255, 159, 64, 0.2)'
                              ],
                              borderColor: [
                                  'rgba(255, 99, 132, 1)',
                                  'rgba(54, 162, 235, 1)',
                                  'rgba(255, 206, 86, 1)',
                                  'rgba(75, 192, 192, 1)',
                                  'rgba(153, 102, 255, 1)',
                                  'rgba(255, 159, 64, 1)'
                              ]
                          }]
                      },
                      options: {
                          plugins: {
                              legend: {
                                  position: 'top',
                              },
                              title: {
                                  display: true,
                                  text: 'Gastos Mensais'
                              }
                          }
                      }
                  });
              } else {
                  currentChart.parentElement.innerHTML += '<p>Sem gastos registrados para este mês</p>';
              }
          });
      } else {
          espaco.innerHTML = `<p>Sem dados para exibir</p>`;
      }
  })
  .catch(error => {
      console.error('Erro:', error);
      espaco.innerHTML = `<p>Erro ao carregar os dados. Tente novamente mais tarde.</p>`;
  });






// Selecionando o botão com a classe "btn_excluir"
function deletarPessoa(idPessoa) {
  fetch(`/Deletar/${idPessoa}`, {
      method: 'DELETE'
  })
  .then(response => {
      if (response.ok) {
          alert('Dados excluídos com sucesso');
          // Atualizar ou redirecionar página, se necessário
      } else {
          alert('Erro ao excluir dados');
      }
  })
  .catch(err => {
      console.error(err);
      alert('Erro ao comunicar com o servidor');
  });
}

// Selecionar todos os botões com a classe "btn_excluir"
let btns_excluir = document.querySelectorAll(".btn_excluir");

btns_excluir.forEach(btn => {
  btn.addEventListener('click', function() {
      const idPessoa = this.dataset.idPessoa; // Pegar o ID do atributo data-id-pessoa
      if (idPessoa) {
          deletarPessoa(idPessoa);
      } else {
          alert('ID da pessoa não encontrado.');
      }
  });
});


