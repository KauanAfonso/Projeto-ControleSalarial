const path = require("path");


module.exports = {
    mode:"development", 
    entry:{
       "create": "./src/create.js",
        "criar_conta": "./src/criar_conta.js",
        "index.js": "./src/index.js",
        "login.js": "./src/login.js",
        "visualizar_graficos":"./src/visualizar_graficos.js"

    }, 
    output:{
        path: path.resolve(__dirname, 'dist'),
        filename:'[name].budles.js'
    },
    optimization: {
        minimize: true  // Ativa minificação
      }
}