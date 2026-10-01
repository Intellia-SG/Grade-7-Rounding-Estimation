import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config({ path: '.env.local' });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const apiKey = process.env.VITE_ELEVENLABS_API_KEY || 'sk_1477a0b0a31e89b834b1e17ca4468c02a6e8bf554f621c5a';
const voiceId = 'Xb7hH8MSUJpSbSDYk0k2'; // Alice
const audioDir = path.join(__dirname, '../public/assets/audio');

if (!fs.existsSync(audioDir)) {
  fs.mkdirSync(audioDir, { recursive: true });
}

const getElevenLabsSettings = (style) => {
  switch (style) {
    case 'celebration':
      return { stability: 0.12, similarity_boost: 0.45, style: 0.75, use_speaker_boost: true };
    case 'encouragement':
      return { stability: 0.16, similarity_boost: 0.50, style: 0.65, use_speaker_boost: true };
    case 'question':
      return { stability: 0.20, similarity_boost: 0.55, style: 0.55, use_speaker_boost: true };
    case 'emphasis':
      return { stability: 0.16, similarity_boost: 0.50, style: 0.60, use_speaker_boost: true };
    case 'thinking':
      return { stability: 0.24, similarity_boost: 0.60, style: 0.35, use_speaker_boost: true };
    default:
      return { stability: 0.20, similarity_boost: 0.55, style: 0.50, use_speaker_boost: true };
  }
};

const phrases = [
  // Intro Screen
  { text: "Welcome to the Global Estimation Squad!", style: 'encouragement' },
  { text: "Today, we are going to master rounding and estimation across world landmarks.", style: 'statement' },
  { text: "How can rounding help us find quick, reasonable answers without counting every single thing?", style: 'question' },
  { text: "Are you ready to join the squad and explore estimation challenges? Let us get started!", style: 'encouragement' },

  // Wonder Phase
  { text: "42,187 people are at a stadium in Rio de Janeiro. Sarah needs to tell her friend about how many people were there without counting every single one. What should she say?", style: 'thinking' },
  { text: "Forty-two thousand one hundred eighty-seven people are at a stadium in Rio de Janeiro. Sarah needs to tell her friend about how many people were there without counting every single one. What should she say?", style: 'thinking' },
  { text: "When numbers are huge or exact counts take too long, rounding and estimation give us fast, smart answers!", style: 'statement' },
  { text: "Let us discover how rounding and estimation give us real-world superpowers!", style: 'celebration' },

  // Story Phase
  { text: "John, Mike, Sarah, Emma, Liam, Sofia, Noah, Aisha, Carlos, and Yuki form the Global Estimation Squad. They love using smart estimates in everyday life!", style: 'statement' },
  { text: "John, Mike, Sarah, Emma, Liam, Sofia, Noah, Aisha, Carlos, and Yuki form the Global Estimation Squad — using smart rounding & estimation to solve everyday math mysteries in cities around the world!", style: 'statement' },
  { text: "Mike is shopping in New York. His cart shows $18.75, $6.40, and $11.20. About how much will he pay altogether?", style: 'statement' },
  { text: "Mike is shopping in New York. His cart shows eighteen dollars and seventy-five cents, six dollars and forty cents, and eleven dollars and twenty cents. About how much will he pay altogether?", style: 'statement' },
  { text: "Rounding each price to the nearest dollar makes $18.75 about $19, $6.40 about $6, and $11.20 about $11. Nineteen plus six plus eleven is about $36 altogether!", style: 'statement' },
  { text: "Rounding each price to the nearest dollar makes eighteen seventy-five about nineteen dollars, six forty about six dollars, and eleven twenty about eleven dollars. Nineteen plus six plus eleven is about thirty-six dollars!", style: 'statement' },
  { text: "Priya in Mumbai reads that a passenger train has 3,912 seats. She rounds it to the nearest thousand: about 4,000 seats!", style: 'statement' },
  { text: "Priya in Mumbai reads that a passenger train has three thousand nine hundred twelve seats. She rounds it to the nearest thousand: about four thousand seats!", style: 'statement' },
  { text: "Diego checks his math homework: 396 × 21. Using compatible numbers, 400 × 20 = 8,000! His exact answer should be close to that.", style: 'statement' },
  { text: "Diego checks his math homework: three hundred ninety-six times twenty-one. Using compatible numbers, four hundred times twenty equals eight thousand! His exact answer should be close to that.", style: 'statement' },
  { text: "Every city, every receipt, every big calculation: rounding and estimation help us think fast, budget wisely, and check our work!", style: 'celebration' },

  // Simulate Phase
  { text: "Slide the number along the number line. Which benchmark tick is it closest to? Watch the marker snap into place!", style: 'instruction' },
  { text: "Look at the four estimation cards. Tap the cards that show a reasonable estimate for the pictured quantity!", style: 'instruction' },
  { text: "Fill in the missing blank in the estimation equation using the number pad!", style: 'instruction' },
  { text: "Perfect snap! You found the exact benchmark!", style: 'celebration' },
  { text: "42,187 is closer to 42,000 because 187 is less than the halfway mark of 500!", style: 'statement' },
  { text: "3,912 has a 9 in the hundreds place (≥ 500), magnetically snapping up to 4,000!", style: 'statement' },
  { text: "7.86 is closer to 7.90 than 7.80 because the hundredths digit is 6 (≥ 5).", style: 'statement' },
  { text: "19,500 lands exactly on the midpoint (500). Standard mathematical convention rounds UP to 20,000!", style: 'statement' },
  { text: "Great math! You completed the compatible equation!", style: 'celebration' },
  { text: "Spot on! You picked every reasonable estimate!", style: 'celebration' },

  // Practice & Reflect
  { text: "Great job! That estimate is right on target!", style: 'celebration' },
  { text: "Not quite. Let us check the benchmark numbers and try again!", style: 'thinking' },
  { text: "Let us reflect on what we learned! Can you help teach Rounder the core ideas of rounding and estimation?", style: 'thinking' },
  { text: "Spot on! That explains rounding and estimation clearly!", style: 'celebration' },
  { text: "Think about how benchmark numbers help us approximate reasonable values.", style: 'thinking' },
  { text: "How confident do you feel about rounding and estimation? Every answer is great!", style: 'question' },
  { text: "Look closely at the distances from the midpoint.", style: 'thinking' },
  { text: "400 and 20 are super compatible! Mental multiplication takes less than 2 seconds.", style: 'celebration' },
  { text: "400 ÷ 20 = 20 gives an instant sanity check before diving into long division.", style: 'statement' },
  { text: "900 − 400 = 500 lets you immediately verify reasonable change or budget estimates.", style: 'statement' },
  { text: "400 × 20 = 8,000.", style: 'statement' },
  { text: "400 ÷ 20 = 20.", style: 'statement' },
  { text: "$19 + $11 = $30.", style: 'statement' },
  { text: "Incredible! You are on a 5 question streak! Perfect estimate!", style: 'celebration' },
];

