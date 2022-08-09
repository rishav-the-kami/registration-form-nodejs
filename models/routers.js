const express = require('express');
const router = new express.Router()
const Register = require("../db/registers")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

router.get("/", (req, res) => {
    res.render("index", { ok: "display: none", name: "Rishav" })
})
router.get("/register", (req, res) => {
    res.render("register")
})
router.post("/register", async(req, res) => {
    try {
        const password = await bcrypt.hash(req.body.password, 10)

        const data = {
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            password: password,
            gender: req.body.gender,
            age: req.body.age
        }

        const newData = new Register(data)

        const token = await newData.generateAuthToken()
        console.log(token)

        const savedNewData = await newData.save()
        
        console.log(savedNewData)
        res.status(200).render("index", { ok: "display: block", name: `${savedNewData.fname} ${savedNewData.lname}` })
    }
    catch(err) {
        console.log(err)
        res.status(400).send(err)
    }
})
router.get("/login", (req, res) => {
    res.render("login")
})
router.post("/login", async(req, res) => {
    try {
        const email = req.body.email
        const password =  req.body.password

        const receivedData = await Register.findOne({ email })
        const hashedPassword = receivedData.password
        const checkPassword = await bcrypt.compare(password, hashedPassword)
        
        
        if(checkPassword) {
            const token = await receivedData.generateAuthToken()
            console.log(token)
            
            if(receivedData)
                res.status(201).render("index", { ok: "display: block", name: `${receivedData.fname} ${receivedData.lname}` })
        }
        else
            res.send("Invalid Authentication")

        console.log(email)
    }
    catch(err) {
        res.status(400).send(err)
        console.log(err)
    }
})

module.exports = router
