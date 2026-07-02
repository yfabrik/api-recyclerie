# @recyclerie/api

Shared API contracts for the recyclerie backend and frontend.

## Install

### From this monorepo (backend)

```json
"@recyclerie/api": "file:./packages/api"
```

### From a separate git repo (frontend / production)

```json
"@recyclerie/api": "git+https://github.com/YOUR_ORG/recyclerie-api.git#v0.1.0"
```

Requires `zod` as a peer dependency (`^4.3.5`).

## Frontend usage

### Request types (inferred from Zod)

```typescript
import {
  loginSchema,
  type LoginBody,
} from "@recyclerie/api/schemas/auth";
import type { ListWasteResponse } from "@recyclerie/api/responses/waste";

type LoginRequest = LoginBody; // or z.infer<typeof loginSchema>

async function login(body: LoginRequest) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json() as Promise<{ message: string; token: string; user: unknown }>;
}

async function listWaste(): Promise<ListWasteResponse> {
  const res = await fetch("/api/waste-disposals");
  return res.json();
}
// ListWasteResponse → { success: true, data: WasteDisposalDto[], pagination }
```

### Optional client-side validation

```typescript
import { wasteBodySchema } from "@recyclerie/api/schemas/waste";

const parsed = wasteBodySchema.safeParse(formValues);
if (!parsed.success) {
  // show parsed.error
}
```

### Enums

```typescript
import { DONATION_STATUSES, type DonationStatus } from "@recyclerie/api/enums";
```

## Backend usage

Controllers import schemas for `parse()` and response types with `satisfies`:

```typescript
import { wasteBodySchema } from "@recyclerie/api/schemas/waste";
import type { CreateWasteResponse } from "@recyclerie/api/responses/waste";

res.status(201).json(
  apiCreated(toWasteDto(waste), {
    message: "Sortie de déchets créée avec succès",
  }) satisfies CreateWasteResponse,
);
// CreateWasteResponse → { success: true, message, data: WasteDisposalDto }
```

## Build

```bash
npm run build
```

Outputs ESM + `.d.ts` to `dist/`.

## Publishing as standalone repo

1. Copy `packages/api` to its own repository.
2. Tag releases (`v0.1.0`, …).
3. Point both apps at `git+https://...#v0.1.0` or publish to npm/GitHub Packages.
