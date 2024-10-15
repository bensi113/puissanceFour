import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let scores = { yellow: 0, red: 0 };

app.get('/api/scores', (req, res) => {
    res.json(scores);
});

app.post('/api/scores', (req, res) => {
    const { winner } = req.body;
    if (winner === 'yellow' || winner === 'red') {
        scores[winner]++;
        res.json({ message: `Score mis à jour pour ${winner}` });
    } else {
        res.status(400).json({ message: 'Joueur invalide' });
    }
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});