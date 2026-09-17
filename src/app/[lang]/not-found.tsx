import ButtonLink from "@/components/ButtonLink";
import { getI18n } from "@/i18n/server";

export default async function NotFound() {
  const { t, href } = await getI18n();
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-5 py-24 gap-6">
      <h1 className="font-display italic uppercase text-8xl sm:text-9xl font-black text-accent">404</h1>
      <p className="font-display italic uppercase text-2xl sm:text-3xl font-black">{t.notFound.title}</p>
      <p className="text-muted max-w-md text-sm leading-relaxed">{t.notFound.body}</p>
      <ButtonLink href={href("/")} className="mt-4">
        {t.notFound.cta}
      </ButtonLink>
    </main>
  );
}
