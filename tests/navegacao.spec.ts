
import { test, expect, type Page } from '@playwright/test'

// As rotas internas exigem a flag de login simulado (ver ProtectedRoute).
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('incorp:auth', 'true'))
})

// Sem perfil salvo, o departamento padrão é Marketing. Para testar outro, defina antes de abrir a página.
async function comoDepartamento(page: Page, dept: 'Marketing' | 'Comercial') {
  await page.addInitScript((d) => localStorage.setItem('incorp:profile', JSON.stringify({ dept: d })), dept)
}

test('QA-001 - Página de login', async ({ page }) => {
  await page.addInitScript(() => localStorage.removeItem('incorp:auth'))
  await page.goto('/login')

  await expect(page).toHaveURL(/\/login$/)
  await expect(page.locator('input[type="password"]')).toBeVisible()
})

test('QA-002 - Página de cadastro', async ({ page }) => {
  await page.addInitScript(() => localStorage.removeItem('incorp:auth'))
  await page.goto('/cadastro')

  await expect(page).toHaveURL(/\/cadastro$/)
  await expect(page.locator('input').first()).toBeVisible()
})

test('QA-004 - Catálogo de agentes', async ({ page }) => {
  await page.goto('/agentes')

  // departamento padrão (Marketing): vê os agentes de Marketing e nenhum de Comercial
  await expect(page.getByText('CopyWriter Pro').first()).toBeVisible()
  await expect(page.getByText('Lead Qualifier')).toHaveCount(0)
})

test('QA-005 - Pesquisa de agentes', async ({ page }) => {
  await page.goto('/agentes')

  await page.getByPlaceholder('Buscar agente...').fill('SEO')

  await expect(page.getByText('SEO Analyst').first()).toBeVisible()
  await expect(page.getByText('CopyWriter Pro')).toHaveCount(0)
})

test('QA-006 - Agentes do departamento', async ({ page }) => {
  await comoDepartamento(page, 'Comercial')
  await page.goto('/agentes')

  await expect(page.getByText('Proposal Builder').first()).toBeVisible()
  await expect(page.getByText('CopyWriter Pro')).toHaveCount(0)
})

test('QA-007 - Abrir Workspace', async ({ page }) => {
  await page.goto('/agentes')

  await page.getByText('CopyWriter Pro').first().click()

  await expect(page).toHaveURL(/\/agentes\/copywriter$/)
  await expect(page.getByPlaceholder('Mensagem para CopyWriter Pro...')).toBeVisible()
})

test('QA-008 - Enviar mensagem demonstrativa', async ({ page }) => {
  await page.goto('/agentes/copywriter')

  await page.getByPlaceholder('Mensagem para CopyWriter Pro...')
    .fill('Crie uma campanha de marketing')

  await page.getByRole('button', { name: 'Enviar' }).click()

  await expect(
    page.getByText('Crie uma campanha de marketing')
  ).toBeVisible()

  await expect(
    page.getByText(/Resposta de demonstração do CopyWriter Pro/)
  ).toBeVisible()
})

test('QA-009 - Nova conversa', async ({ page }) => {
  await page.goto('/agentes/copywriter')

  await page.getByPlaceholder('Mensagem para CopyWriter Pro...')
    .fill('Mensagem de teste')

  await page.getByRole('button', { name: 'Enviar' }).click()

  await page.getByRole('button', { name: 'Nova conversa' }).click()

  await expect(page.getByText('Mensagem de teste')).toHaveCount(0)
})

test('QA-010 - Voltar aos agentes', async ({ page }) => {
  await page.goto('/agentes/copywriter')

  await page.getByRole('link', { name: 'Voltar para agentes' }).click()

  await expect(page).toHaveURL(/\/agentes$/)
})

test('QA-015 - Rota inexistente', async ({ page }) => {
  await page.addInitScript(() => localStorage.removeItem('incorp:auth'))
  await page.goto('/pagina-inexistente')

  await expect(page).toHaveURL(/\/login$/)
})

test('QA-016 - Login com departamento', async ({ page }) => {
  await page.goto('/login')

  await page.getByPlaceholder('nome@incorp.com.br').fill('teste@incorp.com.br')
  await page.getByPlaceholder('Digite sua senha').fill('123456')
  await page.getByLabel('Departamento').selectOption('Comercial')
  await page.getByRole('button', { name: 'Entrar' }).click()

  await expect(page).toHaveURL(/\/home$/)

  await page.goto('/agentes')
  await expect(page.getByText('Proposal Builder').first()).toBeVisible()
  await expect(page.getByText('CopyWriter Pro')).toHaveCount(0)
})

test('QA-017 - Login exige departamento', async ({ page }) => {
  await page.goto('/login')

  await page.getByPlaceholder('nome@incorp.com.br').fill('teste@incorp.com.br')
  await page.getByPlaceholder('Digite sua senha').fill('123456')
  await page.getByRole('button', { name: 'Entrar' }).click()

  await expect(page.getByText('Selecione seu departamento.')).toBeVisible()
  await expect(page).toHaveURL(/\/login$/)
})

test('QA-018 - Agente de outro departamento não abre pela URL', async ({ page }) => {
  // usuário de Marketing tentando abrir um agente de Comercial
  await page.goto('/agentes/proposal')

  await expect(page).toHaveURL(/\/agentes$/)
  await expect(page.getByText('Proposal Builder')).toHaveCount(0)
})

test('QA-019 - Histórico do departamento', async ({ page }) => {
  await comoDepartamento(page, 'Comercial')
  await page.goto('/historico')

  await expect(page.getByText('Proposal Builder').first()).toBeVisible()
  await expect(page.getByText('CopyWriter Pro')).toHaveCount(0)
})

test('QA-020 - Dashboard foi removido', async ({ page }) => {
  await page.goto('/dashboard')

  await expect(page).toHaveURL(/\/login$/)
})
