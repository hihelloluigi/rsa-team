"use server";

import { ContactRequestSchema, sendContactRequest } from "@/lib/contact";

export type ContactFormState = {
  status: "idle" | "sent" | "error";
  message: string;
  // What was typed, handed back on an error: React resets a form once its
  // action settles, and nobody retypes a message because of a typo in an email.
  values?: Record<string, string>;
};

export async function submitContactRequest(
  _previous: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const field = (name: string) => String(formData.get(name) ?? "");

  // A field no person sees or fills. A bot that completes every input gives
  // itself away, and is told it worked so it has no reason to try again.
  if (field("website")) return { status: "sent", message: "" };

  const values = {
    topic: field("topic"),
    name: field("name"),
    organization: field("organization"),
    email: field("email"),
    message: field("message"),
  };

  const parsed = ContactRequestSchema.safeParse(values);
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0].message, values };
  }

  try {
    await sendContactRequest(parsed.data);
    return { status: "sent", message: "" };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Non è partito: palla persa a centrocampo. Riprova tra poco, o scrivici su Instagram.",
      values,
    };
  }
}
