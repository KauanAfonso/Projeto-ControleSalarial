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
app.post('/criar', async (req, res) => {
    const { salario, mes, gastos, idPessoa } = req.body;

    // Verifique se os dados recebidos estão completos
    if (!salario || !mes || !gastos || !idPessoa) {
        return res.status(400).json({ message: "Dados incompletos" });
    }

    const sqlInfoPessoa = "INSERT INTO infoFinancas (idPessoa, salario, mes) VALUES (?, ?, ?)";
    const sqlGastos = "INSERT INTO gastos (tipoGasto, valorDoGasto, idInfoFinancas) VALUES (?, ?, ?)";

    try {
        // Insere as informações principais na tabela infoFinancas
        await new Promise((resolve, reject) => {
            conn.query(sqlInfoPessoa, [idPessoa, salario, mes], (err, result) => {
                if (err) {
                    console.error("Erro ao inserir infoFinancas:", err);
                    return reject(err);
                }
                resolve(result);
            });
        });

        // Insere os gastos na tabela gastos
        const gastoPromises = gastos.map((gasto) => {
            return new Promise((resolve, reject) => {
                conn.query(sqlGastos, [gasto.tipoGasto, gasto.valorDoGasto, idPessoa], (err, result) => {
                    if (err) {
                        console.error("Erro ao inserir gasto:", err);
                        return reject(err);
                    }
                    resolve(result);
                });
            });
        });

        // Aguarda todas as inserções serem concluídas
        await Promise.all(gastoPromises);

        // Envia a resposta ao cliente (somente aqui)
        return res.status(200).json({ message: "Dados salvos com sucesso" });

    } catch (err) {
        console.error("Erro ao salvar dados:", err);
        // Garante que somente um erro seja enviado
        if (!res.headersSent) {
            return res.status(500).json({ message: "Erro ao salvar dados no banco de dados" });
        }
    }
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

app.get("/Visualizar/:idPessoa", (req, res) => {
    const { idPessoa } = req.params;
    const query = `
        SELECT 
            p.nome AS pessoaNome,
            i.mes, 
            i.salario, 
            g.tipoGasto, 
            g.valorDoGasto
        FROM 
            pessoas p
        LEFT JOIN 
            infoFinancas i ON p.id = i.idPessoa
        LEFT JOIN 
            gastos g ON i.id = g.idInfoFinancas
        WHERE 
            p.id = ?;
    `;

    conn.query(query, [idPessoa], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send("Erro no servidor");
        } else {
            const meses = [];
            const pessoaNome = results.length > 0 ? results[0].pessoaNome : '';

            results.forEach(row => {
                let mesObj = meses.find(m => m.mes === row.mes);
                
                if (!mesObj) {
                    mesObj = {
                        mes: row.mes,
                        salario: row.salario,
                        gastos: []
                    };
                    meses.push(mesObj);
                }

                if (row.tipoGasto && row.valorDoGasto) {
                    mesObj.gastos.push({
                        tipoGasto: row.tipoGasto,
                        valorDoGasto: row.valorDoGasto
                    });
                }
            });

            res.json({
                pessoa: pessoaNome,
                meses: meses
            });
        }
    });
});



app.listen(port, () => {
    console.log(`Rodando na porta ${port}`);
});
