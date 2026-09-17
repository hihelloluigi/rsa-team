import { notFound } from "next/navigation";

// Catches every path under a language that no other route claims. Without it
// an unknown URL falls through to Next's bare default 404, because the site's
// own not-found page lives inside [lang] with the root layout; routing the miss
// through here renders that page, in the visitor's language.
export default function CatchAll() {
  notFound();
}
