

# INCorp Front-End

Interface web do projeto **INCorp**, desenvolvida de forma colaborativa pela equipe de Front-End.

O projeto tem como objetivo disponibilizar uma interface corporativa para acesso e utilização de **agentes de Inteligência Artificial**, mantendo uma experiência visual padronizada, responsiva e de fácil utilização.

> Este repositório contém exclusivamente o **Front-End** da aplicação.  
> O Back-End será desenvolvido e integrado separadamente.

---

## Status do projeto

🚧 **Em desenvolvimento**

### Implementado até o momento

- [x] Estrutura inicial do Front-End
- [x] Tela de Login
- [x] Tela de solicitação de cadastro
- [x] Alternância entre Login e Cadastro
- [x] Layout responsivo
- [x] Identidade visual inicial
- [x] Campos com labels animadas
- [x] Efeitos de hover
- [x] Sublinhado animado nos campos
- [x] Máscara para WhatsApp corporativo
- [x] Exibição/ocultação de senha
- [x] Validação dos campos obrigatórios
- [x] Validação básica de e-mail
- [x] Validação de senha
- [x] Confirmação de senha
- [x] Confirmação dos dados corporativos
- [ ] Integração com API
- [ ] Autenticação real
- [ ] Recuperação de senha
- [ ] Integração com Back-End
- [ ] Controle de sessão
- [ ] Demais telas do sistema

---

# Tela de Login

Ao acessar o sistema, o usuário visualiza inicialmente apenas a tela de **Login**.

### Campos

- E-mail corporativo
- Senha

### Recursos

- Mostrar/ocultar senha
- Lembrar acesso
- Link para recuperação de senha
- Botão **Entrar**
- Link **Criar minha conta**

O formulário de cadastro não é exibido inicialmente.

O usuário precisa clicar em:

**Primeiro acesso? → Criar minha conta**

para visualizar a solicitação de cadastro.

---

# Solicitação de Cadastro

A tela de cadastro é destinada aos colaboradores que ainda não possuem acesso à plataforma.

### Dados solicitados

Todos os campos são obrigatórios:

- Nome completo
- Matrícula
- E-mail corporativo
- WhatsApp corporativo
- Cargo
- Setor
- Senha
- Confirmação de senha
- Confirmação dos dados corporativos

O Front-End bloqueia o envio caso algum dos campos obrigatórios não tenha sido preenchido.

---

## Regras atuais da senha

A senha deve possuir:

- mínimo de 8 caracteres;
- pelo menos uma letra maiúscula;
- pelo menos um número.

O sistema também verifica se:

**Senha = Confirmar senha**

---

## Fluxo planejado para cadastro

O cadastro deverá funcionar futuramente como uma **solicitação de acesso**, e não como ativação automática da conta.

```text
Colaborador
     │
     ▼
Solicita acesso
     │
     ▼
   Pendente
     │
     ▼
Administrador
   │      │
   ▼      ▼
Aprovar  Recusar
   │
   ▼
 Ativo
   │
   ▼
Login liberado
```

A implementação desse fluxo dependerá da integração com o Back-End.

---

# Identidade Visual

A identidade visual inicial utiliza uma proposta corporativa baseada em tons de azul escuro, verde e cinza claro.

## Paleta de cores

| Cor | Hex | Utilização |
|---|---|---|
| Azul profundo | `#000F1F` | Fundo principal |
| Azul marinho | `#071E3D` | Áreas institucionais |
| Azul intermediário | `#293C66` | Elementos secundários |
| Verde | `#2BB560` | CTA, destaques e estados ativos |
| Cinza claro | `#D4D3CF` | Textos e elementos claros |

### Variáveis CSS

```css
:root {
    --dark: #000F1F;
    --navy: #071E3D;
    --blue: #293C66;
    --green: #2BB560;
    --light: #D4D3CF;
}
```

> A paleta deve ser preservada pelas demais telas para manter a consistência visual do projeto.

---

# Padrão de Interface

As telas devem seguir, sempre que possível, os seguintes princípios:

- design corporativo e minimalista;
- responsividade para desktop, tablet e mobile;
- utilização da paleta oficial;
- verde para ações principais;
- azul escuro para áreas institucionais;
- campos com sublinhado;
- animações discretas;
- feedback visual de foco;
- efeitos de hover nos botões;
- consistência de espaçamento;
- mensagens claras de erro e sucesso.

---

# Identidade atual da plataforma

A tela inicial utiliza a comunicação:

### A GENTE

**Plataforma Corporativa de Agentes de IA**

> OTIMIZE.  
> SUA ROTINA.

O painel institucional também destaca três pilares iniciais:

### Gestão
Informações centralizadas.

### Segurança
Acesso corporativo.

### Organização
Processos mais eficientes.

---

# Tecnologias

Nesta etapa inicial estão sendo utilizadas:

- HTML5
- CSS3
- JavaScript
- Git
- GitHub

