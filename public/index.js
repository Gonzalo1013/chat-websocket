const socket = io()

//recibo mensjae del back HOLA CLIENTE
socket.on('message_back' , (data) => {
    console.log(data);
    //respondo enviando un Hola servidor
    socket.emit('menssage_client', 'HOLA SERVIDOR')
})
//recibo el array para luego pintar en el front por medio de la funcion render
socket.on('messages' , (data)=>{
    render(data)
})

const render = (data) =>{
    let html = data.map((x)=>{
        return `
            <p> <strong>${x.name}</strong>: ${x.msn}</p>
        `
    }).join(' ')
    document.querySelector('#caja').innerHTML = html
}

const addMsn = () => {
    let msnObj = {
        id: socket.id,
        name: document.querySelector('#name').value,
        msn: document.querySelector('#msn').value
    }
    socket.emit('text' , msnObj)
    document.getElementById('msn').value= ' ';
    return false
}


$(document).ready(function() {
    $("#msn").emojioneArea();
});