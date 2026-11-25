
import { test, expect, type Page } from '@playwright/test'

const authenticatedUser = {
  id: 'user-test',
  name: 'Ana',
  surname: 'Souza',
  email: 'ana@example.com',
  role: 'DEFAULT',
  department: 'MARKETING',
}

const seoAnalysis = {
  url: 'https://www.exemplo.com/pagina',
  title: 'Página de exemplo',
  metaDescription: 'Descrição da página.',
  canonicalUrl: 'https://www.exemplo.com/pagina',
  h1Count: 1,
  headingCount: 3,
  imagesWithoutAlt: 2,
  internalLinks: 4,
  externalLinks: 1,
  score: 82,
  summary: 'A página tem uma estrutura inicial adequada, com pontos a melhorar.',
  titleAdvice: 'Torne o título mais específico.',
  descriptionAdvice: 'Inclua uma descrição única e clara.',
  contentAdvice: 'Desenvolva melhor os tópicos principais.',
  technicalAdvice: 'Adicione texto alternativo às imagens.',
  keywordAdvice: 'Use a palavra-chave de forma natural.',
  actions: ['Reescrever o título.', 'Adicionar textos alternativos.'],
}

test.beforeEach(async ({ page }) => {
  const conversations = []
  const transcripts = new Map()
  const leads = []

  await page.route('**/csrf', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ headerName: 'X-CSRF-TOKEN', token: 'csrf-test' }),
  }))
  await page.route('**/auth/me', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(authenticatedUser),
  }))
  await page.route('**/auth/login', (route) => route.fulfill({ status: 204 }))
  await page.route('**/auth/refresh', (route) => route.fulfill({ status: 204 }))
  await page.route('**/auth/logout', (route) => route.fulfill({ status: 204 }))
  await page.route('**/users/register', (route) => route.fulfill({
    status: 201,
    contentType: 'application/json',
    body: JSON.stringify(authenticatedUser),
  }))
  await page.route('**/agents/content/conversations', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(conversations),
  }))
  await page.route('**/agents/content/conversations/*/messages', (route) => {
    const conversationId = new URL(route.request().url()).pathname.split('/').at(-2)
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(transcripts.get(conversationId) ?? []),
    })
  })
  await page.route('**/agents/content/produce', async (route) => {
    const request = route.request().postDataJSON()
    const conversationId = request.conversationId ?? `conversation-${conversations.length + 1}`
    const transcript = transcripts.get(conversationId) ?? []
    transcript.push({
      id: `user-${transcript.length}`,
      role: 'USER',
      content: JSON.stringify(request),
      createdAt: new Date().toISOString(),
    })
    transcript.push({
      id: `assistant-${transcript.length}`,
      role: 'ASSISTANT',
      content: 'Rascunho de conteúdo para revisão.',
      createdAt: new Date().toISOString(),
    })
    transcripts.set(conversationId, transcript)
    if (!conversations.some((conversation) => conversation.id === conversationId)) {
      conversations.unshift({
        id: conversationId,
        title: request.objective,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        conversationId,
        draft: 'Rascunho de conteúdo para revisão.',
        humanReviewRequired: true,
      }),
    })
  })

  await page.route('**/agents/leads', async (route) => {
    if (route.request().method() === 'GET') {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(leads) })
    }
    const lead = {
      ...route.request().postDataJSON(),
      id: `lead-${leads.length + 1}`,
      score: null,
      fit: null,
      reasoning: null,
      nextStep: null,
      qualifiedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    leads.unshift(lead)
    return route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(lead) })
  })
  await page.route('**/agents/leads/import', async (route) => {
    const imported = route.request().postDataJSON().leads.map((lead, index) => ({
      ...lead,
      id: `imported-${index + 1}`,
      score: null,
      fit: null,
      reasoning: null,
      nextStep: null,
      qualifiedAt: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))
    leads.unshift(...imported)
    return route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(imported) })
  })
  await page.route('**/agents/leads/*/qualify', async (route) => {
    const leadId = new URL(route.request().url()).pathname.split('/').at(-2)
    const lead = leads.find((item) => item.id === leadId)
    const result = {
      id: leadId,
      score: 86,
      fit: 'QUALIFIED',
      reasoning: 'Empresa e setor aderentes ao ICP informado.',
      nextStep: 'Validar o desafio com a pessoa responsável pela área.',
      qualifiedAt: new Date().toISOString(),
    }
    Object.assign(lead, result)
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(result) })
  })
  await page.route('**/agents/seo/analyze', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify(seoAnalysis),
  }))
})

// Sem perfil salvo, o departamento padrão é Marketing. Para testar outro, defina antes de abrir a página.
async function comoDepartamento(page: Page, dept: 'Marketing' | 'Comercial') {
  await page.route('**/auth/me', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({
      ...authenticatedUser,
      department: dept === 'Marketing' ? 'MARKETING' : 'COMMERCIAL',
    }),
  }))
}

