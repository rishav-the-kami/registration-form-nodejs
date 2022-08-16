const jwt = require('jsonwebtoken');
const Register = require('../db/registers')

const auth = async(req, res, next) => {
    try {
        const token = req.cookies.jwt
        const verifyUser = jwt.verify(token, process.env.SECRET_KEY)
        console.log(verifyUser)

        const user = await Register.findOne({_id: verifyUser._id})
        console.log(user)

        res.render("forAuth'd", {name: `${user.fname} ${user.lname}`})
        next()
    }
    catch (err) {
        res.render("index")
    }
}

module.exports = auth
