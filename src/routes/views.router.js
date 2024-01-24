import express from 'express'
import ProductManager from '../classes/ProductManager.js';
const productManager = new ProductManager();
const router = express.Router()

router.get('/', async (req,res) => {
    const content = await productManager.getProducts();
    const products = content.data
    res.render('home', {products})
})

export default router