test('QA-001 - Página de login', async ({ page }) => {
  await page.goto('/login')
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.locator('input[type="password"]')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Entrar com Google' })).toHaveCount(0)
})

test('QA-002 - Cadastro envia os campos aceitos pela API', async ({ page }) => {
  let submitted
  await page.route('**/users/register', async (route) => {
    submitted = route.request().postDataJSON()
    await route.fulfill({ status: 201, contentType: 'application/json', body: JSON.stringify(authenticatedUser) })
  })
  await page.goto('/cadastro')
  await page.getByPlaceholder('Digite seu nome').fill('Ana')
  await page.getByPlaceholder('Digite seu sobrenome').fill('Souza')
  await page.getByPlaceholder('000.000.000-00').fill('012.345.678-90')
  await page.getByPlaceholder('nome@incorp.com.br').fill('ana@example.com')
  await page.getByPlaceholder('Mínimo de 6 caracteres').fill('senha123')
  await page.getByPlaceholder('Repita sua senha').fill('senha123')
  await expect(page.getByLabel('Departamento')).toHaveCount(0)
  await page.getByRole('button', { name: 'Criar conta' }).click()
  await expect(page.getByRole('status')).toContainText('Conta criada com sucesso')
  expect(submitted).toEqual({
    name: 'Ana',
    surname: 'Souza',
    cpf: '01234567890',
    email: 'ana@example.com',
    password: 'senha123',
  })
})

test('QA-003 - Login usa a API e abre a área autenticada', async ({ page }) => {
  let submitted
  await page.route('**/auth/login', async (route) => {
    submitted = route.request().postDataJSON()
    await route.fulfill({ status: 204 })
  })
  await page.goto('/login')
  await page.getByPlaceholder('nome@incorp.com.br').fill('ana@example.com')
  await page.getByPlaceholder('Digite sua senha').fill('senha123')
  await page.getByLabel('Perfil de acesso').selectOption('MARKETING')
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()
  await expect(page).toHaveURL(/\/home$/)
  await expect(page.getByRole('heading', { name: /Ana/ })).toBeVisible()
  expect(submitted).toMatchObject({
    email: 'ana@example.com',
    password: 'senha123',
    department: 'MARKETING',
  })
})

test('Administrador entra e define o departamento de uma nova conta', async ({ page }) => {
  const pendingUser = { ...authenticatedUser, id: 'pending-user', department: null }
  await page.route('**/auth/login', (route) => route.fulfill({ status: 204 }))
  await page.route('**/auth/me', (route) => route.fulfill({
    json: { ...authenticatedUser, role: 'ADMINISTRATOR' },
  }))
  await page.route('**/users', (route) => route.fulfill({ json: [pendingUser] }))
  await page.route('**/users/pending-user', (route) => route.fulfill({
    json: { ...pendingUser, department: 'COMMERCIAL' },
  }))
  await page.goto('/login')
  await page.getByPlaceholder('nome@incorp.com.br').fill('admin@example.com')
  await page.getByPlaceholder('Digite sua senha').fill('senha-de-teste')
  await page.getByLabel('Perfil de acesso').selectOption({ label: 'Administrador' })
  const request = page.waitForRequest('**/auth/login')
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()
  expect((await request).postDataJSON()).toMatchObject({ department: 'ADMINISTRATOR' })
  await expect(page).toHaveURL(/\/usuarios$/)
  await expect(page.getByText('Aguardando departamento')).toBeVisible()
  await page.getByRole('combobox', { name: 'Departamento de ana@example.com', exact: true }).selectOption('COMMERCIAL')
  const assignment = page.waitForRequest('**/users/pending-user')
  await page.getByRole('button', { name: 'Salvar departamento de ana@example.com', exact: true }).click()
  expect((await assignment).postDataJSON()).toEqual({ department: 'COMMERCIAL' })
  await expect(page.getByText('Departamento salvo.')).toBeVisible()
  await expect(page.getByText('Aguardando departamento')).toHaveCount(0)
})

test('Usuário comum não abre o gerenciamento de departamentos', async ({ page }) => {
  await page.goto('/usuarios')
  await expect(page).toHaveURL(/\/home$/)
  await expect(page.getByRole('link', { name: 'Usuários' })).toHaveCount(0)
})

test('QA-004 - Catálogo mostra agentes implementados do departamento', async ({ page }) => {
  await page.goto('/agentes')

  // departamento padrão (Marketing): vê os agentes de Marketing e nenhum de Comercial
  await expect(page.getByText('Agente de Produção de Conteúdo').first()).toBeVisible()
  await expect(page.getByText('Agente de Mídias Sociais').first()).toBeVisible()
  await expect(page.getByText('5 agentes disponíveis para Marketing')).toBeVisible()
  await expect(page.getByText('Agente de Prospecção e Qualificação de Leads')).toHaveCount(0)
})

