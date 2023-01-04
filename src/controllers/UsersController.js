const AppError = require("../utils/AppError")
const sqliteConnection = require("../database/sqlite")
const { hash } = require("bcryptjs")

class UsersController {
    async create(request, response) {
        const { name, email, password} = request.body
        
        if(!name) {
            throw new AppError("Nome é obrigatório")
        }
        
        if(!email) {
            throw new AppError("Email é obrigatório")
        }
        
        if(!password) {
            throw new AppError("Senha é obrigatória")
        }
        
        const database = await sqliteConnection()

        const emailVerifier = await database.get("SELECT * FROM users WHERE email = (?)", [email])
        if(emailVerifier) {
            throw new AppError("Email já está em uso.")
        }

        const hashedPassword = await hash(password, 8)

        await database.run("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, hashedPassword])

        response.status(201).json({name, email, hashedPassword})
    }
}

module.exports = UsersController