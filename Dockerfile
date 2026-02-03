FROM node:20-alpine AS base

#Installing needed packages
RUN apk add --no-cache libc6-compat

#Set application directory
WORKDIR /app

#Copy the project files
COPY . .

#Install dependencies
RUN npm ci

#Built the application
RUN npm run build

#Set envieroment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

#expose ports
EXPOSE 3000

#Start the application
CMD ["npm", "start"]