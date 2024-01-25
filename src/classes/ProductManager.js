// Importamos fs
import { promises as fsPromises, existsSync } from 'fs';

// Declaramos la clase
class ProductManager {
    constructor() {
        // Usaremos este path como archivo
        this.path = './data/productos.json';
        // Esto es para llevar registro local de los datos de productos
        this.products = [];
        // Si no existe el archivo lo creamos al inicializar
        if (!existsSync(this.path)) {
            fsPromises.writeFile(this.path, JSON.stringify([]));
        }
    }
    // Id único
    static id = 0;

    // Lógica de ver productos
    getProducts = async () => {
        try {
            // Leemos, parseamos y mostramos
            let content = await fsPromises.readFile(this.path, 'utf-8');
            const products = JSON.parse(content);
            return products 
        } catch (error) {
            throw new Error('Error al obtener los productos: ' + error.message);
        }
    }

    // Logica de mostrar producto por id
    getProductById = async (requestedId) => {
        try {
            // convertimos el id a un numero por si no lo es
            let id = parseInt(requestedId, 10)
            // Leemos y parseamos
            let content = await fsPromises.readFile(this.path, 'utf-8');
            const products = JSON.parse(content);
            // Buscamos si existe el producto
            let productFound = products.find(p => p.id === id);
            if (!productFound) {
                // Si no existe mostramos que no existe
                return { status: 404, message: `No existe un producto con ID ${id}` };
            } else {
                // En otro caso hacemos un return de los datos
                return productFound
            }
        } catch (error) {
            throw new Error('Error al leer el archivo: ' + error.message);
        }
    }

    // Lógica de añadir productos
    async addProduct(productData) {
        try {
            // Si no nos llega productdata, o si no es un objeto, lo avisamos
            if (!productData || typeof productData !== 'object') {
                return { status: 400, message: 'Los datos del producto no son un objeto.' };
            }
    
            const {
                title,
                description,
                code,
                price,
                stock,
                category,
                thumbnails,
                status,
                idToEdit
            } = productData;
    
            if (status !== "false") {
                productData.status = true;
            }
    
            // Si idToEdit es "none", procede normalmente como antes
            if (idToEdit === "none") {
                // Si title, description, code, price, stock o category no están, lo avisamos (Thumbnail no es necesario)
                if (!title || !description || !code || !price || !stock || !category) {
                    return { status: 400, message: 'Todos los campos son obligatorios (excepto Thumbnail).' };
                }
                // Si stock y price no son numeros (independientemente de si sean strings o integers) lo avisamos
                if (isNaN(Number(stock)) || isNaN(Number(price))){
                    return { status: 400, message: "price y stock deben ser números" };
                }
                // Si el titulo, descripcion, code y category no son strings lo avisamos
                if (typeof title !== 'string' || typeof description !== 'string' || typeof code !== 'string' || typeof category !== 'string') {
                    return { status: 400, message: "title, description, code y category deben ser strings" };
                }
                // Si thumbnails no es un array lo avisamos
                if (thumbnails && !Array.isArray(thumbnails)) {
                    return { status: 400, message: '"thumbnails" debe ser un array de rutas de imágenes.' };
                }
                if (thumbnails) {
                    // Verificar que todos los elementos en thumbnails sean strings
                    if (!thumbnails.every(path => typeof path === 'string')) {
                        return { status: 400, message: 'Todos los elementos en "thumbnails" deben ser strings.' };
                    }
                }
                // Buscamos si en products existe un producto con el mismo code, si lo hay lo avisamos
                let content = await fsPromises.readFile(this.path, 'utf-8');
                let products = JSON.parse(content);
                ProductManager.id = products.length > 0 ? products[products.length - 1].id : 0;
                const existingProduct = products.find((product) => product.code === code);
                if (existingProduct) {
                    return { status: 409, message: `Ya existe un producto con code: ${code}` };
                }
                // Añadimos 1 al id
                ProductManager.id++;
                // Creamos un nuevo producto, lo subimos a this.products y lo mandamos al archivo
                let newProduct = { id: ProductManager.id, ...productData};            
                products.push(newProduct);
                await fsPromises.writeFile(this.path, JSON.stringify(products), 'utf-8');
                return { status: 201, message: `Producto añadido exitosamente con ID: ${ProductManager.id}` };
            } else {
                
            }
    
            
    
        } catch (error) {
            throw new Error(`Error al añadir el producto: ${error.message}`);
        }
    }
    

