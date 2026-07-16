import type { PaymentMethod, TransactionType } from "../enums/index.js";

export type CartLine = {
  quantity: number;
  price: number;
  promotion?: number | null;
  bundlePrice?: number | null;
  bundleQuantity?: number | null;
};
export type GlobalPromotionInput = {
  type: "percent" | "fixed";
  value: number;
};

export const getCartLinePrice = (line: CartLine): number => {
  let bundles = 0;
  let extraItems = line.quantity;
  if (line.bundleQuantity && line.bundleQuantity !== 0) {
    bundles = Math.trunc(line.quantity / line.bundleQuantity);
    extraItems = line.quantity % line.bundleQuantity;
  }
  const sum = (price: number, quantity: number) =>
    price * quantity * (1 - (line.promotion ?? 0) / 100);
  return (
    sum(line.price, extraItems) + sum(line.bundlePrice || line.price, bundles)
  );
};

export const getCartTotal = (cart: CartLine[]) => {
  return cart.reduce(
    (prev, current) =>
    (prev +=
      getCartLinePrice(current)),
    0,
  );
};

export const getGlobalPromotionDiscount = (
  subtotal: number,
  promotion?: GlobalPromotionInput | null,
) => {
  if (!promotion) return 0;
  const normalizedValue = Math.max(Number(promotion.value) || 0, 0);
  const discount =
    promotion.type === "percent"
      ? subtotal * (Math.min(normalizedValue, 100) / 100)
      : normalizedValue;
  return Math.min(discount, subtotal);
};

export const getCartTotalWithGlobalPromotion = (
  cart: CartLine[],
  promotion?: GlobalPromotionInput | null,
) => {
  const subtotal = getCartTotal(cart);
  const discount = getGlobalPromotionDiscount(subtotal, promotion);
  return Math.max(subtotal - discount, 0);
};

// export const toAmount = (value?: number | string | null) =>
//   Number.parseFloat(String(value ?? 0));

export const amountsEqual = (a: number, b: number) =>
  Math.abs(roundCurrency(a) - roundCurrency(b)) < 0.01;


export const computeTotalAfterPromotion = (
  before: number,
  promotion: number | null | undefined,
  type: "percent" | "fixed" | null | undefined,
) => {
  const subtotal = Number(before);
  const discount = getGlobalPromotionDiscount(subtotal, {
    value: promotion ?? 0,
    type: type ?? "fixed",
  });
  return Math.max(subtotal - discount, 0);
};

//TODO the fuck is this?
/**
 * Round to EUR cents (same precision as {@link formatCurrency}).
 * Use for payment comparisons and amounts shown to the cashier — not for cart math or API payloads.
 */
export const roundCurrency = (amount: number) => {
  // return Number((amount || 0).toFixed(2));
  return Math.round((amount || 0) * 100) / 100;
  const parts = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).formatToParts(amount || 0);
  let normalized = "";
  for (const part of parts) {
    if (part.type === "integer" || part.type === "group") {
      normalized += part.value.replace(/\s/g, "");
    } else if (part.type === "decimal") {
      normalized += ".";
    } else if (part.type === "fraction") {
      normalized += part.value;
    }
  }
  return Number(normalized) || 0;
};

/** Compare paid vs due at cent precision (avoids float noise blocking checkout). */
export const isPaymentInsufficient = (totalPaid: number, cartTotal: number) =>
  roundCurrency(totalPaid) < roundCurrency(cartTotal);

export const isAmountEqual = (a: number, b: number) =>
  Math.abs(roundCurrency(a) - roundCurrency(b)) === 0;

type Category = {
  Promotions: {
    promotionValue: number;
  }[];
}

type CashInTransaction = {
  payment_method: PaymentMethod;
  transactionType: TransactionType;
  total_amount: number;
  payments?: Array<{ method: PaymentMethod; amount: number }>;
};
export const sumPromoCategorie = (categorie?: Category) => {
  return categorie?.Promotions?.reduce((prev, current) => prev += current.promotionValue, 0) || 0
}
//same calcul in backend
export const sumCashInPayments = (transactions: CashInTransaction[], openingAmount: number = 0) => {
  return transactions.reduce((prev, current) => {
    if (current.payment_method == "cash")
      return current.transactionType == "sell" ?
        prev + current.total_amount :
        prev - current.total_amount
    if (!current.payments || current.payments.filter(payment => payment.method == "cash").length == 0)
      return prev

    const cashPayment = current.payments.reduce((acc, pay) => pay.method == "cash" ? acc : acc - pay.amount, current.total_amount)
    return current.transactionType == "sell" ?
      prev + cashPayment :
      prev - cashPayment

  }, openingAmount)

}