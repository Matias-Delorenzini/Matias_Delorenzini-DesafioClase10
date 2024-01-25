// Importamos las dependencias y la clase productManager
import express from 'express';
const router = express.Router();
import ProductManager from '../classes/ProductManager.js';
const productManager = new ProductManager();

// Endpoint que añade un producto
router.post('/', async (req, res) => {
    const product = req.body;
    const resp = await productManager.addProduct(product);
    res.status(200).send({ msg: resp });
});

// Endpoint que elimina un producto
router.delete('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const resp = await productManager.deleteProduct(productId);
    res.status(200).send({ msg: resp });
});

// Exportamos
export default router;