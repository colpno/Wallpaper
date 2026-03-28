<a name="readme-top"></a>

# Pinterest Clone

A **Pinterest-inspired clone** built with modern web technologies.  
This project replicates some of Pinterest’s core features such as:

- 🔍 **Image searching** – find related images
- ✂️ **Image cropping** – upload and crop images before saving

---

## Table of Contents

- [Features](#-features)
- [Tech Stack](#️-tech-stack)
- [Project Structure](#-project-structure)
- [Requisitions](#-requisitions)
- [Setup & Installation](#️-setup--installation)
- [Screenshots](#-screenshots)
- [Contact](#-contact)

---

## ✨ Features

- User-friendly image upload with cropping
- Image search functionality
- File management with cloud
- Responsive grid-based UI (Pinterest-style layout)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## 🛠️ Tech Stack

- **Frontend:** [React](https://react.dev/) (with [TailwindCSS](https://tailwindcss.com/) / [React Query](https://tanstack.com/query/v5/docs/framework/react/overview) / [Zustand](https://zustand-demo.pmnd.rs/))
- **Backend:** [Node.js](https://nodejs.org/en) + [Express](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) ([Mongoose](https://mongoosejs.com/))
- **Image Handling:** [Multer](https://github.com/expressjs/multer), Sharp (for cropping and optimization)
- **Search:** Search posts using MongoDB's [vectorSearch](https://www.mongodb.com/docs/manual/reference/operator/aggregation/vectorSearch/) and [textSearch](https://www.mongodb.com/docs/manual/reference/operator/query/text/)
- **File Management:** [Cloudinary](https://cloudinary.com/)
- **Monorepo management:** [Turborepo](https://turborepo.com/)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## 📂 Project Structure

- `api`: **Express** API server
- `client`: **React** app
- `@repo/ui`: **Shadcn UI** components
- `@repo/types`: Shared **Typescript** types
- `@repo/shared`: Shared runtime **Typescript** code
- `@repo/logger`: Logger configurations
- `@repo/eslint-config`: **ESLint** configurations
- `@repo/prettier-config`: **Prettier** configurations
- `@repo/typescript-config`: **Typescript** configurations
- `@repo/vitest-config`: **Vitest** configurations
- `@repo/tailwind-config`: **Tailwind** configurations

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## 📦 Requisitions

- npm >= 11.6.1

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## ⚙️ Setup & Installation

1. Clone the repo

```bash
git clone https://github.com/colpno/Wallpaper.git
cd Wallpaper
```

2. Set up environment variables

```bash
cp apps/api/.env.example apps/api/.env
cp apps/client/.env.example apps/client/.env
```

3. Install dependencies

```bash
npm install
```

> **Optional**: Setup MongoDB using Docker Compose:
>
> ```sh
> docker compose up -d
> ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## 🚀 Usage

4. Start developing

```bash
npm run dev
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## 📸 Screenshots

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## 💬 Contact

📮 tagiavinh12@gmail.com

<p align="right">(<a href="#readme-top">back to top</a>)</p>