test('QA-005 - Pesquisa de agentes', async ({ page }) => {
  await page.goto('/agentes')
  await page.getByPlaceholder('Buscar agente...').fill('SEO')
  await expect(page.getByText('Agente de SEO').first()).toBeVisible()
  await expect(page.getByText('Agente de Produção de Conteúdo')).toHaveCount(0)
})

test('QA-006 - Agentes do departamento', async ({ page }) => {
  await comoDepartamento(page, 'Comercial')
  await page.goto('/agentes')

  await expect(page.getByText('Agente de Prospecção e Qualificação de Leads').first()).toBeVisible()
  await expect(page.getByText('Agente de Produção de Conteúdo')).toHaveCount(0)
})

test('QA-007 - Workspace pede briefing antes de gerar conteúdo', async ({ page }) => {
  await page.goto('/agentes')
  await page.getByText('Agente de Produção de Conteúdo').first().click()
  await expect(page).toHaveURL(/\/agentes\/copywriter$/)
  await expect(page.getByRole('heading', { name: 'Prepare o briefing' })).toBeVisible()
})

test('QA-008 - Geração cria conversa persistente', async ({ page }) => {
  await page.goto('/agentes/copywriter')
  await page.getByPlaceholder('Ex.: divulgar um novo serviço').fill('Divulgar consultoria')
  await page.getByPlaceholder('Ex.: gestores de pequenas empresas').fill('Pequenas empresas')
  await page.getByLabel('Canal *').selectOption({ label: 'LinkedIn' })
  await page.getByPlaceholder('Ex.: post, artigo, e-mail').fill('Post')
  await page.getByPlaceholder(/Inclua fatos, benefícios/).fill('Consultoria em marketing')
  await page.getByRole('button', { name: 'Gerar conteúdo' }).click()
  await expect(page.getByText('Rascunho de conteúdo para revisão.').first()).toBeVisible()
  await expect(page).toHaveURL(/conversationId=conversation-1/)
})

test('QA-009 - Nova conversa limpa o workspace', async ({ page }) => {
  await page.goto('/agentes/copywriter')
  await page.getByPlaceholder('Ex.: divulgar um novo serviço').fill('Primeira campanha')
  await page.getByPlaceholder('Ex.: gestores de pequenas empresas').fill('Clientes')
  await page.getByLabel('Canal *').selectOption({ label: 'LinkedIn' })
  await page.getByPlaceholder('Ex.: post, artigo, e-mail').fill('Post')
  await page.getByPlaceholder(/Inclua fatos, benefícios/).fill('Fatos disponíveis')
  await page.getByRole('button', { name: 'Gerar conteúdo' }).click()
  await expect(page.getByText('Rascunho de conteúdo para revisão.').first()).toBeVisible()
  await page.getByRole('button', { name: 'Nova conversa' }).click()
  await expect(page.getByRole('heading', { name: 'Prepare o briefing' })).toBeVisible()
  await expect(page.getByPlaceholder('Ex.: divulgar um novo serviço')).toHaveValue('')
})

test('QA-010 - Voltar para agentes', async ({ page }) => {
  await page.goto('/agentes/copywriter')
  await page.getByRole('link', { name: 'Voltar para agentes' }).click()
  await expect(page).toHaveURL(/\/agentes$/)
})

test('QA-011 - Histórico lista conversas persistidas', async ({ page }) => {
  await page.goto('/agentes/copywriter')
  await page.getByPlaceholder('Ex.: divulgar um novo serviço').fill('Conteúdo para o histórico')
  await page.getByPlaceholder('Ex.: gestores de pequenas empresas').fill('Clientes corporativos')
  await page.getByLabel('Canal *').selectOption({ label: 'LinkedIn' })
  await page.getByPlaceholder('Ex.: post, artigo, e-mail').fill('Publicação')
  await page.getByPlaceholder(/Inclua fatos, benefícios/).fill('Informações verificadas')
  await page.getByRole('button', { name: 'Gerar conteúdo' }).click()
  await expect(page).toHaveURL(/conversationId=conversation-1/)
  await page.goto('/historico')
  await expect(page.getByText('Conteúdo para o histórico')).toBeVisible()
  await page.getByRole('link', { name: /Conteúdo para o histórico/ }).click()
  await expect(page).toHaveURL(/\/agentes\/copywriter\?conversationId=conversation-1/)
  await expect(page.getByText('Rascunho de conteúdo para revisão.').first()).toBeVisible()
})

