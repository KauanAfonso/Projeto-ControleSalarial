const createData = (nome,salario,mes , ...lista)=>{

    const info = {
        nome: nome,
        salario: salario,
        mes:mes
    };

    const gastos = lista.map(gasto => ({
        tipoGasto: gasto.tipoGasto,
        valorDoGasto: gasto.valorDoGasto
    }));


    return {
        info: info,
        gasto: gastos
    };
}

module.exports = {
    createData
}