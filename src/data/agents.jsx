export const agents = [
  { id: 'copywriter', initials: 'CO', name: 'Agente de Produção de Conteúdo', dept: 'Marketing', category: 'Criação de Conteúdo', status: 'Online', available: true, desc: 'Geração de rascunhos para campanhas, posts e e-mails de marketing.' },
  { id: 'lead', initials: 'LE', name: 'Agente de Prospecção e Qualificação de Leads', dept: 'Comercial', category: 'Vendas', status: 'Em breve', available: false, desc: 'Qualificação de leads com base em critérios de perfil de cliente ideal.' },
  { id: 'seo', initials: 'SE', name: 'Agente de SEO', dept: 'Marketing', category: 'Análise & Dados', status: 'Em breve', available: false, desc: 'Análise de palavras-chave, sugestões de otimização e relatórios de posicionamento.' },
  { id: 'social', initials: 'SO', name: 'Agente de Mídias Sociais', dept: 'Marketing', category: 'Criação de Conteúdo', status: 'Em breve', available: false, desc: 'Planejamento e criação de calendário editorial para redes sociais.' },
  { id: 'reports', initials: 'RE', name: 'Agente de Relatórios e KPIs', dept: 'Marketing', category: 'Análise & Dados', status: 'Em breve', available: false, desc: 'Análise de performance de campanhas e geração de insights acionáveis.' },
  { id: 'traffic', initials: 'TR', name: 'Agente de Tráfego', dept: 'Marketing', category: 'Análise & Dados', status: 'Em breve', available: false, desc: 'Apoio à análise de tráfego e campanhas digitais.' },
  { id: 'tenders', initials: 'ED', name: 'Agente de Editais e Licitações', dept: 'Comercial', category: 'Vendas', status: 'Em breve', available: false, desc: 'Apoio à análise de editais e processos de licitação.' },
  { id: 'commercial', initials: 'AC', name: 'Agente de Apoio Comercial', dept: 'Comercial', category: 'Vendas', status: 'Em breve', available: false, desc: 'Apoio em negociação e fechamento comercial.' },
]

export const isMkt = (dept) => dept === 'Marketing'