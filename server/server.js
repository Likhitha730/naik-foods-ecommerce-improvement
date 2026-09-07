const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const products = [
  { id: "p1", name: "Pearl Millet Noodles", price: 120, weight: "180g", category: "Noodles", region: "Pune", vendor: "NaikFoods", description: "Healthy millet noodles for a quick meal.", image: "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=900&q=80" },
  { id: "p2", name: "Little Millet Noodles", price: 120, weight: "180g", category: "Noodles", region: "Pune", vendor: "NaikFoods", description: "Tasty little millet noodles.", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80" },
  { id: "p3", name: "Foxtail Millet Noodles", price: 110, weight: "180g", category: "Noodles", region: "Konkan", vendor: "Bakelite", description: "Quick-cooking foxtail millet noodles.", image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=900&q=80" },
  { id: "p4", name: "Red Joy Butter Garlic Coin Khakhra", price: 99, weight: "200g", category: "Khakhra", region: "Pune", vendor: "RedJoy", description: "Crispy buttery garlic khakhra.", image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80" },
  { id: "p5", name: "Red Joy Thai Chilli Coin Khakhra", price: 105, weight: "200g", category: "Khakhra", region: "Pune", vendor: "RedJoy", description: "Crispy Thai chilli flavoured khakhra.", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=900&q=80" },
  { id: "p6", name: "Red Joy Maggi Coin Khakhra", price: 95, weight: "200g", category: "Khakhra", region: "Pune", vendor: "RedJoy", description: "Classic Maggi-inspired crunchy snack.", image: "https://images.unsplash.com/photo-1621939514649-280e2aa5f12a?auto=format&fit=crop&w=900&q=80" },
  { id: "p7", name: "Relish Veg Chips", price: 99, weight: "65g", category: "Snacks", region: "Nashik", vendor: "NashikLonche", description: "Crunchy vegetable chips.", image: "https://images.unsplash.com/photo-1621447504864-d8686e12698c?auto=format&fit=crop&w=900&q=80" },
  { id: "p8", name: "Shree MoongBhaji Atta", price: 79, weight: "200g", category: "Flour", region: "Vidarbha", vendor: "Shree", description: "Crispy instant bhaji mix.", image: "https://images.unsplash.com/photo-1626776876729-bab436a9a5a1?auto=format&fit=crop&w=900&q=80" },
  { id: "p9", name: "Mukhwas Moctail", price: 90, weight: "100g", category: "Mukhwas", region: "Pune", vendor: "NaikFoods", description: "Fresh and authentic mouth freshener.", image: "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=900&q=80" },
  { id: "p10", name: "Navjeevan Asafoetida Powder", price: 100, weight: "50g", category: "Spices", region: "Pune", vendor: "Navjeevan", description: "Rich hing powder for everyday cooking.", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=80" },
  { id: "p11", name: "Sawai Kolhapuri Misal Rassa Masala", price: 30, weight: "25g", category: "Spices", region: "Pune", vendor: "Gadchiroli", description: "Traditional Kolhapuri misal spice blend.", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=80" },
  { id: "p12", name: "Prakash Masale Kolhapuri Paneer Maratha Masala", price: 30, weight: "25g", category: "Spices", region: "Pune", vendor: "Prakash", description: "Traditional paneer spice blend.", image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=80" }
];

app.get("/", (req, res) => res.json({ message: "Naik Foods API running" }));

app.get("/api/products", (req, res) => {
  res.json(products.map(p => ({ ...p, price: Number(p.price) > 0 ? Number(p.price) : 1 })));
});

app.get("/api/products/:id", (req, res) => {
  const product = products.find(p => p.id === req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ ...product, price: Number(product.price) > 0 ? Number(product.price) : 1 });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || password.length < 6) {
    return res.status(400).json({ message: "Enter a valid email and password of at least 6 characters." });
  }
  res.json({
    user: { id: "demo-user", name: email.split("@")[0], email },
    token: "demo-token-" + Date.now()
  });
});

app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password || password.length < 6) {
    return res.status(400).json({ message: "Name, email and 6+ character password are required." });
  }
  res.status(201).json({
    user: { id: "demo-user", name, email },
    token: "demo-token-" + Date.now()
  });
});

app.post("/api/orders", (req, res) => {
  const { user, items, pincode, address } = req.body;
  if (!user || !items?.length || !pincode || !address) {
    return res.status(400).json({ message: "Login, cart, pincode and address are required." });
  }
  const orderId = "NF" + Date.now().toString().slice(-8);
  const delivery = new Date();
  delivery.setDate(delivery.getDate() + 4);
  res.status(201).json({
    orderId,
    status: "Confirmed",
    orderedAt: new Date().toISOString(),
    expectedDelivery: delivery.toISOString(),
    pincode,
    address,
    items
  });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
