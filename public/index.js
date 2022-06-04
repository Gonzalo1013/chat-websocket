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

socket.on('products', (data) => {
    renderProducts(data)
})

const renderProducts = (data) =>{
    console.log(data);
    let table = data.map((x)=>{
        return ` 
            <tr>
                <td>${x.id}</td>
                <td>${x.title}</td>
                <td>${x.price}</td>
                <td><img src=${x.thumbnail} width="40"
                height="40" alt="img"></td>
            </tr>`
    }).join(' ')
    document.querySelector('#box').innerHTML = table
}

const addProduct = () => {
    let productObj = {
        title: document.querySelector('#title').value,
        description: document.querySelector('#description').value,
        price: document.querySelector('#price').value,
        stock: document.querySelector('#stock').value,
        thumbnail: document.querySelector('#thumbnail').value,
    }
    socket.emit('product' , productObj);
    document.getElementById('title').value= '';
    document.getElementById('description').value= '';
    document.getElementById('price').value= '';
    document.getElementById('stock').value= '';
    document.getElementById('thumbnail').value= '';
    return false
}


const render = (data) =>{
    let html = data.map((x)=>{
        return `
            <p> <strong>${x.name}</strong>: ${x.msn}</p>
        `
    }).join(' ')
    document.querySelector('#box-msn').innerHTML = html
}

const addMessage = () => {
    let msnObj = {
        id: socket.id,
        name: document.querySelector('#email').value,
        msn: document.querySelector('#msn').value
    }
    socket.emit('text' , msnObj)
    document.getElementById('msn').value= '';
    return false
}

document.addEventListener('submit' , (e)=> {
    e.preventDefault()
})

// $(document).ready(function() {
//     $("#msn").emojioneArea();
// });