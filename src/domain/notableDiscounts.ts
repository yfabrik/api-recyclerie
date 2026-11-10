import type { PromotionType } from "../enums/index.js";

/** A whole-transaction discount the sales analytics page details on its own. */
export type NotableDiscount = {
  type: PromotionType;
  value: number;
  label: string;
};

/**
 * The whole-transaction discounts detailed one by one on the sales analytics
 * page; every other one is grouped under "Autres". Adding one is one entry.
 * Matched on type + value, like the till closing report (`BilanCaissePrint`),
 * which keeps its own rule.
 */
export const NOTABLE_DISCOUNTS = [
  { type: "percent", value: 40, label: "40 %" },
  { type: "fixed", value: 5, label: "5 €" },
] as const satisfies readonly NotableDiscount[];

export type NotableDiscountKey = `${PromotionType}-${number}`;
/** A notable discount, or "other" for every other whole-transaction discount. */
export type WholeTransactionDiscountKey = NotableDiscountKey | "other";

const notableDiscountKey = (discount: Pick<NotableDiscount, "type" | "value">) =>
  `${discount.type}-${discount.value}` satisfies NotableDiscountKey;

/** Every whole-transaction discount falls in one group: a notable one, in order, then "Autres". */
export const WHOLE_TRANSACTION_DISCOUNT_GROUPS: readonly {
  key: WholeTransactionDiscountKey;
  label: string;
}[] = [
  ...NOTABLE_DISCOUNTS.map((discount) => ({
    key: notableDiscountKey(discount),
    label: discount.label,
  })),
  { key: "other", label: "Autres" },
];

/**
 * A Sale's whole-transaction discount as stored (`TransactionGlobalPromotion`
 * row, or the `global_promotion` virtuals): `value` is a DECIMAL string on MariaDB.
 */
export type StoredWholeTransactionDiscount = {
  type?: PromotionType | null;
  value?: number | string | null;
};

/**
 * The group of a Sale's whole-transaction discount, or null when it has none
 * (no promotion, or a value of 0). Same rule as the till closing report: a
 * missing type counts as a percent, then type + value must both match.
 */
export const wholeTransactionDiscountKey = (
  discount: StoredWholeTransactionDiscount | null | undefined,
): WholeTransactionDiscountKey | null => {
  const value = Number(discount?.value ?? 0);
  if (!(value > 0)) return null;
  const type = discount?.type ?? "percent";
  const notable = NOTABLE_DISCOUNTS.find(
    (candidate) => candidate.type === type && candidate.value === value,
  );
  return notable ? notableDiscountKey(notable) : "other";
};
