# First stage: Build the WAR file using Maven
FROM maven:3.9.8-eclipse-temurin-21 AS builder

# Set the working directory in the container
WORKDIR /app

# Copy the pom.xml and source code into the container
COPY pom.xml .
COPY src ./src

# Package the application to create the WAR file
RUN mvn clean package

# Second stage: Create the Tomcat image
FROM tomcat:11.0.2-jdk21-temurin

# Set environment variables for Tomcat
ENV CATALINA_HOME /usr/local/tomcat
ENV PATH $CATALINA_HOME/bin:$PATH

# Remove the default Tomcat ROOT application
RUN rm -rf $CATALINA_HOME/webapps/ROOT

# Copy the WAR file from the builder stage
COPY --from=builder /app/target/*.war $CATALINA_HOME/webapps/ROOT.war

# Expose port 8080
EXPOSE 8080

# Start Tomcat
CMD ["catalina.sh", "run"]
