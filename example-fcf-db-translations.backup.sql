-- MySQL dump 10.13  Distrib 8.0.20, for Linux (x86_64)
--
-- Host: localhost    Database: example-fcf-db-translations
-- ------------------------------------------------------
-- Server version	8.0.20-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `example-fcf-db-translations`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `example-fcf-db-translations` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `example-fcf-db-translations`;

--
-- Table structure for table `fcf_variables`
--

DROP TABLE IF EXISTS `fcf_variables`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fcf_variables` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `package` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `value` text COLLATE utf8_unicode_ci,
  `description` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fcf_variables`
--

LOCK TABLES `fcf_variables` WRITE;
/*!40000 ALTER TABLE `fcf_variables` DISABLE KEYS */;
INSERT INTO `fcf_variables` VALUES (1,'fcf','installModules','[\"fcf\",\"fcfStyles\",\"fcfControls\",\"fcfDBControls\",\"fcfManagement\",\"managementTheme\",\"defaultTheme\",\"semanticUITheme\",\"bootstrapTheme\"]','Array of installed packages in the system'),(2,'fcf','languages','{\"en\":\"English\",\"ru\":\"Russian\"}','List of available languages'),(3,'fcf','defaultLanguage','en','Default language'),(4,'fcf','translations-files','[{\"name\":\"en\",\"path\":\"fcf:translations/en\",\"status\":1,\"editable\":false},{\"name\":\"ru\",\"path\":\"fcf:translations/ru\",\"status\":1,\"editable\":false},{\"name\":\"ru\",\"path\":\":translations/ru\",\"status\":1,\"editable\":true},{\"name\":\"en\",\"path\":\":translations/en\",\"status\":1,\"editable\":true}]','Information about translation files'),(5,'fcf','translations-words','{}','Words to translate'),(6,'fcf','languageIdentification','{\"byPrefix\":true,\"byCookie\":true,\"byParameter\":false,\"parameter\":\"language\",\"byHTTP\":true}','Methods for determining the language'),(7,'fcf','editTranslations','{\"en\":\":translations/en\"}','Editable translation files');
/*!40000 ALTER TABLE `fcf_variables` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fcftranslate__page`
--

DROP TABLE IF EXISTS `fcftranslate__page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fcftranslate__page` (
  `stub_29548` varchar(1) COLLATE utf8_unicode_ci DEFAULT NULL,
  `fcftranslate__language` varchar(2) COLLATE utf8_unicode_ci DEFAULT NULL,
  `id` bigint DEFAULT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8_unicode_ci,
  `fcftranslate__key` bigint NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`fcftranslate__key`),
  UNIQUE KEY `fcftranslate__key` (`fcftranslate__key`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fcftranslate__page`
--

LOCK TABLES `fcftranslate__page` WRITE;
/*!40000 ALTER TABLE `fcftranslate__page` DISABLE KEYS */;
INSERT INTO `fcftranslate__page` VALUES (NULL,'ru',1,'FCF - Full stack javascript framework','Описание проекта','<p>FCF - Full stack javascript framework. Данный проект пишется уже давно - больше года, все на добровольных началах, но до его окончания осталось около полу года</p>\n\n<p>Проект доступен по адресу <a href=\"https://github.com/fcfdev/fcf\">https://github.com/fcfdev/fcf</a></p>\n\n<p>Основные отличия FCF:</p>\n\n<p>Основан на технологии NODEJS<p>\n\n<p>Он полностью основан на шаблонах, при этом шаблоны являются \"Живыми\", т.е. имею собственные динамические параметры и wrapper на клиенте браузера.</p>\n\n<p>Работает через реляционную базу данных не на прямую, а через проекции на данные и язык FSQL, что позволяет объединят несколько таблиц в одну и консолидировать данные подобно объектно-ориентированным БД.</p>\n\n<p>Встроенная многоязычность.</p>\n\n<p>Имеется встроенный механизм функционала CRON</p>\n\n<p>Поддерживается серверный режим запуска нескольких экземпляров приложения.</p>\n\n<p>На текущий момент ведется доработка ядра:</p>\n\n<p>В планах дописать систему авторизации; Создать сайт на базе FCF с документацией и примерами;</p>\n\n<p>Данный проект призван упростить WEB разработку приложений самых разных уровней сложности.</p>\n\n<p>Запуск проекта под линукс:</p>\n<code><pre>\n1) $ cd /opt\n\n2) $ sudo git clone https://github.com/fcfdev/fcf\n</pre></code>\n\n<p>3) Добавьте /opt/fcf в переменную окружения ${PATH}</p>\n\n4) Создание пустого проекта:\n<code><pre>\n$ cd ~\n$ fcfmngr create project test-project\n<code></pre>\n\n<p>5) Создание базудынных MYSQL:</p>\n\n<p>Пользователь редактирующий БД должен иметь включенным плагин mysql_native_password</p>\n\n<p>SQL> ALTER USER \'root\'@\'localhost\' IDENTIFIED WITH mysql_native_password BY \'test\';</p>\n\n<p>$ fcfmngr create-db ./test-project.js</p>\n\n<p>6) И запустите проект, он будет доступен по адресу localhost:8080</p>\n\n<p>$ fcfnode ./test-project.js</p>\n\n<p>Или запустите проект в серверном режиме. Запуск произойдет от пользователя www-data. Файлы проекта должны быть доступны данному пользователю. Адрес: localhost</p>\n<p><b>Запуск необходимо выполнять от супер пользователя, т.к. порт 80 доступен только root.</b></p>\n<p>$ fcfserver ./server.json</p>\n',1);
/*!40000 ALTER TABLE `fcftranslate__page` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `page`
--

DROP TABLE IF EXISTS `page`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `page` (
  `stub_29548` varchar(1) COLLATE utf8_unicode_ci DEFAULT NULL,
  `alias` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `description` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8_unicode_ci,
  `id` bigint NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `page`
--

LOCK TABLES `page` WRITE;
/*!40000 ALTER TABLE `page` DISABLE KEYS */;
INSERT INTO `page` VALUES (NULL,'main','FCF - Full stack javascript framework','Project description','<p>FCF - Full stack javascript framework This project has been written for a long time - more than a year, all on a voluntary basis, but there are about six months left before its completion.</p>\n\n<p>The project is available at <a href=\"https://github.com/fcfdev/fcf\">https://github.com/fcfdev/fcf</a></p>\n\n<p>The main differences between FCF:</p>\n\n<p>Based on NODEJS technology It is completely based on templates, and the templates are \"Live\", i.e. I have my own dynamic parameters and wrapper on the browser client.</p>\n\n<p>It works through a relational database not directly, but through projections to data and the SQL language, which allows you to combine multiple tables into one and consolidate data like object-oriented databases. Built-in multilingualism.</p>\n\n<p>There is a built-in mechanism for CRON functionality</p>\n\n<p>Server mode for running multiple instances of the app is supported.</p>\n\n<p>The core is currently being finalized: We plan to add an authorization system; Create a website based on FCF with documentation and examples;</p>\n\n<p>This project is designed to simplify WEB development of applications of various levels of complexity.</p>\n\n<p>Run project for linux: </p>\n<p>1) $ cd /opt</p>\n\n<p>2) $ sudo git clone https://github.com/fcfdev/fcf</p>\n\n<p>3) Append /opt/fcf to environment ${PATH}</p>\n\n<p>4) Create empty project:</p>\n\n<p>$ cd ~</p>\n\n<p>$ fcfmngr create project test-project</p>\n<p>5) Create database MYSQL:</p>\n\n<p>A mysql_native_password must be enabled for the user editing the database</p>\n\n<p>SQL> ALTER USER \'root\'@\'localhost\' IDENTIFIED WITH mysql_native_password BY \'test\';</p>\n\n<p>$ fcfmngr create-db ./test-project.js\n</p>\n\n<p>6) And launch the project, which will be available at localhost:8080</p>\n\n<p>fcfnode ./test-project.js</p>\n\n<p>Or run the project in server mode. The launch will occur from the www-data user. Project files must be available to this user. Address: localhost</p>\n\n<p><b>You must run from the superuser, because port 80 is only available to root.</b></p>\n\n<p>$ fcfserver ./server.json</p>\n',1);
/*!40000 ALTER TABLE `page` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-07-08 10:09:43
