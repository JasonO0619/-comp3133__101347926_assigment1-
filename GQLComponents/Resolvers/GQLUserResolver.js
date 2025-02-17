const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userResolvers = {
    Query: {
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) throw new Error("User not found");

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) throw new Error("Invalid credentials");

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

            return { token, user };
        },
    },

    Mutation: {
        signup: async (_, { username, email, password }) => {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ username, email, password: hashedPassword });
            await user.save();
            return user;
        },
    }
};

module.exports = userResolvers;