test('QA-012 - Cadastro manual e qualificação de lead', async ({ page }) => {
  await comoDepartamento(page, 'Comercial')
  await page.goto('/agentes')
  await page.getByText('Agente de Prospecção e Qualificação de Leads').first().click()
  await expect(page).toHaveURL(/\/agentes\/lead$/)
  await page.getByLabel('Perfil ideal de cliente (ICP) *').fill('Empresas B2B de tecnologia com 20 a 200 funcionários.')
  await page.getByLabel('Nome *').fill('Marina Costa')
  await page.getByLabel('Empresa', { exact: true }).fill('Acme Tecnologia')
  await page.getByLabel('E-mail').fill('marina@acme.example')
  await page.getByRole('button', { name: 'Cadastrar lead' }).click()
  await expect(page.getByText('Lead cadastrado.')).toBeVisible()
  await page.getByRole('button', { name: 'Qualificar lead' }).click()
  await expect(page.getByText('Pontuação: 86/100')).toBeVisible()
  await expect(page.getByText('Empresa e setor aderentes ao ICP informado.')).toBeVisible()
  await expect(page.getByText(/Validar o desafio com a pessoa responsável/)).toBeVisible()
})

test('QA-013 - Importação de leads por CSV', async ({ page }) => {
  await comoDepartamento(page, 'Comercial')
  await page.goto('/agentes')
  await page.getByText('Agente de Prospecção e Qualificação de Leads').first().click()
  await page.getByLabel('Arquivo CSV').setInputFiles({
    name: 'leads.csv',
    mimeType: 'text/csv',
    buffer: Buffer.from('nome;empresa;email\nJoão Lima;"Empresa, Sul";joao@example.com'),
  })
  await expect(page.getByText('leads.csv: 1 lead(s) pronto(s) para importação.')).toBeVisible()
  await page.getByRole('button', { name: 'Confirmar importação' }).click()
  await expect(page.getByText('1 lead(s) importado(s) com sucesso.')).toBeVisible()
  await expect(page.getByText('João Lima')).toBeVisible()
  await expect(page.getByText(/Empresa, Sul/)).toBeVisible()
})

test('QA-014 - Agente SEO envia URL e mostra auditoria', async ({ page }) => {
  let submitted
  await page.route('**/agents/seo/analyze', async (route) => {
    submitted = route.request().postDataJSON()
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(seoAnalysis),
    })
  })
  await page.goto('/agentes')
  await page.getByText('Agente de SEO').first().click()
  await expect(page).toHaveURL(/\/agentes\/seo$/)
  await page.getByLabel('URL pública da página (HTTPS) *').fill('https://www.exemplo.com/pagina')
  await page.getByLabel('Palavra-chave-alvo').fill('auditoria SEO')
  await page.getByLabel('Contexto adicional (opcional)').fill('Página institucional')
  await page.getByRole('button', { name: 'Analisar página' }).click()
  await expect(page.getByText('Pontuação de auditoria')).toBeVisible()
  await expect(page.getByText('Torne o título mais específico.')).toBeVisible()
  await expect(page.getByText('2 sem texto alternativo')).toBeVisible()
  expect(submitted).toEqual({
    url: 'https://www.exemplo.com/pagina',
    targetKeyword: 'auditoria SEO',
    supplementalText: 'Página institucional',
  })
})

test('QA-015 - Agente SEO exige uma URL HTTPS antes de chamar a API', async ({ page }) => {
  let requestSent = false
  await page.route('**/agents/seo/analyze', async (route) => {
    requestSent = true
    await route.fulfill({ status: 500, body: 'Unexpected request' })
  })
  await page.goto('/agentes/seo')
  await page.getByLabel('URL pública da página (HTTPS) *').fill('http://www.exemplo.com/pagina')
  await page.getByRole('button', { name: 'Analisar página' }).click()
  await expect(page.getByRole('alert')).toHaveText('Informe uma URL válida que comece com HTTPS.')
  expect(requestSent).toBe(false)
})

test('QA-016 - Agente SEO apresenta erro da API', async ({ page }) => {
  await page.route('**/agents/seo/analyze', (route) => route.fulfill({
    status: 422,
    contentType: 'application/problem+json',
    body: JSON.stringify({ detail: 'A página redirecionou a solicitação.' }),
  }))
  await page.goto('/agentes/seo')
  await page.getByLabel('URL pública da página (HTTPS) *').fill('https://www.exemplo.com/pagina')
  await page.getByRole('button', { name: 'Analisar página' }).click()
  await expect(page.getByRole('alert')).toContainText('A página redirecionou a solicitação.')
})

