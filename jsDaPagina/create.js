const createData = (nome,salario,mes , ...lista)=>{

    const info = {
        mes: mes,
        salario: salario,
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