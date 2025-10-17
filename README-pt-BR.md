<p align="center">
  <img src="[LOGO_PATH]" alt="Logo do Snipet" width="200"/>
</p>

<h1 align="center">Snipet</h1>

<p align="center">
  <strong>Plataforma de gerenciamento de conhecimento de código aberto e com tecnologia de IA</strong><br>
  <em>Organize, memorize e expanda seu conhecimento digital — de forma inteligente.</em>
</p>

<p align="center">
  <a href="/README.md" target="_blank">🇺🇸 English</a>
  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="https://github.com/core-stack/snipet/issues/new?template=bug_report.md&title=%5BBUG%5D%20" target="_blank">🐛 Report Bug</a>
  &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="[LINKEDIN_URL]" target="_blank">💼 LinkedIn</a>
</p>

<p align="center">
  <a href="https://github.com/core-stack/snipet/stargazers">
    <img src="https://img.shields.io/github/stars/core-stack/snipet?style=social" alt="GitHub stars">
  </a>
  <a href="https://github.com/core-stack/snipet/issues">
    <img src="https://img.shields.io/github/issues/core-stack/snipet" alt="GitHub issues">
  </a>
  <a href="https://github.com/core-stack/snipet/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/core-stack/snipet" alt="License">
  </a>
</p>

---

<p align="center">
<img src="https://raw.githubusercontent.com/core-stack/snipet/main/.github/assets/showcase.png" alt="Snipet Showcase"/>
</p>

**Snipet** é uma plataforma de código aberto que combina memória de IA, pesquisa vetorial e gerenciamento de conhecimento em um único ambiente.
Ele ajuda equipes e indivíduos a armazenar, organizar e consultar informações de forma inteligente, tornando a memória um conceito de primeira classe em seu fluxo de trabalho.

> 📚 **Evolução do Projeto**: O Snipet foi projetado com arquitetura modular, extensibilidade de plugins e opções híbridas de auto-hospedagem e gerenciamento.

## 🎓 Principais Recursos

- **Mecanismo de Memória de IA** – Armazenamento e recuperação semântica usando embeddings
- **Plugin** – Adicione fontes com suas próprias integrações
- **Pesquisa Vetorial** – Busca híbrida (semântica + palavra-chave) com tecnologia milvus
- **Espaços de Trabalho Multilocatários (em breve)** – Ambientes separados para equipes ou usuários
- **Interface de Usuário Web Moderna** – Responsiva, intuitiva e desenvolvida com React

## 🛠️ Tecnologias Utilizadas

* **Framework**: NestJS + React Router
* **Linguagem**: Typescript
* **Banco de Dados**: PostgreSQL
* **Armazenamento**: Compatível com S3
* **IA**: Gemini (Ollama e OpenAI em breve)
* **Containerização**: Espaços de Trabalho Docker e PNPM

## 🚀 Início Rápido

### 📥 Instalação
1. Clonar o Repositório
```bash
git clone https://github.com/core-stack/snipet.git
cd snipet
```
2. Instalar dependências
```bash
pnpm install
```
3. Configurar ambiente

```bash
cp .env.example .env.local
```
4. Executar em modo de desenvolvimento
```bash
pnpm dev
```

### ⚡ Primeiros Passos

- Acesse http://localhost:3000
- Crie seu primeiro conhecimento
- Adicione um arquivo ou instale um plugin
- Experimente o **chat de busca de memória de IA** para consultar seu conhecimento

## 💻 Para Desenvolvedores

Se você deseja clonar o repositório e executar o projeto localmente:

```bash
# 1. Clone o repositório
git clone https://github.com/core-stack/snipet.git

# 2. Navegue até a pasta do projeto
cd snipet

# 3. Instalar dependências
npm install

# 4. Executar em modo de desenvolvimento
npm start
```

## 📚 Perfeito para

- **Pesquisadores de IA** – testando integrações de busca vetorial e LLM
- **Desenvolvedores** – criando aplicativos ou plugins de conhecimento personalizados
- **Equipes** – compartilhando memória em espaços de trabalho colaborativos
- **Indivíduos** – organizando conhecimento pessoal de forma eficiente

## 🤝 Contribuições

Contribuições de todos são bem-vindas!<br>
Confira nosso [Guia de Contribuição](./CONTRIBUTING.md) e participe do projeto.

## 📄 Licença
Este projeto está licenciado sob a Licença Snipet (baseada no Apache 2.0).
Consulte o arquivo [LICENSE](./LICENSE) para obter detalhes.

---

<p align="center">
  Feito com ❤️ por <a href="[GITHUB_PROFILE_URL]" target="_blank">[AUTHOR_NAME]</a>
</p>
