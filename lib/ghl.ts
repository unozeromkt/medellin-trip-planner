const GHL_API_BASE = "https://services.leadconnectorhq.com";
const GHL_API_VERSION = "2021-07-28";

export interface GHLLeadPayload {
  name: string;
  phone: string;
  email?: string | null;
  source?: string | null;
  message?: string | null;
  tourTitles?: string[];
  peopleCount?: number | null;
  travelDate?: string | null;
  budget?: string | null;
  pageUrl?: string | null;
  totalPrice?: number | null;
}

function normalizePhone(phone: string): string {
  const trimmed = phone.trim();
  const digits = trimmed.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  return `+57${digits.replace(/^0+/, "")}`;
}

function splitName(fullName: string): { firstName: string; lastName?: string } {
  const parts = fullName.trim().split(/\s+/);
  const [firstName, ...rest] = parts;
  return { firstName, lastName: rest.length > 0 ? rest.join(" ") : undefined };
}

function buildNoteBody(payload: GHLLeadPayload): string | null {
  const lines: string[] = [];
  if (payload.tourTitles?.length) {
    lines.push(`Tours de interés: ${payload.tourTitles.join(", ")}`);
  }
  if (payload.peopleCount) lines.push(`Personas: ${payload.peopleCount}`);
  if (payload.travelDate) lines.push(`Fecha tentativa: ${payload.travelDate}`);
  if (payload.budget) lines.push(`Presupuesto: ${payload.budget}`);
  if (payload.message) lines.push(`Mensaje: ${payload.message}`);
  if (payload.pageUrl) lines.push(`Página de origen: ${payload.pageUrl}`);
  if (lines.length === 0) return null;
  return `Lead desde medellintripplanner.com\n${lines.join("\n")}`;
}

function buildOpportunityName(payload: GHLLeadPayload): string {
  return payload.tourTitles?.length
    ? `${payload.name} — ${payload.tourTitles[0]}`
    : payload.name;
}

/**
 * Creates/updates the contact in GHL, attaches a note with trip context, and
 * creates an Opportunity in the sales pipeline (with the "tour_de_interes"
 * custom field, which lives on the Opportunity, not the Contact, in GHL).
 * Never throws past this boundary — GHL sync must not break the lead-saving
 * or WhatsApp-redirect flow for the user.
 */
export async function syncLeadToGHL(payload: GHLLeadPayload): Promise<void> {
  const token = process.env.GHL_PRIVATE_TOKEN;
  const locationId = process.env.GHL_LOCATION_ID;

  if (!token || !locationId) {
    console.warn("[ghl] Missing GHL_PRIVATE_TOKEN or GHL_LOCATION_ID, skipping sync");
    return;
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Version: GHL_API_VERSION,
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  try {
    const { firstName, lastName } = splitName(payload.name);
    const tags = ["web-lead"];
    if (payload.source) tags.push(`web-${payload.source}`);

    const upsertRes = await fetch(`${GHL_API_BASE}/contacts/upsert`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        locationId,
        firstName,
        lastName,
        name: payload.name,
        phone: normalizePhone(payload.phone),
        email: payload.email || undefined,
        tags,
        source: payload.source ? `Website - ${payload.source}` : "Website",
      }),
    });

    if (!upsertRes.ok) {
      const text = await upsertRes.text().catch(() => "");
      throw new Error(`contacts/upsert failed (${upsertRes.status}): ${text}`);
    }

    const { contact } = (await upsertRes.json()) as { contact?: { id?: string } };
    const contactId = contact?.id;
    const noteBody = buildNoteBody(payload);

    if (contactId && noteBody) {
      const noteRes = await fetch(`${GHL_API_BASE}/contacts/${contactId}/notes`, {
        method: "POST",
        headers,
        body: JSON.stringify({ body: noteBody }),
      });

      if (!noteRes.ok) {
        const text = await noteRes.text().catch(() => "");
        console.warn(`[ghl] Contact synced but note failed (${noteRes.status}): ${text}`);
      }
    }

    const pipelineId = process.env.GHL_PIPELINE_ID;
    const pipelineStageId = process.env.GHL_PIPELINE_STAGE_ID;
    const tourInteresFieldId = process.env.GHL_CUSTOM_FIELD_TOUR_INTERES_ID;

    if (contactId && pipelineId && pipelineStageId) {
      const customFields =
        tourInteresFieldId && payload.tourTitles?.length
          ? [{ id: tourInteresFieldId, field_value: payload.tourTitles.join(", ") }]
          : undefined;

      const oppRes = await fetch(`${GHL_API_BASE}/opportunities/`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          locationId,
          pipelineId,
          pipelineStageId,
          contactId,
          name: buildOpportunityName(payload),
          status: "open",
          monetaryValue: payload.totalPrice || undefined,
          customFields,
        }),
      });

      if (!oppRes.ok) {
        const text = await oppRes.text().catch(() => "");
        console.warn(`[ghl] Contact synced but opportunity failed (${oppRes.status}): ${text}`);
      }
    }
  } catch (err) {
    console.error("[ghl] Lead sync failed:", err);
  }
}
