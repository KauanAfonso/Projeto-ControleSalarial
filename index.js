const express = require ('express');
const conn = require('./db');
const cors = require('cors')

const app = express();
app.use(cors());
const port = 3000

app.use(express.json());

//create
 app.post('/criar', (req,res)=>{
        const {gastos, info} = req.body;

        const {nome,salario, mes} = info

        const queryTabelaInfoFinancas = "INSERT INTO infoFinancas (nome, salario, mes) VALUES (?, ?, ?)";

        conn.query(queryTabelaInfoFinancas, [nome,salario, mes], (err,infoFinancasResult)=>{
            if(err){
                return res.status(500).send(err)
            }

        const idDaPessoa = infoFinancasResult.insertId
        const {tipoGasto, valorDoGasto} = gastos

        gastos.forEach(({tipoGasto,valorDoGasto}) =>{
            const queryTabelaGastos = "INSERT INTO gastos (tipoGasto, valorDoGasto, idPessoa) VALUES (?, ?, ?)";

            conn.query(queryTabelaGastos, [tipoGasto,valorDoGasto,idDaPessoa], (err, gastoResult) => {
                if(err){
                    return res.status(500).send(err)
                }
            })
        })

        res.send("Dados Criados com sucesso !")

        })
    })
    

//uptade
// app.put('/atualizar/:id', (req, res) => {
//     const { gasto, info } = req.body; // Aqui, 'gasto' deve ser um array
//     const { nome, salario, mes } = info;
//     const { id } = req.params; // 'id' da pessoa que será atualizada

//     const queryTabelaInfoFinancas = "UPDATE infoFinancas SET nome = ?, salario = ?, mes = ? WHERE id = ?";

//     conn.query(queryTabelaInfoFinancas, [nome, salario, mes, id], (err, infoFinancasResult) => {
//         if (err) {
//             return res.status(500).send(err);
//         }

//         // Verifica se gasto é um array
//         if (Array.isArray(gasto)) {
//             // Para cada gasto no array, faz a atualização
//             gasto.forEach(({ id: gastoId, tipoGasto, valorDoGasto }) => {
//                 const queryTabelaGastos = "UPDATE gastos SET tipoGasto = ?, valorDoGasto = ? WHERE id = ?";
//                 conn.query(queryTabelaGastos, [tipoGasto, valorDoGasto, gastoId], (err, gastoResult) => {
//                     if (err) {
//                         return res.status(500).send(err);
//                     }
//                 });
//             });
//         } else {
//             return res.status(400).send("O campo 'gasto' deve ser um array.");
//         }

//         res.send("Dados alterados com sucesso!");
//     });
// });

//DELETE algum gasto

app.delete('/delete/:id' , (req,res) =>{
    const {id} = req.params //const id = usuario.id;

    const query = "DELETE from gastos WHERE id = ? ";

    conn.query(query, [id], (err, deleteResult) =>{
        if(err){
            return res.status(500).send(err)
        }

        res.send("Excluido com sucesso !")
    })


 
})



//DELETE algum tudo 

app.delete('/delete_tudo/:id' , (req,res) =>{
    const {id} = req.params


    const queryTabelaGastos = "DELETE FROM gastos WHERE idPessoa = ? ";
    conn.query(queryTabelaGastos, [id], (err) =>{

        if(err){
            return res.status(500).send(err)
        }

        const query = "DELETE from infoFinancas WHERE id = ? ";

        conn.query(query, [id], (err, deleteResult) =>{
            if(err){
                return res.status(500).send(err)
            }
    
            res.send("Excluido com sucesso !")
        })


    })

})


//READ
app.get("/Visualizar/:id", (req,res) => {
    const {id} = req.params;
    const query = `
        SELECT infoFinancas.id, infoFinancas.nome, infoFinancas.salario, 
               gastos.tipoGasto, gastos.valorDoGasto
        FROM infoFinancas
        LEFT JOIN gastos ON infoFinancas.id = gastos.idPessoa
        WHERE infoFinancas.id = ?;
        `

    conn.query(query, [id], (err, readResult) =>{
        if(err){
            return res.status(500).send(err)
            }
    
        res.json(readResult)
    })
     
})

app.listen(port, ()=>{
    console.log(`Rodando na porta ${port}`)
})