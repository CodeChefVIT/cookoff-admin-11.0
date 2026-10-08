<p align="center">
  <a href="https://www.codechefvit.com" target="_blank">
    <img src="https://i.ibb.co/4J9LXxS/cclogo.png" width="160" title="CodeChef-VIT" alt="CodeChef-VIT">
  </a>
</p>

<h2 align="center">Cookoff 11.0 Admin</h2>

<br/>

> Cookoff is CodeChef-VIT's flagship competitive programming event that brings together programmers for an intense competitive coding experience. This repository contains the Admin Portal for Cookoff 11.0 — the central interface for managing participants, questions, testcases, rounds, leaderboards, timers, and contest communication.

## 🌐 Deploy

The Cookoff 11.0 Admin Portal is deployed at:

**[Production URL](https://cookoff-admin.codechefvit.com/)**

> Replace the URL above if the production deployment uses a different domain.

## ⚙️ Tech Stack

- [Next.js 16](https://nextjs.org/)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Axios](https://axios-http.com/)
- [Zod](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [Firebase](https://firebase.google.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org/)
- [Zustand](https://github.com/pmndrs/zustand)
- [Vitest](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)

## 🔧 Features

### 🔐 Authentication & Access Control

- Google-based admin authentication.
- Protected admin routes through `AuthGuard`.
- Cookie-based authentication handled by the backend.
- Backend session validation for protected operations.

### 📊 Dashboard & Analytics

- Admin dashboard with contest analytics.
- Participant statistics and contest information.
- Notification sending interface.
- Visual analytics powered by Recharts.

### 👥 User Management

- View and manage registered participants.
- Searchable user listings.
- Ban and unban participants.
- Promote participants to the next round.
- Bulk round promotion.

### 📝 Question Management

- Create, view, update, and delete questions.
- Manage question metadata.
- Configure questions for different contest rounds.
- Manage visual blocks and visual solutions for visual questions.

### 🧪 Testcase Management

- Create testcases for questions.
- View public testcases.
- Update existing testcases.
- Delete testcases.
- Manage testcases on a per-question basis.

### ⏱️ Round & Contest Control

- View the current contest timer.
- Start rounds.
- Stop/reset round state.
- Set contest time.
- Add or update remaining time.
- Enable rounds from the admin portal.

### 🏆 Leaderboard

- View participant rankings.
- Display scores and rank ordering.
- Monitor participant performance during the contest.

### 📢 Notifications

- Send notifications to participants through the admin portal.
- Communicate important contest updates directly to users.

## 🏁 Get Started

### Prerequisites

- Node.js
- pnpm
- A running Cookoff 11.0 backend

### Clone

```bash
git clone -b main https://github.com/CodeChefVIT/cookoff-admin-11.0.git
cd cookoff-admin-11.0
```

### Install Dependencies

```bash
pnpm install
```

### Environment Variables

Create a `.env.local` file:

```bash
cp example.env .env.local
```

Configure the backend API:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

The application also uses Firebase configuration variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

### Run Development Server

```bash
pnpm dev
```

The development server runs on port `3067` as configured in the project.

### Production Build

```bash
pnpm build
pnpm start
```

## 🧱 Repository Structure

```text
cookoff-admin-11.0/
├── src/
│   ├── app/
│   │   ├── (protected)/
│   │   │   ├── dashboard/
│   │   │   ├── leaderboard/
│   │   │   ├── question/
│   │   │   ├── timer/
│   │   │   └── users/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── api/
│   │   ├── adminDashboard.ts
│   │   ├── client.ts
│   │   ├── questions.ts
│   │   ├── testcases.ts
│   │   ├── timer.ts
│   │   └── users.ts
│   │
│   ├── components/
│   │   ├── Analytics.tsx
│   │   ├── NotificationsSender.tsx
│   │   ├── auth/
│   │   ├── providers/
│   │   ├── ui/
│   │   └── Table/
│   │
│   ├── hooks/
│   ├── lib/
│   ├── schemas/
│   ├── stores/
│   ├── styles/
│   ├── test/
│   ├── types/
│   └── utils/
│
├── public/
├── example.env
├── next.config.js
├── package.json
├── pnpm-lock.yaml
├── tsconfig.json
├── vitest.config.ts
├── README.md
└── AGENTS.md
```

## 🔌 Backend API

The admin portal communicates with the Cookoff 11.0 backend through the API client in `src/api/client.ts`.

Major endpoints include:

### Authentication & Session

```text
GET /admin/session
```

Google authentication is initiated through:

```text
/api/v1/auth/google?portal=admin
```

### User Management

```text
GET  /admin/users
POST /admin/users/:id/ban
POST /admin/users/:id/unban
POST /admin/users/:id/upgrade
POST /admin/users/upgrade-all
```

### Leaderboard

```text
GET /admin/leaderboard
```

### Questions

```text
GET    /question
POST   /question
GET    /question/:id
PUT    /question/:id
DELETE /question/:id
```

### Visual Questions

```text
POST   /question/:questionId/blocks
DELETE /question/blocks/:blockId

POST   /question/:questionId/solutions
DELETE /question/solutions/:solutionId
```

### Testcases

```text
POST   /testcase
GET    /question/:id/testcases
GET    /question/:id/testcases/public
PUT    /testcase/:id
DELETE /testcase/:id
```

### Contest Timer

```text
GET  /getTime
POST /admin/setTime
POST /admin/updateTime
POST /admin/resetRound
POST /admin/startRound
POST /round/enable
```

## 🧭 Admin Portal Flow

The application is organized around protected admin routes:

```text
/
├── dashboard
├── leaderboard
├── users
├── question
└── timer
```

- `/` — Admin login and authentication entry point.
- `/dashboard` — Contest analytics and notifications.
- `/leaderboard` — Participant rankings.
- `/users` — Participant management.
- `/question` — Question and testcase administration.
- `/timer` — Contest and round timing controls.

All protected routes are guarded through the application's authentication layer and depend on a valid backend session.

## 🧪 Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Create production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm pretty       # Format files with Prettier
pnpm format:check # Check formatting
pnpm type-check   # Run TypeScript checks
pnpm test         # Run Vitest tests
```

## 🤝 Contribution Workflow

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feat/<scope>-<short-description>
```

3. Make your changes.
4. Run the project's checks:

```bash
pnpm lint
pnpm type-check
pnpm format:check
pnpm test
```

5. Commit your changes using a descriptive commit message:

```bash
git commit -m "feat: add bulk user promotion"
```

6. Push your branch and open a Pull Request.

For UI changes, include relevant screenshots in the Pull Request.

## 🔗 Related Projects

- **Backend:** [`cookoff-11.0-be`](https://github.com/CodeChefVIT/cookoff-11.0-be)
- **Participant Portal:** [`cookoff-portal-11.0`](https://github.com/CodeChefVIT/cookoff-portal-11.0)

These services work together to provide the complete Cookoff 11.0 contest infrastructure.

## 🚀 Contributors

<table align="center">
<tr align="center">

<td>
<p align="center">
<img src="https://avatars.githubusercontent.com/mharshil1234" width="120" height="120" alt="Harshil Maheshwari" style="border-radius:50%">
</p>
<p align="center">
<a href="https://github.com/mharshil1234" target="_blank">Harshil Maheshwari</a>
</p>
</td>

<td>
<p align="center">
<img src="https://avatars.githubusercontent.com/Rithish-2914" width="120" height="120" alt="Rithish-2914" style="border-radius:50%">
</p>
<p align="center">
<a href="https://github.com/Rithish-2914" target="_blank">Rithish Bajjuri</a>
</p>
</td>

<td>
<p align="center">
<img src="https://avatars.githubusercontent.com/YOGESH-08" width="120" height="120" alt="YOGESH-08" style="border-radius:50%">
</p>
<p align="center">
<a href="https://github.com/YOGESH-08" target="_blank">Yogesh Kumar</a>
</p>
</td>

<td>
<p align="center">
<img src="https://avatars.githubusercontent.com/upayanmazumder" width="120" height="120" alt="Upayan Mazumder" style="border-radius:50%">
</p>
<p align="center">
<a href="https://github.com/upayanmazumder" target="_blank">Upayan Mazumder</a>
</p>
</td>

</tr>

<tr align="center">

<td>
<p align="center">
<img src="https://avatars.githubusercontent.com/VPK570" width="120" height="120" alt="VPK570" style="border-radius:50%">
</p>
<p align="center">
<a href="https://github.com/VPK570" target="_blank">VP Krishna</a>
</p>
</td>

</tr>
</table>

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="center">
	Made with ❤️ by <a href="https://www.codechefvit.com" target="_blank">CodeChef-VIT</a>
</p>
