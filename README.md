# rabbitMQ
Взаимодействие двух микросервисов через брокер rabbitMQ<br />
Микросервис М2 получает от Микросервиса М1 JSON, и возвращает объект, кобразованный от этого JSON в котором каждое поле написано задом на перёд <br />

Для того чтобы запустить этот проект требуется в корне проекта прописать комманду <strong>docker-compose up -d</strong>. Далее после 6-10 попытки подключения микросервисы все же подключасться к rabbitmq и и об этом станет известно после того как в терминалах контейнеров микросервисов появится строка <strong> *название микросервиса* подключен к брокеру</strong><br />
Для того чтобы подать микросервису М1 JSON требуется отправить JSON POST запросом с помощью утилиты CURL или другим образом <strong> curl -X POST http://localhost:1337/ -H "Content-Type: application/json" -d "*JSON*"</strong><br />
При получении сервисом М2 данных от М1 и rabbitMQ в терминале контейнера М2 появится запись <strong> Значение поля *названия поля* было заменено с *старое значения поля* на *новое значения поля* </strong><br />
Например:  curl -X POST http://localhost:1337/ -H "Content-Type: application/json" -d "{"name":"Alex","job":"Driver"}"<br /><br />

Автор - Форостин Максим Леонидович
