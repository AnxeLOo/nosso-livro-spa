# 📚 Nosso Livro — Plataforma Universitária de Livros (SPA)

Aplicação de Página Única (SPA) desenvolvida em **React** e **TypeScript** para exploração, gerenciamento, empréstimos e reservas de livros em uma biblioteca universitária. Consome dados em tempo real da **Open Library API**, utiliza **Zustand** para gerenciamento de estado global e **Axios** para requisições HTTP, garantindo persistência local via **Local Storage**.

---

## 🛠️ Stack Tecnológica

* **Framework Frontend:** React 18 (SPA)
* **Linguagem:** TypeScript
* **Gerenciamento de Estado:** Zustand
* **Cliente HTTP:** Axios
* **Roteamento:** React Router DOM v6
* **Estilização:** Vanilla CSS / CSS Modules com Design Tokens e Glassmorphism
* **Containerização:** Docker (Multi-stage build com Nginx Alpine)
* **Persistência:** Local Storage

---

## 📁 Estrutura de Pastas (Padrão Nuxt adaptado para React)

```text
src/
├── assets/          # Arquivos estáticos e estilos globais (global.css, variables.css, login.css, components.css)
├── components/      # Componentes reutilizáveis (Header, BottomNav, BookCard, SearchBar, CategoryFilterBar, Modal, ReadingStatusBadge, Toast)
├── layouts/         # Layouts estruturais (DefaultLayout, AuthLayout)
├── pages/           # Rotas da aplicação (Home, Login, BookDetails, Loans, Saved)
├── services/        # Cliente Axios e integração à Open Library API
├── store/           # Stores globais Zustand (authStore, bookStore, loanStore, toastStore)
├── types/           # Tipagens TypeScript (book, user, loan)
└── utils/           # Formatadores de data, helpers de LocalStorage e sanitização XSS
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
* Node.js 18+ instalado
* npm ou yarn

### Instalação e Execução
```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`.

---

## 🐳 Executando com Docker

Para subir a aplicação em container de produção com Nginx Alpine:

```bash
# Construir imagem e iniciar o serviço
docker compose up --build -d
```

Acesse em `http://localhost:8080`.

---

## 👤 Contas de Acesso Rápido (Demo)

Você pode entrar diretamente usando os botões de atalho na tela de login ou digitando qualquer e-mail/matrícula:

| Usuário | E-mail / Matrícula | Senha | Perfil |
| :--- | :--- | :--- | :--- |
| **Lucas Mendes** | `aluno@universidade.edu.br` / `20241001` | `senha123` | Aluno |
| **Dra. Helena Martins** | `prof@universidade.edu.br` / `20180042` | `senha123` | Docente |
| **Mariana Souza** | `biblioteca@universidade.edu.br` / `20150999` | `senha123` | Bibliotecária |

---

## ✨ Funcionalidades Principais

1. **Autenticação e Sessão Acadêmica:**
   - Tela de login inspirada nos protótipos de alta fidelidade do projeto.
   - Validação de formulários e controle de sessão seguro persistido no LocalStorage.

2. **Catálogo & Open Library API:**
   - Busca em tempo real por título, autor, assunto e ISBN (atalho `⌘K`).
   - Filtros por categoria (Ficção, Ciência, História, Clássicos, Pessoal, Tecnologia).
   - Ordenação dinâmica (Relevância, Mais recentes, Mais antigos, Autor).
   - Paginação contínua ("Carregar Mais Livros").

3. **Sistema de Empréstimo e Reservas:**
   - Empréstimo com cálculo automático de prazo (14 dias corridos).
   - Sistema de fila de reserva quando todos os exemplares estão esgotados.
   - Renovação de empréstimo (+7 dias).
   - Histórico completo de devoluções.

4. **Página de Detalhes do Livro:**
   - Capa em alta resolução ou arte tipográfica elegante com gradientes personalizados.
   - Sinopse completa, ano de publicação e tópicos.
   - Rastreador de status de leitura: *"Lendo"*, *"Concluído"*, *"Lista de desejos"*.
   - Indicador de exemplares físicos disponíveis no campus.

5. **Lista de Salvos (Wishlist):**
   - Salve livros favoritos e acesse rapidamente pela barra de navegação inferior.
