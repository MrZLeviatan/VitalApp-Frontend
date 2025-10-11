# Etapda 1: Build Angular App

## Imagen Base de Node.js para construir la aplicación Angular
FROM node:20 AS build

# Directorio de trabajo dentro del contenedor
WORKDIR /app

#Copia todo el contenido del proyecto al contenedor e instala las dependencias npm
COPY package*.json ./
RUN npm install

# Copy resto de los archivos del proyecto
COPY . .

# Construir la aplicación para producción
RUN npm run build --prod

# Etapa 2: Compilar la aplicación Angular

# Usar una imagen ligera de Nginx para servir la aplicación
FROM nginx:alpine

# Copiar los archivos construidos desde la etapa de build al directorio por defecto de Nginx
COPY --from=build /app/dist/VitalApp-Frontend /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

# Ejecutar Nginx en primer plano automaticamente cuando el contenedor se inicie
CMD ["nginx", "-g", "daemon off;"]
