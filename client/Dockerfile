# Build stage
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Build arg
ARG VITE_PROD_API_URL=http://vcgs848ws00os4osco4sogkk.31.57.154.115.sslip.io/api
ENV VITE_PROD_API_URL=${VITE_PROD_API_URL}

# Build frontend
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
