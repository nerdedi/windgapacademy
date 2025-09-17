<!-- Portions of this file were generated with the assistance of Anthropic Claude (https://www.anthropic.com/) -->

# Integration Guide

End-to-end steps to integrate Chakra UI, tRPC, OpenBadges, Socket.io, analytics, and accessibility into the existing React + Express + Firebase stack.

## Prerequisites

- Node 18+
- Existing React app with Vite
- Express backend (existing `/backend`)
- Firebase Auth configured

---

## 1) Chakra UI Setup

1) Install
```
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

2) Provider
```jsx
// src/main.jsx
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const theme = extendTheme({
  fonts: {
    heading: 'system-ui, sans-serif',
    body: "'OpenDyslexic', system-ui, sans-serif",
  },
  styles: { global: { 'html, body': { scrollBehavior: 'smooth' } } },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
);
```

3) A11y-friendly components
```jsx
import { Button, VisuallyHidden, VStack } from '@chakra-ui/react';

export function AccessibleButton({ onClick }) {
  return (
    <VStack>
      <Button onClick={onClick} colorScheme="teal">
        Start Lesson
      </Button>
      <VisuallyHidden>Starts an interactive 3D lesson</VisuallyHidden>
    </VStack>
  );
}
```

---

## 2) tRPC (server + client)

1) Install packages
```
npm install @trpc/server @trpc/client @trpc/react-query zod
```

2) Server router
```ts
// backend/src/trpc/router.ts
import { initTRPC } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.context<{
  userId?: string;
}>().create();

const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.userId) throw new Error('UNAUTHORIZED');
  return next();
});

export const appRouter = t.router({
  health: t.procedure.query(() => 'ok'),
  game: t.router({
    updateProgress: t.procedure
      .use(isAuthed)
      .input(z.object({ gameId: z.string(), score: z.number().min(0).max(100) }))
      .mutation(async ({ input, ctx }) => {
        // persist to Firestore and return awarded badges
        return { newBadges: [] };
      }),
  }),
});
export type AppRouter = typeof appRouter;
```

3) Express binding
```ts
// backend/src/index.ts
import express from 'express';
import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './trpc/router';

const app = express();
app.use('/trpc', trpcExpress.createExpressMiddleware({
  router: appRouter,
  createContext: ({ req }) => ({ userId: req.headers['x-user-id'] as string | undefined }),
}));
app.listen(9000);
```

4) Client setup
```ts
// src/lib/trpc.ts
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../backend/src/trpc/router';
export const trpc = createTRPCReact<AppRouter>();
```

---

## 3) OpenBadges

1) Badge class JSON-LD
```json
{
  "@context": "https://w3id.org/openbadges/v3",
  "type": "BadgeClass",
  "id": "https://example.org/badges/numeracy-novice",
  "name": "Numeracy Novice",
  "description": "Completed 5 numeracy games with 70%+ accuracy",
  "issuer": "https://example.org/issuers/windgap",
  "criteria": { "narrative": "Achieve 5 passes with >= 70%" }
}
```

2) Issuance (server)
```ts
// backend/src/badges/issue.ts
export async function awardBadge(userId: string, badgeId: string, evidenceUrl?: string) {
  // Sign assertion, persist, and return URL
  return { assertionUrl: `https://example.org/assertions/${userId}/${badgeId}` };
}
```

---

## 4) Socket.io

1) Server
```ts
// backend/src/realtime.ts
import { Server } from 'socket.io';
export function setupRealtime(server: any) {
  const io = new Server(server, { cors: { origin: '*' } });
  io.of('/classroom').on('connection', (socket) => {
    socket.on('joinRoom', (roomId) => socket.join(roomId));
    socket.on('progress', (payload) => socket.to(payload.roomId).emit('progress', payload));
  });
  return io;
}
```

2) Client
```ts
import { io } from 'socket.io-client';
const socket = io('/classroom');
socket.emit('joinRoom', 'lesson-123');
socket.on('progress', (p) => console.log('peer progress', p));
```

---

## 5) Analytics & Events

- Define canonical events; buffer and batch where possible.
- Respect consent; allow opt-out; use server-side proxy for GA if needed.

```ts
export function track(event: string, props: Record<string, unknown> = {}) {
  // send to PostHog/GA4
}
```

---

## 6) Accessibility Checklist

- Focus management: trap focus only in modals; restore focus on close.
- Keyboard: all interactive elements reachable; define shortcuts.
- Reduced motion: conditionalize animations.
- Contrast: adhere to WCAG 2.1 AA.
- Screen readers: landmarks, roles, labels; avoid hidden focusable elements.

---

## Deployment Notes

- CDN for GLB assets; precompress Brotli; cache immutably.
- Health checks for backend; CI with Playwright smoke E2E.
- Environment variables via `.env` and secrets store; never commit keys.
