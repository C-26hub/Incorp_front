import { test, expect } from '@playwright/test'

const authenticatedUser = {
  id: 'user-test',
  name: 'Ana',
  surname: 'Souza',
  email: 'ana@example.com',
  role: 'DEFAULT',
}

test.beforeEach(async ({ page }) => {
  const conversations = []
  const transcripts = new Map()

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
})

test('QA-001 - Página de login', async ({ page }) => {
  await page.goto('/login')
  await expect(page).toHaveURL(/\/login$/)
  await expect(page.locator('input[type="password"]')).toBeVisible()
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
  await page.getByPlaceholder('000.000.000-00').fill('123.456.789-09')
  await page.getByPlaceholder('nome@incorp.com.br').fill('ana@example.com')
  await page.getByPlaceholder('Mínimo de 6 caracteres').fill('senha123')
  await page.getByPlaceholder('Repita sua senha').fill('senha123')
  await page.getByRole('button', { name: 'Criar conta' }).click()
  await expect(page.getByRole('status')).toContainText('Conta criada com sucesso')
  expect(submitted).toEqual({
    name: 'Ana',
    surname: 'Souza',
    cpf: 12345678909,
    email: 'ana@example.com',
    password: 'senha123',
  })
})

test('QA-003 - Login usa a API e abre a área autenticada', async ({ page }) => {
  await page.goto('/login')
  await page.getByPlaceholder('nome@incorp.com.br').fill('ana@example.com')
  await page.getByPlaceholder('Digite sua senha').fill('senha123')
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()
  await expect(page).toHaveURL(/\/home$/)
  await expect(page.getByRole('heading', { name: /Ana/ })).toBeVisible()
})

test('QA-004 - Catálogo marca os agentes não implementados', async ({ page }) => {
  await page.goto('/agentes')
  await expect(page.getByText('Agente de Produção de Conteúdo').first()).toBeVisible()
  await expect(page.getByText('Agente de Prospecção e Qualificação de Leads').first()).toBeVisible()
  await expect(page.getByText('7 em breve')).toBeVisible()
})

test('QA-005 - Pesquisa de agentes', async ({ page }) => {
  await page.goto('/agentes')
  await page.getByPlaceholder('Buscar agente...').fill('SEO')
  await expect(page.getByText('Agente de SEO').first()).toBeVisible()
  await expect(page.getByText('Agente de Produção de Conteúdo')).toHaveCount(0)
})

test('QA-006 - Filtro por departamento', async ({ page }) => {
  await page.goto('/agentes')
  await page.getByRole('tab', { name: 'Comercial', exact: true }).click()
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

test('QA-015 - Rota interna redireciona quando a sessão expira', async ({ page }) => {
  await page.route('**/auth/me', (route) => route.fulfill({ status: 401, body: 'Unauthorized' }))
  await page.goto('/agentes')
  await expect(page).toHaveURL(/\/login$/)
})
