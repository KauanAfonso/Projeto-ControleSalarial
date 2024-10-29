const login = (email, senha) =>{
    return {
        login:{
            email:email,
            senha:senha
        }
    }
}


loginBtn = document.getElementById('loginForm')

loginBtn.addEventListener('submit' , (ev)=>{
        ev.preventDefault()

        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;

        const enviar = login(email,senha)

        fetch('http://localhost:3001/logar' , {
            method:'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(enviar)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na rede: ' + response.statusText);
            }
            return response.text();
        })
        .then((data) => console.log(data))
        .catch((err) => console.log(err))

})