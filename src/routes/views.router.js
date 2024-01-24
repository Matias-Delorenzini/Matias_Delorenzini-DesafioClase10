import ProductManager from '../classes/ProductManager.js';
import express from 'express';
import realtimeRouter from './realtime.router.js';
const productManager = new ProductManager();
const router = express.Router()

let products = []

router.use('/realtimeproducts', realtimeRouter);

router.get('/', async (req,res) => {
    const content = await productManager.getProducts();
    const products = content.data
    res.render('home', {products})
})

export default router