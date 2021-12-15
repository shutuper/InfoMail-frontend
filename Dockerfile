# Create the node stage with name "builder"
FROM node:16 as builder
# Set the working directory
WORKDIR /app
# Copy files from current dir to work dir
COPY . .
# Install npm install and build assets
RUN npm install --force && npm run build

# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:latest

# Remove defoult nginx static assets
RUN rm -rf /usr/share/nginx/html/*
# Copy the static assets from builder stage
COPY --from=builder /app/dist/infomail-frontend /usr/share/nginx/html

WORKDIR /usr/share/nginx/html
# Contatiners run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]

EXPOSE 80
