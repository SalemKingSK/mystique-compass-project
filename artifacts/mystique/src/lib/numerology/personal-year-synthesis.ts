/**
 * MYSTIQUE COMPASS — Forensic Personal Year Synthesis
 *
 * This module turns the Direct + Classic compound pair into one integrated
 * diagnosis. It does not merely print two meanings side-by-side. It performs a
 * historical-cluster comparison, detects reinforcement/conflict, ranks life
 * domains, forecasts behaviour/decisions/outcomes, and returns a consultant-like
 * narrative that feels specific to the year being examined.
 */

import type { ChaldeanPYNCompound } from '@/lib/numerology/chaldean-pyn-compounds';

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
  polarity: 'predominantly constructive' | 'predominantly cautionary' | 'mixed ordeal-and-reward' | 'threshold / transition';
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
  occupation?: string;
  wealthProfile?: 'low' | 'modest' | 'comfortable' | 'wealthy' | 'institutional';
  relationshipStatus?: 'single' | 'partnered' | 'married' | 'separated' | 'widowed' | 'unknown';
  visibility?: 'private' | 'local' | 'public' | 'global';
}

type Domain =
  | 'career' | 'leadership' | 'law' | 'money' | 'publicVisibility' | 'competition'
  | 'relationships' | 'family' | 'health' | 'travel' | 'creativeOutput' | 'spirituality'
  | 'security' | 'home' | 'education' | 'legacy' | 'service' | 'reputation';

type Trait =
  | 'expansion' | 'contraction' | 'visibility' | 'withdrawal' | 'victory' | 'loss'
  | 'lawPressure' | 'competition' | 'service' | 'danger' | 'discipline' | 'creativity'
  | 'relationshipDependence' | 'legacy' | 'reinvention' | 'reckoning';

type Polarity = 'constructive' | 'cautionary' | 'mixed' | 'threshold';

type ScoreMap<T extends string> = Partial<Record<T, number>>;

interface CompoundIntelligence {
  name: string;
  domains: ScoreMap<Domain>;
  traits: ScoreMap<Trait>;
  polarity: Polarity;
  thesis: string;
  likelyMistake: string;
  strategicMove: string;
  outcomeLogic: string;
}

interface PairArchetype {
  title: string;
  thesis: string;
  decisionForecasts: string[];
  personalityShift: string;
  outcomePrediction: string;
  protectiveStrategy: string;
  domainBoost?: ScoreMap<Domain>;
}

interface HistoricalCase {
  id: string;
  person: string;
  year: number;
  age: number;
  occupation: string;
  wealth: 'low' | 'modest' | 'comfortable' | 'wealthy' | 'institutional';
  relationshipStatus: 'single' | 'partnered' | 'married' | 'separated' | 'widowed' | 'unknown';
  visibility: 'private' | 'local' | 'public' | 'global';
  eventCategory: string;
  direct: number;
  classic: number;
  directReduced: number;
  classicReduced: number;
  domains: ScoreMap<Domain>;
  eventIntensity: number;
  outcome: 'triumph' | 'loss' | 'mixed' | 'transition' | 'legacy';
  narrative: string;
  falsePositives: string[];
  decisions: string[];
  personalityShift: string;
  protectiveLesson: string;
}

const DOMAIN_LABELS: Record<Domain, string> = {
  career: 'Career / work direction',
  leadership: 'Leadership / authority',
  law: 'Law / contracts / formal judgment',
  money: 'Money / assets / business risk',
  publicVisibility: 'Public visibility / audience',
  competition: 'Competition / opposition',
  relationships: 'Relationships / alliances',
  family: 'Family / domestic duty',
  health: 'Health / body / fatigue',
  travel: 'Travel / movement / relocation',
  creativeOutput: 'Creative output / communication',
  spirituality: 'Spirituality / inner truth',
  security: 'Security / safety / protection',
  home: 'Home / residence / roots',
  education: 'Study / research / learning',
  legacy: 'Legacy / historical memory',
  service: 'Service / duty / care',
  reputation: 'Reputation / name / public story',
};

const ALL_DOMAINS = Object.keys(DOMAIN_LABELS) as Domain[];
const ALL_TRAITS: Trait[] = ['expansion','contraction','visibility','withdrawal','victory','loss','lawPressure','competition','service','danger','discipline','creativity','relationshipDependence','legacy','reinvention','reckoning'];

function d(scores: ScoreMap<Domain>): ScoreMap<Domain> { return scores; }
function t(scores: ScoreMap<Trait>): ScoreMap<Trait> { return scores; }
function clamp01(n: number): number { return Math.max(0, Math.min(1, n)); }
function pct(n: number): number { return Math.round(clamp01(n) * 100); }
function uniq<T>(arr: T[]): T[] { return [...new Set(arr.filter(Boolean))]; }
function cnum(c: ChaldeanPYNCompound | null, fallback: number): number { return c?.compound ?? fallback; }
function label(raw: number, reduced: number, compound: ChaldeanPYNCompound | null): string { return compound ? `${raw}/${reduced} — ${compound.name}` : `${raw}/${reduced}`; }

const REDUCED_INTELLIGENCE: Record<number, CompoundIntelligence> = {
  1: { name:'Initiation', domains:d({career:.72, leadership:.78, publicVisibility:.62, reputation:.58, competition:.48}), traits:t({expansion:.82, visibility:.7, victory:.55, discipline:.42}), polarity:'constructive', thesis:'The year wants a new public position, a fresh identity, or a visible act of will.', likelyMistake:'acting fast without protecting the future structure', strategicMove:'choose one decisive initiative and make its legal/financial foundation explicit', outcomeLogic:'outcomes follow the quality of initiative and self-command' },
  2: { name:'Relational trial', domains:d({relationships:.78, publicVisibility:.45, law:.38, reputation:.42}), traits:t({relationshipDependence:.82, withdrawal:.35, danger:.35}), polarity:'mixed', thesis:'Other people become the channel through which the year delivers both help and complication.', likelyMistake:'mistaking emotional intensity for reliability', strategicMove:'test alliances before depending on them', outcomeLogic:'outcomes turn on partner quality, timing, and discernment' },
  3: { name:'Expression', domains:d({creativeOutput:.82, publicVisibility:.72, reputation:.62, education:.55, relationships:.4}), traits:t({creativity:.9, visibility:.68, expansion:.56}), polarity:'constructive', thesis:'The year becomes visible through speech, writing, performance, publication, teaching, or the public story around the person.', likelyMistake:'being seen everywhere while finishing nothing central', strategicMove:'make one message sovereign', outcomeLogic:'outcomes improve when expression is disciplined rather than scattered' },
  4: { name:'Foundation pressure', domains:d({career:.72, money:.55, health:.52, home:.48, security:.55}), traits:t({discipline:.88, contraction:.58, reckoning:.5, reinvention:.45}), polarity:'threshold', thesis:'The year tests the structure underneath life and forces weak foundations to be rebuilt.', likelyMistake:'trying to force speed in a year that demands architecture', strategicMove:'slow down enough to build something that can survive pressure', outcomeLogic:'outcomes depend on the strength of systems, routines, and responsibilities' },
  5: { name:'Movement and risk', domains:d({travel:.78, creativeOutput:.65, publicVisibility:.65, money:.5, law:.38, career:.52}), traits:t({expansion:.82, creativity:.52, danger:.42, visibility:.56}), polarity:'mixed', thesis:'The year accelerates movement, communication, travel, markets, media, and freedom decisions.', likelyMistake:'confusing flexibility with recklessness', strategicMove:'move quickly but verify contracts, vehicles, promises, and numbers', outcomeLogic:'outcomes reward adaptability and punish haste' },
  6: { name:'Duty and care', domains:d({family:.78, service:.72, relationships:.65, home:.62, health:.42, publicVisibility:.35}), traits:t({service:.86, contraction:.35, relationshipDependence:.45}), polarity:'mixed', thesis:'The year asks who or what must be served, repaired, loved, released, or carried.', likelyMistake:'letting responsibility become subservience', strategicMove:'serve with boundaries', outcomeLogic:'outcomes depend on emotional maturity and duty without self-erasure' },
  7: { name:'Investigation and correction', domains:d({spirituality:.78, health:.6, security:.55, education:.62, reputation:.35}), traits:t({withdrawal:.78, danger:.55, contraction:.62, reckoning:.55}), polarity:'cautionary', thesis:'The year pulls life under the surface and exposes what was hidden, unsafe, false, or spiritually unfinished.', likelyMistake:'ignoring the body, fatigue, intuition, or safety signals', strategicMove:'reduce speed and let evidence correct belief', outcomeLogic:'outcomes improve through humility, caution, research, and surrender' },
  8: { name:'Power and material karma', domains:d({money:.82, career:.78, law:.62, leadership:.68, reputation:.55}), traits:t({discipline:.6, lawPressure:.55, competition:.58, reckoning:.6, victory:.48}), polarity:'mixed', thesis:'The year brings power, money, contracts, law, office, business, and public consequence to judgment.', likelyMistake:'overreach or misplaced trust in partners', strategicMove:'audit exposure before expanding authority', outcomeLogic:'outcomes mirror previous ambition and present integrity' },
  9: { name:'Completion and legacy', domains:d({legacy:.78, service:.62, publicVisibility:.55, relationships:.45, spirituality:.58, reputation:.58}), traits:t({legacy:.82, reckoning:.7, loss:.48, service:.55, reinvention:.42}), polarity:'threshold', thesis:'The year closes a chapter and extracts meaning from everything that came before.', likelyMistake:'clinging to a form that has already completed', strategicMove:'turn endings into deliberate legacy rather than uncontrolled loss', outcomeLogic:'outcomes depend on release, moral clarity, and completion' },
  11: { name:'Master illumination', domains:d({publicVisibility:.75, creativeOutput:.68, spirituality:.72, relationships:.52, reputation:.58}), traits:t({visibility:.7, danger:.42, creativity:.62, relationshipDependence:.5, reckoning:.45}), polarity:'mixed', thesis:'The year becomes symbolic, electric, revealing, and nervous; the person is asked to carry a message larger than ordinary preference.', likelyMistake:'confusing intensity with certainty', strategicMove:'ground revelation in schedule, body-care, and verifiable counsel', outcomeLogic:'outcomes improve when vision is embodied rather than merely felt' },
  22: { name:'Master builder', domains:d({career:.82, leadership:.75, money:.68, publicVisibility:.6, security:.55}), traits:t({discipline:.86, expansion:.65, reckoning:.55, danger:.42}), polarity:'threshold', thesis:'The year wants scale: a movement, institution, platform, building, company, or public system.', likelyMistake:'building too large before governance is grounded', strategicMove:'test foundations before multiplying scale', outcomeLogic:'outcomes depend on architecture, not inspiration alone' },
  33: { name:'Master teacher', domains:d({service:.82, creativeOutput:.7, publicVisibility:.62, spirituality:.7, legacy:.62}), traits:t({service:.9, creativity:.55, legacy:.55, contraction:.32}), polarity:'constructive', thesis:'The year turns the person or their work into instruction for others.', likelyMistake:'saving everyone while neglecting the vessel that serves', strategicMove:'teach from overflow rather than self-erasure', outcomeLogic:'outcomes become durable when service stays embodied and practical' },
};

