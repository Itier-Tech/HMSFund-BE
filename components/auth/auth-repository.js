const db = require("../../core/database/supabase");

class AuthRepository {
    async findUserByUsername(username) {
        let { data: user, error } = await db
            .from("Users")
            .select("*")
            .eq("username", username)
            .single();
        return user;
    }

    async findAll() {
        let { data: Users, error } = await db.from("Users").select("*");
        if (error) {
            throw error;
        }
        return Users;
    }

    async createUser(user) {
        const userRef = await db.from("Users").insert(user);
        return userRef;
    }
}

module.exports = AuthRepository;