test('QA-017 - Agente de Mídias Sociais valida regras e versão da marca', async ({ page }) => {
  let submitted
  await page.route('**/agents/social/publication-plan', async (route) => {
    submitted = route.request().postDataJSON()
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        status: 'REVIEW_REQUIRED',
        platform: 'LINKEDIN',
        format: 'POST',
        plannedAt: submitted.plannedAt,
        issues: ['A versão da marca usada no conteúdo está desatualizada.'],
        technicalRulesReference: submitted.technicalRules.reference,
        simulation: null,
        pendingInteractions: [],
      }),
    })
  })

  await page.goto('/agentes/social')
  await page.getByLabel('Plataforma *').selectOption('LINKEDIN')
  await page.getByLabel('Referência do conteúdo *').fill('campanha-novembro-post-01')
  await page.getByLabel('Versão da marca usada no conteúdo *').fill('v1')
  await page.getByLabel('Versão atual das diretrizes de marca *').fill('v2')
  await page.getByLabel('Legenda final *').fill('Conteúdo aprovado para revisão.')
  await page.getByLabel('Horário planejado *').fill('2030-11-20T10:00')
  await page.getByLabel('Horários aprovados *').fill('2030-11-20T10:00')
  await page.getByRole('button', { name: 'Validar publicação' }).click()

  await expect(page.getByText('Revisão necessária')).toBeVisible()
  await expect(page.getByText('A versão da marca usada no conteúdo está desatualizada.')).toBeVisible()
  expect(submitted).toMatchObject({
    platform: 'LINKEDIN',
    contentReference: 'campanha-novembro-post-01',
    contentBrandVersion: 'v1',
    currentBrandVersion: 'v2',
    caption: 'Conteúdo aprovado para revisão.',
    confirmed: false,
  })
  expect(submitted.approvedSlots[0]).toBe(submitted.plannedAt)
})

test('QA-018 - Agente de Relatórios envia observações e mostra metas', async ({ page }) => {
  let submitted
  await page.route('**/agents/reports/kpis', async (route) => {
    submitted = route.request().postDataJSON()
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        product: 'Campanha de novembro',
        startDate: '2026-11-01',
        endDate: '2026-11-30',
        metrics: [{
          channel: 'PAID',
          name: 'CPA',
          unit: 'BRL',
          value: 18,
          goal: { value: 20, direction: 'AT_MOST' },
          status: 'GOAL_MET',
          observations: [{ source: 'TRAFFIC_AGENT', reference: 'relatorio-trafego-novembro', value: 18 }],
          contextReferences: [],
        }],
        narrative: 'O CPA ficou abaixo da meta.',
      }),
    })
  })

  await page.goto('/agentes/reports')
  await page.getByLabel('Produto ou iniciativa *').fill('Campanha de novembro')
  await page.getByLabel('Data inicial *').fill('2026-11-01')
  await page.getByLabel('Data final *').fill('2026-11-30')
  await page.getByLabel('Nome do KPI *').fill('CPA')
  await page.getByLabel('Unidade *').fill('BRL')
  await page.getByLabel('Valor observado (opcional)').fill('18')
  await page.getByLabel('Referência da fonte *').fill('relatorio-trafego-novembro')
  await page.getByLabel('Meta (opcional)').fill('20')
  await page.getByRole('button', { name: 'Gerar relatório' }).click()

  await expect(page.getByText('Relatório de Campanha de novembro')).toBeVisible()
  await expect(page.getByText('Meta atingida')).toBeVisible()
  await expect(page.getByText('O CPA ficou abaixo da meta.')).toBeVisible()
  expect(submitted.metrics[0]).toMatchObject({
    channel: 'PAID',
    name: 'CPA',
    unit: 'BRL',
    goal: { value: 20, direction: 'AT_MOST' },
    observations: [{ source: 'TRAFFIC_AGENT', reference: 'relatorio-trafego-novembro', value: 18 }],
  })
})

test('QA-019 - Agente de Tráfego envia briefing e exibe rascunho', async ({ page }) => {
  let submitted
  await page.route('**/agents/traffic/campaign-plan', async (route) => {
    submitted = route.request().postDataJSON()
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        campaignReference: 'campanha-produto-novembro',
        product: 'Consultoria de marketing',
        platform: 'META_ADS',
        startDate: submitted.startDate,
        endDate: submitted.endDate,
        status: 'SIMULATED_DRAFT',
        budget: { currency: 'BRL', planned: 500, ceiling: 600 },
        goals: { maxCpa: 25, minRoas: null },
        issues: [],
        strategy: 'Priorize o público que demonstrar intenção de compra.',
        performance: null,
      }),
    })
  })

  await page.goto('/agentes/traffic')
  await page.getByLabel('Referência da campanha *').fill('campanha-produto-novembro')
  await page.getByLabel('Produto ou serviço *').fill('Consultoria de marketing')
  await page.getByLabel('Objetivo *').fill('Gerar solicitações de demonstração')
  await page.getByLabel('Público-alvo *').fill('Empresas B2B de tecnologia')
  await page.getByLabel('Orçamento planejado *').fill('500')
  await page.getByLabel('Teto de orçamento *').fill('600')
  await page.getByLabel('CPA máximo').fill('25')
  await page.getByLabel('Referência do criativo *').fill('criativo-demo-v1')
  await page.getByLabel('Referência da validação *').fill('revisao-marca-novembro')
  await page.getByRole('button', { name: 'Planejar campanha' }).click()

  await expect(page.getByText('Rascunho simulado')).toBeVisible()
  await expect(page.getByText('Priorize o público que demonstrar intenção de compra.')).toBeVisible()
  expect(submitted).toMatchObject({
    campaignReference: 'campanha-produto-novembro',
    product: 'Consultoria de marketing',
    platform: 'META_ADS',
    budget: { currency: 'BRL', planned: 500, ceiling: 600 },
    goals: { maxCpa: 25, minRoas: null },
    creatives: [{ reference: 'criativo-demo-v1', validationReference: 'revisao-marca-novembro', compatible: true }],
    observation: null,
  })
})