const COMPOUND_INTELLIGENCE: Record<number, Partial<CompoundIntelligence>> = {
  10:{ name:'Wheel of Fortune', domains:d({career:.8, reputation:.78, publicVisibility:.72}), traits:t({expansion:.75, visibility:.7, reckoning:.45}), polarity:'mixed', thesis:'a launch or appointment becomes public quickly and carries immediate consequences', likelyMistake:'assuming the wheel only rises', strategicMove:'control motive and timing before public launch', outcomeLogic:'fast manifestation produces either fame or visible correction' },
  11:{ name:'Strength / Master 11', domains:d({publicVisibility:.7, relationships:.62, spirituality:.72, security:.42}), traits:t({visibility:.68, danger:.45, relationshipDependence:.58}), polarity:'mixed', thesis:'power must be contained through composure rather than force', likelyMistake:'letting nervous electricity become reaction', strategicMove:'ground the omen before acting on it', outcomeLogic:'the person wins when the lion is held, not when it is attacked' },
  12:{ name:'Sacrifice', domains:d({creativeOutput:.62, reputation:.6, relationships:.58}), traits:t({loss:.65, relationshipDependence:.65, creativity:.45}), polarity:'cautionary', thesis:'the public story may consume private dignity or creative credit', likelyMistake:'giving without boundaries', strategicMove:'define ownership and emotional limits', outcomeLogic:'success and sacrifice arrive entangled' },
  13:{ name:'Rebirth', domains:d({career:.75, home:.6, health:.52, security:.62}), traits:t({reinvention:.82, loss:.68, discipline:.7, reckoning:.65}), polarity:'threshold', thesis:'an old structure ends so a more durable one can be built', likelyMistake:'trying to repair what the year is trying to replace', strategicMove:'design the new foundation deliberately', outcomeLogic:'loss becomes useful only if rebuilt into discipline' },
  14:{ name:'Magnetic Movement', domains:d({travel:.82, creativeOutput:.72, money:.55, law:.48, publicVisibility:.66}), traits:t({expansion:.8, danger:.5, creativity:.6}), polarity:'mixed', thesis:'movement and communication open doors while speed and trust create risk', likelyMistake:'depending on verbal promises', strategicMove:'make mobility disciplined and documented', outcomeLogic:'freedom produces reward only when verified' },
  16:{ name:'Shattered Citadel', domains:d({health:.72, security:.78, spirituality:.7, reputation:.52, travel:.46}), traits:t({danger:.85, loss:.78, contraction:.7, reckoning:.78}), polarity:'cautionary', thesis:'false security is struck so that truth can replace image', likelyMistake:'ignoring fatigue, safety, medicine, vehicles, or spiritual arrogance', strategicMove:'dismantle unsafe structures voluntarily', outcomeLogic:'humility prevents the tower from choosing the method of collapse' },
  17:{ name:'Star of the Magi', domains:d({legacy:.86, leadership:.68, publicVisibility:.62, reputation:.78, money:.55}), traits:t({legacy:.9, victory:.62, discipline:.5}), polarity:'constructive', thesis:'trial becomes lasting name, moral authority, or posthumous influence', likelyMistake:'treating legacy as image rather than earned character', strategicMove:'let authority serve a higher principle', outcomeLogic:'difficulty becomes immortalizing when handled with dignity' },
  18:{ name:'Spirit under attack', domains:d({competition:.78, law:.55, publicVisibility:.58, security:.58, relationships:.45}), traits:t({danger:.68, competition:.78, loss:.52, reckoning:.68}), polarity:'cautionary', thesis:'conflict, factional pressure, or material force tests the moral center', likelyMistake:'answering destructive currents with more destruction', strategicMove:'choose disciplined force or principled nonviolence', outcomeLogic:'the year completes through conflict unless the person consciously redirects the fire' },
  19:{ name:'Prince of Heaven', domains:d({leadership:.88, publicVisibility:.78, reputation:.78, career:.72}), traits:t({victory:.9, visibility:.75, expansion:.7}), polarity:'constructive', thesis:'victory, honor, and disproportionate return become possible after temporal failure', likelyMistake:'thinking solar favour removes the need for ethics', strategicMove:'use success to lead rather than dominate', outcomeLogic:'the year rewards confident effort with returns larger than the input' },
  21:{ name:'Crown of the Magi', domains:d({leadership:.82, publicVisibility:.82, reputation:.82, creativeOutput:.68, legacy:.6}), traits:t({victory:.86, visibility:.78, legacy:.55}), polarity:'constructive', thesis:'long initiation turns into public elevation, award, title, or honour', likelyMistake:'forgetting that the crown was earned by tests', strategicMove:'accept elevation while staying accountable to the initiation', outcomeLogic:'recognition is strongest when it completes a long ordeal' },
  22:{ name:'Master Builder under danger', domains:d({career:.86, leadership:.82, money:.7, security:.62}), traits:t({discipline:.85, expansion:.65, danger:.48, reckoning:.58}), polarity:'threshold', thesis:'scale becomes possible but blind spots become dangerous at the same scale', likelyMistake:'letting admirers or partners steer the architecture', strategicMove:'govern the project before expanding it', outcomeLogic:'the builder succeeds only when the foundation is less glamorous than the vision' },
  23:{ name:'Royal Star of the Lion', domains:d({leadership:.78, publicVisibility:.75, career:.72, relationships:.55}), traits:t({victory:.78, expansion:.65, visibility:.68}), polarity:'constructive', thesis:'support from high places opens movement and protection', likelyMistake:'assuming patronage means personal invulnerability', strategicMove:'honour the gatekeepers without surrendering judgment', outcomeLogic:'doors open through authority, recommendation, or public favour' },
  26:{ name:'Gravest Warnings', domains:d({money:.82, law:.75, relationships:.62, career:.6}), traits:t({danger:.78, lawPressure:.75, loss:.72, relationshipDependence:.62}), polarity:'cautionary', thesis:'association, advice, speculation, or partnership can become the loss mechanism', likelyMistake:'outsourcing judgment to persuasive people', strategicMove:'audit partners and refuse unclear exposure', outcomeLogic:'self-reliance protects what alliance can endanger' },
  27:{ name:'The Scepter', domains:d({leadership:.86, legacy:.72, creativeOutput:.62, publicVisibility:.7, reputation:.72}), traits:t({victory:.76, legacy:.72, visibility:.62}), polarity:'constructive', thesis:'authority is earned through productive intellect and command', likelyMistake:'assuming authority exempts the person from moral pressure', strategicMove:'use command to create order rather than merely win', outcomeLogic:'reward comes from ideas, discipline, and rightful authority' },
  28:{ name:'The Lamb', domains:d({law:.86, competition:.82, leadership:.7, money:.66, reputation:.68, security:.55}), traits:t({lawPressure:.9, competition:.82, loss:.78, reinvention:.72, danger:.55}), polarity:'mixed', thesis:'promise is tested by law, trust, opposition, and the need to begin again without losing the mission', likelyMistake:'trusting goodwill where structure is required', strategicMove:'future-proof every agreement, reserve, alliance, and legal exposure', outcomeLogic:'renewal follows loss only when the person protects the next road before the old one is taken' },
  29:{ name:'Grace under trial', domains:d({relationships:.82, reputation:.55, security:.5}), traits:t({relationshipDependence:.8, loss:.62, danger:.45}), polarity:'cautionary', thesis:'emotional trial exposes who is loyal and who is merely present', likelyMistake:'asking unreliable people to become safe under pressure', strategicMove:'reduce dependency before the test arrives', outcomeLogic:'grace appears after relational illusion is removed' },
  30:{ name:'The Crossroads', domains:d({creativeOutput:.72, education:.68, career:.52, reputation:.42}), traits:t({creativity:.62, withdrawal:.52, contraction:.38}), polarity:'threshold', thesis:'achievement and private disappointment stand at the same fork in the road', likelyMistake:'thinking forever instead of choosing one road', strategicMove:'turn intelligence into a finished message or decision', outcomeLogic:'mental clarity becomes power only after ambivalence is resolved' },
  32:{ name:'Unexpected Power', domains:d({creativeOutput:.82, publicVisibility:.75, travel:.58, leadership:.55}), traits:t({creativity:.82, expansion:.72, visibility:.7}), polarity:'constructive', thesis:'creative influence spreads unexpectedly when self-trust is not surrendered', likelyMistake:'letting stubborn or foolish people redirect the plan', strategicMove:'hold your own judgment after consultation', outcomeLogic:'surprising reach follows independent expression' },
  33:{ name:'Master Teacher', domains:d({service:.86, legacy:.72, creativeOutput:.68, spirituality:.7}), traits:t({service:.9, legacy:.65, creativity:.55}), polarity:'constructive', thesis:'the year teaches through the person, work, sacrifice, or healing presence', likelyMistake:'confusing service with self-erasure', strategicMove:'make the teaching practical enough to help real people', outcomeLogic:'benefit multiplies when compassion has structure' },
  35:{ name:'Disastrous Warning repeated', domains:d({money:.78, law:.62, relationships:.58, career:.58}), traits:t({danger:.72, relationshipDependence:.62, lawPressure:.56, loss:.58}), polarity:'cautionary', thesis:'creative or business alliances can carry hidden disaster', likelyMistake:'joining momentum before verifying the carrier', strategicMove:'stress-test vehicles, partners, contracts, and assumptions', outcomeLogic:'the attractive alliance is safe only if independently verified' },
  37:{ name:'Royal Star of Taurus', domains:d({relationships:.78, career:.62, publicVisibility:.55, creativeOutput:.5}), traits:t({relationshipDependence:.65, victory:.55, expansion:.45}), polarity:'constructive', thesis:'partnership and alliance become the channel of initiation', likelyMistake:'trying to win alone when the year wants collaboration', strategicMove:'choose allies for durability, not glamour', outcomeLogic:'the right partner multiplies the beginning' },
  38:{ name:'Visionary Trial', domains:d({creativeOutput:.74, publicVisibility:.68, relationships:.62, law:.52, leadership:.5}), traits:t({creativity:.7, danger:.52, relationshipDependence:.68, visibility:.62}), polarity:'mixed', thesis:'a vision either finds reliable carriers or collapses through misread allies and practical overreach', likelyMistake:'mistaking applause for infrastructure', strategicMove:'test advisers, logistics, and timing before expanding the vision', outcomeLogic:'inspiration survives only when the surrounding structure can carry it' },
  39:{ name:'Scattered Vision', domains:d({creativeOutput:.8, publicVisibility:.62, service:.48, reputation:.52}), traits:t({creativity:.82, expansion:.58, loss:.35}), polarity:'mixed', thesis:'many projects compete for one central life-force', likelyMistake:'being visible everywhere and remembered nowhere', strategicMove:'edit the year around the one project that carries the whole meaning', outcomeLogic:'multiplicity becomes success only after hierarchy is imposed' },
  44:{ name:'Master Business Number', domains:d({money:.9, career:.86, leadership:.72, health:.55}), traits:t({discipline:.9, reckoning:.58, expansion:.55}), polarity:'mixed', thesis:'business mastery intensifies until the person must learn when to stop', likelyMistake:'overworking because the machine is finally understandable', strategicMove:'define stop-loss rules before intensity becomes obsession', outcomeLogic:'survival and achievement come through disciplined execution with limits' },
  48:{ name:'Crown and Cross', domains:d({leadership:.78, publicVisibility:.75, career:.72, service:.58, reputation:.68}), traits:t({visibility:.72, service:.45, loss:.42, discipline:.55}), polarity:'mixed', thesis:'elevation arrives with friction, sacrifice, and the burden of representation', likelyMistake:'expecting the crown to be weightless', strategicMove:'accept visibility while managing the cross it brings', outcomeLogic:'the crown holds if responsibility is carried without martyrdom' },
  51:{ name:'Warrior’s Sacrifice', domains:d({leadership:.74, security:.8, travel:.55, health:.58, publicVisibility:.56}), traits:t({danger:.86, victory:.52, service:.55}), polarity:'mixed', thesis:'advancement comes through courage in a field that also carries danger', likelyMistake:'romanticizing risk because the mission feels noble', strategicMove:'treat protection as part of the mission', outcomeLogic:'bravery advances the year only when safety is strategic' },
  55:{ name:'Master Communicator’s Sword', domains:d({leadership:.86, creativeOutput:.78, publicVisibility:.78, competition:.68, security:.55}), traits:t({visibility:.78, victory:.68, danger:.58, expansion:.72}), polarity:'mixed', thesis:'words, commands, broadcasts, or decisions cut history into before and after', likelyMistake:'becoming addicted to the blade after it works', strategicMove:'say the necessary thing with restraint', outcomeLogic:'decisive communication wins when force remains precise' },
  59:{ name:'Reckoning Voice', domains:d({creativeOutput:.78, publicVisibility:.68, health:.58, reputation:.62, travel:.5}), traits:t({creativity:.65, reckoning:.72, danger:.42}), polarity:'mixed', thesis:'the voice can win honour while the body or private life demands payment', likelyMistake:'thinking persuasion exempts the person from bodily limits', strategicMove:'build a body strategy alongside the communication strategy', outcomeLogic:'recognition lasts only if the vessel can carry it' },
  60:{ name:'Love Tested to the Limit', domains:d({service:.8, family:.76, relationships:.72, publicVisibility:.48, health:.42}), traits:t({service:.82, relationshipDependence:.62, contraction:.42}), polarity:'mixed', thesis:'love, gratitude, duty, and rejection may coexist', likelyMistake:'believing past service purchases future obedience', strategicMove:'serve without clinging to the old role', outcomeLogic:'love becomes mature when it releases control' },
};

