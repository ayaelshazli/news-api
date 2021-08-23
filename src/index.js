const express = require('express')
const userRouter = require('./routers/user')
const newsRouter = require('./routers/news')

require('./db/mongoose')

const app = express()
app.use(express.json())

app.use(userRouter)
app.use(newsRouter)

const port = 3000

app.listen(port,()=>{console.log('Server is running')})
