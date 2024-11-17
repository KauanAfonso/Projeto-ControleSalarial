getId = ()=>{
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('id');

    return userId
}

module.exports =  getId