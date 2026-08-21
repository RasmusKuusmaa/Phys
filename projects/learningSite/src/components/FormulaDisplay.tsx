import { Math } from "./Math";
import type { Formula } from "@/schema";
import type { Locale } from "@/i18n/locales";
import { formatUnitName } from "@/lib/units/registry";

export function FormulaDisplay({ formula, locale }: { formula: Formula; locale: Locale }) {
  return (
    <div>
      <Math tex={formula.latex} display />
      <table className="mt-4 w-full border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border text-muted">
            <th className="py-2 pr-4 font-medium">Symbol</th>
            <th className="py-2 pr-4 font-medium">Name</th>
            <th className="py-2 pr-4 font-medium">Unit</th>
          </tr>
        </thead>
        <tbody>
          {formula.symbols.map((symbol) => (
            <tr key={symbol.symbol} className="border-b border-border">
              <td className="py-2 pr-4">
                <Math tex={symbol.symbol} />
              </td>
              <td className="py-2 pr-4">{symbol.name[locale]}</td>
              <td className="py-2 pr-4">
                {symbol.unit} ({formatUnitName(symbol.unit, locale)})
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
