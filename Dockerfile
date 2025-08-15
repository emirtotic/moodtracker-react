# ---------- Build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Provide Vite env at build-time (Railway -> Build Args / or .env.production)
ARG VITE_API_BASE
ENV VITE_API_BASE=$VITE_API_BASE

# Build
COPY . .
RUN npm run build

# ---------- Runtime stage (nginx) ----------
FROM nginx:1.27-alpine

# envsubst for dynamic $PORT from Railway
RUN apk add --no-cache bash gettext

# Copy build output
COPY --from=build /app/dist /usr/share/nginx/html

# Use nginx template; substitute $PORT on container start
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 8080
CMD ["/bin/sh","-c","envsubst '$$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
