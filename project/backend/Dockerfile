FROM openjdk:17

WORKDIR /app

# Copy the JAR file
COPY build/libs/backend-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]