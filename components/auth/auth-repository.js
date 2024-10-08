const db = require("../../core/database/supabase");

class AuthRepository {
    constructor() {
        this.collection = db.collection("users");
    }

    async findUserByUsername(username) {}
}
