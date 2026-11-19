export type UserRole = 'ADMINISTRATOR' | 'DEFAULT'
export type UserDepartment = 'MARKETING' | 'COMMERCIAL'
export type LoginAccessProfile = UserDepartment | 'ADMINISTRATOR'

export type AuthUser = {
  id: string
  name: string
  surname: string
  email: string
  role: UserRole
  department: UserDepartment
}

export type ManagedUser = Pick<AuthUser, 'id' | 'name' | 'surname' | 'email' | 'role'> & {
  department: UserDepartment | null
}

export type ContentProductionRequest = {
  objective: string
  targetAudience: string
  channel: string
  format: string
  keyInformation: string
  tone?: string
  callToAction?: string
  additionalInstructions?: string
  language?: string
  conversationId?: string
}

export type ContentProductionResponse = {
  conversationId: string
  draft: string
  humanReviewRequired: boolean
}

export type ContentConversation = {
  id: string
  title: string
  createdAt: string
  updatedAt: string
}

export type ContentConversationMessage = {
  id: string
  role: 'USER' | 'ASSISTANT'
  content: string
  createdAt: string
}

export type LeadInput = {
  name: string
  company?: string
  jobTitle?: string
  email?: string
  phone?: string
  website?: string
  industry?: string
  companySize?: string
  location?: string
  notes?: string
}

export type Lead = LeadInput & {
  id: string
  score: number | null
  fit: 'QUALIFIED' | 'REVIEW' | 'NOT_QUALIFIED' | null
  reasoning: string | null
  nextStep: string | null
  qualifiedAt: string | null
  createdAt: string
  updatedAt: string
}

export type SeoAnalysisRequest = {
  url: string
  targetKeyword?: string
  supplementalText?: string
}

export type SeoAnalysisResult = {
  url: string
  title: string
  metaDescription: string
  canonicalUrl: string
  h1Count: number
  headingCount: number
  imagesWithoutAlt: number
  internalLinks: number
  externalLinks: number
  score: number
  summary: string
  titleAdvice: string
  descriptionAdvice: string
  contentAdvice: string
  technicalAdvice: string
  keywordAdvice: string
  actions: string[]
}

export type SocialPublicationRequest = {
  platform: 'FACEBOOK' | 'INSTAGRAM' | 'LINKEDIN'
  format: 'POST' | 'STORY' | 'REEL'
  contentReference: string
  caption: string
  asset?: {
    mimeType: string
    width: number
    height: number
    sizeBytes: number
  }
  technicalRules: {
    reference: string
    maxCaptionCharacters: number
    assetRequired: boolean
    allowedMimeTypes: string[]
    requiredWidth: number | null
    requiredHeight: number | null
    maxAssetBytes: number | null
  }
  contentBrandVersion: string
  currentBrandVersion: string
  plannedAt: string
  approvedSlots: string[]
  occupiedSlots: string[]
  minimumSpacingMinutes: number
  interactions: {
    type: 'COMMENT' | 'DIRECT_MESSAGE'
    reference: string
    url?: string
    pendingReply: boolean
  }[]
  confirmed: boolean
}

export type SocialPublicationResponse = {
  status: 'REVIEW_REQUIRED' | 'READY_FOR_CONFIRMATION' | 'SIMULATED'
  platform: SocialPublicationRequest['platform']
  format: SocialPublicationRequest['format']
  plannedAt: string
  issues: string[]
  technicalRulesReference: string
  simulation: { reference: string; contentReference: string; brandVersion: string } | null
  pendingInteractions: { type: 'COMMENT' | 'DIRECT_MESSAGE'; reference: string; url: string | null }[]
}

export type ReportRequest = {
  product: string
  startDate: string
  endDate: string
  metrics: {
    channel: 'ORGANIC' | 'PAID' | 'LEADS' | 'BIDS' | 'SEO'
    name: string
    unit: string
    goal: { value: number; direction: 'AT_LEAST' | 'AT_MOST' } | null
    observations: { source: 'META' | 'GOOGLE' | 'LINKEDIN' | 'TRAFFIC_AGENT' | 'LEADS_AGENT' | 'BIDS_AGENT' | 'SEO_AGENT'; reference: string; value: number }[]
    contextReferences: string[]
  }[]
  includeNarrative: boolean
}

export type ReportResponse = {
  product: string
  startDate: string
  endDate: string
  metrics: {
    channel: ReportRequest['metrics'][number]['channel']
    name: string
    unit: string
    value: number | null
    goal: ReportRequest['metrics'][number]['goal']
    status: 'MISSING' | 'CONFLICT' | 'NO_GOAL' | 'GOAL_MET' | 'GOAL_NOT_MET'
    observations: ReportRequest['metrics'][number]['observations']
    contextReferences: string[]
  }[]
  narrative: string | null
}

export type TrafficCampaignRequest = {
  campaignReference: string
  product: string
  platform: 'META_ADS' | 'GOOGLE_ADS' | 'LINKEDIN_ADS'
  objective: string
  audience: string
  startDate: string
  endDate: string
  budget: { currency: string; planned: number; ceiling: number }
  goals: { maxCpa: number | null; minRoas: number | null }
  creatives: { reference: string; validationReference: string; compatible: boolean }[]
  observation: {
    reference: string
    startDate: string
    endDate: string
    impressions: number | null
    reach: number | null
    clicks: number | null
    conversions: number | null
    spend: number | null
    attributedRevenue: number | null
  } | null
}

