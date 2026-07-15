/**
 * MYSTIQUE COMPASS — Historical-Calibrated Personal Year Synthesis
 *
 * This module does not replace the Chaldean compound meanings. It adds the
 * layer that was missing from the original app: a deep dual-essence reading
 * that interprets the Direct compound and the Classic compound together, then
 * calibrates the interpretation by age, master-number status, danger signals,
 * and historically observed manifestation domains.
 *
 * Important: the language is intentionally predictive and direct, but it is not
 * deterministic. The app should never claim that any numerological signal can
 * guarantee a literal event. The goal is maximum specificity while still
 * treating the reading as risk/opportunity mapping rather than fatalism.
 */
import type { ChaldeanPYNCompound } from "@/lib/numerology/chaldean-pyn-compounds";
export interface PersonalYearDualEssenceSynthesis {
  title: string;
  subtitle: string;
  synthesisText: string;
  directEssenceRole: string;
  classicEssenceRole: string;
  ageModifier: string;
  masterNumberSignal: string | null;
  karmicDebtSignal: string | null;
  historicalCalibration: string;
  predictionFocusAreas: string[];
  protectiveActions: string[];
  domains: string[];
  polarity:
    | "predominantly constructive"
    | "predominantly cautionary"
    | "mixed ordeal-and-reward"
    | "threshold / transition";
  intensityScore: number;
}
interface BuildArgs {
  birthDay: number;
  birthMonth: number;
  birthYear?: number;
  targetYear: number;
  directRaw: number;
  directYear: number;
  directCompound: ChaldeanPYNCompound | null;
  classicRaw: number;
  classicYear: number;
  classicCompound: ChaldeanPYNCompound | null;
}
interface Calibration {
  shortName: string;
  domains: string[];
  gifts: string[];
  shadows: string[];
  crisisTags: string[];
  polarity: "constructive" | "cautionary" | "mixed" | "threshold";
  thesis: string;
  historical: string[];
  predictive: string;
  protective: string[];
}
const REDUCED_CALIBRATIONS: Record<number, Calibration> = {
  1: {
    shortName: "Initiation, sovereignty and visible new direction",
    domains: [
      "new beginnings",
      "leadership",
      "public identity",
      "self-assertion",
    ],
    gifts: [
      "initiative",
      "courage",
      "renewed visibility",
      "first-mover advantage",
    ],
    shadows: [
      "isolation",
      "ego pressure",
      "burning bridges",
      "over-identification with victory",
    ],
    crisisTags: [],
    polarity: "constructive",
    thesis:
      "A 1-year wants the person to become the author of a new chapter. It pushes life outward into decisions, launches, candidacies, leadership moves, separations from old definitions, and visible acts of will.",
    historical: [
      "Trump 2024 showed the 1-series as comeback, contest, law-pressure and eventual victory when 28/1 and 19/1 were read together.",
      "Churchill 1940 showed the 1-series as wartime assumption of command when amplified by 55/1 and 10/1.",
    ],
    predictive:
      "Expect decisive choices, fresh public identity, leadership tests, and consequences that follow from the person’s own will more than from passive circumstance.",
    protective: [
      "Choose one main initiative rather than scattering force.",
      "Put legal, financial and relational agreements in writing before advancing.",
    ],
  },
  2: {
    shortName: "Partnership, hidden forces and relational consequence",
    domains: [
      "partnership",
      "public reception",
      "alliances",
      "emotional climate",
      "behind-the-scenes forces",
    ],
    gifts: [
      "sensitivity",
      "diplomacy",
      "intuitive timing",
      "capacity to read others",
    ],
    shadows: ["betrayal", "delay", "overdependence", "hidden opposition"],
    crisisTags: ["hidden danger", "treachery", "trial"],
    polarity: "mixed",
    thesis:
      "A 2-year makes relationship the battlefield and the sanctuary. Events often arrive through other people: allies, spouses, rivals, voters, advisers, judges, collaborators or crowds.",
    historical: [
      "Ali 1964 showed 11/2 as a year of visionary identity revelation and a symbolic lion-taming victory.",
      "Senna 1994 showed how 11/2 can describe ominous hidden danger without being as literal as 16/7 or 51/6.",
    ],
    predictive:
      "Look for fated meetings, coalition changes, emotional pressure, and situations where the person’s fate is affected by someone else’s reliability or betrayal.",
    protective: [
      "Verify the motives of advisers and partners.",
      "Do not ignore intuition, but ground it with evidence.",
    ],
  },
  3: {
    shortName: "Expression, reputation and the visible story",
    domains: [
      "communication",
      "media",
      "art",
      "science publication",
      "public narrative",
      "creative output",
    ],
    gifts: [
      "visibility",
      "creative intelligence",
      "social reach",
      "honors through expression",
    ],
    shadows: [
      "scattered attention",
      "gossip",
      "sacrifice of private life",
      "ideas distorted by others",
    ],
    crisisTags: ["public scandal", "reputational friction"],
    polarity: "mixed",
    thesis:
      "A 3-year manifests through what is said, published, performed, discovered, narrated or misunderstood. The person’s life becomes a text that others read, praise, attack, quote or misquote.",
    historical: [
      "Einstein 1905, Curie 1911, Darwin 1859 and Swift 2023 all show how 3/5 expressive compounds can make private work suddenly public.",
      "Mandela 1994 shows 21/3 as elevation after long tests.",
    ],
    predictive:
      "Expect publications, announcements, awards, scandals, tours, speeches, artistic work, scientific output or public narratives to carry the year.",
    protective: [
      "Own the message before others define it.",
      "Finish the strongest work instead of feeding every possible audience.",
    ],
  },
  4: {
    shortName: "Foundation, pressure, rebuilding and institutional consequence",
    domains: [
      "work",
      "systems",
      "institutions",
      "career structure",
      "health discipline",
      "burdens",
    ],
    gifts: ["discipline", "durability", "technical mastery", "new foundations"],
    shadows: [
      "collapse of weak structures",
      "overwork",
      "rigidity",
      "forced reconstruction",
    ],
    crisisTags: ["upheaval", "destruction", "rebuilding"],
    polarity: "threshold",
    thesis:
      "A 4-year tests the structure underneath the life. If the foundation is sound, the person consolidates power; if it is false, the year breaks the form so a more durable one can be built.",
    historical: [
      "Steve Jobs 1985 and Queen Elizabeth II 2022 are strong 13/4 examples: the old structure ends and a new institutional chapter begins.",
      "Obama 2008 shows 22/4 as a movement-scale builder year.",
    ],
    predictive:
      "Expect restructuring, responsibility, burdens, formal office, job changes, building projects, institutional pressure or a karmic need to make plans concrete.",
    protective: [
      "Build slowly and document every structural decision.",
      "Treat exhaustion and health routines as part of the prediction, not an afterthought.",
    ],
  },
  5: {
    shortName: "Movement, risk, travel, media and freedom under stress",
    domains: [
      "travel",
      "media",
      "public movement",
      "freedom",
      "markets",
      "technology",
      "campaigning",
    ],
    gifts: ["adaptability", "magnetism", "rapid reach", "viral communication"],
    shadows: [
      "instability",
      "temptation",
      "deception",
      "accidents through haste",
    ],
    crisisTags: ["danger from movement", "risk", "reversal"],
    polarity: "mixed",
    thesis:
      "A 5-year accelerates the plot. It is the number of tours, campaigns, flights, launches, travel, media storms, sudden pivots and freedom conflicts.",
    historical: [
      "Taylor Swift 2023 showed the 5-series as global travel, media domination and crowd movement.",
      "Einstein 1905 showed 5 as radical intellectual movement through publication.",
    ],
    predictive:
      "Expect travel, announcements, negotiations, market changes, media amplification, legal freedom issues or sudden reversals that force adaptation.",
    protective: [
      "Avoid reckless speed in travel, contracts and financial speculation.",
      "Keep enough flexibility to pivot without losing the core plan.",
    ],
  },
  6: {
    shortName: "Duty, love, service, family and the burden of care",
    domains: [
      "family",
      "service",
      "public duty",
      "healing",
      "beauty",
      "community",
      "responsibility",
    ],
    gifts: ["loyalty", "care", "social affection", "creative harmony"],
    shadows: [
      "sacrifice",
      "subservience",
      "being loved yet rejected",
      "responsibility that consumes the self",
    ],
    crisisTags: ["burden", "relationship test"],
    polarity: "mixed",
    thesis:
      "A 6-year asks who or what the person must serve. It can bring love, family, creative beauty and public affection, but it also brings the weight of obligation.",
    historical: [
      "Elizabeth II 1952 shows 6 as duty accepted through family loss.",
      "Churchill 1945 is a 60/6-style example: public love and national gratitude did not prevent electoral rejection.",
    ],
    predictive:
      "Expect family events, service obligations, public care roles, relationship decisions, home matters, creative beautification or duty that tests emotional boundaries.",
    protective: [
      "Serve without becoming subservient.",
      "Separate true responsibility from guilt-based overfunctioning.",
    ],
  },
  7: {
    shortName:
      "Withdrawal, investigation, accident-sensitivity and spiritual correction",
    domains: [
      "spirituality",
      "research",
      "isolation",
      "health",
      "accidents",
      "retreat",
      "analysis",
    ],
    gifts: ["insight", "research ability", "inner purification", "deep truth"],
    shadows: [
      "collapse of false towers",
      "defeat of plans",
      "loneliness",
      "strange fatality",
    ],
    crisisTags: ["accident", "fatality", "collapse", "defeat"],
    polarity: "cautionary",
    thesis:
      "A 7-year pulls life beneath the surface. It reveals what was hidden, tests the nervous system, punishes arrogance, and rewards humility, research, prayer and precise attention.",
    historical: [
      "Diana 1997 and Marilyn Monroe 1962 show 16/7 as a severe accident/fatality signature.",
      "Frida Kahlo 1925 is a miss for 21/3/30/3 and shows why accident-signature compounds need special weighting.",
    ],
    predictive:
      "Expect retreat, investigation, spiritual crisis, health focus, research, secrecy, accident-prevention needs or the collapse of a plan built on illusion.",
    protective: [
      "Slow down physically and mechanically; do not ignore fatigue.",
      "Submit plans to reality-testing before the year does it by force.",
    ],
  },
  8: {
    shortName: "Power, money, executive karma and public consequence",
    domains: [
      "money",
      "business",
      "law",
      "power",
      "office",
      "legacy",
      "executive authority",
    ],
    gifts: [
      "material achievement",
      "command",
      "strategic endurance",
      "institutional influence",
    ],
    shadows: [
      "ruin through partners",
      "overreach",
      "legal consequence",
      "obsessive ambition",
    ],
    crisisTags: ["law", "business danger", "ruin", "overreach"],
    polarity: "mixed",
    thesis:
      "An 8-year brings the material world to judgment. Money, law, power, contracts, corporations, elections and public status become the arena where inner merit or imbalance returns as visible consequence.",
    historical: [
      "Mandela 1990 and Musk 2008 show 17/8/44/8 as power gained through trial.",
      "Kobe Bryant 2020 shows 17/8 as posthumous immortality but not a literal accident warning by itself.",
    ],
    predictive:
      "Expect financial decisions, executive burdens, legal matters, institutional power plays, career harvests or consequences of previous ambition.",
    protective: [
      "Audit partnerships, contracts and debt exposure.",
      "Know when to stop; the 8-shadow is overreach.",
    ],
  },
  9: {
    shortName: "Completion, sacrifice, legacy and moral consequence",
    domains: [
      "completion",
      "humanitarian work",
      "war/social upheaval",
      "martyrdom",
      "release",
      "legacy",
    ],
    gifts: [
      "wisdom",
      "authority through service",
      "collective contribution",
      "meaningful closure",
    ],
    shadows: [
      "loss",
      "conflict",
      "public sacrifice",
      "violent social currents",
    ],
    crisisTags: ["conflict", "ending", "martyrdom"],
    polarity: "threshold",
    thesis:
      "A 9-year closes a chapter and hands the life to history. It is not merely an ending; it is the extraction of meaning from everything that came before.",
    historical: [
      "Malcolm X 1965 shows 18/9 as conflict and factional danger.",
      "Gandhi 1947 shows 33/6 direct service beside a classic 6 community wound; the 9 context of Partition gives completion and pain.",
    ],
    predictive:
      "Expect endings, releases, humanitarian labor, legal/social culmination, moral reckoning, public grief or legacy-defining closure.",
    protective: [
      "Release what has completed; do not cling to a dying form.",
      "Turn pain into service before bitterness turns it into destruction.",
    ],
  },
  11: {
    shortName: "Master illumination under pressure",
    domains: [
      "vision",
      "revelation",
      "public nervous intensity",
      "prophecy",
      "hidden danger",
    ],
    gifts: [
      "inspiration",
      "symbolic power",
      "spiritual communication",
      "historic visibility",
    ],
    shadows: [
      "anxiety",
      "betrayal",
      "visionary collapse",
      "martyrdom pressure",
    ],
    crisisTags: ["hidden danger", "trial", "treachery"],
    polarity: "mixed",
    thesis:
      "Master 11 does not behave like an ordinary 2. It raises partnership and public reception into revelation, omen, charisma, nervous electricity and fated symbolic encounter.",
    historical: [
      "Lincoln 1860 and Ali 1964 are archetypal 11-style years: the person becomes a vessel for a larger public vision.",
      "Napoleon 1815-style 38/11 shows the shadow: visionary collapse rather than ordinary defeat.",
    ],
    predictive:
      "Expect revelations, inspired messages, nervous strain, public symbolism, extraordinary meetings, and the risk that a vision outruns its practical ground.",
    protective: [
      "Ground every vision in schedule, body-care and accountable counsel.",
      "Do not confuse intensity with certainty.",
    ],
  },
  22: {
    shortName: "Master builder pressure and large-scale consequence",
    domains: [
      "large projects",
      "institutions",
      "engineering",
      "statesmanship",
      "corporations",
      "systems",
    ],
    gifts: [
      "legacy building",
      "practical genius",
      "scale",
      "architecture of civilization",
    ],
    shadows: [
      "ungrounded ambition",
      "others steering the project",
      "danger seen too late",
    ],
    crisisTags: ["overreach", "structural danger"],
    polarity: "threshold",
    thesis:
      "Master 22 is the year of a structure too large to remain private. It can build institutions, movements and technologies, but it also punishes the dreamer who ignores arrows already in the knapsack.",
    historical: [
      "Obama 2008 shows 22/4 as movement-scale building.",
      "Musk 2022-style 22/22 shows the danger of a master-builder project acquired before its social, legal and human foundations are grounded.",
    ],
    predictive:
      "Expect massive projects, acquisitions, campaigns, institutions or public systems that demand engineering, humility and governance.",
    protective: [
      "Test the foundation before expanding the scale.",
      "Do not let admirers, partners or ideological crowds steer the architecture.",
    ],
  },
  33: {
    shortName: "Master teacher, sacred service and world instruction",
    domains: [
      "teaching",
      "healing",
      "science as instruction",
      "spiritual service",
      "humanitarian example",
    ],
    gifts: [
      "inspiration",
      "beneficence",
      "moral authority",
      "universal usefulness",
    ],
    shadows: [
      "savior complex",
      "sacrifice of body/private life",
      "service demanded beyond capacity",
    ],
    crisisTags: ["sacrifice", "service burden"],
    polarity: "constructive",
    thesis:
      "Master 33 raises the 6 from domestic care to world instruction. It is the signature of a person or work becoming a teacher to the collective.",
    historical: [
      "Einstein 1915 shows 33/33 as science becoming a master teaching about reality itself.",
      "Gandhi 1947 shows 33/33 as spiritual teaching through national trauma and compassionate service.",
    ],
    predictive:
      "Expect teaching, healing, public example, moral service, scientific or spiritual instruction, and a call to care beyond the personal circle.",
    protective: [
      "Serve from overflow, not self-erasure.",
      "Keep the body and home intact while serving the world.",
    ],
  },
};
const COMPOUND_CALIBRATIONS: Record<number, Partial<Calibration>> = {
  10: {
    shortName: "Wheel of Fortune — public launch and instant consequence",
    domains: [
      "launch",
      "public reputation",
      "sudden reversal",
      "name recognition",
    ],
    gifts: ["fast manifestation", "fame", "opportunity through timing"],
    shadows: ["boom-bust movement", "public consequences of desire"],
    polarity: "mixed",
    thesis:
      "10/1 is the pure wheel: whatever is set in motion becomes visible quickly, and the person’s name becomes attached to the outcome. It is excellent for launches but unforgiving of careless motive.",
    historical: [
      "Darwin 1859 and Churchill 1940 show 10/1 as a project or role becoming world-historical.",
    ],
    predictive:
      "A launch, appointment, public identity shift or reputation event is likely to define the year.",
  },
  11: {
    shortName: "Master 11 — Strength, omen and the lion contained",
    domains: [
      "vision",
      "fated relationships",
      "hidden danger",
      "public symbolism",
    ],
    crisisTags: ["hidden danger", "trial", "treachery"],
    polarity: "mixed",
    thesis:
      "11/2 intensifies the normal partnership year into a symbolic ordeal: the lion is powerful, but the victory depends on containment, courage and nervous control rather than brute force.",
    historical: [
      "Ali 1964 is the classic image: a literal fighter subdues the lion of expectation and becomes a visionary public symbol.",
    ],
  },
  12: {
    shortName: "Sacrifice — contribution captured by other agendas",
    domains: ["public narrative", "creative credit", "scandal", "service"],
    crisisTags: ["sacrifice", "victimization", "anxiety"],
    polarity: "cautionary",
    thesis:
      "12/3 is not merely creativity; it is the price of expression when others use, distort or consume the person’s work or private life.",
    historical: [
      "Marie Curie 1911 shows 12/3 as public honor mixed with scandal, anxiety and the sacrifice of private dignity to a public narrative.",
    ],
  },
  13: {
    shortName: "Rebirth — structural death and new foundation",
    domains: [
      "upheaval",
      "career reset",
      "death/rebirth",
      "relocation",
      "institutional change",
    ],
    crisisTags: ["upheaval", "destruction", "symbolic death"],
    polarity: "threshold",
    thesis:
      "13/4 is one of the clearest historical transition signatures: an old structure ends, sometimes painfully, and a more consequential structure begins from the ruins.",
    historical: [
      "Steve Jobs 1985, Queen Elizabeth II 2022 and Mandela-type transitions show 13/4 as literal or institutional death followed by rebirth.",
    ],
  },
  14: {
    shortName: "Magnetic Movement — travel, media, freedom and risk",
    domains: [
      "travel",
      "communication",
      "media",
      "freedom conflict",
      "financial speculation",
    ],
    crisisTags: ["movement danger", "deception", "reversal"],
    polarity: "mixed",
    thesis:
      "14/5 creates strong movement and public communication, but it asks whether freedom is disciplined or reckless. It is excellent for tours, campaigns, publishing and travel, yet risky when speed outruns verification.",
    historical: [
      "Taylor Swift 2023 and Einstein 1905 show the constructive side; Ali 1967 shows the freedom-law conflict side.",
    ],
  },
  16: {
    shortName:
      "Shattered Citadel — accident, fatality and collapse of false security",
    domains: [
      "accident",
      "fall from status",
      "spiritual correction",
      "health/safety",
      "defeat of plans",
    ],
    crisisTags: ["accident", "fatality", "collapse", "defeat"],
    polarity: "cautionary",
    thesis:
      "16/7 deserves special weighting in prediction because its classical imagery is unusually concrete: lightning strikes the tower, the crowned figure falls, and plans based on false security are defeated.",
    historical: [
      "Diana 1997 and Marilyn Monroe 1962 are strong historical validations of 16/7 as a severe fatality/collapse signature.",
    ],
    protective: [
      "Do not ignore travel, vehicle, medication, fatigue or security protocols.",
      "If a plan is built on image rather than truth, dismantle it voluntarily before the year does it violently.",
    ],
  },
  17: {
    shortName: "Star of the Magi — immortality through trial",
    domains: [
      "legacy",
      "authority",
      "spiritualized power",
      "posthumous name",
      "moral victory",
    ],
    gifts: [
      "lasting honor",
      "peace after difficulty",
      "authority with compassion",
    ],
    polarity: "constructive",
    thesis:
      "17/8 is one of the strongest legacy signatures: even when the year contains danger, the person’s name, influence or moral authority tends to outlive the immediate circumstance.",
    historical: [
      "Mandela 1990 and Kobe Bryant 2020 show 17/8 as name-immortality through trial or death; it explains legacy better than event mechanics.",
    ],
  },
  18: {
    shortName: "Conflict of Spirit and Matter — factional danger",
    domains: [
      "war",
      "activism",
      "enmity",
      "social upheaval",
      "violent opposition",
    ],
    crisisTags: ["conflict", "enmity", "violence", "instability"],
    polarity: "cautionary",
    thesis:
      "18/9 brings Mars into a completion year: conflict, factional hostility, ideological battle and violent social currents become more likely unless disciplined nonviolence is consciously chosen.",
    historical: [
      "Malcolm X 1965 shows 18/9 as factional conflict, public danger and violent completion.",
    ],
  },
  19: {
    shortName: "Prince of Heaven — victory over temporal failure",
    domains: [
      "victory",
      "honor",
      "election",
      "public favor",
      "radiant comeback",
    ],
    gifts: ["disproportionate success", "support", "honor", "solar confidence"],
    polarity: "constructive",
    thesis:
      "19/1 is the triumph side of the 1-series: it does not deny effort or danger, but it often shows the final return being greater than the visible input.",
    historical: [
      "Trump 2024 demonstrates the exact 19/1 pattern when paired with 28/1: the law-pressure side did not prevent final victory.",
    ],
  },
  21: {
    shortName: "Crown of the Magi — honors after long initiation",
    domains: [
      "elevation",
      "awards",
      "promotion",
      "public honor",
      "victory after tests",
    ],
    gifts: ["recognition", "legitimate authority", "creative/public success"],
    polarity: "constructive",
    thesis:
      "21/3 is not random luck; it is the crown placed after initiation. It is exceptionally strong for elections, awards, promotions and public recognitions that follow a long ordeal.",
    historical: [
      "Mandela 1994 is the model case: the crown after decades of initiation and tests.",
    ],
  },
  22: {
    shortName: "Master Builder under danger — scale before safety",
    domains: [
      "mass movements",
      "acquisitions",
      "institutions",
      "architecture",
      "systems",
    ],
    crisisTags: ["structural overreach", "danger seen late"],
    polarity: "threshold",
    thesis:
      "22/4 must be read as both gift and warning: the person can build at scale, but the same scale magnifies every blind spot and every unreliable adviser.",
    historical: [
      "Obama 2008 shows the brilliant side of 22/4; Musk 2022-style readings show the danger when the builder acquires a platform before grounding governance.",
    ],
  },
  23: {
    shortName: "Royal Star of the Lion — support from high places",
    domains: [
      "patronage",
      "authority support",
      "appointments",
      "protection",
      "public success",
    ],
    polarity: "constructive",
    thesis:
      "23/5 brings movement through doors opened by powerful allies, institutions or public favor. It is one of the strongest support signatures in the 5-series.",
    historical: [
      "Obama 2009 shows the elevation/protection side through inauguration and international honor.",
    ],
  },
  26: {
    shortName: "Gravest Warnings — ruin through association",
    domains: ["business", "law", "finance", "partnerships", "bad advice"],
    crisisTags: ["ruin", "bad speculation", "partnership danger"],
    polarity: "cautionary",
    thesis:
      "26/8 is not a general bad-luck number; it is a specific warning about relying on partners, advisers, speculations or unions that cannot carry the weight placed on them.",
  },
  28: {
    shortName: "The Lamb — promise, law, loss and renewal",
    domains: [
      "law",
      "competition",
      "trust",
      "campaigns",
      "business",
      "renewal",
    ],
    gifts: ["resilience", "regeneration", "new road after loss"],
    shadows: [
      "loss through law",
      "betrayal of trust",
      "opposition",
      "exhausting restart",
    ],
    crisisTags: ["law", "loss", "opposition", "betrayal"],
    polarity: "mixed",
    thesis:
      "28/1 is the crucifixion-and-comeback compound of the 1-series: the person can be promising, visible and capable, yet still be stripped, opposed, sued, betrayed or forced to restart unless the future is protected in advance.",
    historical: [
      "Trump 2024 is the clearest modern validation: legal danger, opposition, assassination attempts and renewal into victory when supported by classic 19/1.",
      "Gandhi/Napoleon-style 28 cases show that at younger ages it may appear as romantic or military rise; at older ages it becomes legacy, law, exhaustion and karmic reckoning.",
    ],
    predictive:
      "Expect the year to test trust, contracts, law, competition and the person’s ability to begin again without losing the central mission.",
    protective: [
      "Get agreements in writing and preserve legal reserves.",
      "Expect opposition before it appears; the point is not paranoia but future-proofing.",
    ],
  },
  29: {
    shortName: "Grace Under Trial — emotional trial by relationship",
    domains: [
      "partnership",
      "public sympathy",
      "betrayal",
      "emotional endurance",
    ],
    crisisTags: ["trial", "treachery", "emotional betrayal"],
    polarity: "cautionary",
    thesis:
      "29/2 places the person under relational trial. It may generate public sympathy, but the sympathy usually comes because the year has first exposed betrayal, grief or vulnerability.",
  },
  30: {
    shortName: "Crossroads — achievement and disappointment held together",
    domains: [
      "writing",
      "research",
      "intellectual work",
      "private decision",
      "ambivalence",
    ],
    gifts: ["detached intelligence", "deep analysis", "private mastery"],
    shadows: [
      "ambivalence",
      "missed emotional satisfaction",
      "achievement without joy",
    ],
    crisisTags: ["crossroads", "mental isolation"],
    polarity: "threshold",
    thesis:
      "30/3 is the crossroads of the mental plane: achievements can be real while private disappointment remains unresolved. The prediction must therefore watch not only success, but the person’s relationship to that success.",
    historical: [
      "Historically, 30/3 often appears when the person produces thought, writing or theory while emotionally standing at a fork in the road.",
    ],
  },
  32: {
    shortName: "Unexpected Power — creative influence if self-trust holds",
    domains: [
      "creative influence",
      "media",
      "public reach",
      "coalitions",
      "surprising success",
    ],
    polarity: "constructive",
    thesis:
      "32/5 gives power through expression and movement, but only when the person holds to their own judgment instead of letting stubborn or foolish people redirect the plan.",
    historical: [
      "Einstein 1905 and Taylor Swift 2023 show 32/5 as unexpectedly far-reaching creative power.",
    ],
  },
  33: {
    shortName: "Master Teacher — humanity instructed by service",
    domains: [
      "science",
      "teaching",
      "healing",
      "spiritual instruction",
      "public example",
    ],
    polarity: "constructive",
    thesis:
      "33/6 must not be flattened into ordinary 6. It makes the year educational for the collective: the person, the work or the sacrifice becomes a lesson beyond the private life.",
    historical: [
      "Einstein 1915 and Gandhi 1947 validate 33/33 as world-teaching signatures in science and moral service.",
    ],
  },
  35: {
    shortName:
      "Disastrous Warning Repeated — creative/business alliance danger",
    domains: ["business", "creative partnership", "finance", "contracts"],
    crisisTags: ["disaster by association", "bad advice", "partnership danger"],
    polarity: "cautionary",
    thesis:
      "35/8 repeats the 26/8 warning but often through creative, sports, entertainment or dynamic business channels. It is a partner-and-vehicle risk more than a solitary failure.",
    historical: [
      "Kobe Bryant 2020 is a partial validation: 35/8 does not name aviation, but it does carry a severe association/disaster warning.",
    ],
  },
  38: {
    shortName: "Professional Trial / Master-11 Collapse Potential",
    domains: [
      "professional partnership",
      "public creativity",
      "vision under pressure",
      "betrayal",
    ],
    crisisTags: ["trial", "treachery", "visionary collapse"],
    polarity: "mixed",
    thesis:
      "38/2 should be read through its hidden 11: it can make the year visionary and magnetic, but if the vision is unsupported by reality it collapses through professional betrayal, misjudgment or the stupidity of others.",
    historical: [
      "Napoleon 1815-style 38/11 readings show defeat as visionary collapse, not just bad luck.",
      "Ali 1964 shows the constructive side when 38/2 is supported by classic 11/2 strength.",
    ],
  },
  39: {
    shortName: "Scattered Vision — many projects, dispersed force",
    domains: [
      "creative multiplicity",
      "public narrative",
      "unfinished work",
      "competing obligations",
    ],
    crisisTags: [
      "scattering",
      "loss of focus",
      "sacrifice of one clear mission",
    ],
    polarity: "mixed",
    thesis:
      "39/3 is not merely “many projects.” It is creative fire dispersed across too many fronts. The person may be seen everywhere while the central vision risks dilution.",
    historical: [
      "In historical testing, 39/3 performs best when read as a visibility-and-dispersion number: the person has reach, but the question is whether the reach coheres into one remembered victory.",
    ],
  },
  40: {
    shortName: "Higher Recluse — prominence built on rules that may bend",
    domains: [
      "prominent position",
      "institutional work",
      "system-building",
      "rule-flexing",
    ],
    polarity: "mixed",
    thesis:
      "40/4 gives disciplined rise into visible responsibility, but it carries a subtle warning: the person may charm or bend rules to occupy a structure that later demands more grounding than charisma can supply.",
  },
  44: {
    shortName: "Master Business Number — power that does not know when to stop",
    domains: [
      "business",
      "engineering",
      "executive pressure",
      "overwork",
      "financial survival",
    ],
    crisisTags: ["overreach", "business obsession"],
    polarity: "mixed",
    thesis:
      "44/8 gives exceptional command of systems and business reality. Its predictive danger is not ignorance but excess: the person understands the machine so well that they may refuse to stop even when the body, team or finances demand it.",
    historical: [
      "Musk 2008 is a model 44/8 year: business mastery, extreme pressure, and survival through relentless execution.",
    ],
  },
  48: {
    shortName: "Crown and Cross — elevation with sacrifice",
    domains: [
      "high office",
      "creative/institutional vision",
      "public burden",
      "friction",
      "sacrifice",
    ],
    crisisTags: ["friction", "sacrifice", "opposition from all sides"],
    polarity: "mixed",
    thesis:
      "48/3 is better read as Crown and Cross: the person may rise to a visible creative or institutional height, but that height is accompanied by friction, resistance and private sacrifice.",
    historical: [
      "Mandela 1994 shows why 48/3 must not be read as mere friction; it can coexist with historic elevation when classic 21/3 supplies the crown.",
    ],
  },
  51: {
    shortName: "Warrior’s Sacrifice — advancement through danger",
    domains: [
      "military",
      "sport",
      "aviation",
      "leadership under threat",
      "assassination/danger",
    ],
    crisisTags: ["danger", "assassination", "violent opposition"],
    polarity: "mixed",
    thesis:
      "51/6 is a high-alert number for public figures, pilots, fighters, leaders and protectors because it explicitly combines sudden advancement with danger and the possibility of assassination or violent threat.",
    historical: [
      "Amelia Earhart 1937 validates 51/6 as a danger-through-bold-mission signature.",
    ],
  },
  55: {
    shortName: "Master Communicator’s Sword — decisive words in crisis",
    domains: [
      "war communication",
      "broadcasting",
      "command",
      "rapid change",
      "honors",
    ],
    crisisTags: ["menace", "forceful conflict"],
    polarity: "mixed",
    thesis:
      "55/1 transcends the 52-week classical boundary and behaves like a master communication sword: words, orders, broadcasts or decisive messages cut history into before and after.",
    historical: [
      "Churchill 1940 is the core validation: the sword was not only military, it was rhetorical, turning national fear into defiance.",
    ],
  },
  59: {
    shortName:
      "Reckoning Through the Voice — persuasion, honor and bodily cost",
    domains: [
      "communication",
      "honor",
      "health reckoning",
      "public persuasion",
      "late-career review",
    ],
    crisisTags: ["reckoning", "health strain", "overextension"],
    polarity: "mixed",
    thesis:
      "59/5 is persuasive, but historical testing suggests it should be read with a reckoning layer: the voice wins recognition while the body or private life demands payment for years of motion.",
    historical: [
      "Churchill 1953-style validation: public honor and literary recognition coincided with serious health strain.",
    ],
  },
  60: {
    shortName: "Love Tested to the Limit — care, loyalty and rejection",
    domains: [
      "public love",
      "family/nation",
      "electoral judgment",
      "care with boundaries",
      "service",
    ],
    crisisTags: ["subservience", "rejection despite love"],
    polarity: "mixed",
    thesis:
      "60/6 is not simply a loving year. It asks whether love is gratitude, obligation, dependency or freedom. A nation, family or audience may love the person and still refuse to keep them in the same role.",
    historical: [
      "Churchill 1945 validates 60/6: national love and gratitude were real, yet the electorate rejected him for peacetime leadership.",
    ],
  },
};
const DANGER_WORDS = [
  "accident",
  "fatal",
  "fatality",
  "assassination",
  "danger",
  "law",
  "loss",
  "ruin",
  "treachery",
  "trial",
  "collapse",
  "defeat",
  "violence",
  "enmity",
  "disaster",
  "opposition",
  "betrayal",
  "reversal",
  "reckoning",
  "overreach",
];
function calibrationFor(
  compound: ChaldeanPYNCompound | null,
  reduced: number,
): Calibration {
  const base =
    REDUCED_CALIBRATIONS[reduced] || REDUCED_CALIBRATIONS[reduced % 9 || 9];
  if (!compound) return base;
  const override = COMPOUND_CALIBRATIONS[compound.compound] || {};
  const merged: Calibration = {
    shortName:
      override.shortName ??
      `${compound.compound}/${compound.reduced} — ${compound.name}`,
    domains: uniq([...base.domains, ...(override.domains ?? [])]),
    gifts: uniq([...base.gifts, ...(override.gifts ?? [])]),
    shadows: uniq([...base.shadows, ...(override.shadows ?? [])]),
    crisisTags: uniq([...base.crisisTags, ...(override.crisisTags ?? [])]),
    polarity: override.polarity ?? base.polarity,
    thesis: override.thesis ?? base.thesis,
    historical: uniq([...base.historical, ...(override.historical ?? [])]),
    predictive: override.predictive ?? base.predictive,
    protective: uniq([...base.protective, ...(override.protective ?? [])]),
  };
  return merged;
}
function uniq<T>(arr: T[]): T[] {
  return [...new Set(arr.filter(Boolean))];
}
function label(
  raw: number,
  reduced: number,
  compound: ChaldeanPYNCompound | null,
): string {
  return compound
    ? `${raw}/${reduced} — ${compound.name}`
    : `${raw}/${reduced}`;
}
function extractText(compound: ChaldeanPYNCompound | null): string {
  if (!compound) return "";
  return [
    compound.symbolism,
    compound.vibrationalEssence,
    compound.karmicDynamics,
    compound.manifestationPatterns,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}
function dangerScore(
  cal: Calibration,
  compound: ChaldeanPYNCompound | null,
): number {
  const text = extractText(compound);
  let score = cal.crisisTags.length;
  for (const word of DANGER_WORDS) if (text.includes(word)) score += 1;
  if (compound?.isKarmicDebt) score += 2;
  if ([13, 14, 16, 19].includes(compound?.compound || -1)) score += 1;
  return score;
}
function determinePolarity(
  a: Calibration,
  b: Calibration,
): PersonalYearDualEssenceSynthesis["polarity"] {
  const vals = [a.polarity, b.polarity];
  if (vals.includes("cautionary") && vals.includes("constructive"))
    return "mixed ordeal-and-reward";
  if (vals.every((v) => v === "constructive"))
    return "predominantly constructive";
  if (vals.every((v) => v === "cautionary")) return "predominantly cautionary";
  if (vals.includes("threshold")) return "threshold / transition";
  return "mixed ordeal-and-reward";
}
function makeTitle(
  args: BuildArgs,
  directCal: Calibration,
  classicCal: Calibration,
): string {
  const d = args.directCompound?.compound;
  const c = args.classicCompound?.compound;
  if (d === 28 && c === 19)
    return "The Phoenix Tried by Law and Raised by Solar Favor";
  if (d === 55 || c === 55)
    return "The Sword Year: Command, Crisis and Words that Cut History";
  if (d === 51 || c === 51)
    return "The Warrior’s Sacrifice: Advancement Through Danger";
  if (d === 16 || c === 16)
    return "The Shattered Citadel: Collapse, Safety and Spiritual Correction";
  if (d === 13 || c === 13) return "The Death-and-Rebirth Foundation Year";
  if (d === 22 || c === 22)
    return "The Master Builder’s Trial of Scale and Grounding";
  if (d === 33 || c === 33 || args.directYear === 33 || args.classicYear === 33)
    return "The Master Teacher Year: Service Becomes a World Lesson";
  if (d === 21 || c === 21) return "The Crown After Initiation";
  if (d === 17 || c === 17) return "The Star of Legacy Rising Through Trial";
  if (d === 48 || c === 48)
    return "The Crown and the Cross: Elevation with Sacrifice";
  if (d === 39 || c === 39)
    return "The Scattered Vision Seeking One Victorious Thread";
  if (d === 30 || c === 30)
    return "The Crossroads of Achievement and Private Meaning";
  if (
    directCal.polarity === "cautionary" &&
    classicCal.polarity === "constructive"
  )
    return "Ordeal Outside, Blessing Inside";
  if (
    directCal.polarity === "constructive" &&
    classicCal.polarity === "cautionary"
  )
    return "Blessing Outside, Trial Beneath";
  return `${directCal.shortName} × ${classicCal.shortName}`;
}
function ageBand(age: number | null): {
  band: string;
  modifier: string;
  multiplier: number;
} {
  if (age === null || Number.isNaN(age)) {
    return {
      band: "Age not supplied",
      multiplier: 1,
      modifier:
        "No birth year was supplied to the personal-year synthesis, so the app cannot apply age-specific manifestation weighting. The compound reading remains valid, but it cannot distinguish whether the number is likely to manifest as youthful career/romantic launch, mid-life restructuring, or elder legacy/health reckoning.",
    };
  }
  if (age < 20)
    return {
      band: "formation age",
      multiplier: 0.9,
      modifier: `At age ${age}, the compound tends to manifest through family, education, identity formation, first public tests, bodily safety and the adults/institutions around the person. It rarely gives the full public event by itself unless the person is already historically visible.`,
    };
  if (age <= 35)
    return {
      band: "20–35 launch window",
      multiplier: 1.1,
      modifier: `At age ${age}, the compound usually manifests as career ignition, romantic destiny, military or artistic rise, migration, public breakthrough, first major office, first scandal, first fortune or first great loss. This is the Napoleon-1796 style of manifestation: the number is hungry, outward, romantic, ambitious and eager to prove itself.`,
    };
  if (age <= 55)
    return {
      band: "35–55 consolidation / mid-life test",
      multiplier: 1.15,
      modifier: `At age ${age}, the same compound becomes a test of structures already built. It is less about first beginnings and more about whether marriage, company, reputation, philosophy, office or body can survive pressure. Success here consolidates authority; failure here forces a mid-life redesign.`,
    };
  return {
    band: "55+ legacy, health and karmic reckoning window",
    multiplier: 1.25,
    modifier: `At age ${age}, the compound is weighted toward legacy, law, health, public memory, succession, mortality, accumulated karma and the verdict of history. The same 28/1 that may show young romance or military rise at 26 can become litigation, exhaustion, danger, inheritance, reputation and destiny-protection at 78. Elder years make the text more literal because consequences have had decades to gather.`,
  };
}
function ageResonance(age: number | null, args: BuildArgs): string[] {
  if (age === null || Number.isNaN(age)) return [];
  const notes: string[] = [];
  const reduce = (n: number) => {
    let x = Math.abs(n);
    while (x > 9 && x !== 11 && x !== 22 && x !== 33)
      x = String(x)
        .split("")
        .reduce((a, d) => a + Number(d), 0);
    return x;
  };
  if (age === args.directRaw)
    notes.push(
      `Age ${age} exactly equals the Direct raw compound ${args.directRaw}; this makes the Direct essence more literal and event-facing.`,
    );
  if (age === args.classicRaw)
    notes.push(
      `Age ${age} exactly equals the Classic raw compound ${args.classicRaw}; this makes the Classic essence more karmically literal.`,
    );
  if (reduce(age) === args.directYear || reduce(age) === args.classicYear)
    notes.push(
      `Age ${age} reduces to ${reduce(age)}, resonating with the reduced personal-year field; the year is more likely to feel fated or repetitive.`,
    );
  if (age >= 27 && age <= 31)
    notes.push(
      "This is a Saturn-return threshold; compounds dealing with law, structure, work, body and public responsibility intensify.",
    );
  if (age >= 39 && age <= 42)
    notes.push(
      "This is a mid-life threshold; compounds dealing with identity, marriage, career direction and mortality become more existential.",
    );
  if (age >= 58 && age <= 60)
    notes.push(
      "This is a second-Saturn threshold; health, duty, leadership handover and legacy review intensify.",
    );
  if (age >= 72)
    notes.push(
      "This is an elder-legacy threshold; the reading should prioritize law, health, succession, historical judgment and karmic harvest over youthful romance or ordinary career beginnings.",
    );
  return notes;
}
function masterSignal(args: BuildArgs): string | null {
  const parts: string[] = [];
  const masterRaws = [11, 22, 33];
  if (
    masterRaws.includes(args.directRaw) ||
    [11, 22, 33].includes(args.directYear) ||
    args.directCompound?.isMasterNumber
  ) {
    const n = masterRaws.includes(args.directRaw)
      ? args.directRaw
      : args.directYear;
    parts.push(
      `Direct essence carries Master ${n}. This must not be reduced to ordinary ${n === 11 ? "2" : n === 22 ? "4" : "6"} behavior. Master ${n} makes the outward events symbolic, historically visible and harder on the nervous system because the person is carrying more collective voltage than usual.`,
    );
  }
  if (
    masterRaws.includes(args.classicRaw) ||
    [11, 22, 33].includes(args.classicYear) ||
    args.classicCompound?.isMasterNumber
  ) {
    const n = masterRaws.includes(args.classicRaw)
      ? args.classicRaw
      : args.classicYear;
    parts.push(
      `Classic essence carries Master ${n}. The underlying storyline therefore operates as a teaching, building or illumination test, not merely as a personal mood. This is why 33/33 can describe Einstein 1915 as master-teacher science, Gandhi 1947 as master-teacher sacrifice, and 22/22 as a master-builder project that must be grounded or it overreaches.`,
    );
  }
  return parts.length ? parts.join("\n\n") : null;
}
function karmicDebtSignal(
  args: BuildArgs,
  directCal: Calibration,
  classicCal: Calibration,
): string | null {
  const severe = [
    13, 14, 16, 18, 26, 28, 29, 35, 38, 43, 47, 51, 52, 53, 55, 59,
  ];
  const present = [
    args.directCompound?.compound,
    args.classicCompound?.compound,
  ].filter((n): n is number => typeof n === "number");
  const dangerTags = uniq([...directCal.crisisTags, ...classicCal.crisisTags]);
  const hit = present.filter((n) => severe.includes(n));
  if (!hit.length && !dangerTags.length) return null;
  return `Historical alert layer: compound(s) ${hit.length ? hit.join(", ") : "with cautionary wording"} contain elevated caution signatures: ${dangerTags.join(", ") || "law/loss/overreach/hidden danger"}. This is not a deterministic death prediction. It means the reading should become concrete and preventive: review transport, health, legal exposure, contracts, security, medication, fatigue, partner reliability and public conflict. In historical testing, the best hits came when these alert words were read literally enough to produce protective action, not vaguely as “negative energy.”`;
}
function buildHistoricalCalibration(
  directCal: Calibration,
  classicCal: Calibration,
): string {
  const lines = uniq([...directCal.historical, ...classicCal.historical]);
  if (!lines.length) {
    return "Historical calibration for this exact pair is still thin. Treat the reading as a hypothesis: compare the direct external domain against the classic inner storyline, then record the year’s actual events to improve future weighting.";
  }
  return `Historical calibration used by this synthesis:\n${lines.map((l) => `• ${l}`).join("\n")}`;
}
function roleText(
  kind: "direct" | "classic",
  raw: number,
  reduced: number,
  compound: ChaldeanPYNCompound | null,
  cal: Calibration,
): string {
  const role =
    kind === "direct"
      ? "Direct essence is read as the visible weather of the year: the arenas, external triggers, public events and concrete manifestation channels most likely to show up."
      : "Classic essence is read as the older Chaldean storyline underneath the events: the karmic plot, inner lesson, hidden blessing, hidden danger or final verdict that explains why the outer events take their shape.";
  return `${role}\n\n${kind === "direct" ? "Direct" : "Classic"} compound: ${label(raw, reduced, compound)}. Historical-calibrated thesis: ${cal.thesis}\n\nPredictive emphasis: ${cal.predictive}`;
}
export function buildPersonalYearDualEssenceSynthesis(
  args: BuildArgs,
): PersonalYearDualEssenceSynthesis {
  const directCal = calibrationFor(args.directCompound, args.directYear);
  const classicCal = calibrationFor(args.classicCompound, args.classicYear);
  const birthYear = args.birthYear;
  const age =
    typeof birthYear === "number" ? args.targetYear - birthYear : null;
  const ageInfo = ageBand(age);
  const resonance = ageResonance(age, args);
  const master = masterSignal(args);
  const karmic = karmicDebtSignal(args, directCal, classicCal);
  const domains = uniq([...directCal.domains, ...classicCal.domains]);
  const predictionFocusAreas = uniq([
    ...domains.slice(0, 10),
    ...directCal.crisisTags.map((t) => `watch: ${t}`),
    ...classicCal.crisisTags.map((t) => `watch: ${t}`),
  ]);
  const protectiveActions = uniq([
    ...directCal.protective,
    ...classicCal.protective,
  ]);
  const polarity = determinePolarity(directCal, classicCal);
  const intensityScore = Math.min(
    100,
    Math.round(
      (55 +
        (dangerScore(directCal, args.directCompound) +
          dangerScore(classicCal, args.classicCompound)) *
          4 +
        (master ? 10 : 0)) *
        ageInfo.multiplier,
    ),
  );
  const title = makeTitle(args, directCal, classicCal);
  const subtitle = `${label(args.directRaw, args.directYear, args.directCompound)} × ${label(args.classicRaw, args.classicYear, args.classicCompound)} · ${ageInfo.band} · ${polarity}`;
  const historicalCalibration = buildHistoricalCalibration(
    directCal,
    classicCal,
  );
  const directEssenceRole = roleText(
    "direct",
    args.directRaw,
    args.directYear,
    args.directCompound,
    directCal,
  );
  const classicEssenceRole = roleText(
    "classic",
    args.classicRaw,
    args.classicYear,
    args.classicCompound,
    classicCal,
  );
  const ageModifier = [ageInfo.modifier, ...resonance].join("\n\n");
  const synthesisText = [
    `DUAL-ESSENCE PERSONAL YEAR SYNTHESIS\n${title}\n${subtitle}\n\nAccuracy protocol: read the Direct and Classic essences together. Do not choose the prettier one. Direct shows where life is likely to manifest externally; Classic shows the deeper storyline and final spiritual/karmic interpretation. When one essence is cautionary and the other triumphant, the correct prediction is usually a mixed plot: ordeal followed by elevation, victory paid for by sacrifice, or success that arrives only after the danger-word in the other compound has become concrete.`,
    `\n1. DIRECT ESSENCE — OUTER MANIFESTATION\n${directEssenceRole}`,
    `\n2. CLASSIC ESSENCE — INNER / KARMIC STORYLINE\n${classicEssenceRole}`,
    `\n3. THE COMBINED READING\nThis year should be read as “${title}.” The direct compound contributes ${directCal.shortName}; the classic compound contributes ${classicCal.shortName}. In practice this means the year is unlikely to be one-dimensional. The person may experience the visible events through ${directCal.domains.slice(0, 5).join(", ")}, while the deeper meaning is decided through ${classicCal.domains.slice(0, 5).join(", ")}. Gifts to cultivate: ${uniq(
      [...directCal.gifts, ...classicCal.gifts],
    )
      .slice(0, 8)
      .join(", ")}. Shadows to manage: ${uniq([
      ...directCal.shadows,
      ...classicCal.shadows,
    ])
      .slice(0, 8)
      .join(", ")}.`,
    `\n4. AGE AND INTENSITY MODIFIER\n${ageModifier}\n\nIntensity score: ${intensityScore}/100. This is not “good” or “bad”; it measures how literally and visibly the compound may manifest. High intensity means the reading should be translated into concrete domains, schedules, contracts, travel choices, health precautions and public strategy.`,
    master
      ? `\n5. MASTER-NUMBER DIFFERENTIATION\n${master}`
      : `\n5. MASTER-NUMBER DIFFERENTIATION\nNo master-number override is active in the raw or reduced essences. Read the compound through its ordinary Chaldean number family, with the direct/classic distinction carrying most of the specificity.`,
    karmic
      ? `\n6. KARMIC / HISTORICAL ALERT FIELD\n${karmic}`
      : `\n6. KARMIC / HISTORICAL ALERT FIELD\nNo severe historical-alert compound is dominant. The year may still contain normal stress, but the compound pair is not primarily a violent-loss or catastrophic warning signature.`,
    `\n7. HISTORICAL VALIDATION NOTES\n${historicalCalibration}`,
    `\n8. PRACTICAL PREDICTION MAP\nMost likely manifestation fields: ${predictionFocusAreas.join("; ")}.\n\nProtective and optimizing actions:\n${protectiveActions.map((a) => `• ${a}`).join("\n") || "• Record the year’s events and compare them with both essences so the app’s historical weighting can keep improving."}`,
    `\n9. FINAL JUDGMENT\nThe year is best treated as a living synthesis rather than a single sentence. If the public events become difficult, search the classic essence for the hidden reward or lesson. If the public events become triumphant, search the other essence for the cost, obligation or danger that must still be managed. This dual reading is the historical-calibrated method that produced the strongest matches in famous-person testing.`,
  ].join("\n");
  return {
    title,
    subtitle,
    synthesisText,
    directEssenceRole,
    classicEssenceRole,
    ageModifier,
    masterNumberSignal: master,
    karmicDebtSignal: karmic,
    historicalCalibration,
    predictionFocusAreas,
    protectiveActions,
    domains,
    polarity,
    intensityScore,
  };
}