FROM node:23-slim

WORKDIR /ask-js
COPY . .

RUN npm install -g pnpm@latest-10 && \
        pnpm i && pnpm build

CMD ["/bin/bash", "-c", "pnpm migration:apply && pnpm start"]