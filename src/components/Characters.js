// Windgap Academy Character definitions
export const windgapCharacters = {
  lana: { name: "Lana", avatar: "🦉", subject: "language", role: "Language Guide" },
  leo: { name: "Leo", avatar: "🦁", subject: "literacy", role: "Literacy Champion" },
  nia: { name: "Nia", avatar: "🐧", subject: "numeracy", role: "Numeracy Expert" },
  dex: { name: "Dex", avatar: "🦊", subject: "digital", role: "Digital Explorer" },
  indy: { name: "Indy", avatar: "🐨", subject: "independence", role: "Independence Coach" },
  daisy: { name: "Daisy", avatar: "🌼", subject: "general", role: "Student President" },
  winnie: { name: "Winnie", avatar: "🐻", subject: "general", role: "AI Mentor" },
  andy: { name: "Andy", avatar: "👨‍💼", subject: "general", role: "Chancellor" },
  natalie: { name: "Natalie", avatar: "👩‍🏫", subject: "general", role: "Head of Education" },
};

export function getCharacterForSubject(subjectId) {
  const characters = {
    language: { name: "Lana", avatar: "🦉" },
    literacy: { name: "Leo", avatar: "🦁" },
    numeracy: { name: "Nia", avatar: "🐧" },
    digital: { name: "Dex", avatar: "🦊" },
    independence: { name: "Indy", avatar: "🐨" },
  };
  return characters[subjectId] || { name: "Guide", avatar: "👤" };
}

export function getCharacterByName(name) {
  return (
    Object.values(windgapCharacters).find((c) => c.name.toLowerCase() === name.toLowerCase()) ||
    null
  );
}

export default windgapCharacters;
