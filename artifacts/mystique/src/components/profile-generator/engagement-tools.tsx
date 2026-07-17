import * as React from "react";
import {
  CalendarDays,
  Bell,
  Star,
  Users,
  Heart,
  Briefcase,
  Smile,
  Upload,
  Download,
  Pin,
  Trash2,
  Pencil,
  Share2,
} from "lucide-react";
import type {
  AstroInsightInput,
  AstroInsightOutput,
  NumerologyData,
} from "./types";
import type { DailyForecast } from "@/lib/temporal-prediction-engine-v2";
import {
  generateDailyForecast,
  generateNotificationBatch,
} from "@/lib/temporal-prediction-engine-v2";
import {
  computePersonalYearNumber,
  reduceNum,
} from "@/lib/numerology/personal-year-full";
import { famousBirthdays } from "@/lib/famous-birthdays";
export type StoredSoul = AstroInsightInput & {
  id?: string;
  timestamp?: number;
  pinned?: boolean;
};
const HARMONY: Record<number, number[]> = {
  1: [1, 4],
  2: [2, 7],
  3: [3, 6, 9],
  4: [4, 1],
  5: [5],
  6: [6, 3, 9],
  7: [7, 2],
  8: [8, 4],
  9: [9, 3, 6],
  11: [2, 7, 11],
  22: [4, 1, 22],
  33: [6, 3, 9, 33],
};
function reduceSingle(n: number): number {
  let v = Math.abs(n);
  while (v > 9)
    v = String(v)
      .split("")
      .reduce((a, d) => a + Number(d), 0);
  return v || 9;
}
function lifePath(
  s: Pick<AstroInsightInput, "day" | "month" | "year">,
): number {
  return reduceNum(
    Number(s.day) +
      Number(s.month) +
      String(s.year)
        .split("")
        .reduce((a, d) => a + Number(d), 0),
  );
}
function psychic(s: Pick<AstroInsightInput, "day">): number {
  return reduceSingle(Number(s.day));
}
function digitsOf(
  s: Pick<AstroInsightInput, "day" | "month" | "year">,
): number[] {
  return `${s.day}${s.month}${s.year}`
    .split("")
    .map(Number)
    .filter((n) => n > 0);
}
function zodiacAnimal(year: number): string {
  const animals = [
    "Rat",
    "Ox",
    "Tiger",
    "Rabbit",
    "Dragon",
    "Snake",
    "Horse",
    "Goat",
    "Monkey",
    "Rooster",
    "Dog",
    "Pig",
  ];
  return animals[
    (Number(year) - 4) % 12 < 0
      ? ((Number(year) - 4) % 12) + 12
      : (Number(year) - 4) % 12
  ];
}
function sameOrHarmonious(a: number, b: number): number {
  if (a === b) return 100;
  if ((HARMONY[a] || []).includes(b) || (HARMONY[b] || []).includes(a))
    return 82;
  if (reduceSingle(a) === reduceSingle(b)) return 72;
  return 42;
}
function barColor(score: number): string {
  if (score >= 85) return "#f1d98a";
  if (score >= 70) return "#86efac";
  if (score >= 55) return "#67e8f9";
  return "#c4b5fd";
}
function ScoreBar({ label, score }: { label: string; score: number }) {
  const color = barColor(score);
  return (
    <div style={{ marginBottom: "0.55rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "0.75rem",
          marginBottom: 4,
        }}
      >
        <span style={{ fontSize: "0.68rem", color: "rgba(231,221,255,0.84)" }}>
          {label}
        </span>
        <span
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: "0.66rem",
            color,
            fontWeight: 800,
          }}
        >
          {Math.round(score)}%
        </span>
      </div>
      <div
        style={{
          height: 8,
          borderRadius: 99,
          background: "rgba(8,7,20,0.95)",
          border: "1px solid rgba(255,255,255,0.06)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.max(3, Math.min(100, score))}%`,
            borderRadius: 99,
            background: `linear-gradient(90deg, ${color}, rgba(167,139,250,0.9))`,
            boxShadow: `0 0 14px ${color}66`,
          }}
        />
      </div>
    </div>
  );
}
function Panel({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      style={{
        border: "1px solid rgba(212,175,55,0.18)",
        background:
          "linear-gradient(135deg, rgba(16,8,42,0.96), rgba(38,16,68,0.72))",
        borderRadius: "1.1rem",
        padding: "1rem",
        marginBottom: "1rem",
        boxShadow: "0 18px 40px rgba(0,0,0,0.22)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.65rem",
          marginBottom: "0.8rem",
        }}
      >
        {icon && (
          <div style={{ color: "#d4af37", display: "flex" }}>{icon}</div>
        )}
        <div>
          <div
            style={{
              fontFamily: "'Cinzel',serif",
              fontSize: "0.72rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#d4af37",
              fontWeight: 800,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: "0.62rem",
                color: "rgba(200,180,240,0.48)",
                marginTop: 2,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}
function tinyButtonStyle(color = "#d4af37"): React.CSSProperties {
  return {
    border: `1px solid ${color}55`,
    color,
    background: `${color}14`,
    borderRadius: 10,
    padding: "0.42rem 0.6rem",
    fontFamily: "'Cinzel',serif",
    fontSize: "0.55rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    cursor: "pointer",
  };
}
export function TodaySurface({
  primarySoul,
  history,
  onLoad,
  onNewSoul,
  onOpenArchivum,
  onImportArchivum,
  onExportArchivum,
}: {
  primarySoul: StoredSoul | null;
  history: StoredSoul[];
  onLoad: (s: AstroInsightInput) => void;
  onNewSoul: () => void;
  onOpenArchivum: () => void;
  onImportArchivum: () => void;
  onExportArchivum: () => void;
}) {
  const today = React.useMemo(
    () =>
      primarySoul
        ? generateDailyForecast(
            primarySoul.day,
            primarySoul.month,
            primarySoul.year,
          )
        : null,
    [primarySoul],
  );
  const batch = React.useMemo(
    () =>
      primarySoul
        ? generateNotificationBatch(
            primarySoul.day,
            primarySoul.month,
            primarySoul.year,
            14,
          )
        : [],
    [primarySoul],
  );
  const year = new Date().getFullYear();
  if (!primarySoul || !today) {
    return (
      <Panel
        title="Today"
        subtitle="Save or pin a soul to turn the app into a daily compass"
        icon={<CalendarDays size={18} />}
      >
        <p
          style={{
            color: "rgba(231,221,255,0.76)",
            fontSize: "0.84rem",
            lineHeight: 1.65,
            marginBottom: "0.9rem",
          }}
        >
          Generate a profile once, then pin it in the Archivum. The home screen
          will show the soul's personal day, lucky-day status, upcoming
          notification-worthy timing windows, and family/soul weather.
        </p>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <button style={tinyButtonStyle()} onClick={onNewSoul}>
            Generate Profile
          </button>
          <button style={tinyButtonStyle("#a78bfa")} onClick={onOpenArchivum}>
            Open Archivum
          </button>
          <button style={tinyButtonStyle("#67e8f9")} onClick={onImportArchivum}>
            Import
          </button>
        </div>
      </Panel>
    );
  }
  return (
    <>
      <Panel
        title="Today’s Compass"
        subtitle={`${primarySoul.name} · ${today.date} · Personal Year ${computePersonalYearNumber(primarySoul.day, primarySoul.month, year)}`}
        icon={<CalendarDays size={18} />}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0,1fr))",
            gap: "0.55rem",
            marginBottom: "0.8rem",
          }}
        >
          <MiniStat label="Personal Day" value={today.personalDay} />
          <MiniStat label="Universal Day" value={today.universalDay} />
          <MiniStat
            label="Power"
            value={
              today.isPowerWindow
                ? "YES"
                : today.isLuckyDay || today.isLuckyDate
                  ? "OPEN"
                  : "—"
            }
          />
        </div>
        <p
          style={{
            color: "rgba(231,221,255,0.82)",
            fontSize: "0.86rem",
            lineHeight: 1.68,
            margin: "0 0 0.8rem",
          }}
        >
          <b style={{ color: "#f1d98a" }}>{today.focus}</b>
          <br />
          {today.shortNarrative}
        </p>
        {today.notificationAlert && (
          <div
            style={{
              padding: "0.72rem",
              borderRadius: 14,
              border: "1px solid rgba(251,191,36,0.25)",
              background: "rgba(251,191,36,0.08)",
              color: "rgba(254,243,199,0.92)",
              fontSize: "0.78rem",
              lineHeight: 1.55,
            }}
          >
            {today.notificationAlert}
          </div>
        )}
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            marginTop: "0.85rem",
          }}
        >
          <button style={tinyButtonStyle()} onClick={() => onLoad(primarySoul)}>
            Open Full Reading
          </button>
          <button style={tinyButtonStyle("#a78bfa")} onClick={onNewSoul}>
            New Soul
          </button>
          <button style={tinyButtonStyle("#67e8f9")} onClick={onExportArchivum}>
            Backup Archivum
          </button>
        </div>
      </Panel>
      {batch.length > 0 && (
        <Panel
          title="Upcoming Timing Alerts"
          subtitle="Next 14 days · generated locally/offline"
          icon={<Bell size={18} />}
        >
          <div style={{ display: "grid", gap: "0.55rem" }}>
            {batch.slice(0, 5).map((f) => (
              <div
                key={`${f.date}-${f.personalDay}`}
                style={{
                  padding: "0.65rem 0.7rem",
                  borderRadius: 13,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Cinzel',serif",
                    fontSize: "0.58rem",
                    letterSpacing: "0.1em",
                    color: "#d4af37",
                    textTransform: "uppercase",
                  }}
                >
                  {f.date} · PD {f.personalDay}
                </div>
                <div
                  style={{
                    color: "rgba(231,221,255,0.78)",
                    fontSize: "0.74rem",
                    lineHeight: 1.55,
                    marginTop: 3,
                  }}
                >
                  {f.notificationAlert}
                </div>
              </div>
            ))}
          </div>
        </Panel>
      )}
      {history.length > 0 && (
        <SoulWeatherDashboard history={history} onLoad={onLoad} />
      )}
      {history.length >= 2 && <SoulResonancePanel history={history} />}
    </>
  );
}
function MiniStat({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div
      style={{
        border: "1px solid rgba(212,175,55,0.16)",
        background: "rgba(255,255,255,0.035)",
        borderRadius: 14,
        padding: "0.65rem 0.5rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "'Cinzel',serif",
          color: "#f1d98a",
          fontSize: "1rem",
          fontWeight: 800,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "0.52rem",
          color: "rgba(200,180,240,0.48)",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        {label}
      </div>
    </div>
  );
}
export function SoulWeatherDashboard({
  history,
  onLoad,
}: {
  history: StoredSoul[];
  onLoad: (s: AstroInsightInput) => void;
}) {
  const year = new Date().getFullYear();
  return (
    <Panel
      title="Soul Weather"
      subtitle="Current personal-year climate for saved souls"
      icon={<Star size={18} />}
    >
      <div style={{ display: "grid", gap: "0.5rem" }}>
        {history.slice(0, 8).map((s) => (
          <button
            key={s.id || `${s.name}-${s.day}-${s.month}-${s.year}`}
            onClick={() => onLoad(s)}
            style={{
              width: "100%",
              textAlign: "left",
              border: "1px solid rgba(255,255,255,0.07)",
              background: "rgba(255,255,255,0.035)",
              borderRadius: 13,
              padding: "0.68rem 0.75rem",
              cursor: "pointer",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "0.75rem",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    color: "rgba(248,250,252,0.92)",
                    fontWeight: 700,
                    fontSize: "0.84rem",
                  }}
                >
                  {s.pinned ? "★ " : ""}
                  {s.name}
                </div>
                <div
                  style={{
                    color: "rgba(200,180,240,0.45)",
                    fontSize: "0.62rem",
                  }}
                >
                  {s.day}/{s.month}/{s.year}
                </div>
              </div>
              <div
                style={{
                  fontFamily: "'Cinzel',serif",
                  color: "#d4af37",
                  fontSize: "0.72rem",
                }}
              >
                PY {computePersonalYearNumber(s.day, s.month, year)}
              </div>
            </div>
          </button>
        ))}
      </div>
    </Panel>
  );
}
function resonance(a: StoredSoul, b: StoredSoul) {
  const psychicScore = sameOrHarmonious(psychic(a), psychic(b));
  const destinyScore = sameOrHarmonious(lifePath(a), lifePath(b));
  const yearScore =
    computePersonalYearNumber(a.day, a.month, new Date().getFullYear()) ===
    computePersonalYearNumber(b.day, b.month, new Date().getFullYear())
      ? 82
      : 52;
  const animalScore = zodiacAnimal(a.year) === zodiacAnimal(b.year) ? 75 : 48;
  const aDigits = new Set(digitsOf(a));
  const bDigits = new Set(digitsOf(b));
  const aMissing = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !aDigits.has(n));
  const filled = aMissing.filter((n) => bDigits.has(n)).length;
  const completionScore = aMissing.length
    ? Math.round((filled / aMissing.length) * 100)
    : 60;
  const romance = Math.round(
    psychicScore * 0.28 +
      destinyScore * 0.22 +
      completionScore * 0.22 +
      animalScore * 0.14 +
      yearScore * 0.14,
  );
  const business = Math.round(
    destinyScore * 0.35 +
      yearScore * 0.25 +
      completionScore * 0.18 +
      psychicScore * 0.12 +
      animalScore * 0.1,
  );
  const friendship = Math.round(
    psychicScore * 0.3 +
      animalScore * 0.22 +
      completionScore * 0.22 +
      destinyScore * 0.16 +
      yearScore * 0.1,
  );
  return {
    psychicScore,
    destinyScore,
    yearScore,
    animalScore,
    completionScore,
    romance,
    business,
    friendship,
  };
}
export function SoulResonancePanel({ history }: { history: StoredSoul[] }) {
  const [aId, setAId] = React.useState(
    history[0]?.id || `${history[0]?.name}-${history[0]?.day}`,
  );
  const [bId, setBId] = React.useState(
    history[1]?.id || `${history[1]?.name}-${history[1]?.day}`,
  );
  React.useEffect(() => {
    if (history[0])
      setAId(history[0].id || `${history[0].name}-${history[0].day}`);
    if (history[1])
      setBId(history[1].id || `${history[1].name}-${history[1].day}`);
  }, [history.length]);
  const getId = (s: StoredSoul) =>
    s.id || `${s.name}-${s.day}-${s.month}-${s.year}`;
  const a = history.find((s) => getId(s) === aId) || history[0];
  const b =
    history.find((s) => getId(s) === bId) ||
    history.find((s) => getId(s) !== getId(a)) ||
    history[1];
  if (!a || !b || getId(a) === getId(b)) return null;
  const r = resonance(a, b);
  return (
    <Panel
      title="Soul Resonance"
      subtitle="Compatibility using Cheiro harmony, Lo Shu completion, personal-year sync and zodiac rhythm"
      icon={<Users size={18} />}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.5rem",
          marginBottom: "0.8rem",
        }}
      >
        <select
          value={aId}
          onChange={(e) => setAId(e.target.value)}
          style={selectStyle}
        >
          {history.map((s) => (
            <option key={getId(s)} value={getId(s)}>
              {s.name}
            </option>
          ))}
        </select>
        <select
          value={bId}
          onChange={(e) => setBId(e.target.value)}
          style={selectStyle}
        >
          {history.map((s) => (
            <option key={getId(s)} value={getId(s)}>
              {s.name}
            </option>
          ))}
        </select>
      </div>
      <ScoreBar label="Romance" score={r.romance} />
      <ScoreBar label="Partnership / Business" score={r.business} />
      <ScoreBar label="Friendship" score={r.friendship} />
      <div
        style={{
          marginTop: "0.75rem",
          color: "rgba(231,221,255,0.76)",
          fontSize: "0.76rem",
          lineHeight: 1.62,
        }}
      >
        <b style={{ color: "#f1d98a" }}>Why:</b> Psychic harmony{" "}
        {r.psychicScore}%, destiny/life-path harmony {r.destinyScore}%, Lo Shu
        completion {r.completionScore}%, current personal-year sync{" "}
        {r.yearScore}%, zodiac rhythm {r.animalScore}%.
      </div>
    </Panel>
  );
}
const selectStyle: React.CSSProperties = {
  width: "100%",
  background: "rgba(10,4,28,0.96)",
  color: "#e9ddff",
  border: "1px solid rgba(167,139,250,0.22)",
  borderRadius: 12,
  padding: "0.65rem",
  fontSize: "0.76rem",
};
export function CosmicTwinsPanel({
  insight,
  numerology,
}: {
  insight: AstroInsightOutput;
  numerology: NumerologyData;
}) {
  const currentLife = lifePath({
    day: numerology.birthDay,
    month: numerology.birthMonth,
    year: numerology.birthYear,
  });
  const animal = zodiacAnimal(numerology.birthYear);
  const matches = famousBirthdays
    .map((p) => {
      let score = 0;
      const reasons: string[] = [];
      if (p.day === numerology.birthDay && p.month === numerology.birthMonth) {
        score += 55;
        reasons.push("same birthday");
      }
      const lp = lifePath({ day: p.day, month: p.month, year: p.year });
      if (lp === currentLife) {
        score += 20;
        reasons.push(`same life path ${lp}`);
      }
      if (zodiacAnimal(p.year) === animal) {
        score += 15;
        reasons.push(`same Chinese animal ${animal}`);
      }
      if (p.month === numerology.birthMonth) {
        score += 5;
        reasons.push("same birth month");
      }
      return { ...p, score, reasons };
    })
    .filter((p) => p.score >= 20 && p.name !== insight.name)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
  if (!matches.length) return null;
  return (
    <Panel
      title="Cosmic Twins"
      subtitle="Famous lives sharing birthday, life-path or zodiac resonance"
      icon={<Star size={18} />}
    >
      <div style={{ display: "grid", gap: "0.55rem" }}>
        {matches.map((m) => (
          <div
            key={`${m.name}-${m.year}`}
            style={{
              padding: "0.65rem 0.7rem",
              borderRadius: 13,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "0.6rem",
              }}
            >
              <b
                style={{ color: "rgba(248,250,252,0.92)", fontSize: "0.82rem" }}
              >
                {m.name}
              </b>
              <span
                style={{
                  color: "#d4af37",
                  fontFamily: "'Cinzel',serif",
                  fontSize: "0.62rem",
                }}
              >
                {m.score}%
              </span>
            </div>
            <div
              style={{
                color: "rgba(200,180,240,0.5)",
                fontSize: "0.64rem",
                marginTop: 2,
              }}
            >
              Born {m.day}/{m.month}/{m.year} · {m.reasons.join(" · ")}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}
export async function shareReadingCard(
  insight: AstroInsightOutput,
  numerology: NumerologyData,
): Promise<void> {
  const title = `${insight.name} — Mystique Compass`;
  const py = computePersonalYearNumber(
    numerology.birthDay,
    numerology.birthMonth,
    new Date().getFullYear(),
  );
  const text = `${title}\nBorn ${numerology.birthDay}/${numerology.birthMonth}/${numerology.birthYear}\nPersonal Year ${py} · ${insight.new_astrology_sign}\nGenerated mechanically by Mystique Compass.`;
  const params = new URLSearchParams({
    s: btoa(
      unescape(
        encodeURIComponent(
          JSON.stringify({
            name: insight.name,
            day: numerology.birthDay,
            month: numerology.birthMonth,
            year: numerology.birthYear,
            gender: insight.gender || "male",
          }),
        ),
      ),
    ),
  });
  const url = `${location.origin}${location.pathname}?${params.toString()}`;
  if (navigator.share) await navigator.share({ title, text, url });
  else {
    await navigator.clipboard?.writeText(`${text}\n${url}`);
    alert("Reading link copied to clipboard.");
  }
}
export function ShareReadingButton({
  insight,
  numerology,
}: {
  insight: AstroInsightOutput;
  numerology: NumerologyData;
}) {
  return (
    <button
      onClick={() => void shareReadingCard(insight, numerology)}
      style={tinyButtonStyle("#67e8f9")}
    >
      <Share2 size={12} style={{ display: "inline", marginRight: 6 }} />
      Share Reading
    </button>
  );
}
export function ArchivumActions({
  item,
  onLoad,
  onPin,
  onRename,
  onDelete,
}: {
  item: StoredSoul;
  onLoad: (s: AstroInsightInput) => void;
  onPin: (s: StoredSoul) => void;
  onRename: (s: StoredSoul) => void;
  onDelete: (s: StoredSoul) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "0.35rem",
        flexWrap: "wrap",
        marginTop: "0.65rem",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button style={tinyButtonStyle()} onClick={() => onLoad(item)}>
        Open
      </button>
      <button style={tinyButtonStyle("#f1d98a")} onClick={() => onPin(item)}>
        <Pin size={11} style={{ display: "inline", marginRight: 4 }} />
        Pin
      </button>
      <button style={tinyButtonStyle("#67e8f9")} onClick={() => onRename(item)}>
        <Pencil size={11} style={{ display: "inline", marginRight: 4 }} />
        Rename
      </button>
      <button style={tinyButtonStyle("#fb7185")} onClick={() => onDelete(item)}>
        <Trash2 size={11} style={{ display: "inline", marginRight: 4 }} />
        Delete
      </button>
    </div>
  );
}
export function ImportExportButtons({
  onImport,
  onExport,
}: {
  onImport: () => void;
  onExport: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "0.45rem",
        flexWrap: "wrap",
        marginTop: "0.75rem",
      }}
    >
      <button style={tinyButtonStyle("#67e8f9")} onClick={onImport}>
        <Upload size={12} style={{ display: "inline", marginRight: 5 }} />
        Import JSON
      </button>
      <button style={tinyButtonStyle("#86efac")} onClick={onExport}>
        <Download size={12} style={{ display: "inline", marginRight: 5 }} />
        Export JSON
      </button>
    </div>
  );
}
