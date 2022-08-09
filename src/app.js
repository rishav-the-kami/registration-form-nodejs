require("dotenv").config()
const express = require("express")
const app = express()
const port = process.env.PORT || 80
const path = require("path")
const hbs = require("hbs")
require("../db/conn")

const staticPath = path.join(__dirname, "../public")
const templatePath = path.join(__dirname, "../templates/views")
const partialsPath = path.join(__dirname, "../templates/partials")

app.use(express.static(staticPath))
app.set("view engine", "hbs")
app.set("views", templatePath) 
hbs.registerPartials(partialsPath)
app.use(express.json())
app.use(express.urlencoded({ extended: false })) 

const router = require("../models/routers") 
app.use(router)

app.listen(port, () => console.log(`listening on port: ${port}`))
