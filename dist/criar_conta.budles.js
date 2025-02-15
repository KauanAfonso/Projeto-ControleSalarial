/*! For license information please see criar_conta.budles.js.LICENSE.txt */
(()=>{var __webpack_modules__={"./src/criar_conta.js":()=>{eval("// Função para criar o objeto pessoa\r\nconst criar_conta = (nome, email, senha) => {\r\n    return {\r\n        pessoa: {\r\n            nome: nome,\r\n            email: email,\r\n            senha: senha\r\n        }\r\n    };\r\n};\r\n\r\n// Obtenha o formulário\r\nconst form = document.getElementById('criar_conta');\r\n\r\n// Adicione o evento de submissão do formulário\r\nform.addEventListener('submit', (ev) => {\r\n    ev.preventDefault();\r\n\r\n    const nome = document.getElementById('nome').value;\r\n    const email = document.getElementById('email').value;\r\n    const senha = document.getElementById('senha').value;\r\n\r\n    // Crie o objeto pessoa\r\n    const enviar = criar_conta(nome, email, senha);\r\n\r\n    // Log do objeto a ser enviado\r\n    console.log(\"Enviando:\", JSON.stringify(enviar)); // Para ver o que está sendo enviado\r\n\r\n    // Enviando para a API\r\n        fetch('http://localhost:3001/criar_usuario', {\r\n            method: 'POST',\r\n            headers: {\r\n                'Content-Type': \"application/json\"\r\n            },\r\n            body: JSON.stringify(enviar) // Convertendo o objeto para JSON\r\n        })\r\n        .then(response => {\r\n            if (!response.ok) {\r\n                throw new Error('Erro na rede: ' + response.statusText);\r\n            }\r\n            return response.text();\r\n        })\r\n        .then(data => {\r\n            console.log(data); // Resposta da API\r\n            // Aqui você pode adicionar alguma ação após a criação do usuário, como redirecionar ou mostrar uma mensagem.\r\n    \r\n          alert('Usuário criado com sucesso !!')\r\n          window.location.href = '../pages/login.html'\r\n        })\r\n        .catch(err => console.error(err));\r\n    \r\n\r\n\r\n});\r\n\n\n//# sourceURL=webpack:///./src/criar_conta.js?")}},__webpack_exports__={};__webpack_modules__["./src/criar_conta.js"]()})();