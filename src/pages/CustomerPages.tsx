import {
  ArrowRight,
  ChevronLeft,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  SlidersHorizontal,
  Star,
  Trash2,
  Truck,
  UserRound,
} from "lucide-react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { categories, type Product } from "../data/catalog";
import { rupiah, useStore } from "../contexts/StoreContext";

const statusTone = (status: string) => {
  if (status === "Selesai") return "border-success/40 text-success";
  if (status === "Dibatalkan") return "border-danger/40 text-danger";
  if (status === "Dikirim") return "border-accent/40 text-accent";
  return "border-warning/40 text-warning";
};

const ProductCard = ({ p }: { p: Product }) => {
  const { addCart, favorites, toggleFavorite } = useStore();
  const liked = favorites.includes(p.id);

  return (
    <article className="group surface flex flex-col">
      <div className="relative overflow-hidden">
        <Link to={`/product/${p.id}`}>
          <img
            className="card-media transition duration-500 group-hover:scale-[1.03]"
            src={p.image}
            alt={p.name}
          />
        </Link>
        <button
          aria-label="Favorit"
          onClick={() => toggleFavorite(p.id)}
          className={`absolute right-3 top-3 rounded-full border border-line bg-surface/90 p-2 backdrop-blur transition ${
            liked ? "text-accent" : "text-muted hover:text-ink"
          }`}
        >
          <Heart size={16} fill={liked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <span className="eyebrow">{p.category}</span>
        <Link
          to={`/product/${p.id}`}
          className="mt-2 line-clamp-2 min-h-[3rem] text-sm font-semibold leading-6 text-ink transition hover:text-accent"
        >
          {p.name}
        </Link>
        <div className="mt-1 flex items-center gap-1 text-xs text-muted">
          <Star size={13} className="text-warning" fill="currentColor" />
          <span className="text-ink">{p.rating}</span>
          <span>({p.reviews})</span>
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <b className="text-base tabular-nums text-ink">{rupiah(p.price)}</b>
          <button
            aria-label={`Tambah ${p.name}`}
            onClick={() => addCart(p.id)}
            className="rounded-md bg-accent p-2 text-on-accent transition hover:bg-accent-strong"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </article>
  );
};

export function Home() {
  const { products } = useStore();

  return (
    <main>
      <section className="page grid items-center gap-12 lg:grid-cols-[7fr_5fr] lg:py-16">
        <div>
          <p className="eyebrow">Belanja lebih cerdas</p>
          <h1 className="display mt-4 text-4xl leading-[1.05] text-ink sm:text-5xl lg:text-[56px]">
            Kebutuhan kampus, dipilih dengan teliti.
          </h1>
          <p className="mt-5 max-w-[60ch] text-lg leading-relaxed text-muted">
            Produk pilihan dari mitra kampus terverifikasi, dikirim aman langsung ke kos atau
            asrama.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn-primary" to="/catalog">
              Belanja sekarang <ArrowRight size={17} />
            </Link>
            <Link className="btn-secondary" to="/stores">
              Jelajahi toko
            </Link>
          </div>
          <div className="mt-10 flex gap-10 border-t border-line pt-6 text-sm text-muted">
            <span>
              <b className="display block text-2xl text-ink">1.200+</b>
              Produk pilihan
            </span>
            <span>
              <b className="display block text-2xl text-ink">86</b>
              Toko kampus
            </span>
          </div>
        </div>

        <figure>
          <img
            className="aspect-[4/5] w-full rounded-md object-cover"
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=85"
            alt="Mahasiswa belajar"
          />
          <figcaption className="mt-3 flex items-center justify-between text-xs text-muted">
            <span>Kurasi minggu ini</span>
            <span className="tabular-nums">01 / 03</span>
          </figcaption>
        </figure>
      </section>

      <section className="border-y border-line">
        <div className="page flex flex-col gap-4 py-6 md:flex-row md:items-center">
          <p className="eyebrow shrink-0">Kategori</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {categories.map((c) => (
              <Link
                key={c}
                to={`/catalog?category=${encodeURIComponent(c)}`}
                className="text-sm font-medium text-ink transition hover:text-accent"
              >
                {c}
              </Link>
            ))}
          </div>
          <Link
            className="text-sm font-semibold text-accent md:ml-auto"
            to="/catalog"
          >
            Lihat semua
          </Link>
        </div>
      </section>

      <section className="page">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Pilihan editor</p>
            <h2 className="display mt-2 text-3xl text-ink">Produk favorit mahasiswa</h2>
          </div>
          <Link
            className="hidden text-sm font-semibold text-ink underline underline-offset-4 transition hover:text-accent sm:block"
            to="/catalog"
          >
            Semua produk
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products
            .filter((x) => x.featured)
            .slice(0, 4)
            .map((p) => (
              <ProductCard key={p.id} p={p} />
            ))}
        </div>
      </section>

      <section className="bg-accent">
        <div className="page flex flex-col gap-2 py-4 text-sm text-on-accent sm:flex-row sm:items-center sm:justify-between">
          <p>
            <b className="font-semibold">Gratis ongkir</b> untuk pengiriman di area kampus.
          </p>
          <Link to="/promo" className="font-semibold underline underline-offset-4">
            Lihat promo
          </Link>
        </div>
      </section>

      <section className="page pt-0">
        <div className="flex flex-col gap-5 border border-line bg-surface p-6 text-sm sm:flex-row sm:items-center sm:justify-around">
          <span className="flex items-center gap-3">
            <ShieldCheck size={18} className="shrink-0 text-accent" />
            <span>
              <b className="block font-semibold text-ink">Transaksi aman</b>
              <small className="text-muted">Metode bayar terpercaya</small>
            </span>
          </span>
          <span className="flex items-center gap-3">
            <Truck size={18} className="shrink-0 text-accent" />
            <span>
              <b className="block font-semibold text-ink">Siap dikirim</b>
              <small className="text-muted">Ke kampus atau kos kamu</small>
            </span>
          </span>
          <span className="flex items-center gap-3">
            <UserRound size={18} className="shrink-0 text-accent" />
            <span>
              <b className="block font-semibold text-ink">Dukung komunitas</b>
              <small className="text-muted">Beli dari toko lokal kampus</small>
            </span>
          </span>
        </div>
      </section>
    </main>
  );
}