const PAIR_ARCHETYPES: Record<string, PairArchetype> = {
  '28-19': {
    title:'Contested Ascension: the road is threatened before the crown is confirmed',
    thesis:'The year is not simply lucky or unlucky. It behaves like a public ascent under challenge: the outer field tests trust, law, competition, and the possibility of losing the road; the deeper outcome field still points toward leadership, public favour, and a victory that can look disproportionate if the person survives the test without becoming careless.',
    decisionForecasts:['You become less willing to rely on verbal promises and more insistent on written protection.','You stop trying to convince every opponent and begin choosing battles that affect the main road.','A tempting expansion may be delayed, narrowed, or legally redesigned before it becomes safe.','You become more comfortable acting alone if allies prove expensive, slow, or unreliable.'],
    personalityShift:'You will likely appear more commanding and optimistic to others while privately becoming more suspicious, procedural, and future-proofing. The year makes you warmer in victory but colder in risk assessment.',
    outcomePrediction:'The most likely outcome is not smooth success; it is success after pressure. A win, promotion, public breakthrough, or new beginning is possible, but only after the year exposes a legal, competitive, trust-based, or resource-based vulnerability.',
    protectiveStrategy:'Do not expand on faith alone. If law, contracts, partnership, debt, acquisition, or public competition becomes active, slow the transaction long enough to build reserves, document obligations, and preserve an exit route.',
    domainBoost:d({leadership:.14, law:.16, competition:.14, reputation:.12, money:.08, security:.07}),
  },
  '27-18': {
    title:'The Scepter in the Storm: authority is earned while conflict tries to define the ending',
    thesis:'The year wants command, reward from intellect, and a stronger public voice, but the inner field is conflict-heavy. The coherent story is authority under ideological, competitive, family, legal, or social pressure. You are not merely completing a cycle; you are proving whether your authority can remain clean when surrounded by tension.',
    decisionForecasts:['You will probably stop asking for permission from people whose judgment has become reactive.','You may reject one conflict that offers ego-satisfaction but weakens long-term authority.','You become faster at separating useful allies from people who only intensify drama.','A major decision is likely to be framed as moral rather than merely practical.'],
    personalityShift:'You become more final, less tolerant of chaos, and more interested in command than approval. Compassion remains possible, but sentimentality drops sharply.',
    outcomePrediction:'The outcome is a completion with authority: a role, argument, relationship, project, or identity reaches a verdict. Victory is possible, but the victory has to pass through conflict rather than around it.',
    protectiveStrategy:'Avoid winning the wrong war. When conflict rises, ask whether engaging it strengthens authority or merely feeds the 18/9 field of enmity and exhaustion.',
    domainBoost:d({leadership:.15, competition:.14, legacy:.1, reputation:.1, law:.08, service:.06}),
  },
  '48-21': {
    title:'The Crown and Cross: elevation arrives with the burden attached',
    thesis:'This pattern does not deny success; it explains its cost. The outer year brings responsibility, friction, office, or public burden, while the deeper storyline gives honours after long tests. The one story is visible elevation that immediately demands sacrifice, discipline, and representation.',
    decisionForecasts:['You accept a role that is larger than your comfort zone.','You become more selective about which criticism deserves an answer.','You trade ease for legitimacy.'],
    personalityShift:'You become more statesmanlike, less casual, and more aware that visibility has consequences.',
    outcomePrediction:'Recognition is likely, but it will not feel light. The honour brings work with it.',
    protectiveStrategy:'Before accepting the crown, negotiate the resources required to carry the cross.',
    domainBoost:d({leadership:.14, publicVisibility:.13, reputation:.12, career:.1}),
  },
  '44-17': {
    title:'The Trial of Power: business pressure becomes lasting authority',
    thesis:'The outer field demands relentless execution, material control, and business survival; the inner field points toward legacy through trial. The story is not easy money. It is power proven by pressure.',
    decisionForecasts:['You will cut projects that drain cash or attention.','You become less sentimental about underperforming structures.','You may double down on one mission while abandoning distractions.'],
    personalityShift:'You become more executive, more severe with time, and less available for emotional noise.',
    outcomePrediction:'A major material achievement is possible, especially if overreach is contained before the body or finances protest.',
    protectiveStrategy:'Set stop-loss rules before ambition starts calling exhaustion a virtue.',
    domainBoost:d({money:.16, career:.14, leadership:.1, health:.08, legacy:.08}),
  },
};

