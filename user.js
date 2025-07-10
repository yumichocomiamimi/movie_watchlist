import { userOperations } from './database.js';

// User class to mimic Mongoose model behavior
class User {
    constructor(data) {
        this.email = data.email;
        this.password = data.password;
        this.id = data.id;
    }

    // Save user to database
    async save() {
        try {
            const result = userOperations.create(this);
            this.id = result.id;
            return this;
        } catch (error) {
            throw new Error('Error saving user: ' + error.message);
        }
    }

    // Static method to find user by email
    static async findOne(query) {
        try {
            if (query.email) {
                return userOperations.getByEmail(query.email);
            }
            return null;
        } catch (error) {
            throw new Error('Error finding user: ' + error.message);
        }
    }

    // Static method to count documents
    static async countDocuments() {
        try {
            return userOperations.count();
        } catch (error) {
            throw new Error('Error counting users: ' + error.message);
        }
    }
}

export default User;
