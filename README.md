# Frontend – Plataforma de reservas

Este repositório contém o frontend da Plataforma de reservas, desenvolvido com **Next.js** e **Material UI**, responsável por fornecer a interface de usuário para gerenciamento de usuários, serviços, reservas e transações.

O frontend consome a API do backend hospedado no Render.

---

## Tecnologias utilizadas

- Next.js 13+ (App Router)
- React
- Material UI (MUI)
- Axios (para requisições HTTP)
- TypeScript 

---

## Funcionalidades principais

- Autenticação de usuários (login/logout)
- Dashboard com estatísticas (usuários, serviços, reservas)
- Listagem, criação, edição e exclusão de:
  - Usuários
  - Serviços
  - Reservas
  - Transações
- Pesquisa dinâmica de clientes e serviços ao criar reservas
- Modais para informações de conta e confirmações
- Responsividade para dispositivos móveis

---

## Rodando localmente

1. Clone o repositório:

```bash
git clone [link-do-repositório-frontend]
cd frontend
npm install

NEXT_PUBLIC_API_URL=https://backend-reservas-cl7a.onrender.com

npm run dev


```

2. Estrutura do projeto

src/
├── app/                # Páginas e rotas
│   ├── dashboard/      # Dashboard e telas internas
│   ├── auth/           # Login e registro
│   └── ...             # Outras rotas
├── components/         # Componentes reutilizáveis
├── services/           # Serviços para chamadas à API
├── hooks/              # Hooks customizados
├── types/              # Tipos TypeScript
└── utils/              # Funções utilitárias

3. Deploy

O frontend está sendo preparado para deploy na Vercel.

Infelizmente não consegui fazer o deploy do frontend a tempo, devido alguns erros mas em breve estará disponível.
