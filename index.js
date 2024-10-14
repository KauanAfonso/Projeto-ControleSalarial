const express = require ('express');
const conn = require('./db');

const app = express();
const port = 3000

app.use(express.json());

//create
app.post('/criar', (req,res) => {
    const {tipoGasto , valorDoGasto, name, salario} = req.body
    const queryTabelaGastos = 'INSERT INTO gastos (tipoDoGasto, valorDoGasto) VALUES (?, ?)'; 

    conn.query(queryTabelaGastos, [tipoGasto, valorDoGasto], (err, gastoResult) =>{
        if(err){
            return res.status(500).send(err);
        }
    })


    const queryTabelaInfoFinancas = 'INSERT INTO infoFinancas (name, salario, idGastos) VALUES (?,?)';
    const gastoId = gastoResult.id // pegar o id referente ao gasto e mandar para 

    conn.query(queryTabelaInfoFinancas, [name, salario , gastoId], (err, infoFinancasResult) => {
        if(err){
            return res.status(500).send
        }
    })

    res.send("Dados criados com sucesso !")
})

//uptade
app.put('/atualizar:id' , (re,res) =>{

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
            return res.status(500).send
        }
    })

    res.send("Dados atualizados com sucesso !")
})

//DELETE

app.delete()