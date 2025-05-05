export default function ThemeSelector({ value = "default", onChange }) {
  return (
    <select
      className="px-2 py-1 border rounded bg-white text-gray-700"
      value={value}
      onChange={e => onChange && onChange(e.target.value)}
    >
      <option value="default">Default</option>
      <option value="beach">Beach</option>
      <option value="mountains">Mountains</option>
    </select>
  );
}