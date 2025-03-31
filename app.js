import express, { json } from 'express';
import {dbAll, initializeDatabase, dbGet, dbRun} from './Util/database.js';

const app = express();
app.use(express.json());

app.use((req, res, next, err) => {
    if(err)
        res.status(500).json({message: 'Error: ${err.message}'});
})

app.get('/wizzards', async (req, res) => {
    const wizzards = await dbAll('SELECT * FROM wizzards');
    res.status(200).json(wizzards);
})

app.get('/wizzards/:id', async (req, res) => {
    const id = req.params.id;
    const wizzard = await dbGet('SELECT * FROM wizzards WHERE id = ?', [id]);
    if(!wizzard)
        return res.status(404).json({message: 'Wizzard not found'});
    res.status(200).json(wizzard);
})

app.post('/wizzards', async (req, res) => {
    const {name, magicWandName, houseName} = req.body;
    if(!name || !magicWandName || !houseName)
        return res.status(400).json({message: 'Name and magic wand name and house name are required'});

    const result = await dbRun('INSERT INTO wizzards (name, magicWandName, houseName) VALUES (?, ?, ?)', [name, magicWandName, houseName]);
    res.status(201),json({id: result.lastID, name, magicWandName, houseName});
});

app.put('/wizzards/:id', async (req, res) => {
    const id = req.params.id;
    const wizzard = await dbGet('SELECT * FROM wizzards WHERE id = ?', [id]);
    if(!wizzard) 
        return res.status(404).json({message: 'Wizzard not found'});

    const {name, magicWandName, houseName} = req.body;
    if(!name || !magicWandName || !houseName)
        return res.status(400).json({message: 'Name and magic wand name and house name are required'});

    await dbRun('UPDATE wizzards SET name = ?, magicWandName = ?, houseName = ? WHERE id = ?', [name, magicWandName, houseName, id]);
    res.status(200).json({id: +id, name, magicWandName, houseName});
});

app.delete('/wizzards/:id', async (req, res) => {
    const id = req.params.id;
    const wizzard = await dbGet('SELECT * FROM wizzards WHERE id = ?', [id]);
    if(!wizzard)
        return res.status(404).json({message: 'Wizzard not found'});
    await dbRun('DELETE FROM wizzards WHERE id = ?', [id]);
    res.status(200).json({message: 'Wizzard deleted'});
});

async function startServer() {
    await initializeDatabase();
    app.listen(3000, ()=>
        {
            console.log('Server is running on port 3000');
        })
}

await startServer();