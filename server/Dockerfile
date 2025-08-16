FROM node:18-alpine

WORKDIR /app

# Install dependencies (production)
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --production

# Copy source
COPY . .

# Default port used by the app; Coolify will map ports as needed
EXPOSE 3000

# Use the production start script
ENV NODE_ENV=production
CMD ["node", "app.js"]
