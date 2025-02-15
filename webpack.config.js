const path = require("path");


modules.exports = {
    mode:"development", 
    entry:{
       "create": "./src/create.js",
        "criar_conta": "./src/criar_conta.js",
        "index.js": "./src/index.js",
        "login.js": "./src/login.js",
        "visualizar_graficos":"visualizar_graficos.js"

    }, 
    output:{
        path: path.resolve(__dirname, 'dist'),
        filename:'[name].budles.js'
    },
}