import { weddingData } from '@/lib/data';
import { generateRomanticSubtitle } from '@/ai/flows/generate-romantic-subtitle';

export async function RomanticSubtitle() {
  try {
    const { subtitle } = await generateRomanticSubtitle({
      groomName: weddingData.groomName,
      brideName: weddingData.brideName,
    });
    return <p className="font-body text-xl md:text-2xl text-primary mt-4 animate-pulse-slow">{subtitle}</p>;
  } catch (error) {
    console.error("Failed to generate subtitle:", error);
    return <p className="font-body text-xl md:text-2xl text-primary mt-4">Juntos, escrevendo um novo capítulo</p>;
  }
}
