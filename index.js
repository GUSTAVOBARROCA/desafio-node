const express = require('express')
const app = express()
const uuid = require('uuid')
const port = 3001
app.use(express.json())


const orders = []

const checkOrderId = (request, response , next) => {
    const {id} = request.params

    const index = orders.findIndex(order => order.id === id)
    if(index < 0){
        return response.status(404).json({message:"User not found"})
    }
    request.orderIndex = index
    request.orderId = id

    next()
}

const checkMethod = (request , response, next) => {
    const methodRequest = request.method
    const url = request.url

    console.log(`[${methodRequest}] ${url}`)
    next()
}

app.get('/orders' ,checkMethod, (request, response) => {
    

    return response.json(orders)
})


app.post('/orders',checkMethod, (request, response) => {
    const {order, clientName , price} = request.body

    const newOrder = {id:uuid.v4(), order, clientName, price, status:"em preparação"}
    // console.log(request)

     orders.push(newOrder)
     return response.status(201).json(newOrder)

} )




app.put('/orders/:id', checkOrderId, checkMethod , (request, response) => {
    const {order, clientName , price} = request.body

    const index = request.orderIndex
    const id = request.orderId
    const updatedOrder = { id ,order, clientName ,price}
   
    orders[index] = updatedOrder 
    return response.json(updatedOrder)
    

})

app.delete('/orders/:id',checkOrderId, checkMethod ,(request , response) => {
    const index = request.orderIndex

    orders.splice(index, 1)

    return response.status(204).json()
})



app.get('/orders/:id' , checkOrderId, checkMethod , (request, response) => {
    const index = request.orderIndex
    
    return response.json(orders[index])
})

app.patch('/orders/:id' , checkOrderId, (request, response) => {
    const orderIndex = request.orderIndex
    const orderToUpdate = orders[orderIndex]

    orderToUpdate.status = 'Pronto'
    return response.json(orderToUpdate)
})





app.listen(port, ()=> {
    console.log(`Server started on port ${port} `)
} )