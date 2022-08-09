const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken")

const schema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim: true
    },
    lname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(val) {
            if(!validator.isEmail(val))
                throw new Error("Please enter a valid email address");
        }
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true,
        min: 1,
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

// generating tokens
schema.methods.generateAuthToken = async function() {
    try {
        // NOTE: here "this" operator is used a lot of times.
        // "this" means the object value we pass to the database (when registering or logging in)
        // thats why we are able to use "this._id"

        const generatedToken = jwt.sign({_id: this._id.toString()}, process.env.SECRET_KEY)
        this.tokens.push({ token: generatedToken })  // adding the generated token to the tokens array
        await this.save()  // save the generated token to the database
        return generatedToken
    }
    catch (err) {
        console.log("u noob xd")
    }
}

const Register = new mongoose.model("Register", schema)

module.exports = Register
