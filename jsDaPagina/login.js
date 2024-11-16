const login = (email, senha) => {
    return {
        pessoa: {
            email: email,
            senha: senha
        }
    };
};

const loginBtn = document.getElementById('loginForm');

loginBtn.addEventListener('submit', (ev) => {
    ev.preventDefault();

    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    const enviar = login(email, senha);

    console.log("Enviando:", JSON.stringify(enviar)); // Para ver o que está sendo enviado

    fetch('http://localhost:3001/logar', {
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        body: JSON.stringify(enviar)
    })
    .then(response => {
        if (!response.ok) {
            alert("Login incorreto!");
            throw new Error('Erro na rede: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
            window.location.href = `../index.html?id=${data.id}`;  // Redireciona no frontend com id na URL
    })
    .catch((err) => console.log(err));
});
