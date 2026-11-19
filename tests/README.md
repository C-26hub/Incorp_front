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
| QA-004 | Catálogo de agentes | O catálogo lista os agentes implementados do departamento selecionado. |
| QA-005 | Pesquisa de agentes | A pesquisa filtra os agentes exibidos. |
| QA-006 | Agentes do departamento | Um usuário de Comercial vê os agentes de Comercial e nenhum de Marketing. |
| QA-007 | Abrir Workspace | Um agente abre seu Workspace na rota correspondente. |
| QA-008 | Gerar conteúdo | O briefing enviado gera uma resposta e uma conversa persistida. |
| QA-009 | Nova conversa | A ação reinicia o workspace. |
| QA-010 | Voltar aos agentes | O retorno leva ao catálogo de agentes. |
| QA-011 | Histórico | Conversas reais são listadas e podem ser reabertas. |
| QA-012 | Cadastro e qualificação de lead | Um lead é comparado ao ICP e recebe pontuação e recomendação. |
| QA-013 | Importação de CSV | Leads de um arquivo CSV são importados e listados. |
| QA-014 | Auditoria SEO | URL, palavra-chave e contexto são enviados; sinais e recomendações são exibidos. |
| QA-015 | URL HTTPS obrigatória | URL HTTP é rejeitada antes de chamar o backend. |
| QA-016 | Erro na análise SEO | Uma resposta de erro do backend é apresentada ao usuário. |
| QA-017 | Mídias Sociais | Regras, calendário e versões da marca são enviados; pendências de revisão são exibidas. |
| QA-018 | Relatórios e KPIs | Observações e metas são enviadas; resultados e síntese são exibidos. |
| QA-019 | Tráfego | Briefing, orçamento, metas e criativo são enviados; o rascunho é exibido. |
| QA-020 | Rota protegida | Uma sessão expirada redireciona a rota autenticada para o login. |
| QA-021 | Login com departamento | O departamento selecionado no login determina quais agentes aparecem. |
| QA-022 | Login exige departamento | Sem escolher um departamento, o login mostra erro e não autentica. |
| QA-023 | Acesso a agente de outro departamento | Uma rota direta é redirecionada ao catálogo. |
| QA-024 | Histórico | O histórico exibe conversas fornecidas pela API, sem dados fictícios. |
| QA-025 | Dashboard removido | `/dashboard` não existe mais e redireciona para o login. |

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

**Escopo atual:** 25 cenários funcionais com respostas simuladas da API; consulte a execução mais recente do Playwright para o resultado.