test('QA-020 - Rota protegida redireciona quando a sessão expira', async ({ page }) => {
  await page.route('**/auth/me', (route) => route.fulfill({ status: 401, body: 'Unauthorized' }))
  await page.goto('/agentes')
  await expect(page).toHaveURL(/\/login$/)
})

test('QA-021 - Login com departamento', async ({ page }) => {
  await comoDepartamento(page, 'Comercial')
  await page.goto('/login')

  await page.getByPlaceholder('nome@incorp.com.br').fill('teste@incorp.com.br')
  await page.getByPlaceholder('Digite sua senha').fill('123456')
  await page.getByLabel('Perfil de acesso').selectOption('COMMERCIAL')
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()

  await expect(page).toHaveURL(/\/home$/)

  await page.goto('/agentes')
  await expect(page.getByText('Agente de Prospecção e Qualificação de Leads').first()).toBeVisible()
  await expect(page.getByText('Agente de Produção de Conteúdo')).toHaveCount(0)
})

test('QA-022 - Login exige perfil de acesso', async ({ page }) => {
  await page.goto('/login')

  await page.getByPlaceholder('nome@incorp.com.br').fill('teste@incorp.com.br')
  await page.getByPlaceholder('Digite sua senha').fill('123456')
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()

  await expect(page.getByText('Selecione seu perfil de acesso.')).toBeVisible()
  await expect(page).toHaveURL(/\/login$/)
})

test('QA-023 - Agente de outro departamento não abre pela URL', async ({ page }) => {
  // usuário de Marketing tentando abrir um agente de Comercial
  await page.goto('/agentes/lead')

  await expect(page).toHaveURL(/\/agentes$/)
  await expect(page.getByText('Agente de Prospecção e Qualificação de Leads')).toHaveCount(0)
})

test('QA-024 - Histórico lista conversas reais da API', async ({ page }) => {
  await page.route('**/agents/content/conversations', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify([{
      id: 'conversation-actual',
      title: 'Relatório mensal de campanha',
      createdAt: '2026-11-18T12:00:00Z',
      updatedAt: '2026-11-18T12:30:00Z',
    }]),
  }))
  await page.goto('/historico')

  await expect(page.getByText('Relatório mensal de campanha')).toBeVisible()
  await expect(page.getByText('Proposal Builder')).toHaveCount(0)
})

test('QA-025 - Dashboard foi removido', async ({ page }) => {
  await page.goto('/dashboard')

  await expect(page).toHaveURL(/\/login$/)
})

