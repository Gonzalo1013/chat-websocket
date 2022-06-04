const express = require('express')
const app = express()
const routerIndex = require('./routes/index')
const fs = require('fs')


const msj = []

//SERVIDOR http
const http = require('http')
const server = http.createServer(app)
//Puerto 
const port = process.env.PORT || 8080

//Archivos ESTATICOS
app.use('/public', express.static('public'))
app.use(express.static(__dirname + '/public'))
app.use('/css', express.static(__dirname + '/public/styles'))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
// Routers
app.use('/api', routerIndex)


app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')


//Servidor de Socket
const {Server} = require('socket.io')
const io = new Server(server)


io.on('connection', (socket) => {
    console.log('Usuario Conectado!');
//envio mensjae de hola cliente al front
    socket.emit('message_back', 'HOLA CLIENTE')
//recibo mensjae de Hola servidor 
socket.on('menssage_client', (data) => {
    console.log(data);
})

//CHAT 
//recibo objeto del formulario
    socket.on('text', (data) => {
        msj.push(data)
        io.sockets.emit('messages', msj)
        // console.log(msj);
    })
//TABLA DE PRODUCTOS
    socket.on('product', (data) => {
        // let msj = req.params.id
        let {title, description, price, stock, thumbnail} = data
        let product = {
            title,
            description,
            price,
            stock,
            thumbnail
        }
        
        fs.readFile('products.json', 'utf-8', (err, data) => {
            if(err) {
                console.log(err)
            } else {
            let products = JSON.parse(data)
            let idd = products.length + 1
            let {title, description, price, stock, thumbnail} = product
            let newProd = {
                id: idd,
                title,
                description,
                price,
                stock,
                thumbnail
            }

            products.push(newProd)
            console.log(products);
            fs.writeFile('products.json', JSON.stringify(products), 'utf-8' , (err) => {
                if (err){
                    console.log({message: 'Error al guardar el archivo'});
                }else{
                    console.log({message: 'Archivo guardado'});
                }
                io.sockets.emit('products', products)
            })
        }
        })
        
    })
})




server.listen(port, () => {
    console.log('SERVER OK!! open in ' + port);
})
