// Função para criar o objeto pessoa
const criar_conta = (nome, email, senha) => {
    return {
        pessoa: {
            nome: nome,
            email: email,
            senha: senha
        }
    };
};

// Obtenha o formulário
const form = document.getElementById('criar_conta');

// Adicione o evento de submissão do formulário
form.addEventListener('submit', (ev) => {
    ev.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    // Crie o objeto pessoa
    const enviar = criar_conta(nome, email, senha);

    // Log do objeto a ser enviado
    console.log("Enviando:", JSON.stringify(enviar)); // Para ver o que está sendo enviado

    // Enviando para a API
        fetch('http://localhost:3001/criar_usuario', {
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(enviar) // Convertendo o objeto para JSON
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na rede: ' + response.statusText);
                 alert("Usuario já cadastado !")
            }
            return response.text();
        })
        .then(data => {
            console.log(data); // Resposta da API
            // Aqui você pode adicionar alguma ação após a criação do usuário, como redirecionar ou mostrar uma mensagem.
    
          alert('Usuário criado com sucesso !!')
          window.location.href = '../pages/login.html'
        })
        .catch(err => console.error(err));
    


});