test('QA-026 - Editais envia o edital e exibe checklist e parecer', async ({ page }) => {
  let submitted
  await comoDepartamento(page, 'Comercial')
  await page.route('**/agents/bids/analyze', async (route) => {
    submitted = route.request().postDataJSON()
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        bidReference: 'PE-42/2026',
        issuingBody: 'Ministério da Gestão e Inovação',
        modality: 'PREGAO_ELETRONICO',
        submissionDeadline: '2026-12-05',
        openingDate: '2026-12-05',
        status: 'REVIEW_REQUIRED',
        riskLevel: 'MEDIUM',
        issues: ['Um documento de habilitação ainda não foi providenciado.'],
        checklist: [
          {
            item: 'Contrato Social consolidado',
            type: 'HABILITACAO_JURIDICA',
            status: 'COMPLIANT',
            observation: 'Documento informado como providenciado.',
          },
          {
            item: 'Balanço Patrimonial do último exercício',
            type: 'QUALIFICACAO_ECONOMICO_FINANCEIRA',
            status: 'PENDING',
            observation: 'Pendente de assinatura contábil.',
          },
        ],
        strategicRecommendations: 'Organize a documentação pendente antes de protocolar a proposta.',
      }),
    })
  })

  await page.goto('/home')
  await page.getByRole('link', { name: /Agente de Editais e Licitações/ }).click()
  await expect(page).toHaveURL(/\/agentes\/tenders$/)
  await page.getByRole('link', { name: 'Voltar para agentes' }).click()
  await expect(page).toHaveURL(/\/agentes$/)
  await expect(page.getByText('3 agentes disponíveis para Comercial')).toBeVisible()
  await page.getByText('Agente de Editais e Licitações').first().click()
  await expect(page).toHaveURL(/\/agentes\/tenders$/)

  await page.getByLabel('Identificador do edital *').fill('PE-42/2026')
  await page.getByLabel('Órgão *').fill('Ministério da Gestão e Inovação')
  await page.getByLabel('Modalidade *').selectOption('PREGAO_ELETRONICO')
  await page.getByLabel('Objeto *').fill('Contratação de plataforma em nuvem para inteligência e automação de processos.')
  await page.getByLabel('Prazo de envio *').fill('2026-12-05')
  await page.getByLabel('Data de abertura *').fill('2026-12-05')
  await page.getByLabel('Valor estimado *').fill('350000')
  await page.getByLabel('Valor máximo aceitável').fill('400000')
  await page.getByRole('button', { name: 'Adicionar requisito' }).click()
  await page.getByLabel('Requisito técnico 1 *').fill('Atestado de capacidade técnica para sustentação de microsserviços em nuvem')
  await page.getByRole('button', { name: 'Adicionar documento' }).click()
  await page.getByLabel('Nome do documento 1 *').fill('Contrato Social consolidado')
  await page.getByLabel('Tipo do documento 1 *').selectOption('HABILITACAO_JURIDICA')
  await page.getByRole('checkbox', { name: 'Documento 1 já providenciado' }).check()
  await page.getByRole('button', { name: 'Adicionar documento' }).click()
  await page.getByLabel('Nome do documento 2 *').fill('Balanço Patrimonial do último exercício')
  await page.getByLabel('Tipo do documento 2 *').selectOption('QUALIFICACAO_ECONOMICO_FINANCEIRA')
  await page.getByLabel('Observação do documento 2').fill('Pendente de assinatura contábil')
  await page.getByLabel('Resumo do edital').fill('Pregão com critério de julgamento menor preço por item.')
  await page.getByRole('button', { name: 'Analisar edital' }).click()

  await expect(page.getByText('Revisão necessária', { exact: true })).toBeVisible()
  await expect(page.getByText('Risco Médio', { exact: true })).toBeVisible()
  await expect(page.getByText('Um documento de habilitação ainda não foi providenciado.')).toBeVisible()
  await expect(page.getByText('Conforme', { exact: true })).toBeVisible()
  await expect(page.getByText('Pendente', { exact: true })).toBeVisible()
  await expect(page.getByText('Organize a documentação pendente antes de protocolar a proposta.')).toBeVisible()
  expect(submitted).toEqual({
    bidReference: 'PE-42/2026',
    issuingBody: 'Ministério da Gestão e Inovação',
    modality: 'PREGAO_ELETRONICO',
    objectDescription: 'Contratação de plataforma em nuvem para inteligência e automação de processos.',
    submissionDeadline: '2026-12-05',
    openingDate: '2026-12-05',
    budget: { currency: 'BRL', estimatedValue: 350000, maxAcceptableValue: 400000 },
    technicalRequirements: ['Atestado de capacidade técnica para sustentação de microsserviços em nuvem'],
    qualificationDocuments: [
      { documentName: 'Contrato Social consolidado', type: 'HABILITACAO_JURIDICA', provided: true },
      {
        documentName: 'Balanço Patrimonial do último exercício',
        type: 'QUALIFICACAO_ECONOMICO_FINANCEIRA',
        provided: false,
        remarks: 'Pendente de assinatura contábil',
      },
    ],
    noticeSummary: 'Pregão com critério de julgamento menor preço por item.',
  })
})

