import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini client server-side
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Endpoint to generate an educational RPG quest with Gemini
app.post('/api/generate-quest', async (req: Request, res: Response) => {
  const { topic, difficulty, schoolGrade, notes } = req.body;

  if (!topic && !notes) {
    return res.status(400).json({ error: 'Un sujet ou des notes sont requis' });
  }

  if (!ai) {
    return res.status(503).json({
      error: 'Clé API Gemini non configurée sur le serveur. Utilisation du mode hors-ligne.',
      useFallback: true,
    });
  }

  try {
    const prompt = `Crée un chantier de révision sous forme d'épreuve d'architecture éducative en français pour une élève de niveau "${schoolGrade || 'Collège (6e - 3e)'}" sur le sujet: "${topic || 'Notes fournies'}".
${notes ? `Notes de cours de l'élève:\n${notes.slice(0, 3000)}` : ''}

Donne 4 ou 5 questions d'apprentissage pédagogiques progressives (QCM à 4 choix, 1 seule bonne réponse exacte).
Chaque question réussie permet de poser une pierre ou un ornement du nouveau monument et apporte une explication claire et encourageante.
Le format doit être un objet JSON valide conforme au schéma demandé.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction:
          'Tu es la Grande Architecte et Conservatrice de StudyQuest, un jeu d’édification de cités scolaires où chaque ville correspond à une matière (Français, SVT/Sciences, Maths, Histoire/Géo, Langues, Informatique). Tu crées des questions rigoureuses, stimulantes, bienveillantes et divertissantes avec des explications instructives pour chaque bonne réponse.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: 'Titre poétique du chantier (ex: Le Pavillon des Mots Fleuris)' },
            subject: { type: Type.STRING, description: 'Discipline scolaire concernée (Maths, Sciences, Histoire, Français, Anglais, etc.)' },
            monsterName: { type: Type.STRING, description: 'Nom thématique du monument ou du guide d’édification' },
            lore: { type: Type.STRING, description: 'Courte introduction narrative inspirante en 2 phrases' },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING, description: 'La question posée' },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: '4 choix distincts et pertinents',
                  },
                  correctIndex: { type: Type.INTEGER, description: 'Index de la bonne réponse (0, 1, 2 ou 3)' },
                  hint: { type: Type.STRING, description: 'Un indice subtil si le joueur utilise un sort' },
                  explanation: { type: Type.STRING, description: 'Explication didactique claire du concept' },
                  xp: { type: Type.INTEGER, description: 'Points d’XP gagnés (ex: 40)' },
                },
                required: ['id', 'question', 'options', 'correctIndex', 'hint', 'explanation', 'xp'],
              },
            },
          },
          required: ['title', 'subject', 'monsterName', 'lore', 'questions'],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Réponse vide du modèle');
    }

    const questData = JSON.parse(text);
    return res.json(questData);
  } catch (err: any) {
    console.error('Erreur de génération Gemini:', err);
    return res.status(500).json({
      error: err.message || 'Erreur lors de la génération de la quête',
      useFallback: true,
    });
  }
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`StudyQuest server running on port ${PORT}`);
  });
}

startServer();
