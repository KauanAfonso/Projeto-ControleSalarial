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

        const {nome,salario} = info

        const queryTabelaInfoFinancas = "INSERT INTO infoFinancas (nome, salario) VALUES (?, ?)";

        conn.query(queryTabelaInfoFinancas, [nome,salario], (err,infoFinancasResult)=>{
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
app.put('/atualizar:id' , (req,res) =>{

    const {gasto, info} = req.body
    const {nome,salario} = info
    const {id} = req.body

    const queryTabelaInfoFinancas = "UPDATE infofinancas SET nome = ? , salario = ? WHERE id = ?"

    conn.query(queryTabelaInfoFinancas, [nome,salario, id], (err, infoFinancasResult)=>{
        if(err){
            return res.status(500).send(err)
        }

        const {tipoGasto, valorDoGasto} = gastos

        gastos.forEach(({tipoGasto,valorDoGasto}) =>{

            
        conn.query(queryTabelaGastos, [tipoGasto, valorDoGasto,id], (gastoResult, err) =>{
            if(err){
                return res.status(500).send(err)
            }


        })

        const queryTabelaGastos = "UPDADE gastos SET tipoGasto = ? valorDoGasto = ? WHERE idPessoa = ?"


            res.send("Dados alterados com Sucesso !")

        } )


    })
  
})

//DELETE

app.delete('/delete:/id' , (req,res) =>{
    const {id} = req.params //const id = usuario.id;

    const query = "DELETE from gastos WHERE id = ? ";

    conn.query(query, [id], (err, deleteResult) =>{
        if(err){
            return res.status(500).send(err)
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