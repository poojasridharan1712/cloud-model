
const express = require("express");
const app = express();

app.use(express.json());

const products = [
    { id: 1, name: "Laptop", price: 65000 },
    { id: 2, name: "Mouse", price: 500 },
    { id: 3, name: "Keyboard", price: 1200 }
];
// Home route
app.get("/", (req, res) => {
    res.send("Product REST API is Running");
});

// GET all products
app.get("/api/products", (req, res) => {
    res.send(products);
});

// GET product by ID
app.get("/api/products/:id", (req, res) => {
    const product = products.find(
        p => p.id === parseInt(req.params.id)
    );

    if (!product) {
        return res.status(404).send("Product not found");
    }
    res.send(product);
});
// POST a new product
app.post("/api/products", (req, res) => {
    const product = {
        id: products.length
            ? Math.max(...products.map(p => p.id)) + 1
            : 1,
        name: req.body.name,
        price: req.body.price
    };
    products.push(product);
    res.status(201).send(product);
});
// PUT - Update product
app.put("/api/products/:id", (req, res) => {
    const product = products.find(
        p => p.id === parseInt(req.params.id)
    );
    if (!product) {
        return res.status(404).send("Product not found");
    }

    product.name = req.body.name;
    product.price = req.body.price;

    res.send(product);
});
// DELETE product
app.delete("/api/products/:id", (req, res) => {
    const index = products.findIndex(
        p => p.id === parseInt(req.params.id)
    );

    if (index === -1) {
        return res.status(404).send("Product not found");
    }
    const deletedProduct = products.splice(index, 1)[0];

    res.send(deletedProduct);
});
// Start server
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

