const express = require ('express');
const conn = require('./db');

const app = express();
const port = 3000

app.use(express.json());

//create
    app.post('/criar', (req, res) => {
        const { gastos, info } = req.body; // espera um objeto com duas chaves: gastos e info
    
        // Inserir cada gasto
        gastos.forEach(({ tipoGasto, valorDoGasto }) => {
            const queryTabelaGastos = 'INSERT INTO gastos (tipoGasto, valorDoGasto) VALUES (?, ?)';
            
            conn.query(queryTabelaGastos, [tipoGasto, valorDoGasto], (err, gastoResult) => {
                if (err) {
                    return res.status(500).send(err);
                }
    
                const gastoId = gastoResult.insertId; // pega o id do gasto inserido
                const { nome, salario } = info; // pega as informações do usuário
                
                // Inserir na tabela infoFinancas usando o id do gasto
                const queryTabelaInfoFinancas = 'INSERT INTO infoFinancas (nome, salario, idGastos) VALUES (?, ?, ?)';
                
                conn.query(queryTabelaInfoFinancas, [nome, salario, gastoId], (err, infoFinancasResult) => {
                    if (err) {
                        return res.status(500).send(err);
                    }
                });
            });
        });
    
        res.send("Dados criados com sucesso !");
    });
    

//uptade
app.put('/atualizar:id' , (req,res) =>{

    const {tipoGasto, valorDoGasto, nome, salario, idInf, idGasto} = req.body
    const queryGastoUptade = "UPDATE gastos SET tipoGasto = ?, valorDoGasto = ? WHERE id = ?"

    conn.query(queryGastoUptade, [tipoGasto, valorDoGasto, idGasto], (err,gastoResult) => {
        if(err){
            return res.status(500).send(err)
        }
    })

    const queryInfoUptade = "UPDATE infoFinancas SET nome = ?, salario = ? WHERE id = ?"
    conn.query(queryInfoUptade , [nome ,salario, idInf], (err, infoResult) => {
        if(err){
            return res.status(500).send(err)
        }
    })

    res.send("Dados atualizados com sucesso !")
})

//DELETE

app.delete('/delete:id' , (req,res) =>{
    const {id} = req.params //const id = usuario.id;

    query = "DELETE from gastos WHERE id = ? ";

    conn.query(query, [id], (err, deleteResult) =>{
        if(err){
            return res.sendStatus(500).send(err)
        }

        res.send("Excluido com sucesso !")
    })
 
})


//READ
app.get("/Visualizar/:id", (req,res) => {
    const {id} = req.params;
    const query = `
        SELECT infoFinancas.id, infoFinancas.nome, infoFinancas.salario, 
        gastos.tipoGasto, gastos.valorDoGasto
        FROM infoFinancas
        LEFT JOIN gastos ON infoFinancas.idGastos = gastos.id
        WHERE infoFinancas.id = ?;
        `

    conn.query(query, [id], (err, readResult) =>{
        if(err){
            return res.sendStatus(500).send(err)
            }
    
        res.json(readResult)
    })
     
})

app.listen(port, ()=>{
    console.log(`Rodando na porta ${port}`)
})