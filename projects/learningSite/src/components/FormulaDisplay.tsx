import { Math } from "./Math";
import type { Formula } from "@/schema";
import type { Locale } from "@/i18n/locales";
import { formatUnitName } from "@/lib/units/registry";

export function FormulaDisplay({ formula, locale }: { formula: Formula; locale: Locale }) {
  return (
    <div>
      <Math tex={formula.latex} display />
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Unit</th>
          </tr>
        </thead>
        <tbody>
          {formula.symbols.map((symbol) => (
            <tr key={symbol.symbol}>
              <td>
                <Math tex={symbol.symbol} />
              </td>
              <td>{symbol.name[locale]}</td>
              <td>
                {symbol.unit} ({formatUnitName(symbol.unit, locale)})
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
