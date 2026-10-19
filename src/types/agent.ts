
export type Departamento = "Marketing" | "Comercial";

export type StatusAgente = "online" | "offline" | "beta";

export interface Agent {
  id: string;
  name: string;
  description: string;
  dept: Departamento;
  category: string;
  status: StatusAgente;
  uses: number;
  isFavorite: boolean;
}