    // Logica de actualizar producto
    async updateProduct(idToUpdate, dataToUpdate) {
        try {
            // Parseamos el id solicitado
            const id = parseInt(idToUpdate);

            // Hacemos un destructuring de la solicitud de datos
            const {
                title,
                description,
                code,
                price,
                status,
                stock,
                category,
                thumbnails
            } = dataToUpdate;

            // Obtenemos los datos
            let content = await fsPromises.readFile(this.path, "utf-8");
            let products = JSON.parse(content);

            // Buscamos el index del producto a actualizar
            const indexToUpdate = products.findIndex((product) => product.id === id);

            // Si no existe lo avisamos
            if (indexToUpdate === -1) {
                return { status: 404, message: `Producto con ID ${id} no encontrado para actualizar.` };
            }

            // Dependiendo de si cada varaible haya sido ingresada o no, su valor es o bien el nuevo (que viene por body) o el que tenía originalmente
            const updatedTitle = title !== undefined ? title : products[indexToUpdate].title;
            const updatedDescription = description !== undefined ? description : products[indexToUpdate].description;
            const updatedCode = code !== undefined ? code : products[indexToUpdate].code;
            const updatedPrice = price !== undefined ? price : products[indexToUpdate].price;
            const updatedStatus = status !== undefined ? status : products[indexToUpdate].status;
            const updatedStock = stock !== undefined ? stock : products[indexToUpdate].stock;
            const updatedCategory = category !== undefined ? category : products[indexToUpdate].category;
            const updatedThumbnails = thumbnails !== undefined ? thumbnails : products[indexToUpdate].updatedThumbnails;

            // Si status no es boolean pero tampoco es undefined, lo advertimos
            if (typeof updatedStatus !== 'boolean' && updatedStatus !== undefined) {
                return { updatedStatus: 400, message: '"status" debe ser un booleano' };
            }
            // Si stock y precio no son numeros lo advertimos
            if (isNaN(Number(updatedStock)) || isNaN(Number(updatedPrice))){
                return { status: 400, message: "price y stock deben ser números" };
            }
            // Si los valores que tienen que ser string no lo son lo avisamos
            if ((typeof updatedTitle !== 'string' || typeof updatedDescription !== 'string' || typeof updatedCode !== 'string' || typeof updatedCategory !== 'string') && (typeof (updatedTitle || updatedDescription || updatedCode || updatedCategory) !== "undefined")) {
                return { status: 400, message: "title, description, code y category deben ser strings" };
            }            
            if (updatedThumbnails !== undefined && !Array.isArray(updatedThumbnails)) {
                return { status: 400, message: '"thumbnails" debe ser un array de rutas de imágenes.' + thumbnails + updatedThumbnails };
            }
            if (updatedThumbnails) {
                // Verificar que todos los elementos en thumbnails sean strings
                if (!updatedThumbnails.every(path => typeof path === 'string')) {
                    return { status: 400, message: 'Todos los elementos en "thumbnails" deben ser strings.' };
                }
            }
    
            // Hacemos un objeto con los datos actualizados
            let updatedData = {
                title: updatedTitle,
                description: updatedDescription,
                code: updatedCode,
                price: updatedPrice,
                status: updatedStatus,
                stock: updatedStock,
                category: updatedCategory
            };
            // Si code ya existe lo avisamos
            if (products.some(product => product.code === updatedData.code)) {
                return { status: 409, message: `El código ${updatedData.code} ya está en uso.` };
            }
            // Hacemos un spread para preparar nuestro producto actualizado con todos sus datos, enviando el id por separado para no alterarlo, y lo enviamos
            products[indexToUpdate] = { id, ...updatedData };
            await fsPromises.writeFile(this.path, JSON.stringify(products));
            return { status: 200, message: `Producto con ID ${id} actualizado correctamente.` };
        } catch (error) {
            throw new Error(`Error al intentar actualizar el producto con ID ${id}: ${error.message}.`);
        }
    }

    // Logica de eliminar producto
    deleteProduct = async (requestedId) => {
        try {
            // parseamos el id
            const id = parseInt(requestedId);
            // Obtenemos los datos
            let content = await fsPromises.readFile(this.path, "utf-8");
            let products = JSON.parse(content);
            // Filtramos el producto con el id indicado, si es que lo hay, y comparamos el largo de ambas listas de productos para ver si miden lo mismo (no existe ese producto con el id especificado) o si miden diferente (existe)
            let productFilter = products.filter(product => product.id != id);
            if (productFilter.length === products.length) {
                return { status: 404, message: `No existe un producto con el ID ${id}.` };
            } else {
                // Eliminamos
                await fsPromises.writeFile(this.path, JSON.stringify(productFilter), "utf-8");
                return { status: 200, message: `Se ha eliminado el producto con ID ${id}` };
            }
        } catch (error) {
            throw new Error(`Error al intentar eliminar el producto con ID ${id}: ${error.message}.`);
        }
    }
}

export default ProductManager;