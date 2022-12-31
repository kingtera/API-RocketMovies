const { Router } = require("express")

const testeRoutes = Router()

testeRoutes.get("/", (request, response) => {
    response.send("Hello world")
})

module.exports = testeRoutes