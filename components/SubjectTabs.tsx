type SubjectTabsProps = {
  subjects: string[];
  current?: string;
  onSelect?: (s: string) => void;
};

export default function SubjectTabs({ subjects, current, onSelect }: SubjectTabsProps) {
  return (
    <div role="tablist" aria-label="Subjects" className="flex gap-2">
      {subjects.map((s) => (
        <button
          key={s}
          role="tab"
          aria-selected={current === s}
          onClick={() => onSelect && onSelect(s)}
          className={`px-3 py-1 rounded ${current === s ? "bg-[#A32C2B] text-white" : "bg-white text-black"}`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
