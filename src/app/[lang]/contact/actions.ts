"use server";

import { contactRequestSchema, sendContactRequest } from "@/lib/contact";
import { DEFAULT_LOCALE, hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

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

  // A server action cannot read the [lang] root parameter, so the form says
  // which language it was rendered in. Only used to pick the error messages.
  const lang = field("lang");
  const errors = getDictionary(hasLocale(lang) ? lang : DEFAULT_LOCALE).form.errors;

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

  const parsed = contactRequestSchema(errors).safeParse(values);
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
      message: errors.send,
      values,
    };
  }
}
