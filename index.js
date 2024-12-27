const express = require('express');
const conn = require('./config/db.js');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json()); // Deve ser antes de definir as rotas

// Rota de login
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
        console.log(user)

        if (user.senha === senha) {
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

// Criar novo usuário
app.post('/criar_usuario', (req, res) => {
    const { pessoa } = req.body;
    const { nome, email, senha } = pessoa;

    const query = "INSERT INTO pessoas (nome, email, senha) VALUES (?, ?, ?)";
    conn.query(query, [nome, email, senha], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Erro ao criar usuário. Verifique os dados.");
        }

        res.send("Usuário criado com sucesso!");
    });
});

// Criar informações financeiras e gastos
app.post('/criar', async (req, res) => {
    const { salario, mes, gastos, idPessoa } = req.body;

    if (!salario || !mes || !gastos || !idPessoa) {
        return res.status(400).json({ message: "Dados incompletos" });
    }

    const sqlInfoPessoa = "INSERT INTO infoFinancas (idPessoa, salario, mes) VALUES (?, ?, ?)";
    const sqlGastos = "INSERT INTO gastos (tipoGasto, valorDoGasto, idInfoFinancas) VALUES (?, ?, ?)";

    try {
        const infoFinancasId = await new Promise((resolve, reject) => {
            conn.query(sqlInfoPessoa, [idPessoa, salario, mes], (err, result) => {
                if (err) return reject(err);
                resolve(result.insertId);
            });
        });

        const gastoPromises = gastos.map((gasto) => {
            return new Promise((resolve, reject) => {
                conn.query(sqlGastos, [gasto.tipoGasto, gasto.valorDoGasto, infoFinancasId], (err, result) => {
                    if (err) return reject(err);
                    resolve(result);
                });
            });
        });

        await Promise.all(gastoPromises);
        res.status(200).json({ message: "Dados salvos com sucesso" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro ao salvar dados no banco de dados" });
    }
});

// Atualizar informações financeiras e gastos
app.put('/atualizar/:idInfoFinancas', (req, res) => {
    const { info, gastos } = req.body;
    const { salario, mes } = info;
    const { idInfoFinancas } = req.params;

    const queryInfo = "UPDATE infoFinancas SET salario = ?, mes = ? WHERE id = ?";

    conn.query(queryInfo, [salario, mes, idInfoFinancas], (err) => {
        if (err) return res.status(500).send(err);

        if (Array.isArray(gastos)) {
            gastos.forEach(({ id: idGasto, tipoGasto, valorDoGasto }) => {
                const queryGastos = "UPDATE gastos SET tipoGasto = ?, valorDoGasto = ? WHERE id = ?";
                conn.query(queryGastos, [tipoGasto, valorDoGasto, idGasto], (err) => {
                    if (err) console.error(err);
                });
            });
        }

        res.send("Dados alterados com sucesso!");
    });
});


// Excluir todas as informações de um gasto especifico do usuário
app.delete('/delete_tudo/:id', (req, res) => {
    const { id } = req.params;

    const queryInfo = "DELETE FROM infoFinancas WHERE id = ?";
        conn.query(queryInfo, [id], (err) => {
            if (err) return res.status(500).send(err);
        
        res.send("Excluído com sucesso!");
        });

});

// Visualizar informações de uma pessoa
app.get("/visualizar/:idPessoa", (req, res) => {
    const { idPessoa } = req.params;

    const query = `
        SELECT 
            p.nome AS pessoaNome,
            i.id AS idInfoFinancas,
            i.mes, 
            i.salario, 
            g.tipoGasto, 
            g.valorDoGasto,
            g.id AS idGasto
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
        if (err) return res.status(500).send("Erro no servidor");

        const mesesMap = new Map();

        results.forEach(row => {
            if (!row.mes) return;

            if (!mesesMap.has(row.idInfoFinancas)) {
                mesesMap.set(row.idInfoFinancas, {
                    idInfoFinancas: row.idInfoFinancas,
                    mes: row.mes,
                    salario: row.salario,
                    gastos: []
                });
            }

            if (row.tipoGasto && row.valorDoGasto) {
                mesesMap.get(row.idInfoFinancas).gastos.push({
                    // idInfoFinancas: idInfoFinancas,
                    id: row.idGasto,
                    tipoGasto: row.tipoGasto,
                    valorDoGasto: row.valorDoGasto
                });
            }
        });

        const meses = Array.from(mesesMap.values());
        res.json({ pessoa: results.length > 0 ? results[0].pessoaNome : "", meses });
    });
});

app.listen(port, () => {
    console.log(`Rodando na porta ${port}`);
});