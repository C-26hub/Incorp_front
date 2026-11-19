# Incorp AI — Plataforma de Agentes Inteligentes

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-blue)
![React](https://img.shields.io/badge/React-frontend-149eca)
![TypeScript](https://img.shields.io/badge/TypeScript-frontend-3178c6)
![Vite](https://img.shields.io/badge/Vite-build-646cff)

Interface web para explorar e utilizar agentes de inteligência artificial voltados aos departamentos de **Marketing** e **Comercial**. O frontend integra autenticação, cadastro, histórico e seis agentes à API Spring Boot.

> **Estado atual:** Produção de Conteúdo, Prospecção e Qualificação de Leads, SEO, Mídias Sociais, Relatórios e KPIs e Tráfego estão integrados. Editais e Licitações e Apoio Comercial continuam “Em breve”.

## Visão geral

A plataforma reúne agentes especializados em uma interface única, permitindo que usuários encontrem ferramentas por departamento, categoria e status, com autenticação e integração segura com a API.

### Telas existentes

| Tela | Descrição | Situação |
| --- | --- | --- |
| Login | Autenticação na API e confirmação do departamento cadastrado | Integrado; sessão em cookies HttpOnly |
| Cadastro | Criação de conta na API com departamento obrigatório | Integrado |
| Home | Acesso aos agentes disponíveis no departamento selecionado | Integrada ao catálogo |
| Agentes | Catálogo com pesquisa, status e categorias | Seis agentes disponíveis e dois em breve |
| Histórico | Conversas do agente de conteúdo | Integrado ao backend |
| Configurações | Preferências de interface | Armazenamento local no navegador |
| Workspace de conteúdo | Geração e continuação de conteúdo | Integrado; revisão humana necessária |
| Prospecção e qualificação | Cadastro manual, importação CSV e análise de leads | Integrado; usa ICP informado pelo usuário e não contata leads |
| Auditoria de SEO | Análise on-page de uma URL pública e recomendações | Integrado; exige HTTPS, não segue redirecionamentos e envia sinais e contexto ao Gemini |
| Mídias Sociais | Validação de legenda, regras fornecidas e horários | Simulação; não consulta calendários ou regras oficiais nem publica/agendas conteúdo |
| Relatórios e KPIs | Consolidação de indicadores, fontes e metas | Valores informados pelo usuário; síntese narrativa opcional via IA |
| Tráfego | Plano de campanha, orçamento, metas e métricas | Rascunho e recomendações; não acessa nem altera contas de anúncios |

O CSV aceita separador por vírgula ou ponto e vírgula, até 100 registros por arquivo e cabeçalhos em português ou inglês. A coluna de nome é obrigatória; por exemplo: `nome,empresa,cargo,email,setor,porte,localizacao,observacoes`. A qualificação envia ao Gemini o ICP e os dados de empresa, cargo, setor, porte, localização e observações; nome e dados de contato não são enviados.

A auditoria de SEO coleta metadados e sinais on-page da página pública no momento da solicitação. O resultado é orientativo e não representa promessa de posicionamento nos buscadores. Informe apenas páginas e contextos que possam ser processados pelo provedor de IA; evite dados pessoais ou confidenciais.

A validação de Mídias Sociais compara a publicação com as regras, versões de marca e horários informados pelo usuário; não há integração com redes sociais ou calendário externo. Relatórios usam observações fornecidas pela equipe, e não buscam dados diretamente nas plataformas. O agente de Tráfego também trabalha somente com o briefing e os dados fornecidos; campanhas e estratégias devem ser revisadas antes de qualquer execução.

## Catálogo de agentes

O catálogo apresenta os oito agentes priorizados para o projeto:

1. Produção de Conteúdo — disponível
2. Prospecção e Qualificação de Leads — disponível
3. SEO — disponível
4. Mídias Sociais — disponível
5. Relatórios e KPIs — disponível
6. Tráfego — disponível
7. Editais e Licitações — em breve
8. Apoio Comercial — em breve

### Acesso por departamento

No cadastro, a pessoa escolhe **Marketing** ou **Comercial**; o backend salva o departamento na conta. No login, a seleção precisa corresponder ao departamento cadastrado. A interface obtém o valor persistido por `/auth/me` e o usa para filtrar o catálogo e a Home. Algumas rotas de agentes ainda dependem apenas da autenticação e não verificam o departamento no backend.

> O departamento identifica a área do usuário e orienta os filtros da interface, mas não substitui autorização por endpoint. Não use esse filtro como barreira de segurança; as permissões devem ser definidas e verificadas no backend.

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

Abra no navegador o endereço exibido pelo Vite (normalmente `http://localhost:5173`). Por padrão, o proxy local encaminha `/csrf`, `/auth`, `/users` e `/agents` para `https://cmiap.onrender.com`. Inicie o backend e configure nele as credenciais do provedor de IA antes de usar os agentes. Para desenvolvimento via HTTP, configure `COOKIE_SECURE=false` somente no backend local; em produção, mantenha HTTPS e cookies `Secure`.

Para apontar diretamente a outro endereço de API, crie um arquivo `.env.local` na raiz do frontend. O valor substitui o endereço padrão:

```dotenv
VITE_API_BASE_URL=https://endereco-da-api
```

Em produção, a API já aponta por padrão para `https://cmiap.onrender.com`. Configure o backend para permitir a origem pública do frontend com credenciais e cookies seguros. Variáveis `VITE_*` são incluídas no bundle do navegador; nunca coloque nelas chaves do Gemini ou outros segredos.

Para validar a compilação de produção:

```bash
npm run build
```

## Publicar no Render

Crie um **Web Service** conectado a este repositório, com a raiz do projeto como diretório:

| Configuração | Valor |
| --- | --- |
| Runtime | Node |
| Build Command | `npm install && npm run build` |
| Start Command | `npm start` |

O comando `npm start` serve a pasta `dist`, atende rotas da aplicação React e escuta a porta `PORT` fornecida pelo Render. Não é necessário configurar `VITE_API_BASE_URL` para usar o backend atual. Se definir essa variável no Render, use `https://cmiap.onrender.com` e faça uma nova compilação após alterar o valor.

No backend, permita a origem exata do domínio Render criado para o frontend em CORS, com credenciais habilitadas; mantenha HTTPS e cookies de sessão compatíveis com requisições cross-origin (`Secure` e `SameSite=None`). Sem essa configuração no backend, o navegador bloqueará login e chamadas autenticadas. Se o serviço for criado como **Static Site**, use `npm install && npm run build` e publique `dist`; nesse tipo de serviço não há comando de start.

Para executar os testes de interface (Playwright com Chromium):

```bash
npx playwright install chromium
npx playwright test
```

Os testes simulam as respostas da API e cobrem navegação, autenticação de interface, catálogo e fluxos dos seis agentes; eles não substituem testes de integração com o backend ou chamadas reais ao Gemini. O relatório HTML é salvo em `qa-report/`. Se a porta padrão estiver ocupada, defina `PLAYWRIGHT_PORT` ao executar a suíte.

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
│   ├── context/             # Sessão de autenticação e perfil
│   ├── data/                # Catálogo local de agentes
│   ├── pages/               # Telas e workspaces dos agentes
│   ├── services/            # Cliente da API e utilitários
│   ├── App.tsx               # Rotas e estrutura principal
│   └── main.tsx              # Ponto de entrada
├── tests/                   # Testes Playwright e documentação de QA
├── playwright.config.ts
├── vite.config.ts
├── index.html
└── package.json
```

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

**Segurança:** o frontend envia cookies com `credentials: 'include'`, obtém o token CSRF do backend e não persiste JWTs em JavaScript ou no `localStorage`. A sessão e o departamento da conta são validados pelo backend. Em desenvolvimento local, o proxy do Vite evita requisições cross-origin; em ambientes publicados, configure HTTPS, CORS e atributos de cookie no backend.

## Itens ainda não implementados e próximos passos

1. Implementar os agentes de Editais e Licitações e Apoio Comercial.
2. Implementar recuperação de senha e edição de dados da conta.
3. Aplicar e validar permissões por departamento no backend e completar as verificações de acesso das telas.
4. Ampliar testes de integração, acessibilidade e cobertura responsiva.

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

**Escopo atual:** seis agentes disponíveis, dois em breve e 25 testes automatizados de interface com respostas simuladas da API.

**Incorp AI** — Projeto em evolução, desenvolvido por estudantes para fins acadêmicos
