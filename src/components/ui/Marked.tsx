/**
 * Text mit einem „angerissenen“ Schlüsselwort: Unter dem Wort zieht sich ein Bleistiftstrich in Accent,
 * sobald die Überschrift im Bild ist (PageMotion setzt .is-marked an der Überschrift). Ohne JS bzw. bei
 * reduzierter Bewegung steht der Strich sofort.
 */
export function Marked({ text, mark }: { text: string; mark?: string }) {
  const i = mark ? text.indexOf(mark) : -1;
  if (!mark || i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span data-mark>{mark}</span>
      {text.slice(i + mark.length)}
    </>
  );
}
