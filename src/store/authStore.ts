import { create } from 'zustand';
import { AuthState, User } from '../types/user';
import { storage } from '../utils/storage';

const STORAGE_AUTH_USER_KEY = 'nosso_livro_auth_user';
const STORAGE_AUTH_TOKEN_KEY = 'nosso_livro_auth_token';

export const DEMO_USERS: Record<string, { user: User; pass: string }> = {
  'aluno@universidade.edu.br': {
    user: {
      id: 'usr_student_1',
      name: 'Lucas Mendes',
      email: 'aluno@universidade.edu.br',
      matricula: '20241001',
      course: 'Ciência da Computação',
      role: 'student',
      avatarInitials: 'LM',
      avatarGradient: 'linear-gradient(145deg,#ff5b50,#b81628)',
      createdAt: '2024-02-15T08:00:00Z',
    },
    pass: 'senha123',
  },
  'prof@universidade.edu.br': {
    user: {
      id: 'usr_prof_1',
      name: 'Dra. Helena Martins',
      email: 'prof@universidade.edu.br',
      matricula: '20180042',
      course: 'Letras e Literatura',
      role: 'professor',
      avatarInitials: 'HM',
      avatarGradient: 'linear-gradient(145deg,#718c9e,#425b6c)',
      createdAt: '2018-03-01T08:00:00Z',
    },
    pass: 'senha123',
  },
  'biblioteca@universidade.edu.br': {
    user: {
      id: 'usr_lib_1',
      name: 'Mariana Souza (Bibliotecária)',
      email: 'biblioteca@universidade.edu.br',
      matricula: '20150999',
      course: 'Gestão da Informação',
      role: 'librarian',
      avatarInitials: 'MS',
      avatarGradient: 'linear-gradient(145deg,#e7c8a7,#986a58)',
      createdAt: '2015-08-10T08:00:00Z',
    },
    pass: 'senha123',
  },
};

const savedUser = storage.get<User | null>(STORAGE_AUTH_USER_KEY, null);
const savedToken = storage.get<string | null>(STORAGE_AUTH_TOKEN_KEY, null);

export const useAuthStore = create<AuthState>((set) => ({
  user: savedUser,
  token: savedToken,
  isAuthenticated: Boolean(savedUser && savedToken),

  login: async (emailOrMatricula: string, pass: string) => {
    // Artificial slight delay for realistic auth feedback
    await new Promise((res) => setTimeout(res, 400));

    const cleanInput = emailOrMatricula.trim().toLowerCase();

    // Check pre-configured demo users first
    const demo = Object.values(DEMO_USERS).find(
      (d) => d.user.email.toLowerCase() === cleanInput || d.user.matricula === cleanInput
    );

    if (demo) {
      if (pass !== demo.pass) {
        return { success: false, error: 'Senha incorreta para esta credencial.' };
      }

      const token = `jwt_mock_${demo.user.id}_${Date.now()}`;
      storage.set(STORAGE_AUTH_USER_KEY, demo.user);
      storage.set(STORAGE_AUTH_TOKEN_KEY, token);

      set({
        user: demo.user,
        token,
        isAuthenticated: true,
      });

      return { success: true };
    }

    // Dynamic registration / login for university email format or matricula
    if (cleanInput.includes('@') && !cleanInput.endsWith('.edu.br') && !cleanInput.includes('universidade')) {
      // allow standard email for flexibility but inform if requested
    }

    if (pass.length < 6) {
      return { success: false, error: 'A senha deve conter no mínimo 6 caracteres.' };
    }

    // Create a personalized academic profile for any new credentials
    const isEmail = cleanInput.includes('@');
    const namePart = isEmail ? cleanInput.split('@')[0].replace(/[._]/g, ' ') : `Aluno ${cleanInput}`;
    const capitalizedName = namePart
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    
    const initials = capitalizedName
      .split(' ')
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase();

    const newUser: User = {
      id: `usr_${Date.now()}`,
      name: capitalizedName || 'Usuário Acadêmico',
      email: isEmail ? cleanInput : `${cleanInput}@universidade.edu.br`,
      matricula: isEmail ? String(Math.floor(10000000 + Math.random() * 90000000)) : cleanInput,
      course: 'Graduação Universitária',
      role: 'student',
      avatarInitials: initials || 'AL',
      avatarGradient: 'linear-gradient(145deg,#ff5b50,#b81628)',
      createdAt: new Date().toISOString(),
    };

    const token = `jwt_mock_${newUser.id}_${Date.now()}`;
    storage.set(STORAGE_AUTH_USER_KEY, newUser);
    storage.set(STORAGE_AUTH_TOKEN_KEY, token);

    set({
      user: newUser,
      token,
      isAuthenticated: true,
    });

    return { success: true };
  },

  logout: () => {
    storage.remove(STORAGE_AUTH_USER_KEY);
    storage.remove(STORAGE_AUTH_TOKEN_KEY);
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  updateUser: (data: Partial<User>) => {
    set((state) => {
      if (!state.user) return state;
      const updated = { ...state.user, ...data };
      storage.set(STORAGE_AUTH_USER_KEY, updated);
      return { user: updated };
    });
  },
}));
