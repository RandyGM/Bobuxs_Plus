//Server.js
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Ruta para el registro de usuarios
app.post('/api/insert', async (req, res) => {
    const data = req.body;

    try {
        const response = await fetch('https://us-west-2.aws.data.mongodb-api.com/app/data-qoxmmip/endpoint/data/v1/action/insertOne', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': 'KI8H0DBcDC6RY19f1xttZK95Z5G0kSruYROkhmCAW0UXXjLxWEy0eINJobXzTTP2'
            },
            body: JSON.stringify({
                dataSource: 'database',
                database: 'DB',
                collection: 'Users',
                document: data
            })
        });

        const result = await response.json();
        res.json(result);
    } catch (error) {
        console.error('Error al enviar datos:', error);
        res.status(500).json({ error: 'Error al enviar datos' });
    }
});

// Ruta para el inicio de sesión
app.post('/api/login', async (req, res) => {
    const { name, password } = req.body;

    try {
        const response = await fetch('https://us-west-2.aws.data.mongodb-api.com/app/data-qoxmmip/endpoint/data/v1/action/findOne', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': 'KI8H0DBcDC6RY19f1xttZK95Z5G0kSruYROkhmCAW0UXXjLxWEy0eINJobXzTTP2'
            },
            body: JSON.stringify({
                dataSource: 'database',
                database: 'DB',
                collection: 'Users',
                filter: { name }
            })
        });

        const result = await response.json();
        const user = result.document;

        if (user && user.password === password) {
            res.json({
                message: 'Inicio de sesión exitoso',
                tickets: user.tickets // Asegúrate de enviar los tickets correctamente
            });
        } else {
            res.status(401).json({ error: 'Nombre o contraseña incorrectos' });
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// Ruta para actualizar los tickets del usuario
app.post('/api/updateTickets', async (req, res) => {
    const { name, tickets } = req.body;

    try {
        const response = await fetch('https://us-west-2.aws.data.mongodb-api.com/app/data-qoxmmip/endpoint/data/v1/action/updateOne', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': 'KI8H0DBcDC6RY19f1xttZK95Z5G0kSruYROkhmCAW0UXXjLxWEy0eINJobXzTTP2'
            },
            body: JSON.stringify({
                dataSource: 'database',
                database: 'DB',
                collection: 'Users',
                filter: { name: name },
                update: {
                    $set: { tickets: tickets }
                }
            })
        });

        const result = await response.json();
        res.json(result);
    } catch (error) {
        console.error('Error al actualizar los tickets:', error);
        res.status(500).json({ error: 'Error al actualizar los tickets' });
    }
    
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});