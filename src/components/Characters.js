export const windgapCharacters = [];

export function getCharacterForSubject(subjectId) {
	const characters = {
		language: { name: "Lana", avatar: "🦉" },
		literacy: { name: "Leo", avatar: "🦁" },
		numeracy: { name: "Nia", avatar: "🐧" },
		digital: { name: "Dex", avatar: "🦊" },
		independence: { name: "Indy", avatar: "🐨" }
	};
	return characters[subjectId] || { name: "Guide", avatar: "👤" };
}
