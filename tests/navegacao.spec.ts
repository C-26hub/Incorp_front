
import { test, expect } from '@playwright/test'

test('QA-001 - Página de login', async ({ page }) => {
  await page.goto('/login')

  await expect(page).toHaveURL(/\/login$/)
  await expect(page.locator('input[type="password"]')).toBeVisible()
})

test('QA-002 - Página de cadastro', async ({ page }) => {
  await page.goto('/cadastro')

  await expect(page).toHaveURL(/\/cadastro$/)
  await expect(page.locator('input').first()).toBeVisible()
})

test('QA-004 - Catálogo de agentes', async ({ page }) => {
  await page.goto('/agentes')

  await expect(page.getByText('CopyWriter Pro').first()).toBeVisible()
  await expect(page.getByText('Lead Qualifier').first()).toBeVisible()
})

test('QA-005 - Pesquisa de agentes', async ({ page }) => {
  await page.goto('/agentes')

  await page.getByPlaceholder('Buscar agente...').fill('SEO')

  await expect(page.getByText('SEO Analyst').first()).toBeVisible()
  await expect(page.getByText('CopyWriter Pro')).toHaveCount(0)
})

test('QA-006 - Filtro por departamento', async ({ page }) => {
  await page.goto('/agentes')

  await page.getByRole('button', {
    name: 'Comercial',
    exact: true,
  }).click()

  await expect(page.getByText('Proposal Builder').first()).toBeVisible()
  await expect(page.getByText('CopyWriter Pro')).toHaveCount(0)
})

test('QA-007 - Abrir Workspace', async ({ page }) => {
  await page.goto('/agentes')

  await page.getByText('CopyWriter Pro').first().click()

  await expect(page).toHaveURL(/\/agentes\/copywriter$/)
  await expect(
  page.getByRole('heading', { name: 'Conversa', exact: true })
).toBeVisible()
})

test('QA-008 - Enviar mensagem demonstrativa', async ({ page }) => {
  await page.goto('/agentes/copywriter')

  await page.getByPlaceholder('Digite sua mensagem...')
    .fill('Crie uma campanha de marketing')

  await page.getByRole('button', { name: 'Enviar' }).click()

  await expect(
    page.getByText('Crie uma campanha de marketing')
  ).toBeVisible()

  await expect(
    page.getByText(/Esta é uma demonstração do agente/)
  ).toBeVisible()
})

test('QA-009 - Nova conversa', async ({ page }) => {
  await page.goto('/agentes/copywriter')

  await page.getByPlaceholder('Digite sua mensagem...')
    .fill('Mensagem de teste')

  await page.getByRole('button', { name: 'Enviar' }).click()

  await page.getByRole('button', { name: 'Nova conversa' }).click()

  await expect(page.getByText('Mensagem de teste')).toHaveCount(0)
})

test('QA-010 - Voltar aos agentes', async ({ page }) => {
  await page.goto('/agentes/copywriter')

  await page.getByRole('button', {
    name: 'Voltar aos agentes',
  }).click()

  await expect(page).toHaveURL(/\/agentes$/)
})

test('QA-015 - Rota inexistente', async ({ page }) => {
  await page.goto('/pagina-inexistente')

  await expect(page).toHaveURL(/\/login$/)
})
