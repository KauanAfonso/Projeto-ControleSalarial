const path = require("path");


modules.exports = {
    entry:{
       "create": "./src/create.js",
        "criar_conta": "./src/criar_conta.js",

    } 
    output:{
        path: path.resolve(__dirname, 'dist'),
        file:'[name].budles.js'
    },
}