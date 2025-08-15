# ---------- Build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

# >>> OVO DODAJ <<<
ARG VITE_API_BASE
ENV VITE_API_BASE=$VITE_API_BASE
# <<<

COPY . .
RUN npm run build
