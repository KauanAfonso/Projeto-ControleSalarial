const mysql = require('mysql2')

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'senai',
    port: 3306,
    database: 'MinhasFinancas'


})

conn.connect((err) => {
    if (err) {
        console.error("Erro ao conectar ao banco de dados:", err);
        return;
    }
    console.log("Conectado com sucesso!");
});

module.exports = conn