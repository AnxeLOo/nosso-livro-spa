export interface User {
  id: string;
  name: string;
  email: string;
  matricula: string;
  course: string;
  role: 'student' | 'professor' | 'librarian';
  avatarInitials: string;
  avatarGradient?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (emailOrMatricula: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}
