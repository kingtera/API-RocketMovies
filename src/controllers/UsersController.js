class UsersController {
    create(request, response) {
        const { name, email } = request.body

        response.json({name, email})
    }
}

module.exports = UsersController