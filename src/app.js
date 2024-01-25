import express from "express"
import handlebars from "express-handlebars"
import __dirname from "./utils.js"
import viewsRouter from "./routes/views.router.js"
import productRouter from "./routes/products.router.js"
import { Server } from "socket.io"
import ProductManager from "./classes/ProductManager.js"
const productManager = new ProductManager;

const app = express();
app.use(express.json());
const httpServer = app.listen(8080, () => console.log('Server running in port 8080'))

const io = new Server(httpServer);

app.use(express.urlencoded({ extended: true }))
app.engine("handlebars",handlebars.engine())
app.set("views",__dirname+"/views")
app.set("view engine","handlebars")
app.use(express.static(__dirname+"/public"))
app.use("/",viewsRouter)
app.use('/api/products', productRouter);

io.on("connection", async (socket) => {
    console.log("Conexión establecida");

    socket.on("getAllProducts", async () => {
        try {
            const prods = await productManager.getProducts()
            socket.emit("actualizarProductos",prods)
        }catch (err){
            socket.emit("error",err.message)
        }
    })

}) // Fin del socket 