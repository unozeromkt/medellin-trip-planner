"use client";

export function DestinoSelect({
  destinations,
  current,
  categoria,
}: {
  destinations: string[];
  current: string;
  categoria?: string;
}) {
  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const url = new URL(window.location.href);
    if (e.target.value) {
      url.searchParams.set("destino", e.target.value);
    } else {
      url.searchParams.delete("destino");
    }
    if (categoria) {
      url.searchParams.set("categoria", categoria);
    }
    window.location.href = url.toString();
  }

  return (
    <select
      defaultValue={current}
      onChange={handleChange}
      className="h-9 px-3 rounded-xl border border-[#E2E8ED] bg-white text-sm font-body text-[#0D1B3D] focus:outline-none focus:ring-2 focus:ring-[#2BB7A6]"
    >
      <option value="">Todos los destinos</option>
      {destinations.map((d) => (
        <option key={d} value={d}>
          {d}
        </option>
      ))}
    </select>
  );
}
