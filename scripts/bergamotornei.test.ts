import { describe, expect, it } from "vitest";
import { parseCalendar, parseScorers } from "./bergamotornei.ts";

// Trimmed from real op=22 responses and match pages, whitespace included:
// the parsers are regexes over this markup, so the samples keep its shape.
const fixture = (href: string, header: string, home: string, away: string, scores: string) => `
<div class="match-element"><div class="match-name">SERIE D gir D</div><a href="${href}"><div class="match-header">
                        ${header}
                    </div><div class="match-content">
                        <div class='match-left'><div class="participant-single-row top">
                                            <img src='x.png'>
                                            <div class='participant-name top'>${home}</div>
                                        </div><div class="participant-single-row ">
                                            <img src='y.png'>
                                            <div class='participant-name '>${away}</div>
                                        </div></div>
                        <div class='match-right'>${scores}</div>
                    </div></a></div>`;

const bye = `
<div class="match-element"><div class="match-name">SERIE D gir D</div><div class="match-header">
                        Turno di riposo
                    </div><div class="match-content">
                        <div class='match-left'><div class="participant-single-row ">
                                            <div class='participant-name top'>Amici Ponteranica</div>
                                        </div></div></div></div>`;

describe("parseCalendar", () => {
  it("reads a played fixture, home side first", () => {
    const html = fixture(
      "https://www.bergamotornei.com/it/match/28619/rsa-team-vecchia-guardia-berghem/",
      "Monterosso CS  Piermario Morosini - Sintetico<br />\n                        Ven 25 SET 20:00",
      "RSA Team",
      "Vecchia Guardia Berghem",
      `<div class="score-container"><div class='score'>3</div><div class='score'>4</div></div>`,
    );
    expect(parseCalendar(html)).toEqual([
      {
        home: "RSA Team",
        away: "Vecchia Guardia Berghem",
        day: 25,
        month: 9,
        kickoff: "20:00",
        score: { home: 3, away: 4 },
        url: "https://www.bergamotornei.com/it/match/28619/rsa-team-vecchia-guardia-berghem/",
      },
    ]);
  });

  it("leaves the score off a fixture not yet played, and skips byes", () => {
    const html =
      fixture(
        "https://www.bergamotornei.com/it/match/28645/san-sebastian-soccer-rsa-team/",
        "Comun Nuovo Centro Sportivo - calcio a 7<br />\n                        Lun 05 OTT 21:00",
        "San Sebastian Soccer",
        "Sita&#039; Olta",
        "",
      ) + bye;
    const [only, ...rest] = parseCalendar(html);
    expect(rest).toEqual([]);
    expect(only).toMatchObject({ away: "Sita' Olta", day: 5, month: 10, kickoff: "21:00" });
    expect(only).not.toHaveProperty("score");
  });

  it("fails loudly on markup it does not recognise", () => {
    expect(() => parseCalendar("<div>maintenance</div>")).toThrow(/markup/);
  });
});

describe("parseScorers", () => {
  it("reads both sides and writes a brace the way the file does", () => {
    const html = `<div class="team-scorer-set-container">
            <div class="scorer_a">
                <a href="/it/player/81673/matteo-basetti/">Basetti Matteo</a><br /><a href="/it/player/83543/paolo-foresti/">Foresti Paolo</a><br />
            </div>
            <div class="set-container">
                &nbsp;
            </div>
            <div class="scorer_b">
                (4) <a href="/it/player/81875/michael-cipolla/">Cipolla Michael</a><br />
            </div>
        </div>`;
    expect(parseScorers(html)).toEqual({
      home: ["Basetti Matteo", "Foresti Paolo"],
      away: ["Cipolla Michael (x4)"],
    });
  });

  it("reads a brace written after the name, as the home side lists them", () => {
    // From My-bg 12-3 RSA Team: the count trails the link on the home side.
    const html = `<div class="scorer_a">
                <a href="/it/player/82963/lhousain-daha/">Daha Lhousain</a> (2)<br /><a href="/it/player/82966/yassine-el-idrissi/">El Idrissi Yassine</a> (6)<br /><a href="/it/player/82971/jamal-ouchikh/">Ouchikh Jamal</a><br />
            </div><div class="scorer_b">
                <a href="/it/player/83542/giacomo-colombo/">Colombo Giacomo</a><br />
            </div>`;
    expect(parseScorers(html)).toEqual({
      home: ["Daha Lhousain (x2)", "El Idrissi Yassine (x6)", "Ouchikh Jamal"],
      away: ["Colombo Giacomo"],
    });
  });

  it("returns empty sides for a result with no scorers entered", () => {
    const html = `<div class="scorer_a">
            </div><div class="scorer_b">
            </div>`;
    expect(parseScorers(html)).toEqual({ home: [], away: [] });
  });
});