const HISTORICAL_CASES: HistoricalCase[] = [
  { id:'trump-2024', person:'Donald Trump', year:2024, age:78, occupation:'politician business owner media figure', wealth:'wealthy', relationshipStatus:'married', visibility:'global', eventCategory:'election litigation assassination attempts comeback', direct:28, classic:19, directReduced:1, classicReduced:1, domains:d({leadership:.98, law:.95, competition:.96, publicVisibility:.98, reputation:.92, money:.65, security:.8, health:.35}), eventIntensity:98, outcome:'triumph', narrative:'Legal danger, opposition, public violence risk and a dramatic electoral comeback formed one mixed ordeal-and-reward pattern.', falsePositives:['Classic 19/1 alone would understate the danger; direct 28/1 alone would understate the victory.'], decisions:['stayed in contest despite legal threat','converted prosecution and danger into campaign identity'], personalityShift:'more combative, mythic, and survival-framed', protectiveLesson:'future-proof law and security before assuming popularity protects you' },
  { id:'churchill-1940', person:'Winston Churchill', year:1940, age:65, occupation:'wartime prime minister writer broadcaster', wealth:'comfortable', relationshipStatus:'married', visibility:'global', eventCategory:'war leadership appointment', direct:55, classic:10, directReduced:1, classicReduced:1, domains:d({leadership:.99, competition:.95, publicVisibility:.94, creativeOutput:.85, security:.86, reputation:.9, legacy:.86}), eventIntensity:99, outcome:'legacy', narrative:'Command, crisis, rhetoric and national survival fused into a sword-like leadership year.', falsePositives:['The 10/1 launch element alone does not explain the military danger; 55/1 supplies the sword.'], decisions:['accepted impossible leadership','used language as strategic weapon'], personalityShift:'defiant, concentrated, historically conscious', protectiveLesson:'speak decisively, but do not confuse rhetoric with logistics' },
  { id:'mandela-1990', person:'Nelson Mandela', year:1990, age:71, occupation:'political prisoner liberation leader', wealth:'modest', relationshipStatus:'married', visibility:'global', eventCategory:'release negotiation transition', direct:44, classic:17, directReduced:8, classicReduced:8, domains:d({leadership:.94, legacy:.96, publicVisibility:.9, law:.74, competition:.72, reputation:.95, service:.82}), eventIntensity:96, outcome:'transition', narrative:'Power returned through trial, and moral authority became practical negotiation.', falsePositives:['44/8 can sound merely businesslike unless 17/8 explains immortal moral authority.'], decisions:['moved from symbolic prisoner to negotiator','chose disciplined reconciliation over revenge'], personalityShift:'authoritative, restrained, legacy-aware', protectiveLesson:'do not let power gained through suffering become bitterness' },
  { id:'mandela-1994', person:'Nelson Mandela', year:1994, age:75, occupation:'statesman president', wealth:'modest', relationshipStatus:'married', visibility:'global', eventCategory:'election presidency honour', direct:48, classic:21, directReduced:3, classicReduced:3, domains:d({leadership:.99, publicVisibility:.96, reputation:.95, legacy:.96, service:.8, competition:.75}), eventIntensity:98, outcome:'triumph', narrative:'The crown arrived after long initiation, but immediately carried the cross of governing a wounded nation.', falsePositives:['48/3 alone overemphasizes friction; 21/3 explains the crown.'], decisions:['accepted office as service','turned personal victory into national transition'], personalityShift:'ceremonial yet burdened, conciliatory yet commanding', protectiveLesson:'honour must be resourced; symbolic elevation still needs administration' },
  { id:'obama-2008', person:'Barack Obama', year:2008, age:47, occupation:'politician lawyer author', wealth:'comfortable', relationshipStatus:'married', visibility:'global', eventCategory:'historic election movement building', direct:22, classic:13, directReduced:22, classicReduced:4, domains:d({leadership:.98, publicVisibility:.96, reputation:.9, career:.9, legacy:.82, competition:.8}), eventIntensity:97, outcome:'triumph', narrative:'A master-builder campaign rode a national rebirth/change story.', falsePositives:['13/4 can sound destructive, but here it described national rebirth more than personal loss.'], decisions:['scaled a movement','accepted the change mantle'], personalityShift:'more presidential, disciplined, symbol-bearing', protectiveLesson:'a movement needs structure or the symbol outruns governance' },
  { id:'diana-1997', person:'Diana Princess of Wales', year:1997, age:36, occupation:'royal humanitarian public figure', wealth:'wealthy', relationshipStatus:'separated', visibility:'global', eventCategory:'fatal accident public grief', direct:34, classic:16, directReduced:7, classicReduced:7, domains:d({health:.95, security:.95, travel:.9, publicVisibility:.86, reputation:.88, relationships:.62, legacy:.86}), eventIntensity:100, outcome:'legacy', narrative:'A public humanitarian image met the severe 16/7 accident/fatality signature.', falsePositives:['Direct 34/7 was too mild; classic 16/7 carried the real danger.'], decisions:['moved publicly amid private transition'], personalityShift:'more independent, exposed, emotionally visible', protectiveLesson:'when 16/7 is active, security and travel are not background details' },
  { id:'jobs-1985', person:'Steve Jobs', year:1985, age:30, occupation:'technology entrepreneur', wealth:'wealthy', relationshipStatus:'partnered', visibility:'public', eventCategory:'ouster rebirth new ventures', direct:49, classic:13, directReduced:4, classicReduced:4, domains:d({career:.95, money:.76, reputation:.82, leadership:.72, creativeOutput:.68, legacy:.78}), eventIntensity:94, outcome:'transition', narrative:'An institutional fall became the foundation of a later return.', falsePositives:['49/4 sounds constructive; classic 13/4 explains the humiliating break.'], decisions:['left old structure','seeded new platforms'], personalityShift:'wounded, obsessive, more independent', protectiveLesson:'do not repair a structure that has already rejected your role' },
  { id:'musk-2008', person:'Elon Musk', year:2008, age:37, occupation:'technology entrepreneur engineer investor', wealth:'wealthy', relationshipStatus:'separated', visibility:'public', eventCategory:'business survival rocket breakthrough', direct:44, classic:17, directReduced:8, classicReduced:8, domains:d({money:.98, career:.94, leadership:.88, health:.65, reputation:.75, legacy:.82, competition:.72}), eventIntensity:96, outcome:'triumph', narrative:'Business mastery under extreme pressure became legacy-making survival.', falsePositives:['17/8 sounds noble; 44/8 explains the brutal cash/execution pressure.'], decisions:['risked capital','cut options to preserve core missions'], personalityShift:'more relentless, more severe, more mission-fused', protectiveLesson:'the machine survives only if the operator has limits' },
  { id:'swift-2023', person:'Taylor Swift', year:2023, age:34, occupation:'musician performer business owner', wealth:'wealthy', relationshipStatus:'partnered', visibility:'global', eventCategory:'global tour cultural dominance', direct:32, classic:14, directReduced:5, classicReduced:5, domains:d({publicVisibility:.99, creativeOutput:.95, travel:.96, money:.9, reputation:.92, leadership:.62, relationships:.45}), eventIntensity:96, outcome:'triumph', narrative:'Creative power and disciplined movement converged into a global tour phenomenon.', falsePositives:['14/5 danger existed mostly as business/logistical risk, not catastrophe.'], decisions:['scaled movement through tour/film','kept creative ownership central'], personalityShift:'expansive, entrepreneurial, audience-commanding', protectiveLesson:'movement succeeds when logistics and ownership are disciplined' },
  { id:'swift-2016', person:'Taylor Swift', year:2016, age:27, occupation:'musician public figure', wealth:'wealthy', relationshipStatus:'single', visibility:'global', eventCategory:'reputation crisis withdrawal reinvention', direct:34, classic:16, directReduced:7, classicReduced:7, domains:d({reputation:.95, publicVisibility:.78, relationships:.72, spirituality:.58, security:.5, creativeOutput:.56}), eventIntensity:86, outcome:'transition', narrative:'Public image cracked, forcing withdrawal and later reinvention.', falsePositives:['16/7 manifested reputationally rather than physically.'], decisions:['withdrew from overexposure','rebuilt around a darker narrative'], personalityShift:'more guarded, strategic, less available', protectiveLesson:'let the false tower fall before rebuilding the brand' },
  { id:'earhart-1937', person:'Amelia Earhart', year:1937, age:39, occupation:'aviator author public pioneer', wealth:'comfortable', relationshipStatus:'married', visibility:'global', eventCategory:'aviation disappearance', direct:51, classic:15, directReduced:6, classicReduced:6, domains:d({travel:.98, security:.95, health:.92, publicVisibility:.82, legacy:.9, leadership:.62}), eventIntensity:100, outcome:'legacy', narrative:'A glamorous public mission carried a severe warrior-danger signature.', falsePositives:['15/6 glamour did not warn enough; 51/6 carried the danger.'], decisions:['pursued bold circumnavigation','accepted extreme travel risk'], personalityShift:'daring, mission-identified, publicly heroic', protectiveLesson:'in danger compounds, mission nobility must not override safety redundancy' },
  { id:'einstein-1915', person:'Albert Einstein', year:1915, age:36, occupation:'physicist professor', wealth:'modest', relationshipStatus:'married', visibility:'public', eventCategory:'general relativity scientific breakthrough', direct:33, classic:15, directReduced:33, classicReduced:6, domains:d({creativeOutput:.98, education:.95, legacy:.95, reputation:.82, publicVisibility:.62, spirituality:.58}), eventIntensity:94, outcome:'legacy', narrative:'A master-teacher year turned scientific work into instruction for the century.', falsePositives:['15/6 charm is secondary; 33/33 is the decisive signature.'], decisions:['completed a demanding theoretical framework'], personalityShift:'absorbed, visionary, intellectually sovereign', protectiveLesson:'master teaching needs bodily and domestic grounding' },
  { id:'einstein-1905', person:'Albert Einstein', year:1905, age:26, occupation:'patent clerk physicist', wealth:'modest', relationshipStatus:'married', visibility:'private', eventCategory:'annus mirabilis publications', direct:32, classic:14, directReduced:5, classicReduced:5, domains:d({creativeOutput:.98, education:.95, reputation:.72, publicVisibility:.55, legacy:.92}), eventIntensity:95, outcome:'legacy', narrative:'Independent judgment and publication created unexpected power.', falsePositives:['The year looked private at the time; historical visibility came later.'], decisions:['published despite low institutional status'], personalityShift:'independent, mentally mobile, quietly audacious', protectiveLesson:'trust original judgment but document the work clearly' },
  { id:'curie-1911', person:'Marie Curie', year:1911, age:44, occupation:'scientist professor', wealth:'modest', relationshipStatus:'widowed', visibility:'global', eventCategory:'Nobel prize scandal public hostility', direct:30, classic:12, directReduced:3, classicReduced:3, domains:d({creativeOutput:.88, reputation:.92, publicVisibility:.86, relationships:.68, education:.86, legacy:.78}), eventIntensity:88, outcome:'mixed', narrative:'Intellectual achievement coexisted with public sacrifice and scandal.', falsePositives:['30/3 alone sounds too detached; 12/3 explains the emotional/public cost.'], decisions:['continued scientific work under public hostility'], personalityShift:'more isolated, stoic, intellectually defended', protectiveLesson:'protect private dignity when public achievement draws appetite' },
  { id:'malcolm-1965', person:'Malcolm X', year:1965, age:39, occupation:'activist minister speaker', wealth:'modest', relationshipStatus:'married', visibility:'global', eventCategory:'assassination factional conflict', direct:45, classic:18, directReduced:9, classicReduced:9, domains:d({competition:.95, security:.95, publicVisibility:.86, reputation:.82, legacy:.9, law:.55}), eventIntensity:100, outcome:'legacy', narrative:'Completion occurred through factional conflict and violent public danger.', falsePositives:['45/9 success language underplayed the lethal opposition; 18/9 carried the conflict field.'], decisions:['continued public mission despite threats'], personalityShift:'urgent, transformed, morally sharpened', protectiveLesson:'when 18/9 dominates, ideological conflict must be treated as physical risk' },
  { id:'ali-1964', person:'Muhammad Ali', year:1964, age:22, occupation:'boxer public figure', wealth:'comfortable', relationshipStatus:'single', visibility:'global', eventCategory:'championship identity revelation', direct:38, classic:11, directReduced:11, classicReduced:11, domains:d({leadership:.82, publicVisibility:.94, competition:.96, reputation:.9, spirituality:.62}), eventIntensity:92, outcome:'triumph', narrative:'A visionary public identity emerged through a literal contest of strength.', falsePositives:['38/2 can be betrayal-prone, but classic 11/2 contained the lion.'], decisions:['claimed title','declared a new religious/public identity'], personalityShift:'electric, provocative, symbolically charged', protectiveLesson:'vision must be grounded before public reaction defines it' },
  { id:'ali-1967', person:'Muhammad Ali', year:1967, age:25, occupation:'boxer activist', wealth:'comfortable', relationshipStatus:'married', visibility:'global', eventCategory:'draft refusal conviction title loss', direct:41, classic:14, directReduced:5, classicReduced:5, domains:d({law:.92, publicVisibility:.9, competition:.78, reputation:.82, spirituality:.72, career:.75}), eventIntensity:92, outcome:'mixed', narrative:'Freedom, conscience, law, and public voice collided.', falsePositives:['14/5 does not say law as directly as 28/1, but the freedom conflict was exact.'], decisions:['refused induction','accepted career loss for conscience'], personalityShift:'principled, defiant, less negotiable', protectiveLesson:'freedom decisions need legal strategy before the moral stand becomes public' },
  { id:'elizabeth-1952', person:'Elizabeth II', year:1952, age:26, occupation:'monarch', wealth:'institutional', relationshipStatus:'married', visibility:'global', eventCategory:'accession through family death', direct:42, classic:15, directReduced:6, classicReduced:6, domains:d({leadership:.9, family:.92, service:.9, publicVisibility:.86, legacy:.82, home:.58}), eventIntensity:92, outcome:'transition', narrative:'Duty and public affection began through family loss.', falsePositives:['15/6 glamour alone misses the solemn burden.'], decisions:['accepted lifelong role immediately'], personalityShift:'more dutiful, contained, ceremonial', protectiveLesson:'service roles need private support systems' },
  { id:'elizabeth-2022', person:'Elizabeth II', year:2022, age:96, occupation:'monarch', wealth:'institutional', relationshipStatus:'widowed', visibility:'global', eventCategory:'jubilee death succession', direct:31, classic:13, directReduced:4, classicReduced:4, domains:d({legacy:.98, family:.86, publicVisibility:.92, health:.9, service:.78, home:.75}), eventIntensity:98, outcome:'legacy', narrative:'An isolated late-life foundation year became literal death and institutional rebirth.', falsePositives:['31/4 solitude was only partial; 13/4 explained succession.'], decisions:['completed public service at elder threshold'], personalityShift:'withdrawn, symbolic, legacy-contained', protectiveLesson:'elder 13/4 should prioritize health, succession, and institutional continuity' },
  { id:'kobe-2020', person:'Kobe Bryant', year:2020, age:41, occupation:'athlete entrepreneur storyteller', wealth:'wealthy', relationshipStatus:'married', visibility:'global', eventCategory:'fatal helicopter crash legacy mourning', direct:35, classic:17, directReduced:8, classicReduced:8, domains:d({security:.95, travel:.9, health:.95, legacy:.96, publicVisibility:.88, relationships:.72}), eventIntensity:100, outcome:'legacy', narrative:'Association/travel danger intersected with a strong immortality-of-name signature.', falsePositives:['17/8 explains legacy but not the accident mechanism.'], decisions:['routine travel in a high-risk vehicle context'], personalityShift:'posthumously mythic, family/legacy-centered', protectiveLesson:'when 35/8 appears with travel, verify the carrier not just the destination' },
  { id:'gandhi-1947', person:'Mahatma Gandhi', year:1947, age:78, occupation:'spiritual political leader', wealth:'modest', relationshipStatus:'married', visibility:'global', eventCategory:'independence partition peace work', direct:33, classic:6, directReduced:33, classicReduced:6, domains:d({service:.98, legacy:.95, publicVisibility:.9, spirituality:.92, competition:.72, health:.58}), eventIntensity:98, outcome:'mixed', narrative:'Master-teacher service operated inside national completion and communal trauma.', falsePositives:['33/33 sounds benefic; history shows service can occur inside catastrophe.'], decisions:['prioritized peace over celebration','used fasting and presence as moral tools'], personalityShift:'austere, compassionate, burdened', protectiveLesson:'master service requires protection from martyrdom and exhaustion' },
  { id:'darwin-1859', person:'Charles Darwin', year:1859, age:50, occupation:'naturalist writer scientist', wealth:'comfortable', relationshipStatus:'married', visibility:'public', eventCategory:'publication controversy scientific legacy', direct:37, classic:10, directReduced:1, classicReduced:1, domains:d({creativeOutput:.96, publicVisibility:.82, reputation:.86, education:.94, relationships:.58, legacy:.94}), eventIntensity:93, outcome:'legacy', narrative:'Collaborative support helped launch a world-changing public work.', falsePositives:['37/1 partnership is less famous than the book, but it enabled the launch.'], decisions:['published when pressured by parallel discovery'], personalityShift:'reluctantly public, intellectually decisive', protectiveLesson:'when reputation will change, prepare the supporting network before release' },
];

