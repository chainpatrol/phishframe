export function Status({
  status,
  label,
}: {
  status: "ALLOWED" | "BLOCKED" | "UNKNOWN" | "IGNORED";
  label?: string;
}) {
  const color = (() => {
    switch (status) {
      case "ALLOWED":
        return "green";
      case "BLOCKED":
        return "red";
      case "UNKNOWN":
      case "IGNORED":
        return "neutral";
      default:
        return "neutral";
    }
  })();

  return (
    <span
      tw={`bg-${color}-300 text-neutral-800 px-2 py-0.5 text-2xl leading-none font-bold uppercase`}
    >
      {label ?? status}
    </span>
  );
}
