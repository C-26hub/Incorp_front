# Incorp AI — Plataforma de Agentes Inteligentes

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-blue)
![React](https://img.shields.io/badge/React-frontend-149eca)
![TypeScript](https://img.shields.io/badge/TypeScript-frontend-3178c6)
![Vite](https://img.shields.io/badge/Vite-build-646cff)

Interface web para explorar e utilizar agentes de inteligência artificial voltados aos departamentos de **Marketing** e **Comercial**. O projeto é desenvolvido em equipe, com foco inicial na navegação e na experiência do usuário. A integração com os serviços de Back-end será realizada em uma etapa posterior.

> **Estado atual:** o repositório contém uma aplicação Front-end navegável e dados demonstrativos. A presença de um agente no catálogo não significa que ele esteja conectado a um modelo de IA.

## Visão geral

A plataforma reúne agentes especializados em uma interface única, permitindo que usuários encontrem ferramentas por departamento, categoria e status. A proposta é evoluir para uma solução com autenticação, conversas, histórico e integração segura com APIs.

### Telas existentes

| Tela | Descrição | Situação |
| --- | --- | --- |
| Login | Formulário de entrada e navegação para a aplicação | Demonstração, sem autenticação real |
| Cadastro | Formulário com validações no navegador | Demonstração, sem persistência no servidor |
| Home | Visão inicial e acesso às funcionalidades | Implementada no Front-end |
| Agentes | Catálogo com pesquisa e filtros | Implementada no Front-end |
| Dashboard | Indicadores e gráficos | Dados demonstrativos |
| Histórico | Listagem de atividades/conversas | Dados demonstrativos |
| Favoritos | Visualização dos agentes favoritos | Dados demonstrativos |
| Configurações | Interface de preferências | Integração/persistência pendentes |
| Workspace (chat) | Conversa com o agente selecionado | Planejado |

## Catálogo de agentes

O catálogo atual apresenta **10 agentes**, organizados em dois departamentos:

**Marketing:** CopyWriter Pro, Social Planner, Brand Voice, SEO Analyst e Campaign Insights.

**Comercial:** Proposal Builder, Lead Qualifier, Pricing Assistant, Follow-up Engine e Sales Forecast.

As informações de status, favoritos e quantidade de usos são **simuladas** nesta fase.

## Tecnologias

- **React** — construção das interfaces.
- **TypeScript e JavaScript (JSX)** — código da aplicação.
- **Vite** — servidor de desenvolvimento e compilação.
- **React Router** — navegação entre páginas.
- **Tailwind CSS** — estilização e responsividade.
- **Lucide React** — ícones.
- **Recharts** — gráficos do Dashboard.

## Pré-requisitos

- Node.js e npm instalados.
- Git instalado, caso deseje clonar e contribuir.

## Executar localmente

Clone o repositório:

```bash
git clone https://github.com/C-26hub/Incorp_front.git
cd Incorp_front
```

Instale as dependências:

```bash
npm install
```

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

Abra no navegador o endereço exibido pelo Vite (normalmente `http://localhost:5173`).

Para validar a compilação de produção:

```bash
npm run build
```

Para visualizar localmente a versão compilada:

```bash
npm run preview
```

## Estrutura principal

```text
Incorp_front/
├── public/                  # Arquivos públicos, incluindo favicon
├── src/
│   ├── assets/              # Imagens e identidade visual
│   ├── components/          # Componentes reutilizáveis
│   ├── data/                # Dados demonstrativos dos agentes
│   ├── pages/               # Telas da aplicação
│   │   ├── cadastro/
│   │   ├── login/
│   │   ├── Agents.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Favorites.jsx
│   │   ├── History.jsx
│   │   ├── Home.jsx
│   │   └── Settings.jsx
│   ├── App.tsx               # Rotas e estrutura principal
│   └── main.tsx              # Ponto de entrada
├── index.html
└── package.json
```

> A estrutura pode evoluir à medida que as telas forem convertidas para TypeScript e os serviços de API forem incorporados.

## Identidade visual

A aplicação utiliza a identidade **Incorp AI**, com logomarca própria, tons de violeta e azul e interface adaptável a diferentes tamanhos de tela. O favicon usa a logomarca do projeto, quando o arquivo `public/favicon.png` está presente.

## Arquitetura e integração futura

```text
Usuário
   ↓
Front-end (React + TypeScript)
   ↓  HTTPS / API
Back-end (a definir com a equipe responsável)
   ↓
Serviços de IA e banco de dados
```

O Front-end será responsável por coletar as entradas do usuário e apresentar os resultados. O Back-end deverá validar permissões, gerenciar sessões, proteger credenciais, registrar conversas e acessar os provedores de IA.

**Segurança:** chaves de API, tokens privados e credenciais de serviços não devem ser incorporados ao código público do Front-end. Os formulários atuais não substituem um mecanismo de autenticação real.

## Próximas etapas

1. Criar a tela **Workspace** e conectar a seleção de agentes à rota correspondente.
2. Revisar todos os botões e fluxos de navegação.
3. Tornar os favoritos e controles de interface interativos.
4. Melhorar a experiência em dispositivos móveis e a acessibilidade.
5. Padronizar estados de carregamento, erro e ausência de resultados.
6. Alinhar com o Back-end os contratos de API, autenticação e histórico.
7. Implementar testes e otimizar o carregamento dos arquivos JavaScript.

## Colaboração

Para desenvolver uma nova funcionalidade, prefira uma branch específica e abra um **Pull Request** para revisão antes de integrar à branch principal.

Exemplo:

```bash
git checkout -b feature/nome-da-funcionalidade
# faça e valide as alterações
git add .
git commit -m "feat: descreve a funcionalidade"
git push -u origin feature/nome-da-funcionalidade
```

Antes de executar `git add .`, revise o `git status` e certifique-se de não incluir arquivos `.env`, credenciais, dados pessoais ou arquivos temporários.

## Repositório

[GitHub — C-26hub/Incorp_front](https://github.com/C-26hub/Incorp_front)

---

**Incorp AI** — Projeto em evolução, desenvolvido por estudantes para fins acadêmicos
