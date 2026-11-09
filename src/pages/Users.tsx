
import {
  useMemo,
  useState,
  type FormEvent,
  type ElementType,
} from "react";

import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Users as UsersIcon,
  Store,
  ShoppingBag,
  GraduationCap,
  Mail,
  CalendarDays,
  UserRound,
} from "lucide-react";

// ==========================================
// 1. TIPE DATA PENGGUNA
// ==========================================

type UserRole = "Admin" | "Penjual" | "Pembeli" | "Dosen";

type UserStatus = "Aktif" | "Ditangguhkan";

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

// ==========================================
// 2. DATA SIMULASI
// Nantinya diganti dengan data dari API
// ==========================================

const initialUsers: User[] = [
  {
    id: 1,
    name: "Abdullah Kavsya",
    email: "abdullah@campusmart.id",
    role: "Admin",
    status: "Aktif",
    createdAt: "01 Nov 2026",
  },
  {
    id: 2,
    name: "Ahmad Fauzi",
    email: "ahmad@campusmart.id",
    role: "Penjual",
    status: "Aktif",
    createdAt: "02 Nov 2026",
  },
  {
    id: 3,
    name: "Siti Rahma",
    email: "siti@campusmart.id",
    role: "Pembeli",
    status: "Aktif",
    createdAt: "03 Nov 2026",
  },
  {
    id: 4,
    name: "Rizky Maulana",
    email: "rizky@campusmart.id",
    role: "Penjual",
    status: "Aktif",
    createdAt: "04 Nov 2026",
  },
  {
    id: 5,
    name: "Nurul Fadilah",
    email: "nurul@campusmart.id",
    role: "Pembeli",
    status: "Ditangguhkan",
    createdAt: "05 Nov 2026",
  },
  {
    id: 6,
    name: "Muhammad Ridwan",
    email: "ridwan@campusmart.id",
    role: "Dosen",
    status: "Aktif",
    createdAt: "06 Nov 2026",
  },
  {
    id: 7,
    name: "azar",
    email: "azar@campusmart.id",
    role: "Pembeli",
    status: "Aktif",
    createdAt: "07 Nov 2026",
  },
  {
    id: 8,
    name: "Fajar Ramadhan",
    email: "fajar@campusmart.id",
    role: "Penjual",
    status: "Aktif",
    createdAt: "08 Nov 2026",
  },
  {
    id: 9,
    name: "Dewi Anggraini",
    email: "dewi@campusmart.id",
    role: "Pembeli",
    status: "Aktif",
    createdAt: "09 Nov 2026",
  },
  {
    id: 10,
    name: "Budi Santoso",
    email: "budi@campusmart.id",
    role: "Dosen",
    status: "Aktif",
    createdAt: "09 Nov 2026",
  },
];

// ==========================================
// 3. KOMPONEN UTAMA
// ==========================================

