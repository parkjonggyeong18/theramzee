FROM openjdk:17-jdk-slim

WORKDIR /app

COPY . /app

RUN ./gradlew build -x test

COPY build/libs/*.jar app.jar

EXPOSE 5000

ENTRYPOINT ["java", "-jar", "app.jar"]
