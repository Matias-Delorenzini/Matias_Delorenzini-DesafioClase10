// Importamos las dependencias y la clase productManager
import express from 'express';
const router = express.Router();
import ProductManager from '../classes/ProductManager.js';
const productManager = new ProductManager();

// Endpoint que muestra todos los productos
router.get('/', async (req, res) => {
    try {
        const { limit } = req.query;
        const products = await productManager.getProducts();
        if (limit && !isNaN(parseInt(limit))) {
            return res.status(200).send(products.data.slice(0, parseInt(limit)));
        }
        return res.status(200).send(products.data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos: ' + error.message });
    }
});

// Endpoint que muestra solo el especificado
router.get('/:pid', async (req, res) =>{
    const productId = req.params.pid;
    const product = await productManager.getProductById(productId);
    res.status(200).send(product.data);
});

// Endpoint que añade un producto
router.post('/', async (req, res) => {
    const product = req.body;
    const resp = await productManager.addProduct(product);
    res.status(200).send({ msg: resp });
});

// Endpoint que edita un producto especificado
router.put('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const updatedProductData = req.body;
    const resp = await productManager.updateProduct(productId, updatedProductData);
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