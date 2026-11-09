import { Heart, Menu, Moon, Search, ShoppingBag, Sun, UserRound, X } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { useStore } from "../contexts/StoreContext";

const nav = [
  ["/", "Beranda"],
  ["/catalog", "Belanja"],
  ["/promo", "Promo"],
  ["/stores", "Toko"],
] as const;

const currentYear = new Date().getFullYear();

export function CustomerShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { cart, user, theme, toggleTheme } = useStore();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-canvas/95 backdrop-blur">
        <div className="mx-auto flex h-[72px] max-w-[1200px] items-center gap-4 px-5 sm:px-8 lg:px-12">
          <Link to="/" className="display text-2xl text-ink">
            Campus<span className="text-accent">Mart</span>
          </Link>

          <nav className="ml-6 hidden items-center gap-6 lg:flex">
            {nav.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  `border-b-2 pb-1 text-sm font-semibold transition ${
                    isActive
                      ? "border-accent text-ink"
                      : "border-transparent text-muted hover:text-ink"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <div className="hidden items-center gap-2 sm:flex">
              {searchOpen ? (
                <>
                  <input
                    autoFocus
                    aria-label="Cari produk"
                    className="field h-9 w-56 py-1.5"
                    placeholder="Cari kebutuhan kampus..."
                  />
                  <button
                    aria-label="Tutup pencarian"
                    onClick={() => setSearchOpen(false)}
                    className="rounded-md p-2 text-muted transition hover:bg-ink/5 hover:text-ink"
                  >
                    <X size={18} />
                  </button>
                </>
              ) : (
                <button
                  aria-label="Buka pencarian"
                  onClick={() => setSearchOpen(true)}
                  className="rounded-md p-2 text-ink transition hover:bg-ink/5"
                >
                  <Search size={19} />
                </button>
              )}
            </div>

            <button
              aria-label={searchOpen ? "Tutup pencarian" : "Buka pencarian"}
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((v) => !v)}
              className="rounded-md p-2 text-ink transition hover:bg-ink/5 sm:hidden"
            >
              <Search size={19} />
            </button>

            <button
              aria-label="Ganti tema"
              onClick={toggleTheme}
              className="rounded-md p-2 text-ink transition hover:bg-ink/5"
            >
              {theme === "light" ? <Moon size={19} /> : <Sun size={19} />}
            </button>

            <Link
              aria-label="Favorit"
              to="/wishlist"
              className="hidden rounded-md p-2 text-ink transition hover:bg-ink/5 sm:block"
            >
              <Heart size={19} />
            </Link>

            <Link
              aria-label="Keranjang"
              to="/cart"
              className="relative rounded-md p-2 text-ink transition hover:bg-ink/5"
            >
              <ShoppingBag size={20} />
              {cart.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 min-w-4 rounded-full bg-accent px-1 text-center text-[10px] font-semibold text-on-accent">
                  {cart.length}
                </span>
              )}
            </Link>

            <Link
              to={user ? "/account" : "/login"}
              className="btn-primary ml-2 hidden px-3 py-2 sm:inline-flex"
            >
              <UserRound size={16} />
              <span className="max-w-24 truncate">{user ? user.name.split(" ")[0] : "Masuk"}</span>
            </Link>

            <button
              aria-label="Buka menu"
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(true)}
              className="rounded-md p-2 text-ink transition hover:bg-ink/5 lg:hidden"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {searchOpen && (
          <div className="border-t border-line sm:hidden">
            <div className="mx-auto flex max-w-[1200px] items-center gap-2 px-5 py-2">
              <input
                autoFocus
                aria-label="Cari produk"
                className="field h-9 flex-1 py-1.5"
                placeholder="Cari kebutuhan kampus..."
              />
              <button
                aria-label="Tutup pencarian"
                onClick={() => setSearchOpen(false)}
                className="rounded-md p-2 text-muted transition hover:bg-ink/5 hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        )}
      </header>

      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Tutup menu"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-ink/30"
          />
          <aside className="absolute right-0 top-0 h-full w-80 max-w-[85vw] border-l border-line bg-surface p-6">
            <div className="flex items-center justify-between">
              <span className="display text-xl">
                Campus<span className="text-accent">Mart</span>
              </span>
              <button
                aria-label="Tutup menu"
                onClick={() => setDrawerOpen(false)}
                className="rounded-md p-2 text-ink transition hover:bg-ink/5"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="mt-8 grid gap-1">
              {nav.map(([to, label]) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setDrawerOpen(false)}
                  className="border-b border-line py-3 text-sm font-semibold text-ink"
                >
                  {label}
                </Link>
              ))}
              <Link
                to="/account"
                onClick={() => setDrawerOpen(false)}
                className="border-b border-line py-3 text-sm font-semibold text-ink"
              >
                Akun Saya
              </Link>
              <Link
                to={user ? "/account" : "/login"}
                onClick={() => setDrawerOpen(false)}
                className="btn-primary mt-4"
              >
                {user ? "Akun saya" : "Masuk"}
              </Link>
            </nav>
          </aside>
        </div>
      )}

      {children}

      <footer className="mt-16 border-t border-line bg-surface">
        <div className="mx-auto grid max-w-[1200px] gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr] lg:px-12">
          <div>
            <span className="display text-2xl">
              Campus<span className="text-accent">Mart</span>
            </span>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
              Marketplace kebutuhan mahasiswa dan kampus, dikurasi dari mitra terverifikasi.
            </p>
          </div>

          <div>
            <p className="eyebrow">Jelajahi</p>
            <div className="mt-3 grid gap-2 text-sm">
              {nav.map(([to, label]) => (
                <Link key={to} to={to} className="text-muted transition hover:text-ink">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="eyebrow">Bantuan</p>
            <div className="mt-3 grid gap-2 text-sm text-muted">
              <Link to="/account" className="transition hover:text-ink">
                Akun saya
              </Link>
              <Link to="/orders" className="transition hover:text-ink">
                Lacak pesanan
              </Link>
              <span>halo@campusmart.id</span>
            </div>
          </div>
        </div>

        <div className="border-t border-line">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-1 px-5 py-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
            <span>© {currentYear} CampusMart. Prototype marketplace kampus.</span>
            <span>Dibuat untuk kebutuhan mahasiswa.</span>
          </div>
        </div>
      </footer>
    </>
  );
}

export function Empty({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="empty">
      <ShoppingBag className="mx-auto text-accent" size={32} />
      <h2 className="display mt-4 text-xl">{title}</h2>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
