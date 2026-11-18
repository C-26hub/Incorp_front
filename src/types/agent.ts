export type Departamento = "Marketing" | "Comercial";

export type StatusAgente = "Online" | "Beta";

// Espelha os objetos de src/data/agents.jsx
export interface Agent {
  id: string;
  initials: string;
  name: string;
  desc: string;
  dept: Departamento;
  category: string;
  status: StatusAgente;
  uses: number;
}
