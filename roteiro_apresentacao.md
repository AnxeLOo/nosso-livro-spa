# 🎙️ Roteiro de Apresentação (Pitch Deck Script) — Nosso Livro

> **Duração Total Estimada:** ~4 minutos e 30 segundos (margem de segurança para o limite de 5 minutos)  
> **Ritmo de Fala:** Confiante, moderado (~130 a 140 palavras por minuto)  
> **Arquivo de Slides:** [`presentation.html`](file:///Users/anxeloo/Documents/Projects/book-rent/presentation.html)

---

## ⏱️ Tabela de Distribuição de Tempo

| Slide | Tema | Tempo Alocado | Tempo Acumulado |
| :---: | :--- | :---: | :---: |
| **01** | Capa, Identidade & Visão Geral | 30s | 00:30 |
| **02** | O Diagnóstico: Problema vs. Solução | 45s | 01:15 |
| **03** | Experiência do Leitor: Funcionalidades Chave | 60s | 02:15 |
| **04** | Engenharia de Software: Arquitetura & Stack | 45s | 03:00 |
| **05** | Destaque Técnico: Desafios Reais & Decisões | 60s | 04:00 |
| **06** | Validação: Personas Acadêmicas | 30s | 04:30 |
| **07** | Conclusão, Métricas & Roadmap | 30s | **05:00** |

---

## 🇧🇷 Roteiro em Português (Speech Script)

### [00:00 - 00:30] Slide 01: Capa & Visão Geral
* **Ação na Tela:** Manter no Slide 1.
* **Fala do Apresentador:**
> *"Olá a todos! Hoje tenho o prazer de apresentar o **Nosso Livro**, uma Single Page Application desenvolvida para modernizar a forma como alunos e professores interagem com o acervo de uma biblioteca universitária.*  
> *O projeto foi construído utilizando **React 18** e **TypeScript**, integrando em tempo real os dados da **Open Library API** a um sistema ágil de circulação, empréstimos e reservas.*  
> *Nosso objetivo foi criar uma experiência fluida, sem atritos burocráticos e com padrão visual de excelência."*

---

### [00:30 - 01:15] Slide 02: Da Burocracia à Circulação Instantânea
* **Ação na Tela:** Pressionar `→` ou `Espaço` para o Slide 2.
* **Fala do Apresentador:**
> *"Todos nós que já frequentamos uma universidade conhecemos a dor dos sistemas legados de biblioteca: filas no balcão de atendimento, catálogos OPAC arcaicos que exigem buscas exatas por código, e a frustração de ir até o campus sem saber se o exemplar físico realmente está na estante.*  
> *O **Nosso Livro** elimina essa barreira. Em vez de burocracia, entregamos empréstimos em um clique, busca global instantânea via atalho de teclado `⌘K`, transparência absoluta sobre a disponibilidade no campus e uma interface escura pensada para uso tanto no desktop quanto no celular."*

---

### [01:15 - 02:15] Slide 03: Uma Plataforma Completa de Leitura
* **Ação na Tela:** Pressionar `→` para o Slide 3.
* **Fala do Apresentador:**
> *"Na prática, o sistema cobre todo o ciclo de vida do leitor acadêmico através de quatro pilares principais:*  
> *Primeiro, a **Busca Global Instantânea**: com o atalho `⌘K`, qualquer obra pode ser localizada por título, autor, assunto ou ISBN com respostas imediatas em debounce.*  
> *Segundo, a **Gestão de Empréstimos e Reservas**: cálculo automático do prazo de 14 dias, renovação em um clique e entrada automática em fila de espera caso os exemplares estejam esgotados.*  
> *Terceiro, o **Rastreador de Status de Leitura**: o usuário pode classificar livros em 'Lendo', 'Concluído' ou guardá-los em sua Wishlist pessoal de 'Salvos'.*  
> *E quarto, a **Geração Procedural de Capas**: quando uma obra pública não possui imagem de capa cadastrada, nosso algoritmo gera uma arte tipográfica harmônica em gradientes CSS, garantindo uma estética sempre impecável."*

---

### [02:15 - 03:00] Slide 04: Arquitetura Limpa & Tecnologias
* **Ação na Tela:** Pressionar `→` para o Slide 4.
* **Fala do Apresentador:**
> *"Por trás dessa interface, estruturamos uma arquitetura limpa e desacoplada em quatro camadas fundamentais:*  
> *Na interface, React 18 tipado com TypeScript e roteamento protegido via React Router.*  
> *No gerenciamento de estado, optamos pelo **Zustand**, dividindo o domínio em quatro stores modulares: autenticação, livros, empréstimos e notificações toast.*  
> *Na integração externa, utilizamos um cliente Axios resiliente conectado à Open Library API com sanitização dos dados.*  
> *E em infraestrutura, conteinerizamos a aplicação em um Docker multi-stage com servidor Nginx Alpine ultraleve, além de deploy automatizado na Vercel."*

---

### [03:00 - 04:00] Slide 05: Desafios Reais & Decisões Chave
* **Ação na Tela:** Pressionar `→` para o Slide 5.
* **Fala do Apresentador:**
> *"Gostaria de destacar três aprendizados de engenharia que foram determinantes para o projeto:*  
> *Nosso **maior desafio técnico** foi a heterogeneidade da Open Library API pública — onde descrições alternavam entre strings simples e objetos complexos, e não havia dados de disponibilidade física. Desenvolvemos uma camada de serviço com normalização resiliente e hashes determinísticos para simular consistentemente o estoque do campus.*  
> *Nossa **principal decisão arquitetural** foi escolher o Zustand em detrimento da Context API e do Redux. A Context API provocaria re-renderizações em cascata desnecessárias no catálogo a cada empréstimo ou aviso de toast, enquanto o Redux traria excesso de boilerplate. O Zustand nos deu seletores granulares e acesso direto ao estado fora da árvore de componentes.*  
> *E o **conceito mais valioso** foi o uso de React Hooks associados à composição, permitindo isolar efeitos assíncronos, debounce e atalhos de teclado de forma limpa e escalável."*

---

### [04:00 - 04:30] Slide 06: Perfis Acadêmicos Pré-Configurados
* **Ação na Tela:** Pressionar `→` para o Slide 6.
* **Fala do Apresentador:**
> *"Para validar a experiência, disponibilizamos na tela de login três perfis pré-configurados que podem ser acessados em um único clique:*  
> *O **Lucas Mendes**, representando os alunos de graduação que buscam bibliografia básica e gerenciam seus prazos de devolução.*  
> *A **Dra. Helena Martins**, representando os docentes e pesquisadores que renovam obras de referência.*  
> *E a **Mariana Souza**, bibliotecária-chefe que monitora a circulação física e a fila de reservas do acervo."*

---

### [04:30 - 05:00] Slide 07: Conclusão e Próximos Horizontes
* **Ação na Tela:** Pressionar `→` para o Slide 7.
* **Fala do Apresentador:**
> *"Como resultado, entregamos uma SPA de alto desempenho, 100% responsiva, com persistência local e pronta para uso em produção.*  
> *Para o futuro da plataforma, nosso roadmap contempla alertas de devolução via Web Push, autoatendimento no campus com leitura de QR Code físico e integração com o sistema institucional de login acadêmico.*  
> *Muito obrigado pela atenção! Fico à disposição para perguntas e demonstração prática."*

---

---

## 🇺🇸 English Script (Pitch Deck Version)

> *Tip: You can press `L` on your keyboard during the presentation to switch the slides instantly to English.*

### [00:00 - 00:30] Slide 01: Hero & Overview
> *"Hello everyone! Today, I’m excited to present **Nosso Livro**, a modern Single Page Application engineered to streamline how students and faculty interact with academic library collections.*  
> *Built with **React 18** and **TypeScript**, the platform connects live data from the **Open Library API** with an instant circulation, borrowing, and reservation system.*  
> *Our goal was to deliver a frictionless, beautifully crafted digital experience tailored for campus life."*

### [00:30 - 01:15] Slide 02: From Bureaucracy to Instant Circulation
> *"Anyone who has ever used a traditional university library knows the pain points: slow legacy catalogs, rigid search queries, front-desk queues, and the frustration of walking to the campus without knowing if a book is actually on the shelf.*  
> *Nosso Livro completely changes this dynamic. Instead of bureaucracy, we provide 1-click borrowing, an instant `⌘K` global search spotlight, full transparency on campus shelf inventory, and a sleek dark mode interface designed for both mobile and desktop."*

### [03:00 - 02:15] Slide 03: A Complete Reader Ecosystem
> *"The platform covers the entire academic reading lifecycle across four core pillars:*  
> *First, **Instant Global Search**: pressing `⌘K` opens a Raycast-style spotlight querying titles, authors, subjects, and ISBNs in real time with debounced queries.*  
> *Second, **Automated Circulation**: automated 14-day borrowing terms, 1-click extensions, and automated waitlist queues when physical copies run out.*  
> *Third, the **Reading Lifecycle Tracker**: users can organize titles into 'Reading', 'Completed', or save them to their personal 'Wishlist'.*  
> *And fourth, **Dynamic Typographic Covers**: when a public domain title lacks official artwork, our procedural engine renders a tailored CSS gradient cover."*

### [02:15 - 03:00] Slide 04: Clean Architecture & Technology Stack
> *"Under the hood, we established a clean, modular 4-layer architecture:*  
> *At the UI layer, strictly typed React 18, React Router DOM v6 route guards, and decoupled layouts.*  
> *For global state, we leveraged **Zustand**, split into four modular domain stores: authentication, books, loans, and toast alerts.*  
> *For network requests, an Axios client normalizes and sanitizes external Open Library responses.*  
> *And for infrastructure, a multi-stage Docker container served by an Alpine Nginx image, with automated continuous deployment on Vercel."*

### [03:00 - 04:00] Slide 05: Real Challenges & Key Decisions
> *"Three engineering highlights defined the success of this project:*  
> *Our **main technical challenge** was the polymorphic nature of the public Open Library API — where descriptions alternate between plain strings and nested objects, with no native campus inventory data. We solved this with a resilient mapper and a deterministic hash function simulating campus shelf copies.*  
> *Our **key architectural decision** was adopting Zustand over React Context and Redux. Context would trigger unnecessary re-render cascades across the entire book catalog on minor state mutations, while Redux added unnecessary boilerplate. Zustand offered granular selector subscriptions and clean out-of-tree state access.*  
> *And the **most valuable concept** was React Hooks combined with component composition, allowing us to cleanly isolate asynchronous lifecycles, debouncing, and keyboard shortcuts."*

### [04:00 - 04:30] Slide 06: Pre-Configured Campus Personas
> *"To validate user journeys, we implemented 1-click login shortcuts for three core campus personas:*  
> *Lucas Mendes, an undergraduate student researching course syllabi and managing due dates;*  
> *Dr. Helena Martins, a professor managing research literature and extending terms;*  
> *And Mariana Souza, campus head librarian supervising physical circulation and reservation queues."*

### [04:30 - 05:00] Slide 07: Conclusion and Future Roadmap
> *"In summary, we delivered a high-performance, responsive SPA with offline-resilient local persistence and production-ready containerization.*  
> *Our upcoming roadmap includes Web Push notifications for proactive due-date reminders, self-service QR code returns on physical shelves, and institutional LDAP/SAML integration.*  
> *Thank you very much for your time! I’m now open for questions and live demonstration."*

---

## 💡 Dicas Práticas para o Apresentador

1. **Atalhos Durante a Apresentação**:
   - `Espaço` ou `→` para avançar o slide.
   - `F` para entrar em modo tela cheia antes de iniciar a fala.
   - `L` para alternar entre Português e Inglês caso a banca ou audiência seja mista.
2. **Postura & Ritmo**:
   - Mantenha contato visual com a banca/público; não leia o texto dos slides literalmente, use o roteiro para guiar o raciocínio.
   - Nos slides 3 e 5, use entonação firme ao citar os termos técnicos (`Zustand`, `⌘K`, `Debounce`, `Open Library API`).
3. **Cronômetro**:
   - Deixe o cronômetro do celular no silencioso ao lado para checar as marcas de 2m30s (Slide 4) e 4m00s (Slide 5).
