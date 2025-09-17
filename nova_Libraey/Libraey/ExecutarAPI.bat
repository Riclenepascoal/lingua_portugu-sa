@echo off
echo Iniciando a API da Social Library...

REM Verifica se o diretório lib existe, se não, cria
if not exist "lib" mkdir lib

REM Verifica se as dependências já estão baixadas
if not exist "lib\spark-core-2.9.4.jar" (
    echo Baixando dependências...
    powershell -Command "& {Invoke-WebRequest -Uri 'https://repo1.maven.org/maven2/com/sparkjava/spark-core/2.9.4/spark-core-2.9.4.jar' -OutFile 'lib\spark-core-2.9.4.jar'}"
    powershell -Command "& {Invoke-WebRequest -Uri 'https://repo1.maven.org/maven2/org/slf4j/slf4j-api/1.7.36/slf4j-api-1.7.36.jar' -OutFile 'lib\slf4j-api-1.7.36.jar'}"
    powershell -Command "& {Invoke-WebRequest -Uri 'https://repo1.maven.org/maven2/org/slf4j/slf4j-simple/1.7.36/slf4j-simple-1.7.36.jar' -OutFile 'lib\slf4j-simple-1.7.36.jar'}"
    powershell -Command "& {Invoke-WebRequest -Uri 'https://repo1.maven.org/maven2/com/google/code/gson/gson/2.10.1/gson-2.10.1.jar' -OutFile 'lib\gson-2.10.1.jar'}"
    powershell -Command "& {Invoke-WebRequest -Uri 'https://repo1.maven.org/maven2/org/eclipse/jetty/jetty-server/9.4.48.v20220622/jetty-server-9.4.48.v20220622.jar' -OutFile 'lib\jetty-server-9.4.48.v20220622.jar'}"
    powershell -Command "& {Invoke-WebRequest -Uri 'https://repo1.maven.org/maven2/org/eclipse/jetty/jetty-util/9.4.48.v20220622/jetty-util-9.4.48.v20220622.jar' -OutFile 'lib\jetty-util-9.4.48.v20220622.jar'}"
    powershell -Command "& {Invoke-WebRequest -Uri 'https://repo1.maven.org/maven2/javax/servlet/javax.servlet-api/3.1.0/javax.servlet-api-3.1.0.jar' -OutFile 'lib\javax.servlet-api-3.1.0.jar'}"
    powershell -Command "& {Invoke-WebRequest -Uri 'https://repo1.maven.org/maven2/org/eclipse/jetty/jetty-http/9.4.48.v20220622/jetty-http-9.4.48.v20220622.jar' -OutFile 'lib\jetty-http-9.4.48.v20220622.jar'}"
    powershell -Command "& {Invoke-WebRequest -Uri 'https://repo1.maven.org/maven2/org/eclipse/jetty/jetty-io/9.4.48.v20220622/jetty-io-9.4.48.v20220622.jar' -OutFile 'lib\jetty-io-9.4.48.v20220622.jar'}"
    powershell -Command "& {Invoke-WebRequest -Uri 'https://repo1.maven.org/maven2/org/eclipse/jetty/jetty-webapp/9.4.48.v20220622/jetty-webapp-9.4.48.v20220622.jar' -OutFile 'lib\jetty-webapp-9.4.48.v20220622.jar'}"
    powershell -Command "& {Invoke-WebRequest -Uri 'https://repo1.maven.org/maven2/org/eclipse/jetty/jetty-servlet/9.4.48.v20220622/jetty-servlet-9.4.48.v20220622.jar' -OutFile 'lib\jetty-servlet-9.4.48.v20220622.jar'}"
    powershell -Command "& {Invoke-WebRequest -Uri 'https://repo1.maven.org/maven2/org/eclipse/jetty/jetty-security/9.4.48.v20220622/jetty-security-9.4.48.v20220622.jar' -OutFile 'lib\jetty-security-9.4.48.v20220622.jar'}"
    powershell -Command "& {Invoke-WebRequest -Uri 'https://repo1.maven.org/maven2/org/eclipse/jetty/jetty-xml/9.4.48.v20220622/jetty-xml-9.4.48.v20220622.jar' -OutFile 'lib\jetty-xml-9.4.48.v20220622.jar'}"
    powershell -Command "& {Invoke-WebRequest -Uri 'https://repo1.maven.org/maven2/org/eclipse/jetty/websocket/websocket-server/9.4.48.v20220622/websocket-server-9.4.48.v20220622.jar' -OutFile 'lib\websocket-server-9.4.48.v20220622.jar'}"
    powershell -Command "& {Invoke-WebRequest -Uri 'https://repo1.maven.org/maven2/org/eclipse/jetty/websocket/websocket-common/9.4.48.v20220622/websocket-common-9.4.48.v20220622.jar' -OutFile 'lib\websocket-common-9.4.48.v20220622.jar'}"
    powershell -Command "& {Invoke-WebRequest -Uri 'https://repo1.maven.org/maven2/org/eclipse/jetty/websocket/websocket-client/9.4.48.v20220622/websocket-client-9.4.48.v20220622.jar' -OutFile 'lib\websocket-client-9.4.48.v20220622.jar'}"
    powershell -Command "& {Invoke-WebRequest -Uri 'https://repo1.maven.org/maven2/org/eclipse/jetty/websocket/websocket-servlet/9.4.48.v20220622/websocket-servlet-9.4.48.v20220622.jar' -OutFile 'lib\websocket-servlet-9.4.48.v20220622.jar'}"
    powershell -Command "& {Invoke-WebRequest -Uri 'https://repo1.maven.org/maven2/org/eclipse/jetty/websocket/websocket-api/9.4.48.v20220622/websocket-api-9.4.48.v20220622.jar' -OutFile 'lib\websocket-api-9.4.48.v20220622.jar'}"
)

echo Compilando classes...
if not exist "target\classes" mkdir target\classes

REM Compilar as classes Java um por um sem usar asterisco
echo Compilando Application.java...
javac -cp "lib/*;src/main/java" -d target/classes src/main/java/com/libraey/api/Application.java

echo Compilando modelos...
FOR %%F IN (src\main\java\com\libraey\api\models\*.java) DO javac -cp "lib/*;target/classes;src/main/java" -d target/classes %%F

echo Compilando services...
FOR %%F IN (src\main\java\com\libraey\api\services\*.java) DO javac -cp "lib/*;target/classes;src/main/java" -d target/classes %%F

echo Compilando controllers...
FOR %%F IN (src\main\java\com\libraey\api\controllers\*.java) DO javac -cp "lib/*;target/classes;src/main/java" -d target/classes %%F

echo Compilando classes restantes...
FOR %%F IN (src\main\java\com\libraey\api\*.java) DO (
    IF NOT "%%~nxF"=="Application.java" javac -cp "lib/*;target/classes;src/main/java" -d target/classes %%F
)

echo Iniciando o servidor...
java -cp "target/classes;lib/*" com.libraey.api.Application

pause 