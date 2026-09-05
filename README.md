<p align="center"><a href="https://www.codechefvit.com" target="_blank"><img src="https://i.ibb.co/4J9LXxS/cclogo.png" width="160" title="CodeChef-VIT" alt="Codechef-VIT"></a></p>

<h2 align="center">Cookoff 11.0 Admin</h2>
<br/>

> Cookoff is CodeChef VIT’s flagship competitive programming event that challenges developers across the country. This repository contains the Admin Portal for Cookoff 11.0 — the single interface for managing users, problems, testcases, rounds, judging operations, and event monitoring.

## 🌐 Deploy

(Production URL)

## ⚙️ Tech Stack:

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Shadcn UI](https://ui.shadcn.com/)
- [Zod](https://zod.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [Axios](https://axios-http.com/)

<!-- ## 🖼 Screenshots

<p align="center">

</p> -->

## 🔧 Features

- Authentication & Access Control:
  - Secure admin-only login
  - Role-based feature gating (Super Admin, Problem Setter, Judge, Observer)
- User Management:
  - Paginated + searchable table
  - Ban / unban
  - Bulk round promotion
- Question Management:
  - CRUD with rich editor/markdown preview
  - Difficulty, tags, constraints metadata
- Testcase Management:
  - List, create, update, delete
  - Distinguish sample vs hidden
- Round / Contest Control:
  - Control timer from admin (start rounds, add time)
- Notifications:
  - Send notifications to users on the main portal
- Observability:
  - Submission analytics page

## 🏁 Get Started

Clone:

```bash
git clone -b main https://github.com/<your-username>/cookoff-admin-11.0.git
cd cookoff-admin-X
```

Install:

```bash
pnpm install
# or
npm install
```

Environment (create `.env.local`):

```bash
NEXT_PUBLIC_API_BASE_URL=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

Run:

```bash
pnpm dev
```

Build:

```bash
pnpm build && pnpm start
```

Suggested structure:

```
/app
/components
/services
/hooks
/lib
/types
/showcase_ss
```

## 📝 Checkout:

- Backend
  Previous cycle example: https://github.com/CodeChefVIT/cookoff-11.0-be
- Participant Portal
  Previous example: https://github.com/CodeChefVIT/cookoff-portal-11.0

## 🤝 Contribution Workflow

1. Branch naming: `feat/<scope>-<short-desc>` (e.g. `feat/users-bulk-promote`)
2. Conventional commits: `feat: add bulk user promotion`
3. Run checks:
   ```bash
   pnpm lint
   pnpm typecheck
   pnpm format
   ```
4. Open PR with screenshots for UI changes.

## 🧪 Scripts

```bash
pnpm dev
pnpm lint
pnpm typecheck
pnpm format
pnpm build
```

## ✅ Quality & Security

- Schema validation via Zod
- Protected routes with server session guard
- Role-based gating for destructive actions
- Avoid logging sensitive data
- API abstraction in `/services`

## 🧱 Roadmap

- Live scoreboard monitor
- Real-time judge queue depth
- Dark mode toggle
- Bulk user CSV import/export
- Rejudge workflow UI
- Anomaly detection (suspicious behavior)
- Email / webhook notifications

## Contributors

<table>
	<tr align="center" style="font-weight:bold">
		<td>
		John Doe
		<p align="center">
			<img src = "https://i.ibb.co/4J9LXxS/cclogo.png" width="150" height="150" alt="Your Name Here (Insert Your Image Link In Src">
		</p>
			<p align="center">
				<a href = "https://github.com/<GitHub-username>">
					<img src = "http://www.iconninja.com/files/241/825/211/round-collaboration-social-github-code-circle-network-icon.svg" width="36" height = "36" alt="GitHub"/>
				</a>
			</p>
		</td>
				<td>
		John Doe
		<p align="center">
			<img src = "https://i.ibb.co/4J9LXxS/cclogo.png" width="150" height="150" alt="Your Name Here (Insert Your Image Link In Src">
		</p>
			<p align="center">
				<a href = "https://github.com/<GitHub-username>">
					<img src = "http://www.iconninja.com/files/241/825/211/round-collaboration-social-github-code-circle-network-icon.svg" width="36" height = "36" alt="GitHub"/>
				</a>
			</p>
		</td>
	</tr>
</table>

## License

[![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

<p align="center">
	Made with ❤️ by <a href="https://www.codechefvit.com" target="_blank">CodeChef-VIT</a>
</p>
