const AppError = require("../utils/AppError")
const sqliteConnection = require("../database/sqlite")
const { hash, compare } = require("bcryptjs")

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

        response.json()
    }

    async update(request, response) {
        const { name, email, password, oldPassword } = request.body
        const { id } = request.params

        const database = await sqliteConnection()
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [id])
        if(!user) {
            throw new AppError("Usuário não encontrado.")
        }

        const userWithSameEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email])
        if(userWithSameEmail && userWithSameEmail.id !== user.id) {
            throw new AppError("Email já está em uso.")
        }

        user.name = name ?? user.name
        user.email = email ?? user.email

        if(password && !oldPassword) {
            throw new AppError("É preciso informar a senha antiga para atualizar a nova senha")
        }
        if(password && oldPassword) {
            const passwordVerifier = await compare(oldPassword, user.password)

            if(!passwordVerifier) {
                throw new AppError("Senha antiga está incorreta.")
            }

            user.password = await hash(password, 8)
        }

        await database.run(`
            UPDATE users SET
            name = ?,
            email = ?,
            password = ?,
            updated_at = DATETIME('now')
            WHERE id = ?
        `, [user.name, user.email, user.password, id])

        return response.json()
    }
}

module.exports = UsersController