function Users() {
  // Menyimpan seluruh data pengguna
  const [users, setUsers] = useState<User[]>(initialUsers);

  // State pencarian
  const [search, setSearch] = useState("");

  // State filter role
  const [roleFilter, setRoleFilter] = useState("Semua");

  // State pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // State modal
  const [modal, setModal] = useState<
    "add" | "edit" | "view" | null
  >(null);

  // Menyimpan pengguna yang sedang dipilih
  const [selectedUser, setSelectedUser] = useState<User | null>(
    null
  );

  // State form
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "Pembeli" as UserRole,
    status: "Aktif" as UserStatus,
  });

  // ==========================================
  // 4. FILTER DATA PENGGUNA
  // ==========================================

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Pencarian berdasarkan nama atau email
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      // Filter berdasarkan role
      const matchesRole =
        roleFilter === "Semua" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  // ==========================================
  // 5. PAGINATION
  // ==========================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / usersPerPage)
  );

  const startIndex = (currentPage - 1) * usersPerPage;

  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage
  );

  // ==========================================
  // 6. STATISTIK PENGGUNA
  // ==========================================

  const statistics = [
    {
      label: "Total Pengguna",
      value: users.length,
      icon: UsersIcon,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Penjual",
      value: users.filter((user) => user.role === "Penjual").length,
      icon: Store,
      color: "bg-teal-50 text-teal-600",
    },
    {
      label: "Pembeli",
      value: users.filter((user) => user.role === "Pembeli").length,
      icon: ShoppingBag,
      color: "bg-orange-50 text-orange-600",
    },
    {
      label: "Dosen",
      value: users.filter((user) => user.role === "Dosen").length,
      icon: GraduationCap,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  // ==========================================
  // 7. BUKA MODAL TAMBAH
  // ==========================================

  function openAddModal() {
    setForm({
      name: "",
      email: "",
      role: "Pembeli",
      status: "Aktif",
    });

    setSelectedUser(null);
    setModal("add");
  }

  // ==========================================
  // 8. BUKA MODAL EDIT
  // ==========================================

  function openEditModal(user: User) {
    setSelectedUser(user);

    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });

    setModal("edit");
  }

  // ==========================================
  // 9. SIMPAN DATA PENGGUNA
  // ==========================================

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim() || !form.email.trim()) {
      return;
    }

    // Cek apakah email sudah digunakan
    const emailExists = users.some(
      (user) =>
        user.email.toLowerCase() === form.email.trim().toLowerCase() &&
        user.id !== selectedUser?.id
    );

    if (emailExists) {
      alert("Email sudah digunakan oleh pengguna lain.");
      return;
    }

    if (modal === "add") {
      // Membuat ID baru berdasarkan ID terbesar
      const newId =
        users.length > 0
          ? Math.max(...users.map((user) => user.id)) + 1
          : 1;

      const newUser: User = {
        id: newId,
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        status: form.status,
        createdAt: new Date().toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      };

      setUsers((current) => [...current, newUser]);
    }

    if (modal === "edit" && selectedUser) {
      setUsers((current) =>
        current.map((user) =>
          user.id === selectedUser.id
            ? { ...user, ...form }
            : user
        )
      );
    }

    setCurrentPage(1);
    setModal(null);
  }

  // ==========================================
  // 10. HAPUS PENGGUNA
  // ==========================================

  function handleDelete(user: User) {
    const confirmed = window.confirm(
      `Yakin ingin menghapus akun ${user.name}?`
    );

    if (!confirmed) return;

    setUsers((current) =>
      current.filter((item) => item.id !== user.id)
    );

    // Jika halaman terakhir kosong, kembali ke halaman sebelumnya
    setCurrentPage((page) =>
      Math.min(
        page,
        Math.max(
          1,
          Math.ceil(
            (filteredUsers.length - 1) / usersPerPage
          )
        )
      )
    );
  }

  // ==========================================
  // 11. TAMPILAN HALAMAN
  // ==========================================

  return (
    <main className="min-h-screen bg-[#f8fafc] p-5 lg:p-8">

      {/* HEADER HALAMAN */}
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-gray-900">
          Manajemen Pengguna
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Kelola seluruh akun pengguna CampusMart.
        </p>
      </div>

      {/* STATISTIK PENGGUNA */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {statistics.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    {item.label}
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    {item.value}
                  </h2>
                </div>

                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}>
                  <Icon size={22} />
                </div>
              </div>
            </div>
          );
        })}

      </div>

      {/* TABEL PENGGUNA */}
      <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm">

        {/* HEADER TABEL */}
        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center">

          <div>
            <h2 className="text-lg font-bold text-gray-900">
              Semua Pengguna
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Daftar seluruh akun yang terdaftar di CampusMart.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            {/* SEARCH */}
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Cari pengguna..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-teal-500 sm:w-52"
              />
            </div>

            {/* FILTER ROLE */}
            <select
              value={roleFilter}
              onChange={(event) => {
                setRoleFilter(event.target.value);
                setCurrentPage(1);
              }}
              className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-teal-500"
            >
              <option value="Semua">Semua Role</option>
              <option value="Admin">Admin</option>
              <option value="Penjual">Penjual</option>
              <option value="Pembeli">Pembeli</option>
              <option value="Dosen">Dosen</option>
            </select>

            {/* BUTTON ADD USER */}
            <button
              onClick={openAddModal}
              className="flex items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              <Plus size={17} />
              Tambah Pengguna
            </button>

          </div>
        </div>

        {/* TABEL */}
        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px] text-left">

            <thead>
              <tr className="bg-gray-50 text-xs text-gray-500">
                <th className="px-5 py-4 font-semibold">No.</th>
                <th className="px-5 py-4 font-semibold">Pengguna</th>
                <th className="px-5 py-4 font-semibold">Email</th>
                <th className="px-5 py-4 font-semibold">Role</th>
                <th className="px-5 py-4 font-semibold">Tanggal Daftar</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 text-center font-semibold">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {currentUsers.map((user, index) => (

                <tr
                  key={user.id}
                  className="transition hover:bg-gray-50/70"
                >

                  {/* NOMOR */}
                  <td className="px-5 py-4 text-sm text-gray-500">
                    {startIndex + index + 1}
                  </td>

                  {/* NAMA PENGGUNA */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-50 font-bold text-teal-700">
                        {user.name
                          .split(" ")
                          .map((word) => word[0])
                          .slice(0, 2)
                          .join("")
                          .toUpperCase()}
                      </div>

                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {user.name}
                        </p>

                        <p className="text-xs text-gray-400">
                          ID: CM-{String(user.id).padStart(4, "0")}
                        </p>
                      </div>

                    </div>
                  </td>

                  {/* EMAIL */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail size={15} />
                      {user.email}
                    </div>
                  </td>

                  {/* ROLE */}
                  <td className="px-5 py-4">
                    <RoleBadge role={user.role} />
                  </td>

                  {/* TANGGAL */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <CalendarDays size={15} />
                      {user.createdAt}
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="px-5 py-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        user.status === "Aktif"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">

                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setModal("view");
                        }}
                        title="Lihat pengguna"
                        className="rounded-lg bg-blue-50 p-2 text-blue-600 transition hover:bg-blue-100"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() => openEditModal(user)}
                        title="Edit pengguna"
                        className="rounded-lg bg-teal-50 p-2 text-teal-600 transition hover:bg-teal-100"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(user)}
                        title="Hapus pengguna"
                        className="rounded-lg bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>
                  </td>

                </tr>

              ))}

              {/* JIKA DATA KOSONG */}
              {currentUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center">

                    <UsersIcon
                      size={35}
                      className="mx-auto mb-3 text-gray-300"
                    />

                    <p className="text-sm font-semibold text-gray-600">
                      Pengguna tidak ditemukan
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Coba ubah kata pencarian atau filter role.
                    </p>

                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

        {/* FOOTER PAGINATION */}
        <div className="flex flex-col justify-between gap-4 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center">

          <p className="text-xs text-gray-500">
            Menampilkan{" "}
            {filteredUsers.length === 0 ? 0 : startIndex + 1}
            {" - "}
            {Math.min(
              startIndex + usersPerPage,
              filteredUsers.length
            )}
            {" dari "}
            {filteredUsers.length} pengguna
          </p>

          <div className="flex items-center gap-2">

            <button
              disabled={currentPage === 1}
              onClick={() =>
                setCurrentPage((page) => page - 1)
              }
              className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft size={17} />
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (

              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-9 w-9 rounded-lg text-sm font-medium transition ${
                  currentPage === page
                    ? "bg-teal-600 text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {page}
              </button>

            ))}

            <button
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((page) => page + 1)
              }
              className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight size={17} />
            </button>

          </div>

        </div>

      </section>

      {/* =====================================
          MODAL TAMBAH DAN EDIT
      ===================================== */}

      {(modal === "add" || modal === "edit") && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {modal === "add"
                    ? "Tambah Pengguna"
                    : "Edit Pengguna"}
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Lengkapi informasi akun pengguna.
                </p>
              </div>

              <button
                onClick={() => setModal(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* NAMA */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Nama Lengkap
                </label>

                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      name: event.target.value,
                    })
                  }
                  placeholder="Masukkan nama lengkap"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-teal-500"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email
                </label>

                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      email: event.target.value,
                    })
                  }
                  placeholder="nama@email.com"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-teal-500"
                />
              </div>

              {/* ROLE */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Role Pengguna
                </label>

                <select
                  value={form.role}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      role: event.target.value as UserRole,
                    })
                  }
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-500"
                >
                  <option value="Admin">Admin</option>
                  <option value="Penjual">Penjual</option>
                  <option value="Pembeli">Pembeli</option>
                  <option value="Dosen">Dosen</option>
                </select>
              </div>

              {/* STATUS */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Status Akun
                </label>

                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      status: event.target.value as UserStatus,
                    })
                  }
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-teal-500"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Ditangguhkan">
                    Ditangguhkan
                  </option>
                </select>
              </div>

              {/* BUTTON */}
              <div className="flex justify-end gap-3 pt-4">

                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
                >
                  {modal === "add"
                    ? "Simpan Pengguna"
                    : "Simpan Perubahan"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =====================================
          MODAL DETAIL PENGGUNA
      ===================================== */}

      {modal === "view" && selectedUser && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <div className="mb-6 flex items-center justify-between">

              <h2 className="text-lg font-bold">
                Detail Pengguna
              </h2>

              <button
                onClick={() => setModal(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100"
              >
                <X size={20} />
              </button>

            </div>

            <div className="mb-6 flex flex-col items-center">

              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-teal-50 text-2xl font-bold text-teal-700">
                {selectedUser.name
                  .split(" ")
                  .map((word) => word[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>

              <h3 className="mt-3 text-lg font-bold">
                {selectedUser.name}
              </h3>

              <RoleBadge role={selectedUser.role} />

            </div>

            <div className="space-y-4 rounded-xl bg-gray-50 p-4">

              <DetailItem
                icon={Mail}
                label="Email"
                value={selectedUser.email}
              />

              <DetailItem
                icon={UserRound}
                label="ID Pengguna"
                value={`CM-${String(selectedUser.id).padStart(4, "0")}`}
              />

              <DetailItem
                icon={CalendarDays}
                label="Tanggal Daftar"
                value={selectedUser.createdAt}
              />

              <DetailItem
                icon={UsersIcon}
                label="Status Akun"
                value={selectedUser.status}
              />

            </div>

            <button
              onClick={() => setModal(null)}
              className="mt-5 w-full rounded-lg bg-teal-600 py-3 text-sm font-semibold text-white hover:bg-teal-700"
            >
              Tutup
            </button>

          </div>

        </div>

      )}

    </main>
  );
}

// ==========================================
// 12. KOMPONEN BADGE ROLE
// ==========================================

function RoleBadge({ role }: { role: UserRole }) {
  const styles: Record<UserRole, string> = {
    Admin: "bg-purple-50 text-purple-600",
    Penjual: "bg-teal-50 text-teal-600",
    Pembeli: "bg-blue-50 text-blue-600",
    Dosen: "bg-orange-50 text-orange-600",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[role]}`}
    >
      {role}
    </span>
  );
}

// ==========================================
// 13. KOMPONEN DETAIL ITEM
// ==========================================

function DetailItem({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">

      <Icon size={17} className="mt-0.5 text-gray-400" />

      <div>
        <p className="text-xs text-gray-400">
          {label}
        </p>

        <p className="mt-1 break-all text-sm font-medium text-gray-800">
          {value}
        </p>
      </div>

    </div>
  );
}

export default Users;
