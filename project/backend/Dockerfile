FROM openjdk:17

WORKDIR /app

# Copy the JAR file
COPY build/libs/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]