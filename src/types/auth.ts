
// Menentukan role yang tersedia di CampusMart
export type UserRole = "buyer" | "staff" | "admin";

// Menentukan struktur data pengguna yang sedang login
export interface AuthUser {
  // ID unik setiap pengguna
  id: string;

  // Nama lengkap pengguna
  name: string;

  // Email untuk login
  email: string;

  // Hak akses pengguna
  role: UserRole;

  // Identitas kampus tempat pengguna terdaftar
  // null bisa digunakan untuk admin tingkat platform
  campusId: string | null;
  blocked?: boolean;
}
