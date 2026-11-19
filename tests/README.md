# Incorp AI — Testes Automatizados de QA

![Playwright](https://img.shields.io/badge/Testes-Playwright-blue)
![Playwright](https://img.shields.io/badge/Testes-Playwright-blue)
![Navegador](https://img.shields.io/badge/Navegador-Chromium-informational)

## Objetivo

Este documento apresenta a primeira bateria de testes automatizados de Quality Assurance (QA) do **Incorp AI**, interface de agentes inteligentes desenvolvida com React, Vite e TypeScript/JavaScript.

Os testes verificam o comportamento da interface e a navegação entre telas, utilizando **Playwright** com o navegador **Chromium**. As respostas da API são simuladas pelos testes; a suíte não valida a integração real com o backend, o banco de dados ou o provedor Gemini.

## Cenários automatizados

Para obter o resultado atualizado, execute `npx playwright test`; o relatório HTML é salvo em `qa-report/`.

| ID | Cenário | Validação |
| --- | --- | --- |
| QA-001 | Página de login | A tela de login é exibida. |
| QA-002 | Página de cadastro | A tela de cadastro é exibida. |
| QA-004 | Catálogo de agentes | O usuário vê os agentes do próprio departamento (padrão: Marketing) e nenhum de outro. |
| QA-005 | Pesquisa de agentes | A pesquisa filtra os agentes exibidos. |
| QA-006 | Agentes do departamento | Um usuário de Comercial vê os agentes de Comercial e nenhum de Marketing. |
| QA-007 | Abrir Workspace | Um agente abre seu Workspace na rota correspondente. |
| QA-008 | Gerar conteúdo | O briefing enviado gera uma resposta e uma conversa persistida. |
| QA-009 | Nova conversa | A ação reinicia o workspace. |
| QA-010 | Voltar aos agentes | O retorno leva ao catálogo de agentes. |
| QA-015 | Rota inexistente | Uma rota desconhecida redireciona para o login. |
| QA-016 | Login com departamento | Escolher o departamento no login leva à Home e define quais agentes aparecem. |
| QA-017 | Login exige departamento | Sem escolher o departamento, o login mostra erro e permanece na tela. |
| QA-018 | Agente de outro departamento | Abrir pela URL um agente de outro departamento redireciona para o catálogo. |
| QA-019 | Histórico do departamento | O histórico mostra só interações com agentes do departamento. |
| QA-020 | Dashboard removido | `/dashboard` não existe mais e redireciona para o login. |

A numeração preserva os identificadores dos cenários planejados; por isso há intervalos entre alguns IDs.

## Estrutura de arquivos

```text
Incorp_front/
├── src/
├── tests/
│   ├── navegacao.spec.ts
│   └── README.md
├── playwright.config.ts
├── package.json
└── ...
```

## Pré-requisitos

- Node.js e npm instalados.
- Dependências do projeto instaladas.
- Playwright instalado como dependência de desenvolvimento.
- Navegador Chromium instalado pelo Playwright.

## Instalação

Na raiz do projeto:

```powershell
npm install
npx playwright install chromium
```

Caso o Playwright ainda não esteja registrado nas dependências do projeto:

```powershell
npm install -D @playwright/test
```

## Execução dos testes

Execute os comandos **na raiz do projeto**, onde está o `package.json`.

**Todos os testes:**

```powershell
npx playwright test
```

**Somente um cenário:**

```powershell
npx playwright test --grep "QA-007"
```

**Executar com navegador visível:**

```powershell
npx playwright test --headed
```

**Visualizar o relatório HTML:**

```powershell
npx playwright show-report qa-report
```

O arquivo `playwright.config.ts` configura o servidor local de desenvolvimento para os testes. Portanto, normalmente não é necessário iniciar `npm run dev` em outro terminal.

## Evidências e relatórios

O Playwright pode gerar, conforme a configuração:

- `qa-report/`: relatório HTML da execução.
- `test-results/`: evidências de falhas, como capturas de tela e traces.
- `playwright-report/`: diretório padrão de relatórios, caso utilizado em outra configuração.

Essas pastas devem permanecer no `.gitignore` para evitar versionar artefatos temporários de execução.

Exemplo de entradas:

```gitignore
test-results/
qa-report/
playwright-report/
```

## Escopo e limitações

Esta bateria cobre fluxos funcionais básicos da interface em **Chromium desktop** usando respostas de API simuladas pelo Playwright. Ela **não comprova**, nesta fase:

- Autenticação e cadastro reais com Back-end.
- Respostas reais de agentes de IA.
- Persistência de mensagens e dados.
- Funcionamento em todos os navegadores e dispositivos.
- Segurança, acessibilidade ou desempenho em produção.

## Próximas etapas de QA

1. Validar os formulários de login e cadastro, incluindo mensagens de erro.
2. Ampliar a cobertura para Histórico e Configurações.
3. Adicionar testes responsivos para telas móveis.
4. Adicionar verificações básicas de acessibilidade.
5. Integrar os testes ao pipeline de CI após alinhamento com a equipe.

## Repositório

- **Projeto:** [C-26hub/Incorp_front](https://github.com/C-26hub/Incorp_front)
- **Branch de desenvolvimento:** [`feature/integracao-telas-react`](https://github.com/C-26hub/Incorp_front/tree/feature/integracao-telas-react)

---

**Escopo atual:** 20 cenários funcionais com respostas simuladas da API; consulte a execução mais recente do Playwright para o resultado.
