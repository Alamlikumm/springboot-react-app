# ==========================================
# Stage 1: Build Frontend (React)
# ==========================================
FROM node:18-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# ==========================================
# Stage 2: Build Backend (Spring Boot)
# ==========================================
FROM maven:3.9-eclipse-temurin-17 AS build-backend
WORKDIR /app/backend

# Copy pom.xml dan download dependency terlebih dahulu (untuk cache)
COPY backend/pom.xml .
COPY backend/mvnw .
COPY backend/.mvn .mvn
RUN mvn dependency:go-offline -B

# Copy source code backend
COPY backend/src ./src

# Copy hasil build React ke folder static Spring Boot
COPY --from=build-frontend /app/frontend/dist ./src/main/resources/static

# Build aplikasi Spring Boot menjadi file JAR
RUN mvn clean package -DskipTests

# ==========================================
# Stage 3: Production Image (Runtime)
# ==========================================
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Tambahkan user non-root demi keamanan (Best Practice Docker)
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy file JAR dari stage build-backend
COPY --from=build-backend /app/backend/target/*.jar app.jar

# Buat folder untuk penyimpanan file lokal (opsional jika menggunakan local storage)
RUN mkdir -p /tmp/uploads

EXPOSE 8080 10000
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar /app/app.jar"]
