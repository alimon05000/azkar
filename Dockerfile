FROM eclipse-temurin:17-jdk

WORKDIR /server

# Установка PaperMC 1.20.1 (последний билд на момент проверки)
RUN wget https://api.papermc.io/v2/projects/paper/versions/1.20.1/builds/196/downloads/paper-1.20.1-196.jar -O paper.jar

# Создаем папку для плагинов
RUN mkdir plugins

# Скачиваем BedWars (проверь, поддерживает ли он 1.20.1!)
RUN wget -O plugins/BedWars.jar https://dev.bukkit.org/projects/bedwars/files/4633979/download  # Версия для 1.20.1 (если есть)

# Дополнительные плагины (по желанию)
RUN wget -O plugins/WorldEdit.jar https://dev.bukkit.org/projects/worldedit/files/4633978/download  # WorldEdit для 1.20.1

# Соглашение с EULA
RUN echo "eula=true" > eula.txt

# Запуск сервера (1 ГБ RAM для теста, можно увеличить)
CMD ["java", "-Xmx1G", "-Xms1G", "-jar", "paper.jar", "--nogui"]
