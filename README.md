# 🧠 Memora

**Memora** is an open-source AI-powered knowledge management platform, built to help individuals and teams organize, query, and expand their information intelligently.
It combines **LLMs**, **vector search**, **customizable plugins**, and a modern interface to simplify how we handle data and digital memories.

---

## 🚀 Key Technologies

Memora is a full-stack project that uses a modern tech stack:

* **TypeScript** – Main language.
* **NestJS** – Modular and scalable backend framework.
* **React + React Router** – Reactive web interface with advanced routing.
* **Drizzle ORM** – Relational database migrations and access.
* **Postgres** – Relational database.
* **Milvus** – Vector database for embeddings.
* **Redis** – Cache and job queue.
* **MinIO (S3)** – File storage.
* **Docker Compose** – Local service orchestration.
* **pnpm** – Monorepo package manager.

---

## 📂 Project Structure

```
├── apps
│   ├── backend        # NestJS API and services
│   └── frontend       # React interface with Vite
├── packages
│   └── schemas        # Shared schemas (Zod/TypeScript)
├── docker-compose.yml # Local orchestration (Postgres, Redis, Milvus, MinIO, etc.)
├── Dockerfile         # Application build
├── pnpm-workspace.yaml
└── README.md
```

* **apps/backend** → Knowledge modules, plugins, document ingestion, cache, vector search, and security.
* **apps/frontend** → File uploads, chat, document viewer, plugin installation.
* **packages/schemas** → Shared types and contracts between backend and frontend.

---

## 🔌 Plugins

Memora supports **plugins** to expand its features — new data sources, pre- and post-processing pipelines, or external integrations.
Each plugin includes:

* `memora-plugin.json` → Plugin metadata.
* `src/index.ts` → Entry point.
* `documentation.md` → Usage documentation.

---

## ⚙️ Running Locally

### Requirements

* [Node.js](https://nodejs.org/) (>= 18)
* [pnpm](https://pnpm.io/)
* [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/core-stack/memora.git
   cd memora
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Start essential services:

   ```bash
   docker compose up -d
   ```

4. Start the backend:

   ```bash
   pnpm --filter @memora/backend dev
   ```

5. Start the frontend:

   ```bash
   pnpm --filter @memora/frontend dev
   ```

---

## 🛠️ Development

* **Migrations** are managed with **Drizzle** under `apps/backend/drizzle`.
* **Ingestion jobs** process documents and generate embeddings for semantic search.
* **LLM module** integrates prompts and plugin decision services.
* **Frontend** uses **Tailwind** and **shadcn/ui** for reactive and consistent components.

---

## 🤝 Contributing

Want to help build **Memora**?

* Open **issues** with ideas, bugs, or improvements.
* Submit **pull requests** for new features or fixes.
* Explore the `apps/backend/plugins` folder and build your own plugin.

---

## 📜 License

This project is open-source under the **MIT License**.

---