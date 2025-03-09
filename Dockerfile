# syntax = docker.io/docker/dockerfile:1

ARG node=22
ARG alpine=3.21

FROM docker.io/library/node:${node}-alpine${alpine} AS web-base
RUN --mount=type=cache,target=/var/cache \
    apk -U upgrade \
 && adduser -h /app -u 1001 -k /dev/null -D app \
 && chown app:app /app

WORKDIR /app
COPY --chown=1001:1001 ./packages/backend/package.json /app/packages/backend/
COPY --chown=1001:1001 ./package.json /app/


FROM web-base AS web-pnpm
ENV CI=1

RUN --mount=type=cache,target=/root/.npm \
    npm install -g pnpm@latest-10

COPY --chown=1001:1001 ./pnpm-workspace.yaml /app/
COPY --chown=1001:1001 ./packages/frontend/package.json /app/packages/frontend/
COPY --chown=1001:1001 ./packages/backend/pnpm-lock.yaml /app/packages/backend/
COPY --chown=1001:1001 ./packages/frontend/pnpm-lock.yaml /app/packages/frontend/
COPY --chown=1001:1001 ./pnpm-lock.yaml /app/

USER app:app


FROM web-pnpm AS web-deps
RUN --mount=type=cache,target=/app/.local/share/pnpm,uid=1001,gid=1001,sharing=locked \
	--mount=type=cache,target=/app/pnpm/store,uid=1001,gid=1001,sharing=locked \
    pnpm install --prod --frozen-lockfile


FROM web-pnpm AS web-build-base
RUN --mount=type=cache,target=/app/.local/share/pnpm,uid=1001,gid=1001,sharing=locked \
	--mount=type=cache,target=/app/pnpm/store,uid=1001,gid=1001,sharing=locked \
    --mount=type=cache,target=/app/node_modules,uid=1001,gid=1001 \
    --mount=type=cache,target=/app/packages/backend/node_modules,uid=1001,gid=1001 \
    --mount=type=cache,target=/app/packages/frontend/node_modules,uid=1001,gid=1001 \
    pnpm install


FROM web-build-base AS web-build-backend
WORKDIR /app/packages/backend

COPY --chown=1001:1001 ./packages/backend/.swcrc /app/packages/backend/
COPY --chown=1001:1001 ./packages/backend/tsconfig.json /app/packages/backend/

COPY --chown=1001:1001 ./packages/backend/src /app/packages/backend/src/

RUN --mount=type=cache,target=/app/.local/share/pnpm,uid=1001,gid=1001 \
	--mount=type=cache,target=/app/pnpm/store,uid=1001,gid=1001 \
    --mount=type=cache,target=/app/node_modules,uid=1001,gid=1001 \
    --mount=type=cache,target=/app/packages/backend/node_modules,uid=1001,gid=1001 \
    pnpm run build


FROM web-build-base AS web-build-frontend
WORKDIR /app/packages/frontend

COPY --chown=1001:1001 ./packages/frontend/svelte.config.js /app/packages/frontend/
COPY --chown=1001:1001 ./packages/frontend/vite.config.js /app/packages/frontend/
COPY --chown=1001:1001 ./packages/frontend/vite-plugin-optimize-tabler.ts /app/packages/frontend/
COPY --chown=1001:1001 ./packages/frontend/jsconfig.json /app/packages/frontend/

COPY --chown=1001:1001 ./packages/frontend/static /app/packages/frontend/static/
COPY --chown=1001:1001 ./packages/frontend/src /app/packages/frontend/src/

RUN --mount=type=cache,target=/app/.local/share/pnpm,uid=1001,gid=1001 \
	--mount=type=cache,target=/app/pnpm/store,uid=1001,gid=1001 \
    --mount=type=cache,target=/app/node_modules,uid=1001,gid=1001 \
    --mount=type=cache,target=/app/packages/frontend/node_modules,uid=1001,gid=1001 \
    pnpm run build


FROM web-base
CMD ["/bin/sh", "-c", "cd /app/packages/backend && npm run migrate && npm run start"]

RUN mkdir -p /app/packages/backend /app/packages/frontend

COPY --from=web-deps /app/node_modules /app/node_modules
COPY --from=web-deps /app/packages/backend/node_modules /app/packages/backend/node_modules
COPY --from=web-deps /app/packages/frontend/node_modules /app/packages/frontend/node_modules
COPY --from=web-build-backend /app/packages/backend/built /app/packages/backend/built
COPY --from=web-build-frontend /app/packages/frontend/build /app/packages/frontend/build

USER app:app