async function generate() {
  console.log(`Starting audio generation with voice ID: ${voiceId}`);
  const mapData = {};

  for (let i = 0; i < phrases.length; i++) {
    const { text, style } = phrases[i];
    const safeName = text.toLowerCase().replace(/[^a-z0-9]/g, '_').substring(0, 40);
    const filename = `audio_${safeName}_${i}.mp3`;
    const filepath = path.join(audioDir, filename);

    mapData[text] = `/assets/audio/${filename}`;

    if (fs.existsSync(filepath) && fs.statSync(filepath).size > 1000) {
      console.log(`[${i + 1}/${phrases.length}] Skipping (already exists): ${filename}`);
      continue;
    }

    if (!apiKey) {
      console.log(`No API key provided, recording map key for: ${filename}`);
      continue;
    }

    console.log(`[${i + 1}/${phrases.length}] Fetching from ElevenLabs: "${text.substring(0, 35)}..." -> ${filename}`);
    const settings = getElevenLabsSettings(style);

    try {
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: settings
        })
      });

      if (!res.ok) {
        const errBody = await res.text();
        console.error(`Failed to generate ${filename} (${res.status}): ${errBody}`);
        continue;
      }

      const buffer = await res.arrayBuffer();
      fs.writeFileSync(filepath, Buffer.from(buffer));
      console.log(`✓ Successfully saved: ${filename} (${buffer.byteLength} bytes)`);
    } catch (err) {
      console.error(`Error with ${filename}:`, err.message);
    }

    await new Promise(r => setTimeout(r, 400));
  }

  const mapFile = path.join(__dirname, '../src/utils/audioMap.js');
  fs.writeFileSync(mapFile, `export const audioMap = ${JSON.stringify(mapData, null, 2)};\n`);
  console.log('✓ Successfully wrote audio map to src/utils/audioMap.js');
}

generate();
