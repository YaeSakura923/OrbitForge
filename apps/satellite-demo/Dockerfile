FROM node:20-alpine AS builder
WORKDIR /app
COPY apps/satellite-demo/package.json apps/satellite-demo/package.json
COPY apps/satellite-demo/tsconfig.json apps/satellite-demo/tsconfig.json
COPY apps/satellite-demo/vite.config.ts apps/satellite-demo/vite.config.ts
COPY apps/satellite-demo/index.html apps/satellite-demo/index.html
COPY apps/satellite-demo/src apps/satellite-demo/src
RUN cd apps/satellite-demo && npm install && npm run build

FROM nginx:alpine
COPY --from=builder /app/apps/satellite-demo/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
