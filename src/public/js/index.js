const socket = io();

function enviarProducto() {

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const price = document.getElementById("price").value;
    const stock = document.getElementById("stock").value;
    const category = document.getElementById("category").value;
    const status = document.getElementById("status").value;
    const idToEdit = document.getElementById("idToEditList").value;

    if (!title || !description || !price || !stock || !category) {
        alert("Faltan ingresar campos");
        return
    }

    const productData = {
        title,
        description,
        price,
        stock,
        category,
        status,
        idToEdit
    };

    fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(productData)
    })
    .then(response => response.json())
    .then(data => {
        socket.emit("getAllProducts");
    })
    .catch(error => {
        console.error('Error:', error);
    });

    document.getElementById("addProductForm").reset();
    return;
}


socket.on("actualizarProductos", (products) => {
    const productList = document.getElementById("productList");
    productList.innerHTML = "";
    products.forEach((product) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${product.title}</td>
            <td>${product.description}</td>
            <td>${product.stock}</td>
            <td>${product.category}</td>
            <td>${product.status}</td>
            <td>${product.price}</td>
            <td>${product.stock}</td>
            <td><button onclick="eliminarProducto('${product.id}')">Eliminar</button></td>
            <td>${product.id}</td>
        `;
        productList.appendChild(row);
    });

    const idToEditList = document.getElementById("idToEditList");
    idToEditList.innerHTML = "";
    const noneOption = document.createElement("option");
    noneOption.value = "none";
    noneOption.textContent = "Ninguno";
    idToEditList.appendChild(noneOption);
    products.forEach((product) => {
        const option = document.createElement("option");
        option.value = product.id;
        option.textContent = product.id;
        idToEditList.appendChild(option);
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
        socket.emit("getAllProducts");
    })
    .catch(error => {
        console.error('Error:', error);
    })
}