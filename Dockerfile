# Create the node stage with name "builder"
FROM node:16 as builder
# Set the working directory
WORKDIR /app
# Copy files from current dir to work dir
COPY . .
# Install npm install and build assets
RUN npm install --force && npm run ng build --prod

# Stage 2: Serve app with nginx server

# Use official nginx image as the base image
FROM nginx:latest
# Set the working directory to nginx asset directory
WORKDIR /usr/share/nginx/html
# Remove defoult nginx static assets
RUN rm -rf ./*
# Copy the static assets from builder stage
COPY --from=builder /app/dist/infomail-frontend .
# Contatiners run nginx with global directives and daemon off
COPY /nginx.conf  /etc/nginx/conf.d/default.conf

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]
