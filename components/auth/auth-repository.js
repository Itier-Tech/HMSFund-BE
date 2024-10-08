const db = require("../../core/database/supabase");

class AuthRepository {
    async findUserByUsername(username) {}

    async findAll() {
        let { data: Users, error } = await db.from("Users").select("*");
        if (error) {
            throw error;
        }
        return Users;
    }
}

module.exports = AuthRepository;