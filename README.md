<p align="center">
  <img src="[LOGO_PATH]" alt="Snipet Logo" width="200"/>
</p>

<h1 align="center">Snipet</h1>

<p align="center">
  <strong>Open-source AI-powered knowledge management platform</strong><br>
  <em>Organize, remember, and expand your digital knowledge — intelligently.</em>
</p>

<p align="center">
  <a href="/README.pt.md" target="_blank">🇧🇷 Português</a>
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

**Snipet** is an open-source platform that merges AI memory, vector search, and knowledge management into one environment.
It helps teams and individuals store, organize, and query information intelligently, making memory a first-class concept in your workflow.

> 📚 **Project Evolution**: Snipet is designed with modular architecture, plugin extensibility, and hybrid self-host + managed options.

## 🎓 Main Features

- **AI Memory Engine** – Semantic storage and retrieval using embeddings
- **Plugin** – Add sources with your own integrations
- **Vector Search** – Hybrid search (semantic + keyword) powered by milvus
- **Multi-tenant Workspaces (comming soon)** – Separate environments for teams or users
- **Modern Web UI** – Responsive, intuitive, and built with React

## 🛠️ Technologies Used

* **Framework**: NestJS + React Router
* **Language**: Typescript
* **Database**: PostgreSQL 
* **Storage**: S3 compatible
* **AI**: Gemini (Ollama and OpenAI comming soon)
* **Containerization**: Docker & PNPM Workspaces

## 🚀 Quick Start

### 📥 Installation
1. Clone the repository
```bash
git clone https://github.com/core-stack/snipet.git
cd snipet
```
2. Install dependencies
```bash
pnpm install
```
3. Setup environment

```bash
cp .env.example .env.local
```
4. Run in development mode
```bash
pnpm dev
```

### ⚡ First Steps

- Access http://localhost:3000
- Create your first knowledge
- Add a file or install a plugin
- Try the **AI memory search chat** to query your knowledge

## 💻 For Developers

If you want to clone the repository and run the project locally:

```bash
# 1. Clone the repository
git clone https://github.com/core-stack/snipet.git

# 2. Navigate to the project folder
cd snipet

# 3. Install dependencies
npm install

# 4. Run in development mode
npm start
```

## 📚 Perfect for

- **AI Researchers** – testing vector search and LLM integrations
- **Developers** – building custom knowledge apps or plugins
- **Teams** – sharing memory across collaborative workspaces
- **Individuals** – organizing personal knowledge efficiently

## 🤝 Contributing

We welcome contributions from everyone!<br>
Check out our [Contributing Guide](./CONTRIBUTING.md) and join the project.

## 📄 License
This project is licensed under the Snipet License (based on Apache 2.0).
See the [LICENSE](./LICENSE) file for details.

---

<p align="center"> Made with ❤️ by <a href="https://github.com/mayron1806" target="_blank">Mayron Fernandes</a> </p>