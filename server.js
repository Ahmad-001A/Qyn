const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();

// Настроим Body-parser для обработки данных
app.use(bodyParser.json());  // Для обработки JSON
app.use(bodyParser.urlencoded({ extended: true })); // Для обработки URL-encoded данных

// Настроим папку для статических файлов (например, CSS, изображения)
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname));  // Указываем текущую директорию как директорию для шаблонов
app.set('view engine', 'ejs');  // Указываем EJS как шаблонизатор


// Путь для главной страницы, которая будет показывать все сохраненные данные
app.get('/', (req, res) => {
    // Проверяем, существует ли файл data.txt
    fs.exists('data.txt', (exists) => {
        if (!exists) {
            // Если файла нет, создаем пустой файл
            fs.writeFile('data.txt', '', (err) => {
                if (err) {
                    return res.status(500).send('Ошибка при создании файла.');
                }
                // Если файл успешно создан, читаем его
                res.render('index', { savedData: '' });
            });
        } else {
            // Если файл существует, читаем его
            fs.readFile('data.txt', 'utf8', (err, data) => {
                if (err) {
                    return res.status(500).send('Ошибка при чтении данных.');
                }
                // Отправляем данные в шаблон для отображения
                res.render('index', { savedData: data });
            });
        }
    });
});

// Путь для получения данных от клиента и сохранения их
app.post('/submit', (req, res) => {
    const data = req.body.data;  // Получаем данные из POST-запроса

    // Сохраняем данные в файл
    fs.appendFile('data.txt', `${new Date().toISOString()} - ${data}\n`, (err) => {
        if (err) {
            return res.status(500).send('Ошибка при сохранении данных.');
        }
        // После успешного сохранения, редиректим обратно на главную страницу
        res.status(200).send('Данные успешно получены и сохранены!');
    });
});

// Запускаем сервер на порту 3000
app.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});

