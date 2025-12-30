# Use Node.js 18+ (supports structuredClone)
FROM node:20-alpine

WORKDIR /app

# Copy all source files
COPY . .

RUN npm install

# Ensure the correct Node.js version
RUN node -v

# Build the application
RUN npm run build

CMD ["npm", "start"]