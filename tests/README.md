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
| QA-003 | Login | A autenticação simulada redireciona para a área autenticada. |
| QA-004 | Catálogo de agentes | A lista de agentes é apresentada. |
| QA-005 | Pesquisa de agentes | A pesquisa filtra os agentes exibidos. |
| QA-006 | Filtro por departamento | A seleção de departamento atualiza os agentes exibidos. |
| QA-007 | Abrir Workspace | Um agente abre seu Workspace na rota correspondente. |
| QA-008 | Gerar conteúdo | O briefing enviado gera uma resposta e uma conversa persistida. |
| QA-009 | Nova conversa | A ação reinicia o workspace. |
| QA-010 | Voltar aos agentes | O retorno leva ao catálogo de agentes. |
| QA-011 | Histórico | Conversas são listadas e podem ser reabertas. |
| QA-012 | Cadastro e qualificação de lead | Um lead manual é comparado ao ICP e recebe pontuação e recomendação. |
| QA-013 | Importação de CSV | Leads de um arquivo CSV são importados e listados. |
| QA-014 | Auditoria SEO | URL, palavra-chave e contexto são enviados; sinais e recomendações são exibidos. |
| QA-015 | URL HTTPS obrigatória | URL HTTP é rejeitada antes de chamar o backend. |
| QA-016 | Erro na análise SEO | Uma resposta de erro do backend é apresentada ao usuário. |
| QA-017 | Rota protegida | Uma sessão expirada redireciona a rota autenticada para o login. |

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

1. Validar mensagens de erro dos formulários de login e cadastro.
2. Adicionar testes responsivos para telas móveis.
3. Adicionar verificações básicas de acessibilidade.
4. Integrar os testes ao pipeline de CI após alinhamento com a equipe.

## Repositório

- **Projeto:** [C-26hub/Incorp_front](https://github.com/C-26hub/Incorp_front)
- **Branch de desenvolvimento:** [`feature/integracao-telas-react`](https://github.com/C-26hub/Incorp_front/tree/feature/integracao-telas-react)

---

**Escopo atual:** 17 cenários funcionais com respostas simuladas da API; consulte a execução mais recente do Playwright para o resultado.