export function Catalog() {
  const { products } = useStore();
  const [params, setParams] = useSearchParams();
  const initialCat = params.get("category");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState(
    initialCat && (categories as readonly string[]).includes(initialCat) ? initialCat : "Semua",
  );
  const [price, setPrice] = useState("all");
  const [rating, setRating] = useState("all");
  const [sort, setSort] = useState("popular");
  const [filterOpen, setFilterOpen] = useState(false);

  const list = useMemo(
    () =>
      products
        .filter(
          (p) =>
            (cat === "Semua" || p.category === cat) &&
            p.name.toLowerCase().includes(q.toLowerCase()) &&
            (price === "all" ||
              (price === "under" && p.price < 100000) ||
              (price === "mid" && p.price >= 100000 && p.price <= 250000) ||
              (price === "over" && p.price > 250000)) &&
            (rating === "all" || p.rating >= Number(rating)),
        )
        .sort((a, b) =>
          sort === "low"
            ? a.price - b.price
            : sort === "high"
              ? b.price - a.price
              : b.rating - a.rating,
        ),
    [products, q, cat, price, rating, sort],
  );

  const chooseCat = (next: string) => {
    setCat(next);
    const query = new URLSearchParams(params);
    if (next === "Semua") query.delete("category");
    else query.set("category", next);
    setParams(query, { replace: true });
  };

  const reset = () => {
    setQ("");
    setPrice("all");
    setRating("all");
    setSort("popular");
    chooseCat("Semua");
  };

  const filters = (
    <div className="space-y-6">
      <label className="eyebrow block">
        Cari
        <input
          className="field mt-2"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Produk atau toko..."
        />
      </label>
      <div>
        <p className="eyebrow">Kategori</p>
        <div className="mt-2 grid gap-1">
          {["Semua", ...categories].map((c) => (
            <button
              key={c}
              aria-pressed={cat === c}
              onClick={() => chooseCat(c)}
              className={`rounded-md px-2 py-1.5 text-left text-sm transition ${
                cat === c
                  ? "bg-surface-2 font-semibold text-ink"
                  : "text-muted hover:text-ink"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="eyebrow block">
          Rentang harga
          <select
            aria-label="Rentang harga"
            className="field mt-2"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          >
            <option value="all">Semua harga</option>
            <option value="under">Di bawah Rp100.000</option>
            <option value="mid">Rp100.000 – Rp250.000</option>
            <option value="over">Di atas Rp250.000</option>
          </select>
        </label>
      </div>
      <div>
        <label className="eyebrow block">
          Rating
          <select
            aria-label="Rating minimum"
            className="field mt-2"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="all">Semua rating</option>
            <option value="4.5">4,5 ke atas</option>
            <option value="4">4,0 ke atas</option>
          </select>
        </label>
      </div>
      <button onClick={reset} className="text-sm font-semibold text-accent">
        Reset filter
      </button>
    </div>
  );

  return (
    <main className="page">
      <p className="eyebrow">Katalog</p>
      <h1 className="display mt-2 text-4xl text-ink">Temukan kebutuhanmu</h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 border border-line bg-surface p-5">{filters}</div>
        </aside>

        <div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              aria-expanded={filterOpen}
              onClick={() => setFilterOpen((v) => !v)}
              className="btn-secondary py-2 lg:hidden"
            >
              <SlidersHorizontal size={16} />
              Filter
            </button>
            <p className="text-sm text-muted">
              <b className="text-ink">{list.length}</b> produk ditemukan
            </p>
            <select
              aria-label="Urutkan produk"
              className="field ml-auto w-auto py-2"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="popular">Terpopuler</option>
              <option value="low">Harga terendah</option>
              <option value="high">Harga tertinggi</option>
            </select>
          </div>

          {filterOpen && (
            <div className="mt-4 border border-line bg-surface p-5 lg:hidden">{filters}</div>
          )}

          {list.length ? (
            <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-3">
              {list.map((p) => (
                <ProductCard key={p.id} p={p} />
              ))}
            </div>
          ) : (
            <div className="empty mt-6">
              <p className="display text-xl">Produk tidak ditemukan</p>
              <p className="mt-2 text-sm text-muted">Coba kata kunci lain atau reset filter.</p>
              <button onClick={reset} className="btn-secondary mt-4">
                Reset filter
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export function ProductDetail() {
  const { id } = useParams();
  const { products, addCart, favorites, toggleFavorite } = useStore();
  const p = products.find((x) => x.id === Number(id));
  const [variant, setVariant] = useState(p?.variants[0] ?? "");
  const [image, setImage] = useState(0);

  useEffect(() => {
    setVariant(p?.variants[0] ?? "");
    setImage(0);
  }, [p?.id, p?.variants]);

  if (!p)
    return (
      <main className="page">
        <div className="empty">
          <p className="display text-xl">Produk tidak ditemukan</p>
          <Link className="btn-secondary mt-4 inline-flex" to="/catalog">
            Kembali ke katalog
          </Link>
        </div>
      </main>
    );

  const liked = favorites.includes(p.id);
  const related = products.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4);

  return (
    <main className="page">
      <Link
        className="inline-flex items-center gap-1 text-sm font-semibold text-muted transition hover:text-ink"
        to="/catalog"
      >
        <ChevronLeft size={16} />
        Kembali ke katalog
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div>
          <div className="flex gap-4">
            <div className="hidden flex-col gap-3 lg:flex">
              {p.images.map((x, i) => (
                <button
                  key={x}
                  onClick={() => setImage(i)}
                  className={`overflow-hidden rounded-md border transition ${
                    i === image ? "border-accent" : "border-line"
                  }`}
                >
                  <img className="h-16 w-16 object-cover" src={x} alt="" />
                </button>
              ))}
            </div>
            <img
              className="aspect-[4/5] flex-1 rounded-md object-cover"
              src={p.images[image]}
              alt={p.name}
            />
          </div>
          <div className="mt-3 flex gap-3 lg:hidden">
            {p.images.map((x, i) => (
              <button
                key={x}
                onClick={() => setImage(i)}
                className={`overflow-hidden rounded-md border transition ${
                  i === image ? "border-accent" : "border-line"
                }`}
              >
                <img className="h-14 w-14 object-cover" src={x} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow">{p.store}</p>
          <h1 className="display mt-2 text-4xl leading-tight text-ink">{p.name}</h1>
          <div className="mt-3 flex items-center gap-2 text-sm text-muted">
            <Star size={15} className="text-warning" fill="currentColor" />
            <span className="text-ink">{p.rating}</span>
            <span>({p.reviews} ulasan)</span>
          </div>
          <p className="mt-5 text-2xl font-semibold tabular-nums text-ink">{rupiah(p.price)}</p>
          <p className="mt-5 max-w-[65ch] leading-relaxed text-muted">{p.description}</p>

          <div className="mt-7">
            <p className="eyebrow">Pilih varian</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {p.variants.map((v) => (
                <button
                  key={v}
                  onClick={() => setVariant(v)}
                  className={`rounded-md border px-4 py-2 text-sm font-medium transition ${
                    v === variant
                      ? "border-ink bg-ink text-canvas"
                      : "border-line text-ink hover:border-ink"
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <p
            className={`mt-5 text-sm font-medium ${
              p.stock < 6 ? "text-warning" : "text-success"
            }`}
          >
            Stok tersedia: {p.stock}
          </p>

          <div className="mt-6 flex gap-3">
            <button onClick={() => addCart(p.id, variant)} className="btn-primary flex-1">
              <ShoppingBag size={17} />
              Tambah ke keranjang
            </button>
            <button
              aria-label="Favorit"
              onClick={() => toggleFavorite(p.id)}
              className={`btn-secondary px-3 ${liked ? "text-accent" : ""}`}
            >
              <Heart size={17} fill={liked ? "currentColor" : "none"} />
            </button>
          </div>

          <div className="mt-8 grid gap-3 border-t border-line pt-6 text-sm text-muted sm:grid-cols-3">
            <span className="flex items-center gap-2">
              <Truck size={16} className="text-accent" /> Dikirim ke kampus
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-accent" /> Pembayaran aman
            </span>
            <span className="flex items-center gap-2">
              <UserRound size={16} className="text-accent" /> Mitra terverifikasi
            </span>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14">
          <p className="eyebrow">Produk terkait</p>
          <h2 className="display mt-2 text-3xl text-ink">Kamu mungkin suka</h2>
          <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
            {related.map((x) => (
              <ProductCard key={x.id} p={x} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

export function Cart() {
  const { cart, products, changeQty } = useStore();
  const nav = useNavigate();
  const items = cart
    .map((i) => ({ ...i, p: products.find((x) => x.id === i.productId)! }))
    .filter((x) => x.p);
  const total = items.reduce((s, i) => s + i.p.price * i.quantity, 0);

  return (
    <main className="page">
      <p className="eyebrow">Keranjang</p>
      <h1 className="display mt-2 text-4xl text-ink">Keranjang belanja</h1>

      {!items.length ? (
        <div className="empty mt-8">
          <ShoppingBag size={32} className="mx-auto text-accent" />
          <p className="display mt-4 text-xl">Keranjangmu masih kosong</p>
          <Link className="btn-primary mt-5 inline-flex" to="/catalog">
            Mulai belanja
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
          <div className="border border-line bg-surface">
            {items.map(({ p, quantity, variant }) => (
              <div
                className="flex gap-4 border-b border-line p-4 last:border-b-0"
                key={`${p.id}-${variant}`}
              >
                <img className="h-20 w-20 rounded-md object-cover" src={p.image} alt={p.name} />
                <div className="min-w-0 flex-1">
                  <b className="font-semibold text-ink">{p.name}</b>
                  <p className="mt-1 text-xs text-muted">{variant}</p>
                  <b className="mt-2 block text-sm tabular-nums text-ink">{rupiah(p.price)}</b>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    aria-label="Hapus produk"
                    onClick={() => changeQty(p.id, -quantity)}
                    className="text-muted transition hover:text-danger"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="flex items-center rounded-md border border-line">
                    <button onClick={() => changeQty(p.id, -1)} className="p-1.5 text-ink">
                      <Minus size={14} />
                    </button>
                    <span className="w-7 text-center text-sm font-semibold tabular-nums">
                      {quantity}
                    </span>
                    <button onClick={() => changeQty(p.id, 1)} className="p-1.5 text-ink">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <aside className="h-fit border border-line bg-surface p-6 lg:sticky lg:top-24">
            <h2 className="display text-xl text-ink">Ringkasan belanja</h2>
            <div className="mt-4 flex justify-between text-sm text-muted">
              <span>Total produk</span>
              <span>{items.length} jenis</span>
            </div>
            <div className="mt-4 flex justify-between border-t border-line pt-4 text-base font-semibold text-ink">
              <span>Total</span>
              <span className="tabular-nums">{rupiah(total)}</span>
            </div>
            <button onClick={() => nav("/checkout")} className="btn-primary mt-5 w-full">
              Lanjut checkout <ArrowRight size={16} />
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}

export function Checkout() {
  const { cart, products, addresses, checkout } = useStore();
  const nav = useNavigate();
  const [address, setAddress] = useState(addresses[0]?.detail ?? "");
  const [payment, setPayment] = useState("QRIS");
  const total = cart.reduce(
    (s, i) => s + (products.find((p) => p.id === i.productId)?.price ?? 0) * i.quantity,
    0,
  );

  if (!cart.length)
    return (
      <main className="page">
        <div className="empty">
          <p className="display text-xl">Keranjang kosong</p>
          <Link className="btn-primary mt-4 inline-flex" to="/catalog">
            Mulai belanja
          </Link>
        </div>
      </main>
    );

  return (
    <main className="page">
      <p className="eyebrow">Checkout</p>
      <h1 className="display mt-2 text-4xl text-ink">Selesaikan pesanan</h1>

      <div className="mt-6 flex flex-wrap items-center gap-2 text-sm">
        {["Informasi", "Pembayaran", "Selesai"].map((s, i) => (
          <span key={s} className="flex items-center gap-2">
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                i === 0 ? "bg-accent text-on-accent" : "border border-line text-muted"
              }`}
            >
              {i + 1}
            </span>
            <span className={i === 0 ? "text-ink" : "text-muted"}>{s}</span>
            {i < 2 && <span className="mx-1 h-px w-6 bg-line" />}
          </span>
        ))}
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="border border-line bg-surface p-6">
            <h2 className="display text-xl text-ink">Alamat pengiriman</h2>
            <select
              className="field mt-4"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            >
              {addresses.map((a) => (
                <option key={a.id} value={a.detail}>
                  {a.label} — {a.recipient}, {a.detail}
                </option>
              ))}
            </select>
            <Link className="mt-3 block text-sm font-semibold text-accent" to="/account">
              Kelola alamat
            </Link>
          </section>

          <section className="border border-line bg-surface p-6">
            <h2 className="display text-xl text-ink">Metode pembayaran</h2>
            <div className="mt-4 grid gap-2">
              {["QRIS", "E-Wallet", "Transfer Bank"].map((x) => (
                <label
                  key={x}
                  className={`flex cursor-pointer items-center justify-between border p-3 transition ${
                    payment === x
                      ? "border-accent bg-accent/5"
                      : "border-line hover:border-ink/40"
                  }`}
                >
                  <span className="font-semibold text-ink">{x}</span>
                  <input
                    checked={payment === x}
                    onChange={() => setPayment(x)}
                    type="radio"
                    name="pay"
                    className="accent-accent"
                  />
                </label>
              ))}
            </div>
          </section>
        </div>

        <aside className="h-fit border border-line bg-surface p-6 lg:sticky lg:top-24">
          <h2 className="display text-xl text-ink">Ringkasan pesanan</h2>
          <div className="mt-4 flex justify-between text-sm text-muted">
            <span>{cart.length} produk</span>
            <span className="tabular-nums">{rupiah(total)}</span>
          </div>
          <input className="field mt-4" placeholder="Kode voucher" />
          <div className="mt-4 flex justify-between border-t border-line pt-4 text-base font-semibold text-ink">
            <span>Total</span>
            <span className="tabular-nums">{rupiah(total)}</span>
          </div>
          <button
            onClick={() => {
              const o = checkout(payment, address);
              if (o) nav("/orders");
            }}
            className="btn-primary mt-5 w-full"
          >
            Bayar sekarang
          </button>
        </aside>
      </div>
    </main>
  );
}

export function Login() {
  const { login } = useStore();
  const nav = useNavigate();
  const [role, setRole] = useState<"buyer" | "staff" | "admin">("buyer");

  return (
    <main className="grid min-h-[80vh] lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img
          className="h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=85"
          alt="Mahasiswa belajar"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <p className="text-xs font-semibold uppercase tracking-[.12em] text-white/70">
            CampusMart
          </p>
          <p className="display mt-2 text-3xl leading-tight">Belanja kebutuhan kampus tanpa ribet.</p>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-14 sm:px-8">
        <div className="w-full max-w-[420px]">
          <p className="eyebrow">Selamat datang</p>
          <h1 className="display mt-2 text-4xl text-ink">Masuk ke CampusMart</h1>
          <p className="mt-3 text-sm text-muted">
            Prototype: pilih peran untuk melihat alur yang berbeda.
          </p>

          <label className="mt-7 block text-sm font-medium text-ink" htmlFor="login-email">
            Email
          </label>
          <input id="login-email" className="field mt-2" defaultValue="alya@kampus.ac.id" />

          <label className="mt-4 block text-sm font-medium text-ink" htmlFor="login-role">
            Peran demo
          </label>
          <select
            id="login-role"
            className="field mt-2"
            value={role}
            onChange={(e) => setRole(e.target.value as typeof role)}
          >
            <option value="buyer">Pembeli</option>
            <option value="staff">Staff admin</option>
            <option value="admin">Super admin</option>
          </select>

          <button
            onClick={() => {
              login(role);
              nav(role === "buyer" ? "/" : "/admin");
            }}
            className="btn-primary mt-6 w-full"
          >
            Masuk
          </button>

          <p className="mt-6 text-center text-sm text-muted">
            <Link className="font-semibold text-accent" to="/forgot">
              Lupa kata sandi?
            </Link>{" "}
            · Belum punya akun?{" "}
            <Link className="font-semibold text-accent" to="/register">
              Daftar
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export function SimpleAuth({ type }: { type: "register" | "forgot" }) {
  return (
    <main className="grid min-h-[70vh] place-items-center px-5 py-14">
      <div className="w-full max-w-[420px]">
        <p className="eyebrow">{type === "register" ? "Akun baru" : "Pemulihan akun"}</p>
        <h1 className="display mt-2 text-4xl text-ink">
          {type === "register" ? "Buat akun baru" : "Pulihkan akun"}
        </h1>
        <p className="mt-3 text-sm text-muted">
          {type === "register"
            ? "Daftar untuk mulai belanja di CampusMart."
            : "Kami akan mengirim tautan pemulihan ke emailmu."}
        </p>

        {type === "register" && (
          <>
            <label className="mt-7 block text-sm font-medium text-ink" htmlFor="auth-name">
              Nama lengkap
            </label>
            <input id="auth-name" className="field mt-2" placeholder="Nama lengkap" />
          </>
        )}

        <label
          className={`block text-sm font-medium text-ink ${type === "register" ? "mt-4" : "mt-7"}`}
          htmlFor="auth-email"
        >
          Email kampus
        </label>
        <input id="auth-email" className="field mt-2" placeholder="Email kampus" />

        <Link to="/login" className="btn-primary mt-6 w-full">
          {type === "register" ? "Daftar" : "Kirim tautan"}
        </Link>
      </div>
    </main>
  );
}

export function Account({ tab = "profile" }: { tab?: "profile" | "orders" | "wishlist" }) {
  const { user, orders, products, favorites, addresses, saveAddress } = useStore();
  const my = orders.filter((o) => !user || o.customer === user.name);

  const navItems = [
    ["/account", "Profil & alamat", "profile"],
    ["/orders", "Pesanan saya", "orders"],
    ["/wishlist", "Wishlist", "wishlist"],
  ] as const;

  return (
    <main className="page">
      <div className="border-b border-line pb-6">
        <p className="eyebrow">Akun saya</p>
        <h1 className="display mt-2 text-3xl text-ink">{user?.name ?? "Tamu"}</h1>
        <p className="mt-1 text-sm text-muted">
          {user?.email ?? "Silakan masuk untuk mengelola akun."}
        </p>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="h-fit">
          <nav className="grid gap-1">
            {navItems.map(([to, label, key]) => (
              <Link
                key={to}
                to={to}
                className={`border-l-2 py-2 pl-3 text-sm font-medium transition ${
                  tab === key
                    ? "border-accent text-ink"
                    : "border-transparent text-muted hover:text-ink"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </aside>

        <section>
          {tab === "profile" && (
            <div className="space-y-6">
              <div className="border border-line bg-surface p-6">
                <h2 className="display text-xl text-ink">Profil</h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-ink">Nama</label>
                    <input className="field mt-2" defaultValue={user?.name} />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-ink">Email</label>
                    <input className="field mt-2" defaultValue={user?.email} />
                  </div>
                </div>
                <button className="btn-primary mt-5">Simpan perubahan</button>
              </div>

              <div className="border border-line bg-surface p-6">
                <h2 className="display text-xl text-ink">Alamat tersimpan</h2>
                <div className="mt-4 grid gap-3">
                  {addresses.map((a) => (
                    <div className="border border-line p-4" key={a.id}>
                      <b className="text-sm font-semibold text-ink">{a.label}</b>
                      <p className="mt-1 text-sm text-muted">
                        {a.recipient} · {a.phone}
                        <br />
                        {a.detail}
                      </p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() =>
                    saveAddress({
                      id: crypto.randomUUID(),
                      label: "Alamat baru",
                      recipient: user?.name ?? "Pengguna",
                      phone: "",
                      detail: "Lengkapi alamat baru",
                    })
                  }
                  className="btn-secondary mt-4"
                >
                  Tambah alamat
                </button>
              </div>
            </div>
          )}

          {tab === "orders" && (
            <div className="border border-line bg-surface">
              <div className="border-b border-line p-6">
                <h2 className="display text-xl text-ink">Riwayat pesanan</h2>
              </div>
              {my.length ? (
                my.map((o) => (
                  <div key={o.id} className="border-b border-line p-6 last:border-b-0">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <b className="text-sm font-semibold tabular-nums text-ink">{o.id}</b>
                        <p className="mt-1 text-sm text-muted">
                          {o.createdAt} · {o.payment}
                        </p>
                      </div>
                      <span className={`badge ${statusTone(o.status)}`}>{o.status}</span>
                    </div>
                    <div className="mt-3 flex justify-between text-sm">
                      <span className="text-muted">{o.items.length} produk</span>
                      <b className="tabular-nums text-ink">{rupiah(o.total)}</b>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-sm text-muted">Belum ada pesanan.</div>
              )}
            </div>
          )}

          {tab === "wishlist" &&
            (favorites.length ? (
              <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
                {products
                  .filter((p) => favorites.includes(p.id))
                  .map((p) => (
                    <ProductCard key={p.id} p={p} />
                  ))}
              </div>
            ) : (
              <div className="empty">
                <p className="display text-xl">Belum ada produk favorit</p>
                <Link className="btn-secondary mt-4 inline-flex" to="/catalog">
                  Jelajahi katalog
                </Link>
              </div>
            ))}
        </section>
      </div>
    </main>
  );
}

export function Promo() {
  const { vouchers } = useStore();
  const active = vouchers.filter((v) => v.active);

  return (
    <main className="page">
      <p className="eyebrow">Hemat lebih banyak</p>
      <h1 className="display mt-2 text-4xl text-ink">Promo untuk kamu</h1>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {active.map((v) => (
          <div key={v.id} className="flex flex-col border border-line bg-surface sm:flex-row">
            <div className="min-w-0 flex-1 p-6">
              <p className="eyebrow">{v.scope}</p>
              <p className="display mt-3 break-words text-3xl tracking-[.12em] text-ink">{v.code}</p>
              <p className="mt-3 text-sm text-muted">
                Diskon {v.type === "Persen" ? `${v.value}%` : rupiah(v.value)}
              </p>
            </div>
            <div className="flex items-center border-t border-dashed border-line p-6 sm:border-l sm:border-t-0">
              <button className="btn-primary w-full whitespace-nowrap sm:w-auto">
                Gunakan voucher
              </button>
            </div>
          </div>
        ))}
        {!active.length && (
          <div className="empty md:col-span-2">
            <p className="display text-xl">Belum ada promo aktif</p>
          </div>
        )}
      </div>
    </main>
  );
}

export function Stores() {
  const { products } = useStore();
  const groups = Object.entries(
    products.reduce<Record<string, Product[]>>((a, p) => {
      (a[p.store] ??= []).push(p);
      return a;
    }, {}),
  );

  return (
    <main className="page">
      <p className="eyebrow">Mitra kampus</p>
      <h1 className="display mt-2 text-4xl text-ink">Toko pilihan</h1>

      <div className="mt-8 grid gap-x-12 md:grid-cols-2">
        {groups.map(([name, items]) => (
          <article key={name} className="flex items-center gap-4 border-b border-line py-5">
            <span className="display flex h-12 w-12 items-center justify-center bg-surface-2 text-xl text-ink">
              {name[0]}
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="display text-lg text-ink">{name}</h2>
              <p className="mt-0.5 text-sm text-muted">
                {items.length} produk · Mitra terverifikasi
              </p>
            </div>
            <Link
              to="/catalog"
              className="flex items-center gap-1 text-sm font-semibold text-ink transition hover:text-accent"
            >
              Kunjungi <ArrowRight size={15} />
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
