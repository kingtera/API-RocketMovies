require("express-async-errors")
const AppError = require("./utils/AppError")
const migrationRun = require("./database/sqlite/migrations")
const express = require("express")
const routes = require("./routes") //por padrão, vai rodar o index.js
const app = express() //inicializa o express

app.use(express.json())

app.use(routes)

migrationRun()

app.use((error, request, response, next) => {
    if(error instanceof AppError) {
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message 
        })
    }

    return response.status(500).json({
        status: "error",
        message: "Server Error"
    })
})

const PORT = 3333
app.listen(PORT, () => console.log(`Server is running on Port ${PORT}`))