# 📋 Task: Desenvolvimento da Plataforma de Biblioteca Universitária (SPA)

## 🎯 Visão Geral do Projeto

Construção de uma Aplicação de Página Única (SPA) em **React** e **TypeScript** para gerenciar e explorar livros numa biblioteca universitária. A aplicação deve consumir dados da **Open Library API**, utilizar o **Zustand** para gerenciamento de estado e **Axios** para requisições HTTP, garantindo persistência local via **Local Storage**.

---

## 🛠️ Stack Tecnológica & Arquitetura

* **Linguagem:** TypeScript
* **Framework Frontend:** React (SPA)
* **Gerenciamento de Estado:** Zustand
* **Cliente HTTP:** Axios
* **Containerização:** Docker
* **Roteamento:** React Router DOM (seguindo a estrutura de diretórios inspirada no Nuxt/arquitetura baseada em rotas/pastas)
* **Persistência de Dados:** Local Storage

---

## 📁 Diretrizes de Arquitetura (Padrão Nuxt / Feature-based)

A estrutura de pastas do projeto deve seguir o modelo organizacional do Nuxt adaptado para o React:

```text
src/
├── assets/          # Arquivos estáticos (imagens, estilos globais)
├── components/      # Componentes reutilizáveis globais (botões, modais, etc.)
├── layouts/         # Layouts estruturais da aplicação (ex: DefaultLayout, AuthLayout)
├── pages/           # Páginas da aplicação mapeadas por rotas (ex: Login, Home, BookDetails)
├── services/        # Configuração do Axios e instâncias de chamadas à Open Library API
├── store/           # Stores globais utilizando Zustand
├── types/           # Definições de tipos e interfaces TypeScript
└── utils/           # Funções utilitárias e formatadores

```

---

## 🎨 Diretrizes de UI/UX e Protótipos

* **Protótipos obrigatórios:** Utilizar rigorosamente os protótipos visuais de layout para a **Página de Login** e a **Página Principal (Home / Catálogo)** localizados no diretório do projeto `prototypes/`.
* **Design Responsivo:** Abordagem *mobile-first*, garantindo fluidez e adaptação visual em todos os dispositivos.
* **Acessibilidade:** Suporte à navegação por teclado e implementação de papéis e atributos ARIA.

---

## 📝 Requisitos Funcionais do Sistema

1. **Autenticação e Acesso:**
* Implementar tela de login baseada no protótipo do diretório `prototypes/`.
* Validação de formulários no lado cliente e mecanismos seguros de controle de sessão.

2. **Navegação, Busca e Filtragem de Livros:**
* Exibir catálogo de livros obtidos dinamicamente da **Open Library API**.
* Permitir busca por título, autor ou palavras-chave.
* Implementar filtros por categorias (ex: ficção, ciência, história) e ordenação por data de publicação, autor ou popularidade.
* Manipulação eficiente de paginação e grandes conjuntos de dados.

3. **Sistema de Empréstimo e Reservas:**
* Permitir que usuários realizem o empréstimo de livros e acompanhem prazos de devolução.
* Sistema de reservas para livros atualmente emprestados.
* Armazenamento e histórico de empréstimos persistidos no **Local Storage**.

4. **Página de Detalhes do Livro:**
* Página dedicada contendo capa, título, autor, descrição detalhada, gênero e status de disponibilidade.
* Rastreador de status de leitura integrado (*"Lendo"*, *"Concluído"*, *"Lista de desejos"*).

5. **Lista de Desejos (Opcional Avançado):**
* Gerenciamento de lista de desejos para leituras futuras e notificações de disponibilidade.

---

## 🔒 Requisitos Não-Funcionais e Segurança

* **Segurança:** Validação e sanitização de entradas para prevenção de ataques XSS. Tratamento adequado de erros e submissões seguras de formulários.
* **Performance:** Carregamento tardio (*lazy loading*) para imagens e recursos da aplicação.
* **Ambiente & Deploy:** Configuração correta de variáveis de ambiente (`.env`) para desenvolvimento e produção. Suporte a containerização via **Docker** e preparação para implantação em serviços de hospedagem estática/PaaS (ex: Vercel, Netlify).