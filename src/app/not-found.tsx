import ButtonLink from "@/components/ButtonLink";
import { GiSoccerBall } from "react-icons/gi";

export default function NotFound() {
  return (
    <main className="min-h-[70vh] flex flex-col items-center justify-center text-center px-5 py-24 gap-6">
      <GiSoccerBall className="text-accent" size={64} />
      <h1 className="font-display italic uppercase text-8xl sm:text-9xl font-black text-accent">404</h1>
      <p className="font-display italic uppercase text-2xl sm:text-3xl font-black">Fuorigioco.</p>
      <p className="text-muted max-w-md text-sm leading-relaxed">
        Questa pagina è in fuorigioco. Nemmeno il VAR può salvarla.
      </p>
      <ButtonLink href="/" className="mt-4">
        Torna a casa
      </ButtonLink>
    </main>
  );
}