test('QA-027 - Apoio Comercial envia a oportunidade e exibe a estratégia', async ({ page }) => {
  let submitted
  await comoDepartamento(page, 'Comercial')
  await page.route('**/agents/commercial/advise', async (route) => {
    submitted = route.request().postDataJSON()
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        opportunityReference: 'OPP-2026-089',
        clientName: 'Grupo Varejo Brasil',
        stage: 'NEGOTIATION',
        status: 'REVIEW_REQUIRED',
        issues: ['Há objeções que ainda precisam de alinhamento antes do avanço.'],
        objectionStrategies: [{
          category: 'Preço',
          description: 'Cliente alega que o setup está 20% acima do orçamento previsto para este ano.',
          recommendedAngle: 'Compare o custo do setup com o ganho de conversão no mobile.',
        }],
        commercialStrategy: 'Apresente o piloto como validação do CFO e destaque a integração com o ERP.',
      }),
    })
  })

  await page.goto('/home')
  await page.getByRole('link', { name: /Agente de Apoio Comercial/ }).click()
  await expect(page).toHaveURL(/\/agentes\/commercial$/)
  await page.getByRole('link', { name: 'Voltar para agentes' }).click()
  await expect(page).toHaveURL(/\/agentes$/)
  await page.getByText('Agente de Apoio Comercial').first().click()
  await expect(page).toHaveURL(/\/agentes\/commercial$/)

  await page.getByLabel('Referência da oportunidade *').fill('OPP-2026-089')
  await page.getByLabel('Cliente *').fill('Grupo Varejo Brasil')
  await page.getByLabel('Segmento *').fill('Varejo Omnichannel')
  await page.getByLabel('Decisores *').fill('Diretora de E-commerce e Gerente de TI')
  await page.getByLabel('Produto oferecido *').fill('Plataforma de Personalização de Vitrines')
  await page.getByLabel('Estágio *').selectOption('NEGOTIATION')
  await page.getByLabel('Valor da oportunidade *').fill('85000')
  await page.getByLabel('Dor 1 *').fill('Taxa de conversão estagnada no mobile')
  await page.getByRole('button', { name: 'Adicionar dor' }).click()
  await page.getByLabel('Dor 2 *').fill('Dificuldade de integrar catálogo com o ERP legado')
  await page.getByRole('button', { name: 'Adicionar concorrente' }).click()
  await page.getByLabel('Concorrente 1 *').fill('Concorrente Alfa')
  await page.getByRole('button', { name: 'Adicionar concorrente' }).click()
  await page.getByLabel('Concorrente 2 *').fill('Solução interna legada')
  await page.getByRole('button', { name: 'Adicionar objeção' }).click()
  await page.getByLabel('Categoria da objeção 1 *').fill('Preço')
  await page.getByLabel('Descrição da objeção 1 *').fill('Cliente alega que o setup está 20% acima do orçamento previsto para este ano.')
  await page.getByLabel('Tentativa atual 1').fill('Oferecemos parcelamento do setup em 3 vezes.')
  await page.getByLabel('Observações').fill('Cliente demonstrou alto interesse no piloto mas necessita de validação do CFO.')
  await page.getByRole('button', { name: 'Gerar direcionamento' }).click()

  await expect(page.getByText('Revisão necessária', { exact: true })).toBeVisible()
  await expect(page.getByText('Há objeções que ainda precisam de alinhamento antes do avanço.')).toBeVisible()
  await expect(page.getByText('Compare o custo do setup com o ganho de conversão no mobile.')).toBeVisible()
  await expect(page.getByText('Apresente o piloto como validação do CFO e destaque a integração com o ERP.')).toBeVisible()
  expect(submitted).toEqual({
    opportunityReference: 'OPP-2026-089',
    clientName: 'Grupo Varejo Brasil',
    clientSegment: 'Varejo Omnichannel',
    decisionMakers: 'Diretora de E-commerce e Gerente de TI',
    productOffered: 'Plataforma de Personalização de Vitrines',
    stage: 'NEGOTIATION',
    dealValue: { currency: 'BRL', amount: 85000 },
    painPoints: [
      'Taxa de conversão estagnada no mobile',
      'Dificuldade de integrar catálogo com o ERP legado',
    ],
    competitors: ['Concorrente Alfa', 'Solução interna legada'],
    objections: [{
      category: 'Preço',
      description: 'Cliente alega que o setup está 20% acima do orçamento previsto para este ano.',
      currentAttempt: 'Oferecemos parcelamento do setup em 3 vezes.',
    }],
    notes: 'Cliente demonstrou alto interesse no piloto mas necessita de validação do CFO.',
  })
})

test('QA-028 - Usuário de Marketing não abre editais nem apoio comercial pela URL', async ({ page }) => {
  await page.goto('/agentes/tenders')
  await expect(page).toHaveURL(/\/agentes$/)
  await expect(page.getByText('Agente de Editais e Licitações')).toHaveCount(0)

  await page.goto('/agentes/commercial')
  await expect(page).toHaveURL(/\/agentes$/)
  await expect(page.getByText('Agente de Apoio Comercial')).toHaveCount(0)
})

test('QA-029 - Edital não envia prazo posterior à data de abertura', async ({ page }) => {
  let requestSent = false
  await comoDepartamento(page, 'Comercial')
  await page.route('**/agents/bids/analyze', async (route) => {
    requestSent = true
    await route.fulfill({ status: 500, body: 'Unexpected request' })
  })

  await page.goto('/agentes/tenders')
  await page.getByLabel('Identificador do edital *').fill('PE-42/2026')
  await page.getByLabel('Órgão *').fill('Ministério da Gestão e Inovação')
  await page.getByLabel('Objeto *').fill('Contratação de plataforma em nuvem.')
  await page.getByLabel('Prazo de envio *').fill('2026-12-06')
  await page.getByLabel('Data de abertura *').fill('2026-12-05')
  await page.getByLabel('Valor estimado *').fill('350000')
  await page.getByRole('button', { name: 'Analisar edital' }).click()

  await expect(page.getByRole('alert')).toHaveText('O prazo de envio de propostas não pode ser posterior à data de abertura.')
  expect(requestSent).toBe(false)
})
