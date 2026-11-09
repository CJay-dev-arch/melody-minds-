/**
 * Melody AI Companion & Educational Song Creator Client Service
 */

export interface CompanionReply {
  reply: string;
  isSimulated: boolean;
  note?: string;
  errorNotice?: string;
}

export interface GeneratedSong {
  title: string;
  tempoBpm: number;
  verse: string;
  chorus: string;
  educationalTip: string;
}

class CompanionService {
  public async askMelody(params: {
    message: string;
    learnerName: string;
    learnerAge: number;
    subject?: string;
    currentTopic?: string;
  }): Promise<CompanionReply> {
    try {
      const res = await fetch('/api/gemini/companion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!res.ok) throw new Error('Companion network response error');
      return await res.json();
    } catch {
      return {
        reply: `You are singing and shining bright, ${params.learnerName}! 🎵 Keep tapping your curiosity! Let's explore more musical magic together! ✨`,
        isSimulated: true,
      };
    }
  }

  public async generateEducationalSong(params: {
    topic: string;
    subject: string;
    style?: string;
    learnerName?: string;
  }): Promise<{ song: GeneratedSong; isSimulated: boolean }> {
    try {
      const res = await fetch('/api/gemini/song-creator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!res.ok) throw new Error('Song creator network response error');
      return await res.json();
    } catch {
      return {
        song: {
          title: `The ${params.topic} Song`,
          tempoBpm: 110,
          verse: `Every question starts a spark,\nLighting wonder in the dark!\n${params.topic} helps us see,\nAll the ways our minds are free!`,
          chorus: `Sing it with me, tap the beat,\nLearning something new and sweet!\nMelody Minds will help you grow,\nThere is so much more to know!`,
          educationalTip: `Music helps your brain remember concepts faster and deeper!`,
        },
        isSimulated: true,
      };
    }
  }
}

export const companionService = new CompanionService();
