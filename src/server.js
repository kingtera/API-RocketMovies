const express = require("express")

const routes = require("./routes") //por padrão, vai rodar o index.js

const app = express() //inicializa o express
app.use(express.json())

app.use(routes)

const PORT = 3333
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))