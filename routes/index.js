const express = require('express')
const {Router} = express
const router = new Router()
const fs = require('fs')

// router.get('/' , (req, res) => {
//     res.sendFile('public/index.html' , {root:'.'})
// })


//Mostrar todos los PRODUCTOS en web
router.get('/', (req, res)=>{
    fs.readFile('./products.json' , 'utf-8' , (err,data) =>{
        if(err){
            res.send({message:'No se pudo leer el archivo' })
        }else if(data === ''){
            res.send({message: 'No hay ningun Producto cargado'})
        }else{
            let products = JSON.parse(data)
            res.render('index', {data:products})
        }
    })
})
router.get('/getAll', (req, res)=>{
    fs.readFile('./products.json' , 'utf-8' , (err,data) =>{
        if(err){
            res.send({message:'No se pudo leer el archivo' })
        }else if(data === ''){
            res.send({message: 'No hay ningun Producto cargado'})
        }else{
            let products = JSON.parse(data)
            res.send({data:products})
        }
    })
})

//MOSTRAR UN PORDUCTO POR ID EN LA WEB
router.get('/get/:id', (req, res) => {
    let idd = req.params.id
    console.log(idd);
    fs.readFile('./products.json', 'utf-8', (err, data) => {
        if(err){
            res.send('Error al buscar producto')
        }else{
            let products = JSON.parse(data)
            let itemFound = products.find(x => x.id === Number(idd) )
            if(!itemFound){
                res.send({message: 'not Exist'})
            }else{
                res.send({data: itemFound})
            }
        }
    })
        
})

//MODIFICAR PRODUCTO en Postman
router.put('/change/:id' , (req, res) => {
    let idItem = req.params.id-1
    let idIndex = JSON.parse(idItem)
    fs.readFile('./products.json', 'utf-8', (err, data)=> {
        if(err){
            res.send({message: 'Error de lectura'})
        }else{
            let product = JSON.parse(data)

            product[idIndex]["title"] = req.body.title
            product[idIndex]["description"] = req.body.description
            product[idIndex]["price"] = req.body.price
            product[idIndex]["thumbnail"] = req.body.thumbnail
            product[idIndex]["stock"] = req.body.stock
            
            fs.writeFile('./products.json', JSON.stringify(product), 'utf-8' , (err) => {
                if(err){
                    res.send({message: 'No se pudo actualizar el producto'})
                }else{
                    res.send({message: 'Producto actualizado'})
                }
            })
        }
    })
})


//Eliminar un producto en Postman
router.delete('/delete/:id' , (req, res) => {
    let idItem = req.params.id
    fs.readFile('./products.json', 'utf-8', (err, data) => {
        if(err){
            res.send({message: 'Error de lectura'})
        }else{
            let product = JSON.parse(data)
            let itemFound = product.find(x => x.id === Number(idItem))

            if(!itemFound){
                res.send({message: 'No se encontro el producto'})
            }else{
                let index = product.indexOf(itemFound)
                if(index > -1){
                    product.splice(index, 1)

                    fs.writeFile('./products.json' , JSON.stringify(product), 'utf-8', (err) => {
                        if(err){
                            res.send({message: 'Error al Eliminar producto'})
                            }else{
                                res.send({message: `El producto fue eliminado exitosamente!`})
                            }
                    })
                }
                res.send({message: `El producto con ID: ${idItem}  fue eliminado con exitos!` })
            }
        }
    })
})
module.exports = router