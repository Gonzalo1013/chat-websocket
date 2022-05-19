const express = require('express')
const app = express()
const routerIndex = require('./routes/index') 


const msj = []

//SERVIDOR http
const http = require('http')
const server = http.createServer(app)
//Puerto 
const port = process.env.PORT || 8080

//Archivos ESTATICOS
app.use(express.static(__dirname + '/public'))
app.use('/css', express.static(__dirname + '/public/styles'))
// Routers
app.use('/api', routerIndex)


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
//recibo objeto del formulario
    socket.on('text', (data) => {
        msj.push(data)
        io.sockets.emit('messages', msj)
    })
})
server.listen(port, () => {
    console.log('SERVER OK!! open in ' + port);
})