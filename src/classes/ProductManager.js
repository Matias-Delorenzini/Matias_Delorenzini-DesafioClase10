import { promises as fsPromises, existsSync } from 'fs';
import { Server } from 'socket.io';

class ProductManager {
    constructor(server) {
        this.path = './data/productos.json';
        this.products = [];
        if (!existsSync(this.path)) {
            fsPromises.writeFile(this.path, JSON.stringify([]));
        }
    }
    
    static id = 0;

    getProducts = async () => {
        try {
            let content = await fsPromises.readFile(this.path, 'utf-8');
            const products = JSON.parse(content);
            return { status: 200, data: products };
        } catch (error) {
            throw new Error('Error al obtener los productos: ' + error.message);
        }
    }

    async addProduct(productData) {
        try {
            if (!productData || typeof productData !== 'object') {
                return { status: 400, message: 'Los datos del producto no son un objeto.' };
            }
            const { title, description, price, stock, code, category, status, thumbnails} = productData;

            let content = await fsPromises.readFile(this.path, 'utf-8');
            let products = JSON.parse(content);
            ProductManager.id = products.length > 0 ? products[products.length - 1].id : 0;
            ProductManager.id++;
            let newProduct = { id: ProductManager.id, ...productData};            
            products.push(newProduct);
        } catch (error) {
            throw new Error(`Error al añadir el producto: ${error.message}`);
        }
    }
    emitProductList(socket) {
        socket.emit('updateProducts', this.products);
    }
}

export default ProductManager;