export type TrafficCampaignResponse = {
  campaignReference: string
  product: string
  platform: TrafficCampaignRequest['platform']
  startDate: string
  endDate: string
  status: 'SIMULATED_DRAFT' | 'REVIEW_REQUIRED'
  budget: TrafficCampaignRequest['budget']
  goals: TrafficCampaignRequest['goals']
  issues: string[]
  strategy: string | null
  performance: {
    source: string
    reference: string
    startDate: string
    endDate: string
    metrics: {
      name: string
      unit: string
      value: number | null
      goal: { value: number; direction: 'AT_MOST' | 'AT_LEAST' } | null
      status: 'MISSING' | 'NO_GOAL' | 'GOAL_MET' | 'GOAL_NOT_MET'
    }[]
    alerts: string[]
  } | null
}

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')
let csrf: { headerName: string; token: string } | null = null
let csrfRequest: Promise<{ headerName: string; token: string }> | null = null
let refreshRequest: Promise<boolean> | null = null
const RETRY_REQUEST = { csrf: true, auth: true }

function normalizeLead(input: LeadInput): LeadInput {
  return Object.fromEntries(
    Object.entries(input).map(([field, value]) => [field, value?.trim() || undefined]),
  ) as LeadInput
}

function apiUrl(path: string) {
  return `${apiBaseUrl}${path}`
}

async function readCsrf(forceRefresh = false) {
  if (forceRefresh) csrf = null
  if (csrf) return csrf
  if (!csrfRequest) {
    csrfRequest = fetch(apiUrl('/csrf'), { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) throw new ApiError('Não foi possível iniciar a sessão segura.', response.status)
        const token = (await response.json()) as { headerName: string; token: string }
        csrf = token
        return token
      })
      .finally(() => {
        csrfRequest = null
      })
  }
  return csrfRequest
}

async function responseError(response: Response) {
  let message = `A solicitação falhou (${response.status}).`
  try {
    const body = (await response.json()) as { detail?: string; message?: string; title?: string }
    message = body.detail ?? body.message ?? body.title ?? message
  } catch {
    // O backend pode responder sem corpo ou com conteúdo que não seja JSON.
  }
  return new ApiError(message, response.status)
}

function canRefresh(path: string) {
  return !['/auth/login', '/auth/refresh', '/auth/logout', '/users/register'].includes(path)
}

async function refreshSession() {
  if (!refreshRequest) {
    refreshRequest = request('/auth/refresh', { method: 'POST' }, { csrf: true, auth: false })
      .then(() => true)
      .catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 401) {
          window.dispatchEvent(new Event('cmiap:session-expired'))
        }
        return false
      })
      .finally(() => {
        refreshRequest = null
      })
  }
  return refreshRequest
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  retryPolicy = RETRY_REQUEST,
): Promise<T> {
  const method = (init.method ?? 'GET').toUpperCase()
  const headers = new Headers(init.headers)
  if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json')

  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const token = await readCsrf()
    headers.set(token.headerName, token.token)
  }

  let response: Response
  try {
    response = await fetch(apiUrl(path), { ...init, method, headers, credentials: 'include' })
  } catch {
    throw new Error('Não foi possível conectar à API. Verifique se o backend está em execução.')
  }

  if (response.status === 403 && retryPolicy.csrf && !['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    await readCsrf(true)
    return request<T>(path, init, { ...retryPolicy, csrf: false })
  }

  if (response.status === 401 && retryPolicy.auth && canRefresh(path) && await refreshSession()) {
    return request<T>(path, init, { ...retryPolicy, auth: false })
  }

  if (!response.ok) throw await responseError(response)
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const api = {
  currentUser: () => request<AuthUser>('/auth/me'),

  login: (email: string, password: string, profile: LoginAccessProfile) =>
    request<void>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, department: profile }),
    }),

  register: (input: {
    name: string
    surname: string
    cpf: number
    email: string
    password: string
  }) =>
    request<void>('/users/register', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  listUsers: () => request<ManagedUser[]>('/users'),

  assignUserDepartment: (id: string, department: UserDepartment) =>
    request<ManagedUser>(`/users/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify({ department }),
    }),

  logout: () => request<void>('/auth/logout', { method: 'POST' }),

  produceContent: (input: ContentProductionRequest) =>
    request<ContentProductionResponse>('/agents/content/produce', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  listConversations: () => request<ContentConversation[]>('/agents/content/conversations'),

  conversationMessages: (conversationId: string) =>
    request<ContentConversationMessage[]>(
      `/agents/content/conversations/${encodeURIComponent(conversationId)}/messages`,
    ),

  listLeads: () => request<Lead[]>('/agents/leads'),

  createLead: (input: LeadInput) =>
    request<Lead>('/agents/leads', {
      method: 'POST',
      body: JSON.stringify(normalizeLead(input)),
    }),

  importLeads: (leads: LeadInput[]) =>
    request<Lead[]>('/agents/leads/import', {
      method: 'POST',
      body: JSON.stringify({ leads: leads.map(normalizeLead) }),
    }),

  qualifyLead: (leadId: string, idealCustomerProfile: string) =>
    request<Pick<Lead, 'id' | 'score' | 'fit' | 'reasoning' | 'nextStep' | 'qualifiedAt'>>(
      `/agents/leads/${encodeURIComponent(leadId)}/qualify`,
      {
        method: 'POST',
        body: JSON.stringify({ idealCustomerProfile }),
      },
    ),

  analyzeSeo: (input: SeoAnalysisRequest) =>
    request<SeoAnalysisResult>('/agents/seo/analyze', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  planSocialPublication: (input: SocialPublicationRequest) =>
    request<SocialPublicationResponse>('/agents/social/publication-plan', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  reportKpis: (input: ReportRequest) =>
    request<ReportResponse>('/agents/reports/kpis', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  planTrafficCampaign: (input: TrafficCampaignRequest) =>
    request<TrafficCampaignResponse>('/agents/traffic/campaign-plan', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
}
