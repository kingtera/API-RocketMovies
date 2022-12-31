const { Router } = require("express")

const teste = require("./test")

const routes = Router()

routes.use("/", teste)

module.exports = routes //por que preciso exportar o routes?