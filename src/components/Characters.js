Largest Contentful Paint element 1,040 ms
This is the largest contentful element painted within the viewport. Learn more about the Largest Contentful Paint elementLCP
Element
span.text-2xl.font-bold.text-[#A32C2B]
Phase
% of LCP
Timing
TTFB
13%
140 ms
Load Delay
0%
0 ms
Load Time
0%
0 ms
Render Delay
87%
900 ms

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
