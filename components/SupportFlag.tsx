export default function SupportFlag({ needsHelp }: { needsHelp: boolean }) {
  return (
    <p className={`text-sm ${needsHelp ? "text-red-600" : "text-green-600"}`}>
      Needs Support: {needsHelp ? "✅" : "❌"}
    </p>
  );
}
