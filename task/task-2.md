# Atividade

## Propósito

**Reflexão do Projeto Final & Síntese de Aprendizado** 

Esta tarefa é um exercício reflexivo projetado para ajudá-lo a sintetizar o conhecimento que adquiriu e articular os principais desafios e sucessos do seu projeto final.

---

## Direções

Você responderá três perguntas reflexivas sobre sua jornada através deste curso e o desenvolvimento do seu projeto final.

- **Parte 1: Maior Desafio Técnico:** Descreva o problema técnico mais difícil que enfrentou durante seu projeto final e os passos que tomou para resolvê-lo.
- **Parte 2: Decisão Arquitetural Principal:** Explique uma decisão arquitetural significativa que tomou (ex.: sua estratégia de gerenciamento de estado, estrutura de componentes ou abordagem de roteamento) e justifique por que a
- **Parte 3: Conceito Mais Valioso:** Identifique o único conceito deste curso (ex.: hooks, HTML semântico, CSS Grid, testes) que acredita ter sido mais crítico para o sucesso do seu projeto e explique por quê.

## Entregáveis:

- Um único **documento Markdown** contendo suas respostas escritas (aproximadamente um parágrafo por pergunta).

---

## Lógica de pontuação

Sua tarefa será avaliada utilizando a rubrica abaixo.

|                                                       | **Muito Bom**<br><br>**A**                                                                                                                                                                                            | **Bom**<br><br>**B-C**                                                                                                                                                                          | **Precisa Melhorar**<br><br>**D-F**                                                                                          |
| ----------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Seguir instruções**                                 | Siga corretamente as instruções da atividade                                                                                                                                                                          | Segue as instruções, mas comete alguns erros                                                                                                                                                    | Precisa de ajuda para entender e seguir as instruções                                                                        |
| **Profundidade da Reflexão (24 pts, 50%)**            | **(20-24 pts)**<br><br>A reflexão é perspicaz, demonstrando um entendimento profundo dos desafios técnicos e decisões arquiteturais. A conexão entre conceitos do curso e sucesso do projeto é claramente articulada. | **(16-19 pts)**<br><br>A reflexão é precisa mas pode ser superficial. As respostas descrevem o que foi feito, mas carecem de profundidade em explicar o “por quê” ou o processo de aprendizado. | **(0-15 pts)**<br><br>A reflexão é vaga, incompleta ou não demonstra um entendimento claro dos aspectos técnicos do projeto. |
| **Clareza** **e** **Justificativa** **(24 pts, 50%)** | **(20-24 pts)**<br><br>As explicações são claras, concisas e bem justificadas com exemplos específicos do próprio projeto do estudante.                                                                               | **(16-19 pts)**<br><br>As justificativas estão presentes mas podem ser fracas ou não bem apoiadas por exemplos.                                                                                 | **(0-15 pts)**<br><br>As respostas são pouco claras, injustificadas ou mal escritas.                                         |

---

## 📄 Respostas da Atividade

### Parte 1: Maior Desafio Técnico
O maior desafio técnico enfrentado durante o desenvolvimento da plataforma **Nosso Livro** foi a integração e normalização dos dados consumidos da **Open Library API** pública (`/search.json` e `/works/{id}`). A API apresenta elevada heterogeneidade estrutural nas respostas — como o polimorfismo no campo de descrição (que oscila entre strings simples e objetos `{ type: string, value: string }`), capas ausentes ou com identificadores nulos, além da ausência nativa de regras de negócio essenciais para uma biblioteca universitária (como controle de exemplares físicos, localização de acervo e disponibilidade em tempo real). Para resolver esse problema, estruturei uma camada de serviço resiliente em `src/services/openLibrary.ts`, centralizada na função `transformSearchDocToBook`. Essa camada higieniza e padroniza os dados brutos no modelo de domínio fortemente tipado `Book`, utiliza uma função hash determinística para gerar de forma consistente atributos complementares (como número total de cópias e distância do campus) e implementa um sistema de *fallback* visual que renderiza capas tipográficas dinâmicas com gradientes CSS quando a imagem oficial inexiste. Por fim, conectei esses dados ao `useLoanStore`, que deduz dinamicamente os exemplares em posse de alunos com base no `localStorage`, garantindo uma experiência estável, sem quedas em tempo de execução (*runtime crashes*) e totalmente alinhada ao protótipo de alta fidelidade.

### Parte 2: Decisão Arquitetural Principal
A decisão arquitetural mais significativa foi a implementação do **gerenciamento de estado global modular com Zustand** (`authStore`, `bookStore`, `loanStore` e `toastStore`), combinada a uma divisão de diretórios *feature-based* inspirada no ecossistema Nuxt. A adoção do Zustand foi priorizada em relação à Context API nativa do React porque a Context API provocaria re-renderizações desnecessárias em cascata em árvores extensas de componentes sempre que qualquer parte do estado global sofresse mutação — como uma simples alteração em um aviso *toast* ou a confirmação de um empréstimo disparando a repintura completa do catálogo de livros. Em contrapartida, soluções mais pesadas como Redux Toolkit trariam uma sobrecarga excessiva de arquivos, ações e *reducers* desnecessários para o escopo do projeto. O Zustand destacou-se por oferecer assinaturas granulares baseadas em seletores (garantindo que cada componente seja atualizado unicamente quando sua fatia de dados é modificada), permitir acesso ao estado fora da árvore de renderização (facilitando requisições com o Axios) e viabilizar uma camada limpa de sincronização reativa com o `localStorage` através de utilitários em `src/utils/storage.ts`. Essa modularidade manteve alta coesão e baixo acoplamento entre regras de autenticação, reservas e catálogo.

### Parte 3: Conceito Mais Valioso
O conceito mais crítico e transformador para o sucesso do projeto foi o uso de **React Hooks (nativos e seletores de estado reativo) associados à Composição de Componentes**. A capacidade dos hooks de isolar lógica de efeitos colaterais e ciclos de vida assíncronos permitiu manter os componentes visuais focados exclusivamente em renderização declarativa e acessibilidade. No projeto, isso se materializou em funcionalidades essenciais: o gerenciamento de chamadas com *debounce* na barra de busca (impedindo disparos excessivos de requisições de rede à Open Library API), o controle global de atalhos de teclado via `useEffect` (como o atalho `⌘K` / `Ctrl+K` para exibição instantânea do modal de busca), a persistência reativa com o `localStorage` e a paginação sob demanda (*infinite scroll / "Carregar Mais"*). Sem a clareza e o desacoplamento proporcionados pelos hooks, a orquestração de estados assíncronos e a sincronização entre regras de empréstimo e catálogo exigiriam soluções arcaicas baseadas em componentes de classe ou um encadeamento confuso de *prop drilling*, o que comprometeria severamente a manutenibilidade, a performance e a escalabilidade da aplicação.

