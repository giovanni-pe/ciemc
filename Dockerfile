# Usamos la imagen oficial de Node.js como base
FROM node:16

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiamos el archivo package.json y el package-lock.json (si existe)
COPY package*.json ./

# Instalamos las dependencias
RUN npm install

# Copiamos el resto del código de la aplicación
COPY . .

# El contenedor expondrá el puerto 3000
EXPOSE 3000

# Definimos el comando que ejecutará la aplicación
CMD ["npm", "run", "start:prod"]