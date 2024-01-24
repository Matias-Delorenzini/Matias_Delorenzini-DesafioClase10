import express from "express"
import __dirname from "./utils.js"
import handlebars from "express-handlebars"
import viewsRouter from "./routes/views.router.js"
import { Server } from "socket.io"

const app = express();
app.use(express.json());
const httpSever = app.listen(8080,()=>console.log("Listening on port 8080"))    

const socketServer = new Server(httpSever);

app.engine("handlebars",handlebars.engine())
app.set("view engine","handlebars")
app.set("views",__dirname+"/views")
app.use(express.static(__dirname+"/public"))
app.use("/",viewsRouter)

socketServer.on("connection",socket =>{
    console.log("Nuevo cliente conectado")
})