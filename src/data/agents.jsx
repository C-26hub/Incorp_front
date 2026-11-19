export const agents = [
  { id: 'copywriter', initials: 'CO', name: 'Agente de Produção de Conteúdo', dept: 'Marketing', category: 'Criação de Conteúdo', status: 'Online', available: true, desc: 'Geração de rascunhos para campanhas, posts e e-mails de marketing.' },
  { id: 'lead', initials: 'LE', name: 'Agente de Prospecção e Qualificação de Leads', dept: 'Comercial', category: 'Vendas', status: 'Online', available: true, desc: 'Organize leads e avalie a aderência ao perfil ideal de cliente.' },
  { id: 'seo', initials: 'SE', name: 'Agente de SEO', dept: 'Marketing', category: 'Análise & Dados', status: 'Online', available: true, desc: 'Auditoria on-page de páginas publicadas e recomendações práticas de otimização.' },
  { id: 'social', initials: 'SO', name: 'Agente de Mídias Sociais', dept: 'Marketing', category: 'Criação de Conteúdo', status: 'Online', available: true, desc: 'Valide regras de publicação, calendário aprovado e pendências antes de simular o agendamento.' },
  { id: 'reports', initials: 'RE', name: 'Agente de Relatórios e KPIs', dept: 'Marketing', category: 'Análise & Dados', status: 'Online', available: true, desc: 'Consolide indicadores informados, compare com metas e identifique lacunas ou divergências.' },
  { id: 'traffic', initials: 'TR', name: 'Agente de Tráfego', dept: 'Marketing', category: 'Análise & Dados', status: 'Online', available: true, desc: 'Estruture um rascunho de campanha paga e calcule métricas a partir de dados informados.' },
  { id: 'tenders', initials: 'ED', name: 'Agente de Editais e Licitações', dept: 'Comercial', category: 'Vendas', status: 'Em breve', available: false, desc: 'Apoio à análise de editais e processos de licitação.' },
  { id: 'commercial', initials: 'AC', name: 'Agente de Apoio Comercial', dept: 'Comercial', category: 'Vendas', status: 'Em breve', available: false, desc: 'Apoio em negociação e fechamento comercial.' },
]

export const isMkt = (dept) => dept === 'Marketing'