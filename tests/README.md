# Incorp AI — Testes Automatizados de QA

![QA](https://img.shields.io/badge/QA-10%2F10%20aprovados-brightgreen)
![Playwright](https://img.shields.io/badge/Testes-Playwright-blue)
![Navegador](https://img.shields.io/badge/Navegador-Chromium-informational)

## Objetivo

Este documento apresenta a primeira bateria de testes automatizados de Quality Assurance (QA) do **Incorp AI**, interface de agentes inteligentes desenvolvida com React, Vite e TypeScript/JavaScript.

Os testes verificam o comportamento da interface e a navegação entre telas, utilizando **Playwright** com o navegador **Chromium**. Nesta etapa, as interações com agentes são **demonstrativas**, sem integração real com serviços de inteligência artificial ou autenticação no Back-end.

## Resultado da primeira execução validada

| Indicador | Resultado |
| --- | --- |
| Cenários executados | 10 |
| Aprovados | 10 |
| Reprovados | 0 |
| Taxa de aprovação | **100%** |
| Ferramenta | Playwright |
| Navegador | Chromium |

> **Nota:** o resultado acima corresponde à execução local informada após a correção do seletor do QA-007. Ele não garante ausência de defeitos nem substitui testes futuros de integração, segurança e acessibilidade.

## Cenários automatizados

| ID | Cenário | Validação |
| --- | --- | --- |
| QA-001 | Página de login | A tela de login é exibida. |
| QA-002 | Página de cadastro | A tela de cadastro é exibida. |
| QA-004 | Catálogo de agentes | A lista de agentes é apresentada. |
| QA-005 | Pesquisa de agentes | A pesquisa filtra os agentes exibidos. |
| QA-006 | Filtro por departamento | A seleção de departamento atualiza os agentes exibidos. |
| QA-007 | Abrir Workspace | Um agente abre seu Workspace na rota correspondente. |
| QA-008 | Enviar mensagem demonstrativa | A mensagem enviada aparece na conversa e recebe resposta simulada. |
| QA-009 | Nova conversa | A ação reinicia a conversa demonstrativa. |
| QA-010 | Voltar aos agentes | O retorno leva ao catálogo de agentes. |
| QA-015 | Rota inexistente | Uma rota desconhecida redireciona para o login. |

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

## Histórico de correção: QA-007

Na primeira execução, o cenário **QA-007 — Abrir Workspace** falhou porque `getByText('Conversa')` correspondia tanto ao título da tela quanto ao botão **Nova conversa**. O seletor foi tornado específico:

```typescript
await expect(
  page.getByRole('heading', { name: 'Conversa', exact: true })
).toBeVisible()
```

Após essa correção no **teste**, os 10 cenários passaram. Não foi necessário alterar o componente da aplicação para resolver essa falha de seleção.

## Escopo e limitações

Esta bateria cobre fluxos funcionais básicos da interface em **Chromium desktop**. Ela **não comprova**, nesta fase:

- Autenticação e cadastro reais com Back-end.
- Respostas reais de agentes de IA.
- Persistência de mensagens e dados.
- Funcionamento em todos os navegadores e dispositivos.
- Segurança, acessibilidade ou desempenho em produção.

## Próximas etapas de QA

1. Validar os formulários de login e cadastro, incluindo mensagens de erro.
2. Ampliar a cobertura para Dashboard, Histórico, Favoritos e Configurações.
3. Adicionar testes responsivos para telas móveis.
4. Adicionar verificações básicas de acessibilidade.
5. Integrar os testes ao pipeline de CI após alinhamento com a equipe.

## Repositório

- **Projeto:** [C-26hub/Incorp_front](https://github.com/C-26hub/Incorp_front)
- **Branch de desenvolvimento:** [`feature/integracao-telas-react`](https://github.com/C-26hub/Incorp_front/tree/feature/integracao-telas-react)

---

**Status da primeira bateria:** 10/10 testes aprovados na execução local registrada.
