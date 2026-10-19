export const agents = [
  { id: 'copywriter', initials: 'CO', name: 'CopyWriter Pro', dept: 'Marketing', category: 'Criação de Conteúdo', status: 'Online', uses: 842, fav: true, desc: 'Geração de textos para campanhas, posts e e-mails de marketing.' },
  { id: 'social', initials: 'SO', name: 'Social Planner', dept: 'Marketing', category: 'Criação de Conteúdo', status: 'Beta', uses: 388, fav: true, desc: 'Planejamento e criação de calendário editorial para redes sociais.' },
  { id: 'brand', initials: 'BR', name: 'Brand Voice', dept: 'Marketing', category: 'Criação de Conteúdo', status: 'Online', uses: 295, fav: false, desc: 'Revisão e adequação de conteúdos ao tom de voz da marca Incorp.' },
  { id: 'seo', initials: 'SE', name: 'SEO Analyst', dept: 'Marketing', category: 'Análise & Dados', status: 'Online', uses: 617, fav: false, desc: 'Análise de palavras-chave, sugestões de otimização e relatórios de posicionamento.' },
  { id: 'campaign', initials: 'CA', name: 'Campaign Insights', dept: 'Marketing', category: 'Análise & Dados', status: 'Online', uses: 451, fav: false, desc: 'Análise de performance de campanhas e geração de insights acionáveis.' },
  { id: 'proposal', initials: 'PR', name: 'Proposal Builder', dept: 'Comercial', category: 'Vendas', status: 'Online', uses: 973, fav: true, desc: 'Criação automática de propostas comerciais personalizadas por cliente.' },
  { id: 'lead', initials: 'LE', name: 'Lead Qualifier', dept: 'Comercial', category: 'Vendas', status: 'Online', uses: 756, fav: true, desc: 'Qualificação automática de leads com base em critérios de ICP.' },
  { id: 'pricing', initials: 'PR', name: 'Pricing Assistant', dept: 'Comercial', category: 'Vendas', status: 'Online', uses: 534, fav: false, desc: 'Sugestão de preços e descontos com base no perfil do cliente.' },
  { id: 'followup', initials: 'FO', name: 'Follow-up Engine', dept: 'Comercial', category: 'Relacionamento', status: 'Online', uses: 402, fav: false, desc: 'Sequências de follow-up para oportunidades em aberto.' },
  { id: 'forecast', initials: 'SF', name: 'Sales Forecast', dept: 'Comercial', category: 'Relacionamento', status: 'Online', uses: 318, fav: false, desc: 'Previsão de receita e análise do pipeline comercial.' },
]

export const history = [
  { agent: 'Proposal Builder', initials: 'PR', dept: 'Comercial', query: 'Proposta para Grupo Renova — P...', date: '15/09/26 14:30', duration: '1m 12s', status: 'Exportado' },
  { agent: 'CopyWriter Pro', initials: 'CO', dept: 'Marketing', query: 'E-mail marketing campanha Sete...', date: '15/09/26 11:05', duration: '0m 48s', status: 'Salvo' },
  { agent: 'Lead Qualifier', initials: 'LE', dept: 'Comercial', query: 'Qualificação lote 24 leads — Link...', date: '14/09/26 16:22', duration: '2m 03s', status: 'Concluído' },
  { agent: 'SEO Analyst', initials: 'SE', dept: 'Marketing', query: 'Auditoria palavras-chave — blog ...', date: '14/09/26 09:47', duration: '1m 35s', status: 'Salvo' },
  { agent: 'Social Planner', initials: 'SO', dept: 'Marketing', query: 'Calendário editorial Outubro — Li...', date: '13/09/26 15:10', duration: '0m 57s', status: 'Concluído' },
  { agent: 'Follow-up Engine', initials: 'FO', dept: 'Comercial', query: 'Sequência follow-up — oportunid...', date: '12/09/26 10:38', duration: '1m 22s', status: 'Exportado' },
  { agent: 'Campaign Insights', initials: 'CA', dept: 'Marketing', query: 'Análise campanha Google Ads — ...', date: '11/09/26 13:55', duration: '2m 41s', status: 'Salvo' },
]

export const weekly = [
  { day: 'Seg', Marketing: 47, Comercial: 62 },
  { day: 'Ter', Marketing: 70, Comercial: 85 },
  { day: 'Qua', Marketing: 90, Comercial: 73 },
  { day: 'Qui', Marketing: 65, Comercial: 98 },
  { day: 'Sex', Marketing: 82, Comercial: 113 },
  { day: 'Sáb', Marketing: 35, Comercial: 40 },
  { day: 'Dom', Marketing: 27, Comercial: 37 },
]

export const activity = [
  { initials: 'AS', who: 'Ana Souza', action: 'gerou proposta via', agent: 'Proposal Builder', time: '2 min atrás' },
  { initials: 'RL', who: 'Rafael Lima', action: 'iniciou análise com', agent: 'SEO Analyst', time: '7 min atrás' },
  { initials: 'CT', who: 'Camila Torres', action: 'exportou resultado do', agent: 'CopyWriter Pro', time: '15 min atrás' },
  { initials: 'BM', who: 'Bruno Melo', action: 'qualificou leads com', agent: 'Lead Qualifier', time: '28 min atrás' },
]

export const isMkt = (dept) => dept === 'Marketing'