# Use Node.js 18+ (supports structuredClone)
FROM node:20-alpine

WORKDIR /app

RUN npm install

# Copy all source files
COPY . .

# Ensure the correct Node.js version
RUN node -v

# Build the application
RUN npm run build

CMD ["npm", "start"]