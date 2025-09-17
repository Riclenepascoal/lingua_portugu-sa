@echo off
echo Iniciando Libraey API com wget...

REM Verificando se o Java está instalado
java -version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Java não encontrado. Por favor, instale o Java 11 ou superior.
    exit /b 1
)

REM Verificando se o wget está instalado
wget --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo wget não encontrado. Por favor, instale o wget para Windows.
    echo Você pode baixá-lo em: https://eternallybored.org/misc/wget/
    exit /b 1
)

REM Criando diretórios para compilação
if not exist "classes" mkdir classes
if not exist "lib" mkdir lib

REM Criando toda a estrutura de pacotes necessária
if not exist "classes\com\libraey\api\models" mkdir classes\com\libraey\api\models
if not exist "classes\com\libraey\api\standalone" mkdir classes\com\libraey\api\standalone
if not exist "classes\com\libraey\api\services" mkdir classes\com\libraey\api\services

REM Baixando as dependências necessárias
if not exist "lib\spark-core-2.9.4.jar" (
    echo Baixando dependências com wget...
    wget -P lib https://repo1.maven.org/maven2/com/sparkjava/spark-core/2.9.4/spark-core-2.9.4.jar
    wget -P lib https://repo1.maven.org/maven2/com/google/code/gson/gson/2.10.1/gson-2.10.1.jar
    wget -P lib https://repo1.maven.org/maven2/org/slf4j/slf4j-api/2.0.7/slf4j-api-2.0.7.jar
    wget -P lib https://repo1.maven.org/maven2/org/slf4j/slf4j-simple/2.0.7/slf4j-simple-2.0.7.jar
    wget -P lib https://repo1.maven.org/maven2/javax/servlet/javax.servlet-api/3.1.0/javax.servlet-api-3.1.0.jar
    wget -P lib https://repo1.maven.org/maven2/org/eclipse/jetty/jetty-server/9.4.48.v20220622/jetty-server-9.4.48.v20220622.jar
    wget -P lib https://repo1.maven.org/maven2/org/eclipse/jetty/jetty-util/9.4.48.v20220622/jetty-util-9.4.48.v20220622.jar
    wget -P lib https://repo1.maven.org/maven2/org/eclipse/jetty/jetty-http/9.4.48.v20220622/jetty-http-9.4.48.v20220622.jar
    wget -P lib https://repo1.maven.org/maven2/org/eclipse/jetty/jetty-io/9.4.48.v20220622/jetty-io-9.4.48.v20220622.jar
    wget -P lib https://repo1.maven.org/maven2/org/eclipse/jetty/jetty-webapp/9.4.48.v20220622/jetty-webapp-9.4.48.v20220622.jar
    wget -P lib https://repo1.maven.org/maven2/org/eclipse/jetty/jetty-servlet/9.4.48.v20220622/jetty-servlet-9.4.48.v20220622.jar
)

REM Configurando o CLASSPATH
setlocal EnableDelayedExpansion
set CLASSPATH=.
for %%i in (lib\*.jar) do set CLASSPATH=!CLASSPATH!;%%i

REM Compilando o código-fonte com codificação UTF-8
echo Compilando código-fonte...
javac -encoding UTF-8 -d classes -cp "%CLASSPATH%" src\main\java\com\libraey\api\models\*.java
javac -encoding UTF-8 -d classes -cp "%CLASSPATH%;classes" src\main\java\com\libraey\api\services\*.java
javac -encoding UTF-8 -d classes -cp "%CLASSPATH%;classes" src\main\java\com\libraey\api\*.java
javac -encoding UTF-8 -d classes -cp "%CLASSPATH%;classes" src\main\java\com\libraey\api\standalone\*.java

REM Verificando se a compilação foi bem-sucedida
if %ERRORLEVEL% NEQ 0 (
    echo Erro na compilação. Verifique os erros acima.
    exit /b 1
)

REM Executando a aplicação
echo Iniciando a API na porta 4567...
java -cp "classes;%CLASSPATH%" com.libraey.api.standalone.Main

echo API encerrada. 