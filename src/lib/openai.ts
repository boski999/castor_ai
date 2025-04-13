import OpenAI from 'openai';

// Cette valeur sera remplacée par la vraie clé lors du déploiement
// Pour le prototype, nous utilisons une valeur fictive
const apiKey = process.env.OPENAI_API_KEY || 'your-openai-api-key';

export const openai = new OpenAI({
  apiKey: apiKey,
});

export async function generateStory(
  childName: string,
  childAge: number,
  childGender: string,
  childAppearance: string,
  childInterests: string[],
  childPersonality: string[],
  theme: string,
  pageCount: number = 12
) {
  try {
    const prompt = `Tu es un auteur expert en littérature jeunesse, spécialisé dans la création d'histoires personnalisées pour les enfants âgés de 3 à 10 ans. Ta mission est de créer une histoire captivante et adaptée à l'âge où l'enfant est le héros de l'aventure.

INFORMATIONS SUR L'ENFANT :
- Prénom : ${childName}
- Âge : ${childAge} ans
- Genre : ${childGender}
- Apparence : ${childAppearance}
- Centres d'intérêt : ${childInterests.join(', ')}
- Traits de personnalité : ${childPersonality.join(', ')}

THÈME DE L'HISTOIRE : ${theme}

PARAMÈTRES DE L'HISTOIRE :
- Niveau de lecture : adapté à un enfant de ${childAge} ans
- Longueur : ${pageCount} pages (environ 100-150 mots par page)
- Ton : chaleureux, encourageant et légèrement humoristique
- Structure : introduction claire, développement avec un petit défi à surmonter, conclusion positive

CONSIGNES IMPORTANTES :
1. L'enfant doit toujours être le personnage principal et le héros de l'histoire
2. Intègre naturellement ses centres d'intérêt dans l'intrigue
3. Utilise son prénom régulièrement mais sans excès (environ 1-2 fois par page)
4. Inclus des descriptions qui correspondent à son apparence physique
5. Adapte le vocabulaire et la complexité des phrases à son âge
6. Évite tout contenu effrayant, violent ou inapproprié
7. Termine l'histoire sur une note positive et valorisante
8. Divise clairement l'histoire en ${pageCount} sections, chacune représentant une page
9. Chaque section doit être conçue pour s'accompagner d'une illustration
10. Inclus une brève description de l'illustration qui devrait accompagner chaque page

FORMAT DE SORTIE :
Titre : [Titre créatif incluant le prénom de l'enfant]

Page 1 : [Texte de la page 1]
Description illustration : [Brève description de l'illustration pour cette page]

Page 2 : [Texte de la page 2]
Description illustration : [Brève description de l'illustration pour cette page]

[Et ainsi de suite pour chaque page]`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Tu es un auteur expert en littérature jeunesse." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Erreur lors de la génération de l\'histoire:', error);
    throw error;
  }
}

export async function generateIllustration(
  childName: string,
  childAge: number,
  childGender: string,
  childAppearance: string,
  sceneDescription: string,
  style: string = "aquarelle douce"
) {
  try {
    const prompt = `Illustration pour un livre pour enfants. 
    
Un enfant nommé ${childName}, ${childAge} ans, ${childGender}, avec ${childAppearance}.

Scène: ${sceneDescription}

Style: ${style}, couleurs vives, adapté aux enfants, format carré.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    return response.data[0].url;
  } catch (error) {
    console.error('Erreur lors de la génération de l\'illustration:', error);
    throw error;
  }
}
