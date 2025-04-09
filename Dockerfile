FROM ubuntu:latest
LABEL authors="yangming"

ENTRYPOINT ["top", "-b"]

# 阶段一：构建阶段（使用Maven镜像）
FROM maven:3.8.6-openjdk-17 AS builder
WORKDIR /build
COPY pom.xml .
# 下载依赖（利用Docker缓存层）
RUN mvn dependency:go-offline -B
COPY src ./src
# 打包并跳过测试
RUN mvn package -DskipTests

# 阶段二：运行阶段（使用JRE镜像）
FROM openjdk:17-jdk-slim
WORKDIR /app
# 从构建阶段复制jar包
COPY --from=builder /build/target/*.jar app.jar
# 暴露端口（与Spring Boot配置一致）
EXPOSE 8080
# 启动命令
ENTRYPOINT ["java", "-jar", "app.jar"]