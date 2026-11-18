# Incorp AI — Plataforma de Agentes Inteligentes

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-blue)
![React](https://img.shields.io/badge/React-frontend-149eca)
![TypeScript](https://img.shields.io/badge/TypeScript-frontend-3178c6)
![Vite](https://img.shields.io/badge/Vite-build-646cff)

Interface web para explorar e utilizar agentes de inteligência artificial voltados aos departamentos de **Marketing** e **Comercial**. O frontend integra autenticação, cadastro, histórico, produção de conteúdo e qualificação de leads à API Spring Boot.

> **Estado atual:** os agentes de Produção de Conteúdo e de Prospecção e Qualificação de Leads estão conectados ao backend. Os outros seis itens do catálogo são exibidos como “Em breve”.

## Visão geral

A plataforma reúne agentes especializados em uma interface única, permitindo que usuários encontrem ferramentas por departamento, categoria e status, com autenticação e integração segura com a API.

### Telas existentes

| Tela | Descrição | Situação |
| --- | --- | --- |
| Login | Autenticação na API e consulta do usuário atual | Integrado; sessão em cookies HttpOnly |
| Cadastro | Criação de conta na API | Integrado |
| Home | Visão inicial e acesso às funcionalidades | Implementada no Front-end |
| Agentes | Catálogo com pesquisa e filtros | Dois agentes integrados; demais indisponíveis |
| Histórico | Conversas do agente de conteúdo | Integrado ao backend |
| Configurações | Preferências de interface | Armazenamento local no navegador |
| Workspace de conteúdo | Geração e continuação de conteúdo | Integrado; revisão humana necessária |
| Prospecção e qualificação | Cadastro manual, importação CSV e análise de leads | Integrado; usa ICP informado pelo usuário e não contata leads |

O CSV aceita separador por vírgula ou ponto e vírgula, até 100 registros por arquivo e cabeçalhos em português ou inglês. A coluna de nome é obrigatória; por exemplo: `nome,empresa,cargo,email,setor,porte,localizacao,observacoes`. A qualificação envia ao Gemini o ICP e os dados de empresa, cargo, setor, porte, localização e observações; nome e dados de contato não são enviados.

## Catálogo de agentes

O catálogo apresenta os oito agentes priorizados para o projeto:

1. Produção de Conteúdo — disponível
2. Prospecção e Qualificação de Leads — disponível
3. SEO — em breve
4. Mídias Sociais — em breve
5. Relatórios e KPIs — em breve
6. Tráfego — em breve
7. Editais e Licitações — em breve
8. Apoio Comercial — em breve

## Tecnologias

- **React** — construção das interfaces.
- **TypeScript e JavaScript (JSX)** — código da aplicação.
- **Vite** — servidor de desenvolvimento e compilação.
- **React Router** — navegação entre páginas.
- **Tailwind CSS** — estilização e responsividade.
- **Lucide React** — ícones.

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

Abra no navegador o endereço exibido pelo Vite (normalmente `http://localhost:5173`). A configuração local encaminha `/csrf`, `/auth`, `/users` e `/agents` para o backend em `http://localhost:8080`. Inicie o backend e configure nele as credenciais do provedor de IA antes de usar a geração de conteúdo. Para desenvolvimento via HTTP, configure `COOKIE_SECURE=false` somente no backend local; em produção, mantenha HTTPS e cookies `Secure`.

Para apontar diretamente a outro endereço de API, defina `VITE_API_BASE_URL` no ambiente do frontend e configure o backend para permitir a origem correspondente. Não coloque chaves do Gemini ou outros segredos nas variáveis `VITE_*`.

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
│   ├── data/                # Catálogo local de agentes
│   ├── pages/               # Telas da aplicação
│   │   ├── cadastro/
│   │   ├── login/
│   │   ├── Agents.jsx
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

## Arquitetura e integração

```text
Usuário
   ↓
Front-end (React + TypeScript)
   ↓  HTTPS / API
Back-end (Spring Boot)
   ↓
Serviços de IA e banco de dados
```

O Front-end coleta as entradas do usuário e apresenta os resultados. O Back-end valida permissões, gerencia sessões, protege credenciais, persiste os leads por usuário e acessa o provedor de IA.

**Segurança:** o frontend envia cookies com `credentials: 'include'`, obtém o token CSRF do backend e não persiste JWTs em JavaScript ou no `localStorage`. O backend controla a autenticação e autorização. Em desenvolvimento local, o proxy do Vite evita requisições cross-origin; em ambientes publicados, configure HTTPS, CORS e atributos de cookie no backend.

## Próximas etapas

1. Adicionar endpoints backend para os outros seis agentes.
2. Implementar recuperação de senha e edição de dados da conta no backend.
3. Ampliar testes de integração e acessibilidade.

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
