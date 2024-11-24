const getId = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    return userId;
};

let espaco = document.getElementById("espaco")


const id_usuario = getId()

fetch(`http://localhost:3001/Visualizar/${id_usuario}`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
})
.then(response => response.json())
.then(data => {
    console.log(data); // Use os dados conforme necessário
    
    document.getElementById('saudacao').innerHTML = `<h2>Seja bem vindo ${data.pessoa}<\h2>`

    let lista_tipo_gasto = []
    let lista_valor_gasto = []
     
    data.meses.forEach(element => {
        console.log(element)

        espaco.innerHTML += `
        <div class="card">
            <div class="mes">${element.mes}</div>
            <div class="salario">${element.salario}</div>
            <div>
                <canvas id="myChart"></canvas>
            </div>
        </div>
        
        `
        let gastos = element.gastos

        gastos.forEach(gasto => {
            lista_tipo_gasto.push(gasto.tipoGasto)
            lista_valor_gasto.push(gasto.valorDoGasto)
        });

        const ctx = document.getElementById('myChart');
    
        new Chart(ctx, {
          type: 'pie',
          data: {
            labels: lista_tipo_gasto,
            datasets: [{
              label: '# of Votes',
              data: lista_valor_gasto,
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      

    });

    // console.log(lista_tipo_gasto)

   

})
.catch(error => console.error('Erro:', error));
