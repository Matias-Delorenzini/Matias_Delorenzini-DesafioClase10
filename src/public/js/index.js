const socket = io();


function enviarProducto() {
    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const code = document.getElementById("code").value;
    const thumbnail = document.getElementById("thumbnail").value;
    const stock = document.getElementById("stock").value;
    const category = document.getElementById("category").value;
    const status = document.getElementById("status").value;

    fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({title,description,price,code,thumbnail,stock,category,status})
    })
    .then(response => response.json())
    .then(data => {
        socket.emit("getAllProducts")
    })
    .catch(error => {
        console.error('Error:', error);
    });

    document.getElementById("addProductForm").reset();
    return
}

socket.on("actualizarProductos", (products) => {
    const productList = document.getElementById("body");
    productList.innerHTML = "";
  
    products.forEach((product) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.title}</td>
            <td>${product.description}</td>
            <td>${product.code}</td>
            <td>${product.thumbnail}</td>
            <td>${product.stock}</td>
            <td>${product.category}</td>
            <td>${product.status}</td>
            <td>${product.price}</td>
            <td>${product.stock}</td>
            <td><button onclick="eliminarProducto('${product.id}')">X</button></td>
            <td><button onclick="guardarCambios(this, '${this.id}')">Guardar</button></td>
            <td>${product.id}</td>
        `;
        productList.appendChild(row);
    });
});

function eliminarProducto(id) {
    fetch(`http://localhost:8080/api/products/${id}`, {
        method: 'DELETE',
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar el producto');
        }
        return response.json();
    })
    .then(data => {
        console.log('Producto eliminado correctamente');
        socket.emit("getAllProducts");
    })
    .catch(error => {
        console.error(error);
    })
}

function guardarCambios(button, productId) {
    const row = button.parentNode.parentNode;
    const descriptionCell = row.querySelector('.editable');
    const newDescription = descriptionCell.textContent;

    fetch(`http://localhost:8080/api/products/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            description: newDescription,
        }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Cambios guardados correctamente:', data);
    })
    .catch(error => {
        console.error('Error al guardar cambios:', error);
    });
}

