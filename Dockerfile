FROM --platform=linux/amd64 node:20-bullseye AS build
WORKDIR /app

# Update npm to latest version and install build tools
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/* && \
    npm install -g npm@latest

# Copy package files
COPY package*.json ./

# Clear npm cache and install dependencies with force flag
RUN npm cache clean --force && \
    npm install --force --verbose && \
    npm rebuild

# Copy application code
COPY . .

# Run nuxt prepare to generate types and then build
RUN npx nuxt prepare && \
    NODE_OPTIONS="--max-old-space-size=4096" npm run build

FROM --platform=linux/amd64 node:20-bullseye AS production
WORKDIR /app

# Update npm in production stage as well
RUN npm install -g npm@latest

COPY --from=build /app/.output ./.output
COPY --from=build /app/package*.json ./

# Install production dependencies with force flag
RUN npm cache clean --force && \
    npm install --omit=dev --force

ENV NODE_ENV=production
ENV NITRO_PORT=3000
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