function intelligenceFor(compound: ChaldeanPYNCompound | null, reduced: number, raw: number): CompoundIntelligence {
  const base = REDUCED_INTELLIGENCE[reduced] || REDUCED_INTELLIGENCE[((reduced % 9) || 9)];
  const over = COMPOUND_INTELLIGENCE[compound?.compound ?? raw] || {};
  return {
    name: over.name ?? compound?.name ?? base.name,
    domains: { ...base.domains, ...over.domains },
    traits: { ...base.traits, ...over.traits },
    polarity: over.polarity ?? base.polarity,
    thesis: over.thesis ?? base.thesis,
    likelyMistake: over.likelyMistake ?? base.likelyMistake,
    strategicMove: over.strategicMove ?? base.strategicMove,
    outcomeLogic: over.outcomeLogic ?? base.outcomeLogic,
  };
}

function scoreFrom(map: ScoreMap<Domain>, domain: Domain): number { return map[domain] ?? 0; }
function traitFrom(map: ScoreMap<Trait>, trait: Trait): number { return map[trait] ?? 0; }

function ageBand(age: number | null): { label: string; text: string; multiplier: number } {
  if (age === null || Number.isNaN(age)) return { label:'age unavailable', multiplier:1, text:'Because no birth year was supplied, the engine cannot apply age-specific manifestation weighting. The pair is still interpreted, but the app cannot know whether the pattern is likely to manifest as youthful launch, mid-life restructuring, or elder legacy reckoning.' };
  if (age < 20) return { label:`age ${age} formation window`, multiplier:.92, text:`At age ${age}, the pattern usually expresses through education, family, identity formation, first opportunities, body safety, and the institutions around the person rather than through full public destiny.` };
  if (age <= 35) return { label:`age ${age} launch window`, multiplier:1.08, text:`At age ${age}, the pattern tends to manifest as first major proof: career ignition, romance, migration, public identity, first large risk, first public conflict, or the decision that separates the person from a former self.` };
  if (age <= 55) return { label:`age ${age} consolidation window`, multiplier:1.15, text:`At age ${age}, the same compounds test what has already been built: career structure, marriage, reputation, money, health routines, and authority. The year is less about becoming visible for the first time and more about whether existing structures can survive pressure.` };
  return { label:`age ${age} legacy window`, multiplier:1.25, text:`At age ${age}, the pair should be weighted toward law, health, succession, reputation, accumulated karma, legacy, and the verdict of history. Elder years make warning phrases more literal because consequences have had decades to gather.` };
}

