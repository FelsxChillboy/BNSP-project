import {
  BarChart3,
  Boxes,
  Gift,
  LayoutDashboard,
  LogOut,
  Menu,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { categories, type Order, type Product, type Voucher } from "../data/catalog";
import { rupiah, useStore } from "../contexts/StoreContext";

const nav = [
  ["/admin", "Dashboard", LayoutDashboard],
  ["/admin/products", "Produk", Package],
  ["/admin/orders", "Pesanan", ShoppingBag],
  ["/admin/users", "Users", Users],
  ["/admin/customers", "Pelanggan", Users],
  ["/admin/promos", "Promo", Gift],
  ["/admin/categories", "Kategori", Boxes],
  ["/admin/settings", "Pengaturan", Settings],
] as const;

const toneMap: Record<string, string> = {
  Selesai: "border-success/40 text-success",
  Aktif: "border-success/40 text-success",
  Dikirim: "border-accent/40 text-accent",
  Nonaktif: "border-line text-muted",
  Dibatalkan: "border-danger/40 text-danger",
  Diblokir: "border-danger/40 text-danger",
};

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { user, logout, theme, toggleTheme } = useStore();
  const go = useNavigate();

  return (
    <div className="min-h-screen bg-canvas">
      {open && (
        <button
          aria-label="Tutup menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-ink/30 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-line bg-surface transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <span className="display text-xl text-ink">
            Campus<span className="text-accent">Mart</span>
          </span>
          <button
            aria-label="Tutup menu"
            className="text-ink lg:hidden"
            onClick={() => setOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <p className="eyebrow px-5 pt-6">Operasional</p>
        <nav className="mt-2 grid gap-1 px-3">
          {nav.map(([to, label, Icon]) => (
            <NavLink
              end={to === "/admin"}
              to={to}
              key={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 border-l-2 py-2.5 pl-3 text-sm font-medium transition ${
                  isActive
                    ? "border-accent bg-surface-2 text-ink"
                    : "border-transparent text-muted hover:text-ink"
                }`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto border-t border-line p-5">
          <p className="text-sm font-semibold text-ink">{user?.name}</p>
          <p className="mt-0.5 text-xs text-muted">
            {user?.role === "admin" ? "Super admin" : "Staff operasional"}
          </p>
          <button
            onClick={() => {
              logout();
              go("/login");
            }}
            className="mt-3 flex items-center gap-2 text-sm font-semibold text-danger"
          >
            <LogOut size={15} />
            Keluar
          </button>
        </div>
      </aside>

      <main className="lg:pl-60">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-canvas/95 px-4 backdrop-blur sm:px-7">
          <button
            aria-label="Buka menu"
            className="text-ink lg:hidden"
            onClick={() => setOpen(true)}
          >
            <Menu size={20} />
          </button>
          <div className="hidden max-w-md flex-1 items-center gap-2 border border-line bg-surface px-3 py-2 md:flex">
            <Search size={15} className="text-muted" />
            <input
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted/60"
              placeholder="Cari data..."
            />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button onClick={toggleTheme} className="btn-secondary px-3 py-2 text-xs">
              {theme === "light" ? "Gelap" : "Terang"}
            </button>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-xs font-semibold text-canvas">
              {user?.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

const Page = ({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) => (
  <div className="mx-auto w-full max-w-[1200px] px-5 py-8 sm:px-8 lg:px-10">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="eyebrow">Administrasi</p>
        <h1 className="display mt-2 text-3xl text-ink">{title}</h1>
      </div>
      {action}
    </div>
    {children}
  </div>
);

const Status = ({ children }: { children: React.ReactNode }) => {
  const label = String(children);
  return <span className={`badge ${toneMap[label] ?? "border-line text-muted"}`}>{children}</span>;
};

export function Dashboard() {
  const { orders, products, users } = useStore();
  const revenue = orders.reduce((s, o) => s + o.total, 0);
  const stats = [
    ["Pendapatan bulan ini", rupiah(revenue), "↑ 12,5%"],
    ["Total pesanan", orders.length, "↑ 8,2%"],
    ["Pelanggan aktif", users.filter((x) => x.role === "buyer").length, "↑ 4,8%"],
    ["Stok menipis", products.filter((x) => x.stock < 10).length, "Butuh perhatian"],
  ];

  return (
    <Page
      title="Dashboard"
      action={
        <select className="field w-auto">
          <option>30 hari terakhir</option>
          <option>Bulan ini</option>
        </select>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([label, value, delta]) => (
          <div className="border border-line bg-surface p-5" key={label}>
            <p className="eyebrow">{label}</p>
            <b className="display mt-2 block text-3xl tabular-nums text-ink">{value}</b>
            <span className="mt-3 inline-block text-xs font-medium text-success">{delta}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="border border-line bg-surface p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="display text-xl text-ink">Tren penjualan</h2>
              <p className="mt-1 text-sm text-muted">Pendapatan 7 hari terakhir</p>
            </div>
            <BarChart3 className="text-accent" size={20} />
          </div>
          <div className="mt-8 flex h-52 items-end justify-between gap-2">
            {[38, 52, 45, 72, 60, 88, 78].map((h, i) => (
              <div className="flex flex-1 flex-col items-center gap-2" key={i}>
                <div style={{ height: `${h}%` }} className="w-full rounded-t-sm bg-accent/80" />
                <small className="text-xs text-muted">
                  {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"][i]}
                </small>
              </div>
            ))}
          </div>
        </section>

        <section className="border border-line bg-surface p-6">
          <h2 className="display text-xl text-ink">Stok menipis</h2>
          <div className="mt-4 grid gap-3">
            {products
              .filter((p) => p.stock < 10)
              .map((p) => (
                <div className="flex items-center gap-3" key={p.id}>
                  <img className="h-10 w-10 rounded-sm object-cover" src={p.image} alt="" />
                  <div className="min-w-0 flex-1">
                    <b className="block truncate text-sm font-medium text-ink">{p.name}</b>
                    <small className="text-warning">Sisa {p.stock} unit</small>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>

      <section className="mt-6 overflow-hidden border border-line bg-surface">
        <div className="border-b border-line p-6">
          <h2 className="display text-xl text-ink">Pesanan terbaru</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="table min-w-150">
            <thead>
              <tr>
                <th>Pesanan</th>
                <th>Pelanggan</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id}>
                  <td className="font-semibold tabular-nums">{o.id}</td>
                  <td>{o.customer}</td>
                  <td className="tabular-nums">{rupiah(o.total)}</td>
                  <td>
                    <Status>{o.status}</Status>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Page>
  );
}

function ProductForm({ initial, onDone }: { initial?: Product; onDone: () => void }) {
  const { saveProduct } = useStore();
  const [p, setP] = useState<Product>(
    initial ?? {
      id: 0,
      name: "",
      description: "",
      price: 0,
      stock: 0,
      rating: 4.5,
      reviews: 0,
      category: categories[0],
      tags: [],
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
      images: [],
      store: "Campus Store",
      variants: ["Default"],
    },
  );

  const set = (k: keyof Product, v: string | number) => setP((x) => ({ ...x, [k]: v }));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        saveProduct({ ...p, id: p.id || Date.now(), images: [p.image] });
        onDone();
      }}
      className="mt-5 grid gap-4 border border-line bg-surface p-6 md:grid-cols-2"
    >
      <input
        required
        className="field"
        value={p.name}
        onChange={(e) => set("name", e.target.value)}
        placeholder="Nama produk"
      />
      <select
        className="field"
        value={p.category}
        onChange={(e) => set("category", e.target.value)}
      >
        {categories.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      <input
        required
        type="number"
        className="field"
        value={p.price}
        onChange={(e) => set("price", Number(e.target.value))}
        placeholder="Harga"
      />
      <input
        required
        type="number"
        className="field"
        value={p.stock}
        onChange={(e) => set("stock", Number(e.target.value))}
        placeholder="Stok"
      />
      <input
        className="field md:col-span-2"
        value={p.image}
        onChange={(e) => set("image", e.target.value)}
        placeholder="URL gambar"
      />
      <textarea
        className="field md:col-span-2"
        value={p.description}
        onChange={(e) => set("description", e.target.value)}
        placeholder="Deskripsi"
      />
      <div className="flex gap-2 md:col-span-2">
        <button className="btn-primary">Simpan produk</button>
        <button type="button" onClick={onDone} className="btn-secondary">
          Batal
        </button>
      </div>
    </form>
  );
}

export function ProductsAdmin() {
  const { products, deleteProduct } = useStore();
  const [form, setForm] = useState<Product | undefined | false>(false);
  const [q, setQ] = useState("");
  const list = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <Page
      title="Manajemen produk"
      action={
        <button onClick={() => setForm(undefined)} className="btn-primary">
          <Plus size={16} />
          Produk baru
        </button>
      }
    >
      <input
        className="field max-w-md"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Cari produk..."
      />
      {form !== false && <ProductForm initial={form || undefined} onDone={() => setForm(false)} />}

      <div className="mt-5 overflow-x-auto border border-line bg-surface">
        <table className="table min-w-175">
          <thead>
            <tr>
              <th>Produk</th>
              <th>Kategori</th>
              <th>Harga</th>
              <th>Stok</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id}>
                <td>
                  <div className="flex items-center gap-3">
                    <img className="h-10 w-10 rounded-sm object-cover" src={p.image} alt="" />
                    <b className="font-medium text-ink">{p.name}</b>
                  </div>
                </td>
                <td>{p.category}</td>
                <td className="tabular-nums">{rupiah(p.price)}</td>
                <td>
                  <Status>{p.stock} unit</Status>
                </td>
                <td>
                  <button
                    onClick={() => setForm(p)}
                    className="mr-3 font-semibold text-accent"
                  >
                    Edit
                  </button>
                  <button onClick={() => deleteProduct(p.id)} className="font-semibold text-danger">
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  );
}

export function OrdersAdmin() {
  const { orders, updateOrder } = useStore();
  const [filter, setFilter] = useState("Semua");
  const list = orders.filter((o) => filter === "Semua" || o.status === filter);
  const statuses = ["Menunggu Pembayaran", "Diproses", "Dikirim", "Selesai", "Dibatalkan"];

  return (
    <Page
      title="Manajemen pesanan"
      action={
        <select
          className="field w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>Semua</option>
          {statuses.map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
      }
    >
      <div className="overflow-x-auto border border-line bg-surface">
        <table className="table min-w-175">
          <thead>
            <tr>
              <th>ID / Tanggal</th>
              <th>Pelanggan</th>
              <th>Pembayaran</th>
              <th>Total</th>
              <th>Status</th>
              <th>Invoice</th>
            </tr>
          </thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id}>
                <td>
                  <b className="font-semibold tabular-nums">{o.id}</b>
                  <small className="block text-muted">{o.createdAt}</small>
                </td>
                <td>{o.customer}</td>
                <td>{o.payment}</td>
                <td className="tabular-nums">{rupiah(o.total)}</td>
                <td>
                  <select
                    className="field w-auto py-1 text-xs"
                    value={o.status}
                    onChange={(e) => updateOrder(o.id, e.target.value as Order["status"])}
                  >
                    {statuses.map((x) => (
                      <option key={x}>{x}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    onClick={() => window.print()}
                    className="font-semibold text-accent"
                  >
                    Cetak
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  );
}

export function CustomersAdmin() {
  const { users, orders, toggleBlock } = useStore();
  const [q, setQ] = useState("");
  const list = users.filter(
    (u) => u.role === "buyer" && u.name.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <Page title="Pelanggan">
      <input
        className="field max-w-md"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Cari pelanggan..."
      />
      <div className="mt-5 overflow-x-auto border border-line bg-surface">
        <table className="table min-w-150">
          <thead>
            <tr>
              <th>Pelanggan</th>
              <th>Email</th>
              <th>Transaksi</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id}>
                <td className="font-semibold text-ink">{u.name}</td>
                <td>{u.email}</td>
                <td>{orders.filter((o) => o.customer === u.name).length} pesanan</td>
                <td>
                  <Status>{u.blocked ? "Diblokir" : "Aktif"}</Status>
                </td>
                <td>
                  <button
                    onClick={() => toggleBlock(u.id)}
                    className={`font-semibold ${u.blocked ? "text-success" : "text-danger"}`}
                  >
                    {u.blocked ? "Aktifkan" : "Blokir"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Page>
  );
}

function VoucherForm({ initial, onDone }: { initial?: Voucher; onDone: () => void }) {
  const { saveVoucher } = useStore();
  const [v, setV] = useState<Voucher>(
    initial ?? {
      id: crypto.randomUUID(),
      code: "",
      type: "Persen",
      value: 10,
      active: true,
      scope: "Semua produk",
    },
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        saveVoucher(v);
        onDone();
      }}
      className="mt-5 grid gap-4 border border-line bg-surface p-6 md:grid-cols-2"
    >
      <input
        required
        className="field"
        placeholder="Kode voucher"
        value={v.code}
        onChange={(e) => setV({ ...v, code: e.target.value.toUpperCase() })}
      />
      <select
        className="field"
        value={v.type}
        onChange={(e) => setV({ ...v, type: e.target.value as Voucher["type"] })}
      >
        <option>Persen</option>
        <option>Nominal</option>
      </select>
      <input
        className="field"
        type="number"
        value={v.value}
        onChange={(e) => setV({ ...v, value: Number(e.target.value) })}
      />
      <input
        className="field"
        placeholder="Cakupan promo"
        value={v.scope}
        onChange={(e) => setV({ ...v, scope: e.target.value })}
      />
      <button className="btn-primary">Simpan voucher</button>
      <button type="button" onClick={onDone} className="btn-secondary">
        Batal
      </button>
    </form>
  );
}

export function PromosAdmin() {
  const { vouchers, deleteVoucher } = useStore();
  const [form, setForm] = useState<Voucher | undefined | false>(false);

  return (
    <Page
      title="Promo & diskon"
      action={
        <button onClick={() => setForm(undefined)} className="btn-primary">
          <Plus size={16} />
          Voucher baru
        </button>
      }
    >
      {form !== false && <VoucherForm initial={form || undefined} onDone={() => setForm(false)} />}

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        {vouchers.map((v) => (
          <article className="border border-line bg-surface p-6" key={v.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow">{v.scope}</p>
                <h2 className="display mt-2 text-2xl tracking-[.06em] text-ink">{v.code}</h2>
              </div>
              <Status>{v.active ? "Aktif" : "Nonaktif"}</Status>
            </div>
            <p className="mt-4 font-semibold text-ink">
              {v.type === "Persen" ? `${v.value}%` : rupiah(v.value)} diskon
            </p>
            <div className="mt-5 flex gap-4 border-t border-line pt-4 text-sm">
              <button onClick={() => setForm(v)} className="font-semibold text-accent">
                Edit
              </button>
              <button onClick={() => deleteVoucher(v.id)} className="font-semibold text-danger">
                Hapus
              </button>
            </div>
          </article>
        ))}
      </div>
    </Page>
  );
}

export function CategoriesAdmin() {
  return (
    <Page title="Kategori & tag">
      <div className="border border-line bg-surface p-6">
        <h2 className="display text-xl text-ink">Kategori aktif</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((c, i) => (
            <span
              key={c}
              className="border border-line bg-surface-2 px-3 py-1.5 text-sm font-medium text-ink"
            >
              {c} <small className="ml-2 text-muted">#{i + 1}</small>
            </span>
          ))}
        </div>
        <div className="mt-6 flex max-w-md gap-2">
          <input className="field" placeholder="Kategori baru" />
          <button className="btn-primary whitespace-nowrap">Tambah</button>
        </div>
        <p className="mt-3 text-sm text-muted">
          Kategori disiapkan sebagai data katalog; perubahan struktur kategori dapat dihubungkan ke
          API pada tahap berikutnya.
        </p>
      </div>
    </Page>
  );
}

export function SettingsAdmin() {
  return (
    <Page title="Pengaturan">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="border border-line bg-surface p-6">
          <h2 className="display text-xl text-ink">Profil organisasi</h2>
          <div className="mt-4 grid gap-4">
            <div>
              <label className="text-sm font-medium text-ink">Nama organisasi</label>
              <input className="field mt-2" defaultValue="CampusMart" />
            </div>
            <div>
              <label className="text-sm font-medium text-ink">Email dukungan</label>
              <input className="field mt-2" defaultValue="support@campusmart.id" />
            </div>
          </div>
        </div>
        <div className="border border-line bg-surface p-6">
          <h2 className="display text-xl text-ink">Deskripsi</h2>
          <textarea
            className="field mt-4"
            defaultValue="Marketplace kebutuhan mahasiswa dan kampus."
          />
          <button className="btn-primary mt-5">Simpan pengaturan</button>
        </div>
      </div>
    </Page>
  );
}
