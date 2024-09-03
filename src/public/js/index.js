
document.addEventListener("DOMContentLoaded", () => {
    const socket = io();

    socket.on("updateProducts", (products) => {
        const productList = document.getElementById("product-list");
        productList.innerHTML = "";

        products.forEach((product) => {
            const li = document.createElement("li");
            li.innerHTML = `
                <img src="${product.thumbnails}" alt="${product.title}" class="product-image">
                <h2>${product.title}</h2>
                <p>${product.description}</p>
                <p>Precio: $${product.price}</p>
                <p>Stock: ${product.stock}</p>
                <p>Categoría: ${product.category}</p>
                <button class="delete-btn" data-id="${product.id}">Delete</button>`;
            productList.appendChild(li);
        });
    });

    document.getElementById("product-list").addEventListener("click", (event) => {
        if (event.target.classList.contains("delete-btn")) {
            const productId = parseInt(event.target.getAttribute("data-id"));
            socket.emit("deleteProduct", productId);
        }
    });

    document.getElementById("add-product-form").addEventListener("submit", (event) => {
        event.preventDefault();
        
        const title = document.getElementById("title").value;
        const description = document.getElementById("description").value;
        const price = parseFloat(document.getElementById("price").value);
        const stock = parseInt(document.getElementById("stock").value);
        const category = document.getElementById("category").value;
        const thumbnails = document.getElementById("thumbnails").value;

        if (title && !isNaN(price) && !isNaN(stock)) {
            socket.emit("addProduct", {
                title,
                description,
                price,
                stock,
                category,
                thumbnails
            });
        }
    });

    socket.emit("requestProducts");
});
