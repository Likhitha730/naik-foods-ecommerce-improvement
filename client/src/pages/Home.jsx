import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useStore } from "../context/StoreContext";

const sortOptions = [
  ["newest", "Newest first"],
  ["price-desc", "Price: high to low"],
  ["price-asc", "Price: low to high"],
  ["name-asc", "Name: A → Z"],
  ["name-desc", "Name: Z → A"]
];

export default function Home() {
  const { products, wishlist } = useStore();
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [category, setCategory] = useState("All");
  const [region, setRegion] = useState("All");
  const [vendor, setVendor] = useState("All");

  const categories = ["All", ...new Set(products.map(p => p.category))];
  const regions = ["All", ...new Set(products.map(p => p.region))];
  const vendors = ["All", ...new Set(products.map(p => p.vendor))];
  const onlyWishlist = params.get("wishlist") === "1";

  // Make navbar links work even when the user is currently on another page.
  useEffect(() => {
    const section = params.get("section");
    if (!section) return;

    const timer = setTimeout(() => {
      document.getElementById(section)?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [params]);

  const visible = useMemo(() => {
    let result = products.filter(p => Number(p.price) > 0);

    if (onlyWishlist) result = result.filter(p => wishlist.includes(p.id));
    if (search.trim()) result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase().trim()));
    if (category !== "All") result = result.filter(p => p.category === category);
    if (region !== "All") result = result.filter(p => p.region === region);
    if (vendor !== "All") result = result.filter(p => p.vendor === vendor);

    const copy = [...result];

    if (sort === "price-desc") copy.sort((a,b) => Number(b.price) - Number(a.price));
    if (sort === "price-asc") copy.sort((a,b) => Number(a.price) - Number(b.price));
    if (sort === "name-asc") copy.sort((a,b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
    if (sort === "name-desc") copy.sort((a,b) => b.name.localeCompare(a.name, undefined, { sensitivity: "base" }));

    return copy;
  }, [products, wishlist, search, sort, category, region, vendor, onlyWishlist]);

  const clear = () => {
    setSearch("");
    setSort("newest");
    setCategory("All");
    setRegion("All");
    setVendor("All");
    setParams({});
  };

  const clearSectionParam = () => {
    if (params.get("section")) setParams(prev => {
      prev.delete("section");
      return prev;
    });
  };

  return (
    <div>
      <section className="hero">
        <div>
          <span className="eyebrow">AUTHENTIC · HEALTHY · REGIONAL</span>
          <h1>Traditional goodness,<br/>delivered to your door.</h1>
          <p>Explore authentic foods, snacks, spices and millet products.</p>
          <button className="primary" onClick={() => {
            document.getElementById("shop")?.scrollIntoView({ behavior: "smooth" });
            clearSectionParam();
          }}>Shop Products</button>
        </div>
        <div className="hero-art">
          <div className="hero-circle">Naik<br/><b>Foods</b></div>
        </div>
      </section>

      <section className="shop-layout" id="shop">
        <aside className="filters">
          <div className="search-box">
            <Search size={19}/>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." />
          </div>

          <label>Sort by</label>
          <select value={sort} onChange={e => setSort(e.target.value)}>
            {sortOptions.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
          </select>

          <Filter title="Category" values={categories} value={category} onChange={setCategory}/>
          <Filter title="Region" values={regions} value={region} onChange={setRegion}/>
          <Filter title="Vendor" values={vendors} value={vendor} onChange={setVendor}/>

          {(search || sort !== "newest" || category !== "All" || region !== "All" || vendor !== "All" || onlyWishlist) &&
            <button className="clear" onClick={clear}><X size={17}/> Clear all filters</button>}
        </aside>

        <section className="products-area">
          <div className="shop-heading">
            <div>
              <span className="eyebrow">OUR COLLECTION</span>
              <h2>{onlyWishlist ? "Wishlist" : "All Products"}</h2>
            </div>
            <span className="result-count">{visible.length} products</span>
          </div>

          {visible.length ? (
            <div className="product-grid">
              {visible.map(p => <ProductCard key={p.id} product={p}/>)}
            </div>
          ) : (
            <div className="empty"><h3>No products found</h3><button className="primary" onClick={clear}>Reset filters</button></div>
          )}
        </section>
      </section>

      <section className="features" id="about">
        <div><b>🚚 Free Delivery</b><span>Minimum order ₹399</span></div>
        <div><b>◷ 24/7 Support</b><span>Contact us anytime</span></div>
        <div><b>🔒 Secure Pay</b><span>100% secure payment</span></div>
        <div><b>↩ Easy Returns</b><span>Within 30 days</span></div>
      </section>

      <section className="content-section" id="blogs">
        <span className="eyebrow">FROM OUR BLOG</span>
        <h2>Food stories & healthy living</h2>
        <div className="blog-grid">
          <article className="blog-card">
            <h3>Traditional foods of India</h3>
            <p>Discover regional snacks, spices and homemade favourites.</p>
            <button onClick={() => alert("Blog preview: Traditional foods of India")}>Read More</button>
          </article>
          <article className="blog-card">
            <h3>Why millets matter</h3>
            <p>Learn how traditional grains can become part of a balanced diet.</p>
            <button onClick={() => alert("Blog preview: Why millets matter")}>Read More</button>
          </article>
          <article className="blog-card">
            <h3>From local vendors to your home</h3>
            <p>See how authentic products are brought from regional sellers.</p>
            <button onClick={() => alert("Blog preview: Local vendors")}>Read More</button>
          </article>
        </div>
      </section>

      <section className="content-section contact-section" id="contact">
        <span className="eyebrow">GET IN TOUCH</span>
        <h2>Contact Naik Foods</h2>
        <p>Have a question about an order or product? Our support team is here to help.</p>
        <div className="contact-actions">
          <a className="primary" href="mailto:support@naikfoods.example">Email Support</a>
          <a className="secondary" href="tel:+919999999999">Call Support</a>
        </div>
      </section>
    </div>
  );
}

function Filter({ title, values, value, onChange }) {
  return (
    <div className="filter">
      <h3>{title}</h3>
      {values.map(v => (
        <label className="check" key={v}>
          <input type="radio" name={title} checked={value === v} onChange={() => onChange(v)} />
          <span>{v}</span>
        </label>
      ))}
    </div>
  );
}
