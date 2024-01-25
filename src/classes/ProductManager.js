import { promises as fsPromises, existsSync } from 'fs';

class ProductManager {
    constructor() {
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
            return products 
        } catch (error) {
            throw new Error('Error al obtener los productos: ' + error.message);
        }
    }

    async addProduct(productData) {
        try {
            if (!productData || typeof productData !== 'object') {
                return { status: 400, message: 'Los datos del producto no son un objeto.' };
            }
            let {title,description,code,price,stock,category,thumbnail,status,idToEdit} = productData;

            let content = await fsPromises.readFile(this.path, 'utf-8');
            let products = JSON.parse(content);
            
            const lastId = products.reduce((maxId, product) => {
                return product.id > maxId ? product.id : maxId;
            }, 0);
            
            if (idToEdit === "none") {
                parseInt(lastId)
                const newId = lastId + 1;
                let newProduct = { id: newId, title,description,code,price,stock,category,thumbnail,status};            
                products.push(newProduct);
                await fsPromises.writeFile(this.path, JSON.stringify(products), 'utf-8');
                return { status: 201, message: `Producto añadido exitosamente con ID: ${newId}` };  
            } else {
                idToEdit = parseInt(idToEdit)
                await this.deleteProduct(idToEdit)
                console.log("Estoy editando al id " + idToEdit)
                console.log(typeof idToEdit)
                
                let content = await fsPromises.readFile(this.path, 'utf-8');
                let products = JSON.parse(content);
                
                let newProduct = { id: idToEdit, title,description,code,price,stock,category,thumbnail,status};
                console.log("le estoy poniendo", newProduct);
                
                products.push(newProduct);
                await fsPromises.writeFile(this.path, JSON.stringify(products), 'utf-8');
                return { status: 201, message: `Producto añadido exitosamente con ID: ${ProductManager.id}` };
                
            }
        } catch (error) {
            throw new Error(`Error al añadir el producto: ${error.message}`);
        }
    }

    deleteProduct = async (requestedId) => {
        try {
            const id = parseInt(requestedId);
            let content = await fsPromises.readFile(this.path, "utf-8");
            let products = JSON.parse(content);
            let productFilter = products.filter(product => product.id != id);
            if (productFilter.length === products.length) {
                return { status: 404, message: `No existe un producto con el ID ${id}.` };
            } else {
                await fsPromises.writeFile(this.path, JSON.stringify(productFilter), "utf-8");
                return { status: 200, message: `Se ha eliminado el producto con ID ${id}` };
            }
        } catch (error) {
            throw new Error(`Error al intentar eliminar el producto con ID ${id}: ${error.message}.`);
        }
    }

    validateCode = async (code) => {
        try{
            let content = await fsPromises.readFile(this.path, 'utf-8');
            let products = JSON.parse(content);

            const existingProduct = products.find((product) => product.code === code);
            if (existingProduct) {
                return { status: 409, message: `Ya existe un producto con code: ${code}` };
            } else {
                return { status: 200, message: `No existe un producto con code: ${code}` };
            }
        } catch {
            throw new Error(`Error al validar el code: ${error.message}`);
        }
    }
}

export default ProductManager;