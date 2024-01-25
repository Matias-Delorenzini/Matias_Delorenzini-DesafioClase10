import express from "express";
const router = express.Router()
import ProductManager from "../classes/ProductManager.js";
const productmanager = new ProductManager;

router.get('/', async (req, res) => {
    try {
        const content = await productmanager.getProducts();
        const products = content;
        res.render('home', { products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.get("/realtimeproducts", async (req,res)=>{
    const products = await productmanager.getProducts()
    res.render("realTimeProducts",{products})
})

export default router