const express = require('express');
const conn = require('./db');
const cors = require('cors');
const app = express();
const port = 3001;


app.use(cors());
app.use(express.json()); // Isso deve ser antes de definir as rotas




app.use(express.json());


app.post('/logar', (req, res) => {
    const { pessoa } = req.body;
    const { email, senha } = pessoa;

    const query = "SELECT id, email, senha FROM pessoas WHERE email = ?";

    conn.query(query, [email], (err, resultadoEmail) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (resultadoEmail.length === 0) {
            return res.status(401).send("Credenciais inválidas!");
        }

        const user = resultadoEmail[0];

        if (user.senha === senha) {
            // Se as credenciais forem válidas, retorne o id e email
            return res.status(200).json({
                success: true,
                id: user.id,
                email: user.email,
                message: 'Login bem-sucedido'
            });
        } else {
            return res.status(401).send('Senha incorreta!');
        }
    });
});



verificar_funcao = (req,res,next)=>{

    if(req.session.userId){
        next()
    }else{
        res.redirect('./pages/login.html')
    }

}


app.get('/index', verificar_funcao, (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Rendeiza index.html
  });
  

// CREATE - Adiciona um novo usuário 
app.post('/criar_usuario' , (req,res) =>{
    
    const {pessoa} = req.body
    console.log(req.body); // Para ver o que está sendo recebido
    const {nome, email , senha} = pessoa

    const query = "INSERT INTO pessoas (nome, email, senha) VALUES (? , ? , ?)";
    conn.query(query, [nome,email,senha] , (err) =>{
        if(err){
            alert("Usuario já cadastado !")
            return res.status(500).send(err);
            
        }

        res.send("Usuario criado com sucesso !")
    })  
})

//CREATE - Adiciona informações sobre a pessoa e o usuário
app.post('/criar', (req, res) => {
    const { salario, mes, gastos, idPessoa } = req.body;

    const queryCriarInfoFinanceira = "INSERT INTO infoFinancas (idPessoa, salario, mes) VALUES (?, ?, ?)";

    conn.query(queryCriarInfoFinanceira, [idPessoa, salario, mes], (err, infoFinancasResult) => {
        if (err) {
            return res.status(500).send(err);
        }

        const idInfoFinancas = infoFinancasResult.insertId;

        gastos.forEach(({ tipoGasto, valorDoGasto }) => {
            const queryCriarGasto = "INSERT INTO gastos (tipoGasto, valorDoGasto, idPessoa) VALUES (?, ?, ?)";

            conn.query(queryCriarGasto, [tipoGasto, valorDoGasto, idPessoa], (err) => {
                if (err) {
                    return res.status(500).send(err);
                }
            });
        });

        res.send("Informações financeiras criadas com sucesso!");
    });
});


// UPDATE - Atualiza informações financeiras e gastos
app.put('/atualizar/:idPessoa', (req, res) => {
    const { info, gastos } = req.body;
    const { salario, mes } = info;
    const { idPessoa } = req.params;

    const queryTabelaInfoFinancas = "UPDATE infoFinancas SET salario = ?, mes = ? WHERE idPessoa = ?";

    conn.query(queryTabelaInfoFinancas, [salario, mes, idPessoa], (err, infoFinancasResult) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (Array.isArray(gastos)) {
            gastos.forEach(({ id: idGasto, tipoGasto, valorDoGasto }) => {
                const queryTabelaGastos = "UPDATE gastos SET tipoGasto = ?, valorDoGasto = ? WHERE id = ?";
                conn.query(queryTabelaGastos, [tipoGasto, valorDoGasto, idGasto], (err, gastoResult) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                });
            });
        } else {
            return res.status(400).send("O campo 'gastos' deve ser um array.");
        }

        res.send("Dados alterados com sucesso!");
    });
});

// DELETE - Excluir um gasto específico
app.delete('/delete/:id', (req, res) => {
    const { id } = req.params;

    const query = "DELETE FROM gastos WHERE id = ?";

    conn.query(query, [id], (err, deleteResult) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.send("Gasto excluído com sucesso!");
    });
});

// DELETE - Excluir todas as informações de uma pessoa e seus gastos
app.delete('/delete_tudo/:idPessoa', (req, res) => {
    const { idPessoa } = req.params;

    const queryTabelaGastos = `
        DELETE FROM gastos 
        WHERE idInfoFinancas IN (
            SELECT id FROM infoFinancas WHERE idPessoa = ?
        )`;

    conn.query(queryTabelaGastos, [idPessoa], (err) => {
        if (err) {
            return res.status(500).send(err);
        }

        const queryTabelaInfoFinancas = "DELETE FROM infoFinancas WHERE idPessoa = ?";
        conn.query(queryTabelaInfoFinancas, [idPessoa], (err) => {
            if (err) {
                return res.status(500).send(err);
            }

            const queryTabelaPessoa = "DELETE FROM pessoas WHERE id = ?";
            conn.query(queryTabelaPessoa, [idPessoa], (err, deleteResult) => {
                if (err) {
                    return res.status(500).send(err);
                }

                res.send("Excluído com sucesso!");
            });
        });
    });
});

// READ - Visualizar informações e gastos de uma pessoa
app.get("/Visualizar/:idPessoa", (req, res) => {
    const { idPessoa } = req.params;
    const query = `
        SELECT infoFinancas.id AS infoId, pessoas.nome, pessoas.email, infoFinancas.mes, infoFinancas.salario, 
               gastos.tipoGasto, gastos.valorDoGasto
        FROM pessoas
        LEFT JOIN infoFinancas ON pessoas.id = infoFinancas.idPessoa
        LEFT JOIN gastos ON infoFinancas.id = gastos.idInfoFinancas
        WHERE pessoas.id = ?;
    `;

    conn.query(query, [idPessoa], (err, readResult) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.json(readResult);
    });
});

app.listen(port, () => {
    console.log(`Rodando na porta ${port}`);
});