function ageResonance(age: number | null, args: BuildArgs): string[] {
  if (age === null) return [];
  const notes: string[] = [];
  if (age === args.directRaw) notes.push(`Age ${age} exactly equals the Direct raw compound ${args.directRaw}; the visible layer becomes unusually literal.`);
  if (age === args.classicRaw) notes.push(`Age ${age} exactly equals the Classic raw compound ${args.classicRaw}; the karmic storyline becomes unusually literal.`);
  if (age >= 27 && age <= 31) notes.push('This is a first Saturn-return zone; law, work, body, responsibility, and adult identity become harder to avoid.');
  if (age >= 39 && age <= 42) notes.push('This is a mid-life threshold; relationship, career, mortality, and authenticity themes become more existential.');
  if (age >= 58 && age <= 60) notes.push('This is a second-Saturn zone; health, duty, leadership handover, and legacy review intensify.');
  if (age >= 72) notes.push('This is an elder-legacy zone; the reading should prioritize succession, history, mortality, and karmic harvest.');
  return notes;
}

function pairKey(args: BuildArgs): string { return `${cnum(args.directCompound, args.directRaw)}-${cnum(args.classicCompound, args.classicRaw)}`; }
function pairArchetype(args: BuildArgs): PairArchetype | null { return PAIR_ARCHETYPES[pairKey(args)] ?? null; }

function domainOverlap(a: ScoreMap<Domain>, b: ScoreMap<Domain>): number {
  let num = 0, den = 0;
  for (const domain of ALL_DOMAINS) { const av = a[domain] ?? 0; const bv = b[domain] ?? 0; num += Math.min(av, bv); den += Math.max(av, bv); }
  return den ? num / den : 0;
}

function pairSimilarity(args: BuildArgs, hist: HistoricalCase, directIntel: CompoundIntelligence, classicIntel: CompoundIntelligence): number {
  const direct = cnum(args.directCompound, args.directRaw);
  const classic = cnum(args.classicCompound, args.classicRaw);
  let score = 0;
  if (direct === hist.direct) score += .26;
  if (classic === hist.classic) score += .26;
  if (direct === hist.classic && classic === hist.direct) score += .18;
  if (args.directYear === hist.directReduced) score += .08;
  if (args.classicYear === hist.classicReduced) score += .08;
  if (args.directYear === hist.classicReduced || args.classicYear === hist.directReduced) score += .04;
  const age = typeof args.birthYear === 'number' ? args.targetYear - args.birthYear : null;
  if (age !== null) score += Math.max(0, 1 - Math.abs(age - hist.age) / 60) * .1;
  const symbolicDomains: ScoreMap<Domain> = {};
  for (const domain of ALL_DOMAINS) symbolicDomains[domain] = Math.max(scoreFrom(directIntel.domains, domain), scoreFrom(classicIntel.domains, domain));
  score += domainOverlap(symbolicDomains, hist.domains) * .12;
  if (args.occupation && args.occupation.toLowerCase().split(/\W+/).some(tok => tok.length > 3 && hist.occupation.toLowerCase().includes(tok))) score += .04;
  if (args.wealthProfile && args.wealthProfile === hist.wealth) score += .025;
  if (args.relationshipStatus && args.relationshipStatus === hist.relationshipStatus) score += .02;
  if (args.visibility && args.visibility === hist.visibility) score += .025;
  return clamp01(score);
}

