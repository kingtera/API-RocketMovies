const { Router } = require("express")

const usersRoutes = require("./users.routes")
const notesRoutes = require("./movie_notes.routes")
// const tagsRoutes = require("./movie_tags.routes")

const routes = Router()

routes.use("/users", usersRoutes)
routes.use("/movie_notes", notesRoutes)
// routes.use("/movie_tags", tagsRoutes)

module.exports = routes 