# Portfólio — João P.

Site estático construído com Astro + Vue + Tailwind.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Testes

```bash
npm run test
```

## Antes do deploy

- [ ] Copiar o PDF do currículo para `public/cv.pdf`
- [ ] Criar uma conta em https://web3forms.com com o e-mail `jteixeira.dev@outlook.com`, copiar a access key para `.env` (baseado em `.env.example`)
- [ ] Substituir `src/content/projetos/exemplo-projeto.mdx` pelos projetos reais (um arquivo `.mdx` por projeto, seguindo o schema em `src/content.config.ts`)
- [ ] Criar o repositório remoto na conta pessoal do GitHub (não a conta da empresa configurada nesta máquina) e conectar ao Vercel — a ser feito junto com o autor quando chegar a essa etapa
