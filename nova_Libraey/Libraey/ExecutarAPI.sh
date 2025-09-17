#!/bin/bash

echo "Iniciando a API da Social Library..."

# Verifica se o diretório lib existe, se não, cria
if [ ! -d "lib" ]; then
    mkdir -p lib
fi

# Verifica se as dependências já estão baixadas
if [ ! -f "lib/spark-core-2.9.4.jar" ]; then
    echo "Baixando dependências..."
    wget -P lib https://repo1.maven.org/maven2/com/sparkjava/spark-core/2.9.4/spark-core-2.9.4.jar
    wget -P lib https://repo1.maven.org/maven2/org/slf4j/slf4j-api/1.7.36/slf4j-api-1.7.36.jar
    wget -P lib https://repo1.maven.org/maven2/org/slf4j/slf4j-simple/1.7.36/slf4j-simple-1.7.36.jar
    wget -P lib https://repo1.maven.org/maven2/com/google/code/gson/gson/2.10.1/gson-2.10.1.jar
    wget -P lib https://repo1.maven.org/maven2/org/eclipse/jetty/jetty-server/9.4.48.v20220622/jetty-server-9.4.48.v20220622.jar
    wget -P lib https://repo1.maven.org/maven2/org/eclipse/jetty/jetty-util/9.4.48.v20220622/jetty-util-9.4.48.v20220622.jar
    wget -P lib https://repo1.maven.org/maven2/javax/servlet/javax.servlet-api/3.1.0/javax.servlet-api-3.1.0.jar
    wget -P lib https://repo1.maven.org/maven2/org/eclipse/jetty/jetty-http/9.4.48.v20220622/jetty-http-9.4.48.v20220622.jar
    wget -P lib https://repo1.maven.org/maven2/org/eclipse/jetty/jetty-io/9.4.48.v20220622/jetty-io-9.4.48.v20220622.jar
    wget -P lib https://repo1.maven.org/maven2/org/eclipse/jetty/jetty-webapp/9.4.48.v20220622/jetty-webapp-9.4.48.v20220622.jar
    wget -P lib https://repo1.maven.org/maven2/org/eclipse/jetty/jetty-servlet/9.4.48.v20220622/jetty-servlet-9.4.48.v20220622.jar
    wget -P lib https://repo1.maven.org/maven2/org/eclipse/jetty/jetty-security/9.4.48.v20220622/jetty-security-9.4.48.v20220622.jar
    wget -P lib https://repo1.maven.org/maven2/org/eclipse/jetty/jetty-xml/9.4.48.v20220622/jetty-xml-9.4.48.v20220622.jar
    wget -P lib https://repo1.maven.org/maven2/org/eclipse/jetty/websocket/websocket-server/9.4.48.v20220622/websocket-server-9.4.48.v20220622.jar
    wget -P lib https://repo1.maven.org/maven2/org/eclipse/jetty/websocket/websocket-common/9.4.48.v20220622/websocket-common-9.4.48.v20220622.jar
    wget -P lib https://repo1.maven.org/maven2/org/eclipse/jetty/websocket/websocket-client/9.4.48.v20220622/websocket-client-9.4.48.v20220622.jar
    wget -P lib https://repo1.maven.org/maven2/org/eclipse/jetty/websocket/websocket-servlet/9.4.48.v20220622/websocket-servlet-9.4.48.v20220622.jar
    wget -P lib https://repo1.maven.org/maven2/org/eclipse/jetty/websocket/websocket-api/9.4.48.v20220622/websocket-api-9.4.48.v20220622.jar
fi

echo "Compilando classes..."
mkdir -p target/classes

# Compilar as classes Java
javac -cp "lib/*:src/main/java" -d target/classes src/main/java/com/libraey/api/*.java src/main/java/com/libraey/api/controllers/*.java src/main/java/com/libraey/api/models/*.java src/main/java/com/libraey/api/services/*.java

echo "Iniciando o servidor..."
java -cp "target/classes:lib/*" com.libraey.api.Application 