Não existe dependência de framework JavaScript nesta versão.

---

# Estrutura inicial

```text
Incorp_front/
│
├── index.html
│
├── README.md
│
│
├── css/
│   └── style.css
│
└── js/
    └── script.js
```

Conforme novas telas forem desenvolvidas, a estrutura poderá evoluir para algo semelhante a:

```text
Incorp_front/
│
├── index.html
├── README.md
│
├── css/
│   ├── global.css
│   ├── login.css
│   ├── dashboard.css
│   └── ...
│
├── js/
│   ├── login.js
│   ├── dashboard.js
│   └── ...
│
└── pages/
    ├── dashboard.html
    ├── perfil.html
    ├── usuarios.html
    └── ...
```

A equipe deverá avaliar essa reorganização conforme o crescimento do projeto.

---

# Desenvolvimento em equipe

Como diferentes integrantes desenvolverão diferentes telas, recomenda-se evitar desenvolvimento direto na branch `main`.

## Fluxo sugerido

```text
feature/tela
     │
     ▼
  develop
     │
     ▼
   testes
     │
     ▼
    main
     │
     ▼
  produção
```

Exemplos de branches:

```text
feature/login-cadastro
feature/dashboard
feature/perfil
feature/usuarios
feature/agentes
feature/configuracoes
```

---

# Criando uma branch

Antes de iniciar uma nova funcionalidade:

```bash
git checkout main
git pull origin main
git checkout -b feature/nome-da-funcionalidade
```

Exemplo:

```bash
git checkout -b feature/login-cadastro
```

Após desenvolver:

```bash
git add .
git commit -m "feat: implementa login e cadastro"
git push -u origin feature/login-cadastro
```

Depois deverá ser aberto um **Pull Request** para revisão e integração.

---

# Padrão de commits

Sugestão de padronização:

```text
feat: nova funcionalidade
fix: correção de problema
style: alteração visual
refactor: reorganização de código
docs: documentação
chore: configuração/manutenção
```

Exemplos:

```bash
git commit -m "feat: adiciona tela de dashboard"
```

```bash
git commit -m "fix: corrige validação do cadastro"
```

```bash
git commit -m "style: ajusta responsividade do login"
```

```bash
git commit -m "docs: atualiza README"
```

---

# Integração com Back-End

O Back-End será desenvolvido por outra equipe.

Por isso, o Front-End deve evitar dependência direta da implementação interna do servidor.

A integração deverá ocorrer por meio de uma **API**.

Exemplo conceitual:

```text
FRONT-END
HTML / CSS / JavaScript
       │
       │ HTTPS / JSON
       ▼
      API
       │
       ▼
BACK-END
       │
       ▼
Banco de Dados
```

---

## Contrato de API

Antes da integração definitiva, as equipes de Front-End e Back-End deverão definir:

- endpoints;
- métodos HTTP;
- estrutura dos JSONs;
- autenticação;
- códigos de resposta;
- tratamento de erros;
- regras de cadastro;
- regras de login;
- perfis e permissões.

Exemplo conceitual:

```text
POST /api/auth/login/
POST /api/auth/cadastro/
POST /api/auth/logout/
GET  /api/usuarios/me/
```

Os endpoints acima são apenas uma proposta inicial e deverão ser confirmados com a equipe responsável pelo Back-End.

---

# Segurança

A versão atual contém somente validações no navegador.

Essas validações **não substituem as validações do servidor**.

Quando houver integração com o Back-End, deverão ser implementados mecanismos como:

- validação dos dados no servidor;
- armazenamento seguro das senhas;
- hash de senha;
- autenticação;
- autorização;
- controle de sessão/token;
- proteção das rotas;
- tratamento seguro de erros;
- controle de usuários ativos e inativos.

Senhas não devem ser armazenadas no `localStorage` ou expostas pelo Front-End.

---

# Deploy

O projeto poderá ser publicado inicialmente como um site estático para testes e homologação.

A branch `main` deverá representar uma versão estável do Front-End.

Fluxo sugerido:

```text
Desenvolvimento
      ↓
Feature Branch
      ↓
Pull Request
      ↓
Develop
      ↓
Testes
      ↓
Main
      ↓
Deploy
```

---

# Repositório

Projeto mantido no GitHub pela equipe:

`C-26hub/Incorp_front`

---

## Próximas etapas

- finalizar fluxo visual de cadastro;
- testar validações;
- definir estrutura das demais telas;
- padronizar componentes compartilhados;
- definir contrato da API com a equipe de Back-End;
- configurar ambiente de homologação;
- integrar autenticação quando a API estiver disponível.

---

## Projeto acadêmico / colaborativo

Este projeto está sendo desenvolvido de forma colaborativa.

Cada integrante da equipe de Front-End poderá ser responsável por diferentes telas ou funcionalidades, respeitando a identidade visual e os padrões definidos neste documento.