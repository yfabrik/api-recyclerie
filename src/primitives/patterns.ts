/** Matches user/recyclery/collectionPoint/donation/ecoOrganism phone validators */
export const FRENCH_PHONE_REGEX =
  /^(0|(\+[0-9]{2}[. -]?))[1-9]([. -]?[0-9][0-9]){4}$/;

/** Matches recyclery/collectionPoint postal_code + sales customer_postal_code */
export const FRENCH_POSTAL_CODE_REGEX =
  /^(?:0[1-9]|[1-8]\d|9[0-8])\d{3}$/;

/** Matches donation.donor_name + collectionPoint.contact_person isAlphanumeric */
export const ALPHANUMERIC_REGEX = /^[a-zA-Z0-9]+$/;

/** Labeled-item virtual barcode: zero-padded numeric id, always 12 digits. */
export const ITEM_BARCODE_REGEX = /^\d{12}$/;
