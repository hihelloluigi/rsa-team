// Renders one or more schema.org objects as a JSON-LD <script>.
// `<` is escaped per Next's guidance to avoid XSS via injected content.
export default function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