function nearestCluster(args: BuildArgs, directIntel: CompoundIntelligence, classicIntel: CompoundIntelligence) {
  return HISTORICAL_CASES
    .map(h => ({ ...h, similarity: pairSimilarity(args, h, directIntel, classicIntel) }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 6);
}

function buildDomainScores(args: BuildArgs, directIntel: CompoundIntelligence, classicIntel: CompoundIntelligence, cluster: ReturnType<typeof nearestCluster>, archetype: PairArchetype | null): Record<Domain, number> {
  const scores: Record<Domain, number> = Object.fromEntries(ALL_DOMAINS.map(k => [k, 0])) as Record<Domain, number>;
  const totalSim = cluster.reduce((a, c) => a + c.similarity, 0) || 1;
  for (const domain of ALL_DOMAINS) {
    const historical = cluster.reduce((a, c) => a + c.similarity * (c.domains[domain] ?? 0), 0) / totalSim;
    const direct = directIntel.domains[domain] ?? 0;
    const classic = classicIntel.domains[domain] ?? 0;
    const reinforcement = direct >= .55 && classic >= .55 ? .08 : 0;
    const boost = archetype?.domainBoost?.[domain] ?? 0;
    // The percentages are historically anchored first, then corrected by the compound pair.
    scores[domain] = clamp01(historical * .62 + Math.max(direct, classic) * .25 + ((direct + classic) / 2) * .13 + reinforcement + boost);
  }
  return scores;
}

function rankedDomains(scores: Record<Domain, number>): Array<{ domain: Domain; score: number }> {
  return ALL_DOMAINS.map(domain => ({ domain, score: scores[domain] })).sort((a, b) => b.score - a.score);
}

function detectReinforcements(directIntel: CompoundIntelligence, classicIntel: CompoundIntelligence): string[] {
  return ALL_DOMAINS.filter(domain => (directIntel.domains[domain] ?? 0) >= .55 && (classicIntel.domains[domain] ?? 0) >= .55)
    .sort((a,b) => ((directIntel.domains[b] ?? 0)+(classicIntel.domains[b] ?? 0))-((directIntel.domains[a] ?? 0)+(classicIntel.domains[a] ?? 0)))
    .slice(0, 5)
    .map(d => DOMAIN_LABELS[d]);
}

function detectConflicts(directIntel: CompoundIntelligence, classicIntel: CompoundIntelligence): string[] {
  const conflicts: string[] = [];
  const dt = directIntel.traits, ct = classicIntel.traits;
  if (traitFrom(dt,'expansion') > .6 && traitFrom(ct,'contraction') > .45) conflicts.push('external expansion versus internal simplification');
  if (traitFrom(dt,'contraction') > .55 && traitFrom(ct,'expansion') > .6) conflicts.push('outer narrowing versus inner growth pressure');
  if (traitFrom(dt,'loss') > .55 && traitFrom(ct,'victory') > .55) conflicts.push('visible loss-pressure versus eventual victory signature');
  if (traitFrom(dt,'victory') > .55 && traitFrom(ct,'loss') > .55) conflicts.push('outer opportunity versus hidden cost');
  if (traitFrom(dt,'visibility') > .6 && traitFrom(ct,'withdrawal') > .5) conflicts.push('public visibility versus private retreat');
  if (traitFrom(dt,'lawPressure') > .55 && traitFrom(ct,'victory') > .55) conflicts.push('formal/legal pressure becoming the road to recognition');
  if (traitFrom(dt,'danger') > .55 || traitFrom(ct,'danger') > .55) conflicts.push('opportunity operating inside a safety or exposure field');
  return uniq(conflicts).slice(0, 4);
}

function determinePolarity(directIntel: CompoundIntelligence, classicIntel: CompoundIntelligence): PersonalYearDualEssenceSynthesis['polarity'] {
  const ps = [directIntel.polarity, classicIntel.polarity];
  if (ps.includes('cautionary') && ps.includes('constructive')) return 'mixed ordeal-and-reward';
  if (ps.every(p => p === 'constructive')) return 'predominantly constructive';
  if (ps.every(p => p === 'cautionary')) return 'predominantly cautionary';
  if (ps.includes('threshold')) return 'threshold / transition';
  return 'mixed ordeal-and-reward';
}

function masterSignal(args: BuildArgs): string | null {
  const parts: string[] = [];
  const directMaster = [11,22,33].includes(args.directRaw) || [11,22,33].includes(args.directYear) || !!args.directCompound?.isMasterNumber;
  const classicMaster = [11,22,33].includes(args.classicRaw) || [11,22,33].includes(args.classicYear) || !!args.classicCompound?.isMasterNumber;
  if (directMaster) parts.push(`The visible layer carries master-number voltage. That makes the year more symbolic and less ordinary: the public event may look practical, but people will read meaning into it.`);
  if (classicMaster) parts.push(`The hidden storyline carries master-number voltage. That means the real lesson is not merely personal success or failure; it becomes a teaching, building, or illumination test.`);
  return parts.length ? parts.join(' ') : null;
}

function karmicDebtSignal(args: BuildArgs, directIntel: CompoundIntelligence, classicIntel: CompoundIntelligence): string | null {
  const dangerCompounds = [13,14,16,18,26,28,29,35,38,43,47,51,52,53,55,59];
  const active = [cnum(args.directCompound,args.directRaw), cnum(args.classicCompound,args.classicRaw)].filter(n => dangerCompounds.includes(n));
  const danger = Math.max(traitFrom(directIntel.traits,'danger'), traitFrom(classicIntel.traits,'danger'), traitFrom(directIntel.traits,'lawPressure'), traitFrom(classicIntel.traits,'lawPressure'));
  if (!active.length && danger < .55) return null;
  return `The alert field is active through ${active.length ? active.join(' and ') : 'the compound language itself'}. This should not be read fatalistically. It should be read operationally: contracts, transport, body strain, legal exposure, partner reliability, public conflict, and security deserve concrete preventive action rather than vague worry.`;
}

function makeHistoricalText(cluster: ReturnType<typeof nearestCluster>): string {
  return `Closest historical cluster:\n${cluster.map(c => `• ${c.person} ${c.year} — ${pct(c.similarity)}% similarity: ${c.narrative} False-positive lesson: ${c.falsePositives[0]}`).join('\n')}`;
}

function formatDomainRanking(ranked: Array<{domain: Domain; score: number}>): string {
  return ranked.slice(0, 8).map((r, i) => `${i + 1}. ${DOMAIN_LABELS[r.domain]} — ${pct(r.score)}%`).join('\n');
}

function topDomainNames(ranked: Array<{domain: Domain; score: number}>): string[] { return ranked.slice(0, 8).map(r => `${DOMAIN_LABELS[r.domain]} ${pct(r.score)}%`); }

function buildDecisionForecasts(archetype: PairArchetype | null, ranked: Array<{domain: Domain; score: number}>, directIntel: CompoundIntelligence, classicIntel: CompoundIntelligence): string[] {
  const out = [...(archetype?.decisionForecasts ?? [])];
  const top = ranked.slice(0, 5).map(r => r.domain);
  if (top.includes('law')) out.push('You will probably become less tolerant of unclear agreements; if something cannot be written clearly, you will start treating it as unsafe.');
  if (top.includes('leadership')) out.push('You are likely to stop waiting for consensus in at least one situation and act as if the responsibility is already yours.');
  if (top.includes('money')) out.push('Money decisions become faster, but the better prediction is not “more money”; it is a sharper distinction between assets that strengthen your position and commitments that trap liquidity.');
  if (top.includes('relationships')) out.push('You will test people by reliability rather than affection; one alliance may become more formal, while another becomes obviously too expensive emotionally or practically.');
  if (top.includes('health') || top.includes('security')) out.push('You may decide to slow, cancel, insure, document, or redesign a plan that initially looked exciting because the risk-to-reward ratio becomes impossible to ignore.');
  if (top.includes('creativeOutput')) out.push('You are likely to choose one message, product, paper, campaign, or performance as the year’s main vehicle and let lesser ideas become secondary.');
  if (traitFrom(directIntel.traits,'competition') > .6 || traitFrom(classicIntel.traits,'competition') > .6) out.push('You become more strategic about opposition: not every fight receives your energy, but the fight that affects your road receives full attention.');
  return uniq(out).slice(0, 8);
}

function buildPersonalityShift(archetype: PairArchetype | null, ranked: Array<{domain: Domain; score: number}>, directIntel: CompoundIntelligence, classicIntel: CompoundIntelligence): string {
  if (archetype?.personalityShift) return archetype.personalityShift;
  const top = ranked[0]?.domain;
  if (top === 'leadership') return 'You become more decisive, less apologetic, and less interested in persuading people who have already shown you their limits. The temporary personality shift is toward command.';
  if (top === 'law') return 'You become more procedural and less trusting. You may still be warm socially, but your decision-making becomes contractual: proof, timing, records, and leverage matter more than promises.';
  if (top === 'money') return 'You become more calculating about resources. The year makes you quicker to distinguish real assets from attractive drains, and you may surprise people by cutting costs or refusing vague opportunities.';
  if (top === 'relationships') return 'You become selective with emotional access. Affection alone is not enough; reliability, timing, and mutual usefulness become the real tests.';
  if (top === 'health' || top === 'security') return 'You become more risk-aware, even if reluctantly. The personality shift is toward caution, simplification, and a lower tolerance for people who normalize unnecessary danger.';
  if (top === 'creativeOutput') return 'You become more expressive but also more editorial. The year increases the pressure to choose the message that deserves your full name attached to it.';
  if (traitFrom(directIntel.traits,'withdrawal') > .55 || traitFrom(classicIntel.traits,'withdrawal') > .55) return 'You become quieter, more observant, and more difficult to impress. People may interpret this as distance, but the real shift is discrimination.';
  return 'You become more exacting. The year reduces tolerance for vague motives and pushes you to act from the part of you that already knows what matters.';
}

function buildOutcomePrediction(archetype: PairArchetype | null, ranked: Array<{domain: Domain; score: number}>, conflicts: string[], reinforcements: string[], polarity: PersonalYearDualEssenceSynthesis['polarity']): string {
  if (archetype?.outcomePrediction) return archetype.outcomePrediction;
  const top = ranked[0];
  const second = ranked[1];
  const base = `The strongest outcome probability sits in ${DOMAIN_LABELS[top.domain].toLowerCase()} at ${pct(top.score)}%, followed by ${DOMAIN_LABELS[second.domain].toLowerCase()} at ${pct(second.score)}%.`;
  if (polarity === 'mixed ordeal-and-reward') return `${base} The year is likely to pay through contrast: pressure first, reward later; exposure first, clarity later; conflict first, authority later. The outcome improves when you treat the difficult part as the price of accuracy rather than as proof that the year is failing.`;
  if (polarity === 'predominantly cautionary') return `${base} The outcome is less about expansion than preservation, correction, and avoiding the mistake that historical analogues show can become expensive. A smaller, safer win is preferable to a dramatic move with hidden downside.`;
  if (polarity === 'predominantly constructive') return `${base} The outcome is likely to be constructive if you do not dilute the main opportunity. The risk is not absence of luck; it is wasting favourable timing through scattered attention or weak structure.`;
  return `${base} The outcome is transitional: something changes form, status, duty, or definition. The year succeeds if the new structure is stronger than the one it replaces.`;
}

function buildProtectiveStrategy(archetype: PairArchetype | null, ranked: Array<{domain: Domain; score: number}>): string {
  if (archetype?.protectiveStrategy) return archetype.protectiveStrategy;
  const top = ranked.slice(0, 4).map(r => r.domain);
  if (top.includes('law')) return 'Do not enter the year with loose paperwork. If the legal/formal domain activates, delay large commitments until obligations, exit clauses, ownership, and liability are explicit.';
  if (top.includes('money')) return 'Before expanding, define your downside limit. Historical analogues show that the danger is rarely lack of opportunity; it is overexposure to an opportunity that looked safe too early.';
  if (top.includes('health') || top.includes('security') || top.includes('travel')) return 'Treat logistics as prophecy. Vehicles, fatigue, medical routines, security, insurance, and contingency plans are not small details this year; they are how the pattern is prevented from becoming literal.';
  if (top.includes('relationships')) return 'Make reliability observable. Do not judge people by affection, charisma, shared history, or urgency; judge by what they do when timing and responsibility become inconvenient.';
  if (top.includes('creativeOutput')) return 'Protect the central message from dilution. Say no to secondary platforms, projects, and audiences if they weaken the one work that can carry the year.';
  return 'Translate the reading into one concrete control: written terms, fewer distractions, better timing, physical protection, or a clearer chain of authority.';
}

function titleFor(args: BuildArgs, archetype: PairArchetype | null, ranked: Array<{domain: Domain; score: number}>, conflicts: string[]): string {
  if (archetype) return archetype.title;
  const d = cnum(args.directCompound, args.directRaw);
  const c = cnum(args.classicCompound, args.classicRaw);
  if (conflicts.length) return `${DOMAIN_LABELS[ranked[0].domain]} Under Contradiction`;
  if (d === c) return `The Reinforced ${DOMAIN_LABELS[ranked[0].domain]} Year`;
  return `The ${DOMAIN_LABELS[ranked[0].domain]} Year with ${DOMAIN_LABELS[ranked[1].domain]} Consequence`;
}

function buildDominantDiagnosis(archetype: PairArchetype | null, args: BuildArgs, directIntel: CompoundIntelligence, classicIntel: CompoundIntelligence, ranked: Array<{domain: Domain; score: number}>, conflicts: string[], reinforcements: string[]): string {
  if (archetype) return archetype.thesis;
  const top = ranked[0];
  const second = ranked[1];
  const conflictLine = conflicts.length ? `The contradiction that deserves attention is ${conflicts[0]}. This means people outside may notice one story while you experience another.` : '';
  const reinforceLine = reinforcements.length ? `The reinforcement is strongest around ${reinforcements.slice(0,3).join(', ')}; those areas should not be treated as background themes.` : '';
  return `The pattern emerging from ${label(args.directRaw,args.directYear,args.directCompound)} and ${label(args.classicRaw,args.classicYear,args.classicCompound)} is a single story about ${DOMAIN_LABELS[top.domain].toLowerCase()} being shaped by ${DOMAIN_LABELS[second.domain].toLowerCase()}. The visible layer pushes through ${directIntel.thesis}; the hidden layer judges the year through ${classicIntel.thesis}. ${conflictLine} ${reinforceLine}`.replace(/\s+/g,' ').trim();
}

function buildFeedbackLoopText(): string {
  return 'At the end of the year, the app should ask you to score career, relationships, health, money, travel, legal matters, family, major events, unexpected events, severity, and perceived accuracy. That record should become new training data. The next user with a similar compound pair should then be compared not only to famous public lives, but also to completed private-year outcomes.';
}

function intensityScore(args: BuildArgs, ageMultiplier: number, domainScores: Record<Domain, number>, cluster: ReturnType<typeof nearestCluster>, directIntel: CompoundIntelligence, classicIntel: CompoundIntelligence): number {
  const top = Math.max(...Object.values(domainScores));
  const clusterStrength = cluster[0]?.similarity ?? 0;
  const danger = Math.max(traitFrom(directIntel.traits,'danger'), traitFrom(classicIntel.traits,'danger'), traitFrom(directIntel.traits,'lawPressure'), traitFrom(classicIntel.traits,'lawPressure'));
  const master = [11,22,33].includes(args.directYear) || [11,22,33].includes(args.classicYear) || !!args.directCompound?.isMasterNumber || !!args.classicCompound?.isMasterNumber ? .08 : 0;
  return Math.min(100, Math.round((.46 + top * .24 + clusterStrength * .18 + danger * .12 + master) * 100 * ageMultiplier));
}

function fullSynthesisText(args: BuildArgs, title: string, subtitle: string, diagnosis: string, ranked: Array<{domain: Domain; score: number}>, clusterText: string, conflicts: string[], reinforcements: string[], decisions: string[], personality: string, outcome: string, protection: string, ageText: string, master: string | null, karmic: string | null, intensity: number): string {
  const conflictParagraph = conflicts.length
    ? `The contradiction is not a problem to average out; it is the mechanism of the year. ${conflicts.map(c => `The pattern shows ${c}`).join('; ')}. In practice, this means the visible event and the private experience may not match. Others may call it expansion while you experience subtraction, or they may see victory while you are busy managing risk.`
    : 'There is no major contradiction requiring a forced compromise. The two compounds mostly point in the same direction, so the correct reading is amplification rather than balance.';
  const reinforcementParagraph = reinforcements.length
    ? `The reinforced domains are ${reinforcements.join(', ')}. Reinforcement matters because it changes probability: these areas move from “possible theme” to “likely stage.” Do not scatter attention evenly across the whole life; concentrate strategy where the pair repeats itself.`
    : 'The pair does not heavily reinforce one single domain, so the year is more adaptive. The practical task is to notice which domain activates first and then interpret the other domains through that opening.';

  return [
    `FORENSIC PERSONAL YEAR SYNTHESIS\n${title}\n${subtitle}\n\nThe strongest question is not “what does each compound mean?” The stronger question is: if these two compounds are trying to tell one coherent story about ${args.targetYear}, what is that story? ${diagnosis}`,
    `\n1. HISTORICAL PATTERN DETECTION\n${clusterText}`,
    `\n2. DOMINANT ESSENCE AND CONFLICT RESOLUTION\n${conflictParagraph}\n\n${reinforcementParagraph}`,
    `\n3. MANIFESTATION PROBABILITY MAP\n${formatDomainRanking(ranked)}\n\nThese percentages are not random decoration. They come from the closest historical cluster, corrected by the Direct/Classic pair and boosted where both compounds reinforce the same domain. A low percentage does not mean “nothing can happen” there; it means the year is less likely to choose that domain as its main stage.`,
    `\n4. BEHAVIOUR AND DECISION FORECAST\nPersonality shift: ${personality}\n\nLikely decisions:\n${decisions.map(x => `• ${x}`).join('\n')}`,
    `\n5. OUTCOME FORECAST\n${outcome}`,
    `\n6. PROTECTIVE STRATEGY\n${protection}\n\nThis is intentionally specific. Generic advice such as “work hard” is too weak for this engine. The protective move must match the highest-probability manifestation field, because historical analogues show that the same compound pair can become triumph or loss depending on where the person failed to protect the obvious weak point.`,
    `\n7. AGE, MASTER AND ALERT MODIFIERS\n${ageText}\n\n${master ? `Master-number note: ${master}` : 'No master-number override dominates the pair.'}\n\n${karmic ? `Alert note: ${karmic}` : 'No severe alert compound dominates the pair; ordinary prudence is enough unless the year activates a high-risk domain.'}\n\nIntensity score: ${intensity}/100. High intensity means the pattern is more likely to become concrete and visible; it does not mean the year is automatically good or bad.`,
    `\n8. FEEDBACK LOOP\n${buildFeedbackLoopText()}`,
  ].join('\n');
}

export function buildPersonalYearDualEssenceSynthesis(args: BuildArgs): PersonalYearDualEssenceSynthesis {
  const directIntel = intelligenceFor(args.directCompound, args.directYear, args.directRaw);
  const classicIntel = intelligenceFor(args.classicCompound, args.classicYear, args.classicRaw);
  const archetype = pairArchetype(args);
  const cluster = nearestCluster(args, directIntel, classicIntel);
  const domainScores = buildDomainScores(args, directIntel, classicIntel, cluster, archetype);
  const ranked = rankedDomains(domainScores);
  const conflicts = detectConflicts(directIntel, classicIntel);
  const reinforcements = detectReinforcements(directIntel, classicIntel);
  const age = typeof args.birthYear === 'number' ? args.targetYear - args.birthYear : null;
  const ageInfo = ageBand(age);
  const resonance = ageResonance(age, args);
  const master = masterSignal(args);
  const karmic = karmicDebtSignal(args, directIntel, classicIntel);
  const polarity = determinePolarity(directIntel, classicIntel);
  const title = titleFor(args, archetype, ranked, conflicts);
  const subtitle = `${label(args.directRaw,args.directYear,args.directCompound)} × ${label(args.classicRaw,args.classicYear,args.classicCompound)} · ${ageInfo.label} · ${polarity}`;
  const clusterText = makeHistoricalText(cluster);
  const diagnosis = buildDominantDiagnosis(archetype, args, directIntel, classicIntel, ranked, conflicts, reinforcements);
  const decisions = buildDecisionForecasts(archetype, ranked, directIntel, classicIntel);
  const personality = buildPersonalityShift(archetype, ranked, directIntel, classicIntel);
  const outcome = buildOutcomePrediction(archetype, ranked, conflicts, reinforcements, polarity);
  const protection = buildProtectiveStrategy(archetype, ranked);
  const ageText = [ageInfo.text, ...resonance].join('\n\n');
  const intensity = intensityScore(args, ageInfo.multiplier, domainScores, cluster, directIntel, classicIntel);
  const synthesisText = fullSynthesisText(args, title, subtitle, diagnosis, ranked, clusterText, conflicts, reinforcements, decisions, personality, outcome, protection, ageText, master, karmic, intensity);
  const directEssenceRole = `Visible trigger layer: ${label(args.directRaw,args.directYear,args.directCompound)} tends to manifest through ${Object.entries(directIntel.domains).sort((a,b)=>(b[1]??0)-(a[1]??0)).slice(0,4).map(([k]) => DOMAIN_LABELS[k as Domain]).join(', ')}. Consultant reading: ${directIntel.thesis}`;
  const classicEssenceRole = `Hidden storyline layer: ${label(args.classicRaw,args.classicYear,args.classicCompound)} tends to judge the outcome through ${Object.entries(classicIntel.domains).sort((a,b)=>(b[1]??0)-(a[1]??0)).slice(0,4).map(([k]) => DOMAIN_LABELS[k as Domain]).join(', ')}. Consultant reading: ${classicIntel.thesis}`;

  return {
    title,
    subtitle,
    synthesisText,
    directEssenceRole,
    classicEssenceRole,
    ageModifier: ageText,
    masterNumberSignal: master,
    karmicDebtSignal: karmic,
    historicalCalibration: clusterText,
    predictionFocusAreas: topDomainNames(ranked),
    protectiveActions: uniq([protection, ...decisions.slice(0, 4)]),
    domains: ranked.slice(0, 8).map(r => DOMAIN_LABELS[r.domain]),
    polarity,
    intensityScore: intensity,
  };
}
