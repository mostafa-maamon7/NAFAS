# NAFAS (نَفَس) — Complete Handoff Pack

> **للاستخدام:** ارفع الملف ده كله للأداة اللي هتبني (أو انسخه كاملًا في الرسالة)، وارفق معاه الصور الموضحة في **الجزء 0**.
> الأجزاء من 1 إلى 5 مكتوبة بالإنجليزي عشان الأداة. الجزء 0 ليك إنت بس (متبعتوش للأداة).

---

## PART 0 — دليلك (للمستخدم فقط، لا يُرسل للأداة)

### ١) ابعت إيه مع الملف ده (في نفس الرسالة)
1. **لقطات الموقع الأول** (الهوية والألوان واللوجو): قول للأداة "ده الهوية اللي لازم نلتزم بيها".
2. **لقطات المحاكاة التلاتة الأخيرة** (المجسم الشفاف + بطاقات L7/L8/L9): قول "ده اللي مش مقبول".
3. **ملف اللوجو الأصلي** لو عندك.
4. **صور الشخصيات والمشاهد** اللي هتولّدها من برومتات **PART 5** (الأهم). لو لسه ما جهزتهاش، سيب الأداة تستخدم placeholders وتديك قائمة بالناقص (موضح في PART 1).

### ٢) لو الأصول مش جاهزة
الأداة اللي بتكتب كود مش هترسم شخصيات حقيقية. من غير أصول حقيقية هترجع نفس المشكلة. ولّد الأصول الأول من PART 5، وبعد كل خطوة صوّر النتيجة وابعتها لي أراجعها معاك.

### ٣) بعد ما ترجعلك النتيجة
صوّر الشاشات وارجع لي، وأنا أحدد إيه المخالف بالظبط وأكتبلك التعديل.

### ٤) ملاحظات
- الأسماء (`Youssef/Tariq` و`Mostafa/Youssef` و`Nelly/Layan`) مكتوبة زي ما حددتها. لو قررت تستقر على اسم واحد، عدّلها في الملف كله قبل الإرسال.
- أي محتوى طبي لازم يراجعه طبيب أو مسعف معتمد قبل الإطلاق.

---

## PART 1 — INSTRUCTION TO THE BUILDING TOOL (read this first)

You are receiving a complete handoff pack for the NAFAS rebuild. Read all parts, then follow these rules:

1. **Priority order if instructions conflict:** PART 2 (Corrective Brief) overrides PART 3 (Master Brief). PART 4 (Level 4 reference) defines story and layout for Level 4.
2. **Attached images:** the first-site screenshots define brand identity (colors, logo, tone) and must be matched. The last three simulation screenshots show what is NOT acceptable. Generated character/scene images (if attached) are the visual assets to be used.
3. **Scope now:** build ONLY Level 4 "Cafeteria Alarm" as the reference implementation (plus the shared design system and the rebuilt homepage if not yet done). Do NOT touch other levels.
4. **If final character/scene artwork is missing:** use clearly marked temporary illustrated placeholders that still show a human face and correct poses, and return a list of exactly which assets are still needed. Never fall back to a translucent mannequin or geometric shapes as the final art.
5. **When finished, STOP** and show the result for review. Do not continue to other levels without approval.

---

## PART 2 — CORRECTIVE BRIEF (HIGHEST PRIORITY)

### Context
The current build misses the core idea. Failures found:
- **F1.** The main view is a translucent, faceless 3D mannequin: no identity, no setting, no story. It is a model viewer, not a scenario.
- **F2.** At the start of a level the HUD says "normal breathing, SpO2 99%". The problem is invisible; the user cannot tell what is wrong with the patient.
- **F3.** The screen is overloaded with toolbars (layers, camera, zoom, anatomical regions, patient switcher). A learner cannot tell what to do.
- **F4.** A CPR landmark popup covers the scene during the case-presentation stage, unrelated to choking.
- **F5.** The 5 stages were renamed ("Anatomical Application" instead of "Watch It Unfold"); the live consequence of the user's choice is not shown as a performed scene.
- **F6.** The same infant illustration is reused for L7, L8 and L9 although the scenarios differ (silent choking / effective cough / unresponsive). In L8 the image even shows back blows, which is the WRONG action for that level.
- **F7.** Text embedded inside images is unreadable.
- **F8.** Level cards open a "clinical case", not a story.

### Required changes

**1) Primary view = story scene, not a 3D model**
- Remove the 3D mannequin as the main experience. The main canvas is an illustrated scene with a real, identifiable person (face, clothes, age, expressions) in a real setting (dining room, school cafeteria, nursery, etc.), with at least 2 characters (patient + rescuer/bystanders).
- Anatomy becomes an optional "X-ray lens" overlay (airway cross-section: open / partial / blocked + the object) that appears automatically at key moments (choking onset, during maneuver, after expulsion) and can be toggled. It is never the default view.
- Remove the patient-age switcher, layer controls, camera controls and region chips from the level player. Keep only: Next, Inspect signs, X-ray lens toggle, Sound toggle, Skip/Auto-perform.

**2) The problem must be readable in 2 seconds**
- At choking onset: pulsing ring on the throat, hands-at-throat pose, wide-eyed expression, tinted lips, SpO2 dropping live (tabular numbers), airway indicator turning red/blocked, one-line caption in plain language, e.g. "He can't cough. He can't speak." / "لا يستطيع السعال ولا الكلام".
- Never show "normal/healthy" vitals once the emergency starts. HUD values must follow the story beat timeline.
- Mild-obstruction levels (L1, L5, L8) must visibly show an EFFECTIVE cough (loud cough, color normal, SpO2 stable) so the learner can compare it with severe choking.

**3) Restore the 5 stages exactly**
STORY → ASSESS → DECIDE → WATCH IT UNFOLD → SCORE & MASTER. Use these names. A visible stage stepper shows progress.
- STORY: 3–5 beats, each a UNIQUE scene state; tap/Space to advance; short caption per beat.
- ASSESS: tap hotspots on the patient (throat, mouth/lips color, hands, SpO2, airway). Each opens a short label: what you see + what it means. Choices are locked until the required hotspots are inspected.
- DECIDE: exactly 3 choices appear only now, shuffled. One correct, two plausible mistakes (at least one critical where applicable).
- WATCH IT UNFOLD: the chosen action is PERFORMED in the same scene: rescuer moves in, positions, performs the maneuver, object is expelled or not, patient reacts, HUD updates in real time. Wrong choices show their real consequence (e.g., shaking = object goes deeper, patient loses consciousness; water = cannot swallow, SpO2 falls). No right/wrong label until the sequence ends.
- SCORE & MASTER: stars (0–3), XP, verdict, why, real-life tip, guideline source, "Watch correct technique" replay, replay level, next level.

**4) Real interaction (not just buttons)**
- Assess: tap hotspots directly on the person.
- Maneuver: drag the rescuer's hands to the correct landmark (target zone highlights), then tap in rhythm to deliver 5 back blows / 5 thrusts with live force-arrow and airway feedback. Provide "Auto-perform" so it is never blocking, and skipping must NOT reduce stars for a correct decision (show a "Technique practice" badge).
- Infant levels: head-supported forearm position and two-finger chest-thrust landmark as the interaction.
- CPR levels: tap-to-compress with a rate guide (100–120/min) and depth feedback.

**5) Zero image repetition (hard rule)**
- Every level has its own unique scene set, and every story beat has its own unique pose/frame. No two levels may share a hero image, card image or scene.
- Level cards show a unique cover frame of that level's story moment.
- Add an automated build check that fails if two levels reference the same image asset or identical image hash.
- L7, L8, L9 must be visually distinct: L7 silent choking (distressed infant, parent panics), L8 loud cough (infant coughing strongly, parent watching, NO maneuver shown), L9 unresponsive infant (limp, parent calls EMS on speakerphone, CPR).

**6) Text and layout**
- No text baked into images. All labels are real HTML text, minimum 14px on mobile, bilingual, RTL-correct.
- Level cards open the Level Player (story), not a clinical case page. Card shows: unique cover, level title, age group, 1-line hook, stars, status.
- Reduce visual density: one primary action per screen.

**7) Art pipeline (quality rule)**
- Do not use geometric placeholder or translucent-mannequin art for characters. Use the supplied character/scene assets. For each character (Youssef/Tariq, Mostafa/Youssef, Nelly/Layan, rescuers, bystanders) expect a character sheet with consistent face/outfit and the poses/expressions: neutral, alert, distressed, choking, unconscious, recovered; plus per-level scene backgrounds in layers (far / mid / near).
- Build a layered animation rig (Rive or layered SVG + GSAP) that consumes those assets. If final artwork is not yet available, use clearly marked temporary illustrated placeholders that still show a human face and the correct poses, and list exactly which assets are still needed.
- Keep the character names EXACTLY as defined in the Master Brief.

**8) Keep (unchanged from Master Brief)**
Bilingual EN/AR with RTL, design tokens and navy/teal identity, AHA/ARC/RCUK alignment, safety rules (no shaking, no water, no blind sweeps, no abdominal thrusts on infants), disclaimer + emergency numbers, flash-safety under 3 Hz, reduced-motion support, local persistence.

### Acceptance criteria (corrective)
- [ ] A first-time viewer understands in 2 seconds who the patient is, where they are, and what is wrong.
- [ ] The main screen is a story scene with real characters, not an anatomical model.
- [ ] Vitals/HUD never contradict the story beat.
- [ ] Choices appear only after story + assessment; all 3 choices play out as live scenes with real consequences.
- [ ] At least 3 distinct hands-on interactions (hotspots, hand placement, rhythm) with an always-available Auto-perform.
- [ ] No two levels or cards share an image; build check enforces this.
- [ ] L7, L8, L9 are visually and medically distinct and correct.
- [ ] No text inside images; all text is bilingual HTML.

---

## PART 3 — MASTER BRIEF (v3)

### 0. Role
Act as a combined team: Principal Product Designer, Art Director, Senior Front-End Engineer (React/TypeScript), Motion Designer, Serious-Games Designer and Medical E-Learning Specialist. Deliver work at the level of a premium health-tech / clinical-training product. Be opinionated, justify key decisions briefly, state assumptions instead of asking unnecessary questions, and proceed.

### 1. Project context
NAFAS (نَفَس) is a bilingual (English LTR + Arabic RTL) educational simulation website teaching choking first aid through story-driven, interactive levels. A first version exists and works, but must now be rebuilt from scratch at a professional standard.
Keep navigation: Home · Story Levels · Learning Hub · Results & Evaluation · About NAFAS · AI Assistant, plus EN/AR switch, player progress chip (Stars x/27 · XP · Rank) and a "Play Levels" CTA. Keep the official NAFAS logo as is.

### 2. Problems to fix
- P1. Weak, unprofessional homepage → rebuild from zero, on-brand, game-like.
- P2. Poor, inconsistent, unclear characters → the scene alone must show what is happening and what the medical problem is.
- P3. After choosing a solution it is unclear what happened or why → every choice must be PERFORMED live on screen with visible consequences.
- P4. Static images → truly interactive, animated levels.
- P5. No personality/polish → a distinctive, cinematic, professional identity.
- P6. Must NOT feel like a children's game → serious, trustworthy, premium, yet engaging (progress, stars, XP, ranks, mission path).

### 3. Brand & art direction
Mood: calm, clinical-grade, cinematic, human, trustworthy. Not cartoonish, not bubbly, not toy-like, never graphic.

Design tokens (CSS custom properties, light + dark surfaces):
- navy-900 #071E30 · navy-800 #0B2A3F · navy-700 #0F3B57 · navy-600 #145074
- teal-500 #12B5A8 · teal-400 #2DD4C6 · teal-700 #0A7C73
- amber-400 #FFC83D (stars/XP only)
- success-500 #22A06B · warning-500 #E8A33D · danger-500 #E5484D (critical states only, always paired with icon + text label)
- neutral scale #F5F9FB → #0A1A26. All pairs pass WCAG 2.2 AA.

Typography: Inter (Latin); Cairo (Arabic display/headings) + IBM Plex Sans Arabic (Arabic body). tabular-nums for SpO₂, timers, XP, stars. Generous Arabic line-height. No novelty fonts.
Icons: one consistent line-icon family (Lucide or Phosphor). No emoji as UI icons.
Surfaces/effects: subtle glass panels, layered soft shadows, 1px borders, restrained gradients, light grain on cinematic areas. Motion 150–400ms UI easing, slow cinematic pushes in scenes. Logical CSS properties everywhere (ms-/me-/ps-/pe-/start-/end-).

Illustration style (ONE consistent style for all characters/scenes): modern semi-realistic flat/vector illustration, soft cinematic lighting, natural proportions, expressive but realistic faces, culturally appropriate for Arab families/schools/homes.
Quality rule: do not use simple geometric placeholder shapes for final characters; use real layered artwork (Rive / Lottie / layered SVG from illustrated assets) and provide an asset specification list.

### 4. Character naming rule (DO NOT ALTER)
Use the names EXACTLY as written. Do not rename, merge, split, "correct" or localize them differently.
- L1 adult: "Youssef/Tariq", age 34
- L4 child: "Mostafa/Youssef", age 6
- L7 infant: "Nelly/Layan", age 8 months
Render each name string exactly as written in UI, data files and captions (in Arabic display, transliterate each name part faithfully and keep the same pairing). Treat the names as client-provided content.

### 5. Pages
Home, Story Levels (full 9-level map), Level Player, Learning Hub (+ article page), Results & Evaluation, About NAFAS, AI Assistant, 404. Bilingual routing (/en, /ar), persistent language and progress, shared header/footer with persistent medical disclaimer and emergency numbers (997 / 911 / 999 / 123 / 112).

**Homepage (rebuild from zero)**
1. Sticky navbar: logo, single-line nav, progress chip (Stars x/27 · XP · Rank), instant EN/AR switch, primary CTA "Play Levels". Accessible mobile drawer.
2. Cinematic dark-navy hero (#071E30 → #0F3B57): "Breathe. Learn. Respond." / "تنفّس. تعلّم. أنقذ."; primary CTA "Play Story Levels", secondary "Start Learning". Beside it a live animated scene preview with a floating "Next Mission" card (level number, title, character, location, "Play Now"); below it the "Rescue Readiness" progress card.
3. Clinical trust strip: AHA · ARC · Resuscitation Council UK, 9 interactive story levels, live animated consequence playback, bilingual accessibility.
4. "Choose Your Learning Path": Adult (18+), Child (1–8), Infant (<1) campaign cards with scene art, setting, 3-level progress, stars, one-line clinical rule, plus "Open Full 9-Level Map".
5. Stylized 9-level route map teaser (completed/current/locked, stars, click-to-play).
6. "How each level works": 4-stage loop preview.
7. Featured Learning Hub modules.
8. Medical disclaimer + emergency numbers + footer.

### 6. Core gameplay loop — 5-stage state machine
STORY → ASSESS → DECIDE → WATCH_UNFOLD → SCORE_MASTER. Each level is a short story from an ordinary moment up to the emergency. It is not a quiz.

- **Stage 1 STORY (3–5 beats):** everyday setting → risk setup → rising tension → choking onset. Advance by click/tap/Space/Enter. Captions. Each beat drives a rig pose, camera framing (wide | medium | close_airway) and HUD telemetry. Audio toggle OFF by default.
- **Stage 2 ASSESS:** scene pauses at the acute moment. Learners click hotspots: throat clutch, cough effectiveness/sound, lip/skin cyanosis, SpO₂ trend, airway cross-section. Each shows a label + clinical meaning. Shortcut "Inspect All Signs". Optional Challenge Mode timer (OFF by default), pausable/extendable.
- **Stage 3 DECIDE:** only after Stage 1 beats are viewed and Stage 2 is done, reveal exactly 3 choices, shuffled per attempt: 1 optimal + 2 plausible mistakes (at least one critical where applicable). Never hint. Keys 1/2/3.
- **Stage 4 WATCH IT UNFOLD:** the action is performed LIVE on the rigged characters (anatomy, hand placement, force direction, rescuer movement, object expelled or not). Wrong choices show realistic, non-graphic consequences. HUD updates in real time. No spoilers until the sequence ends. Optional micro-interactions (hand-placement targeting, rhythmic tap delivery) with a visible Auto-Perform/Skip. Skipping must NOT reduce stars for a correct decision; show a "Technique practice" badge.
- **Stage 5 SCORE & MASTER:** 0–3★, XP and rank progress, verdict, reasoning, guideline citation (AHA/ARC/RCUK family, no invented quotes), real-life tip, "Watch Correct Technique" annotated replay, "Replay Level", "Next Level". Update global progress (x/27).

Scoring: 3★ = optimal decision + clean technique (or skipped via Auto-Perform with practice badge); 2★ = optimal decision with minor timing/landmark variance; 1★ = partially safe but delaying/suboptimal; 0★ = critical safety error.
XP: max ≈ 120 XP per level (stars-scaled + first-time bonus) so the top rank is reachable. Output the XP table.
Ranks: 0–249 Observer / ملاحظ · 250–599 Responder / مستجيب · 600–949 Rescuer / مسعف · 950+ Lifesaver / منقذ حياة.

### 7. Interactivity, animation, accessibility
- Layered rig: Far background → Mid environment/props → Articulated character rig → Rescuer & force-vector layer → Foreground lighting/vignette.
- Characters visibly act: breathing, coughing, universal choking sign, cyanosis lip tint, forward-leaning posture, rescuer approach, back blows, abdominal thrusts, chest thrusts, object expulsion, collapse, supine CPR.
- In-scene HUD: SpO₂, airway cross-section (open/partial/blocked), patient state, time indicator, subtle vignette/heartbeat cue.
- Any pulsing/flashing: under 3 flashes per second, disableable, never the only signal.
- prefers-reduced-motion: step-by-step illustrated pose transitions with explicit state badges.
- Sound OFF by default; captions always available.
- WCAG 2.2 AA, semantic HTML, full keyboard operation (Tab, Enter/Space, 1/2/3, Esc), visible focus, ARIA live regions for HUD, color never the only signal.
- Persist locally: language, stars, XP, completed levels, best scores, preferences.

### 8. The 9 levels (stories in EN + simple natural MSA Arabic)
**ADULT (18+)**
- **L1 "The First Cough at Dinner"** (Youssef/Tariq, 34): mild obstruction, effective cough. Correct: encourage coughing, stay close, monitor, escalate if cough becomes ineffective. Mistakes: immediate back slaps, offering water/bread.
- **L2 "Silent at the Table":** severe obstruction, conscious adult. Correct: call/activate EMS, 5 back blows + 5 abdominal thrusts, alternate. Mistakes: waiting it out, offering water.
- **L3 "When Standard Doesn't Fit"** (late-stage pregnancy / larger-body adult): chest thrusts on the sternum instead of abdominal; progresses to unresponsiveness → call EMS and start CPR immediately.

**CHILD (1–8)**
- **L4 "Cafeteria Alarm"** (Mostafa/Youssef, 6, whole grape — REFERENCE IMPLEMENTATION): severe silent choking. Correct: kneel to child's height, lean child forward, activate help/EMS, 5 back blows + 5 abdominal thrusts. Critical mistakes: shaking/upending the child, giving water.
- **L5 "Recess Coughing Fit":** loud effective cough. Correct: do not interfere physically, encourage coughing, monitor closely, escalate if signs change.
- **L6 "Collapse in the Hallway":** child becomes unresponsive. Correct: call EMS, pediatric CPR (30 compressions at 100–120/min), visually check the mouth before breaths and remove ONLY a visible object; never blind finger sweeps.

**INFANT (<1)**
- **L7 "Silent in the Nursery"** (Nelly/Layan, 8 months): severe silent choking. Correct: seated forearm support, head lower than chest, jaw cradled, 5 back blows + 5 two-finger chest thrusts, call EMS. NEVER abdominal thrusts or blind sweeps.
- **L8 "High-Chair Sputter":** strong cry/effective cough. Correct: monitor closely, no forceful blows/thrusts, stay ready to intervene if the cough weakens.
- **L9 "Limp in Your Arms":** infant becomes unresponsive. Correct: firm flat surface, call EMS on speakerphone, infant CPR (30 two-finger chest compressions ~4 cm deep at 100–120/min) + visual mouth check before gentle puffs.

For every level provide: 3–5 story beats, 3–4 assessment hotspots, 3 choices with explanations, outcome animation cues, scoring rules, tip, Learning Hub links. All choices medically defensible. Every severe-choking choice set must make "call EMS" explicit.

### 9. Medical accuracy & safety
- Align with AHA, ARC, Resuscitation Council UK.
- Always differentiate mild (effective cough) from severe (ineffective/silent) obstruction.
- Adults/children: back blows + abdominal thrusts. Infants: back blows + chest thrusts only. Unresponsive: EMS + CPR.
- Never: shake/hang upside down, blind finger sweeps, water for someone who cannot breathe, abdominal thrusts on infants.
- Non-graphic, calm tone. No distressing close-ups.
- Persistent disclaimer: NAFAS is educational and does not replace certified hands-on first-aid training or emergency services.
- Provide a Clinical Review Checklist flagging every scenario, anatomical rule and citation for licensed-clinician verification.

### 10. Secondary pages (same design system)
- **Story Levels:** full 9-level interactive map, states, stars, age filters, Challenge Mode toggle.
- **Learning Hub:** 8 categories, search, filters (age, read time, topic), clinical diagrams, related levels.
- **Results & Evaluation:** stars/XP/rank dashboard, per-level performance, mistake review with "why", readiness score, strengths/weaknesses, print/PDF-ready Educational Readiness Certificate (educational simulation record, not a clinical license).
- **About NAFAS:** mission, method, guideline matrix, Clinical Review Checklist, Character Sheet & Layered Scene Kit Inspector.
- **AI Assistant:** bilingual first-aid education chat via a server-side proxy (no API key in client code). Fixed guardrails: static emergency-escalation banner, no diagnosis, no medication advice, refuse unsafe requests, cite Learning Hub content.

### 11. Data-driven level engine
Levels are typed data validated at runtime (Zod):
```
{
 id, order(1–9), campaign("adult"|"child"|"infant"),
 title{en,ar}, subtitle{en,ar}, patientName (exact string per naming rule), patientAge,
 sceneConfig{location, victimCharacter, rescuerCharacter, obstructionObject},
 story[3–5]{id, caption{en,ar}, rigPose, camera, hud{spo2, heartRate, airwayState}},
 assess[3–4]{id, x, y, cueType, label{en,ar}, clinicalMeaning{en,ar}},
 choices[3]{id, text{en,ar}, isCorrect, isCriticalError, microInteractionType, outcomeRigSequence, hudTimeline[], verdictTitle{en,ar}, why{en,ar}, tip{en,ar}},
 scoring, guidelines[], recommendedArticleIds[], clinicalReviewNotes
}
```
One reusable LevelPlayer renders any level. Adding a level = a data file + assets, documented in the README.

### 12. Tech stack & engineering
React + TypeScript (Vite or Next.js), Tailwind with design tokens, Framer Motion/GSAP, Rive/Lottie/layered SVG, Zustand, localStorage/IndexedDB, react-i18next with RTL mirroring.
Performance: Lighthouse ≥ 90 mobile, lazy-loaded scenes, optimized assets, code splitting, zero layout shift.
Quality: ESLint/Prettier, unit tests for scoring/engine, Playwright smoke tests of a full level in EN and AR, Storybook for core components. README (setup, architecture, add a level, add a language).

### 13. Process
**Phase 1 (now):** (1) concise plan + style summary + assumptions + open questions; (2) design system + asset specification list; (3) homepage; (4) level engine + Level 4 as the complete reference. → **STOP** for my review.
**Phase 2 (after approval):** remaining 8 levels, Story Levels map, Learning Hub, Results, About, AI Assistant, QA pass, Clinical Review Checklist, risk list.

### 14. Deliverables
Design-system docs, source code, character sheet + layered scene kit + asset spec list, level data, XP table, README, Clinical Review Checklist, assumptions/open questions, short roadmap.

---

## PART 4 — LEVEL 4 REFERENCE (story + layout)

**Level 4 · "Cafeteria Alarm" · Mostafa/Youssef (6) · School cafeteria**

### Story beats (each is a unique scene)
| # | Scene | Caption (EN / AR) | HUD |
|---|-------|-------------------|-----|
| 1 | Wide shot: busy cafeteria, children eating, teacher watching | "Lunchtime at school. Everyone is eating and laughing." / "وقت الغداء في المدرسة… الجميع يأكل ويضحك." | SpO₂ 98% · airway open |
| 2 | Medium shot: boy laughing with a classmate, a whole grape in his mouth | "A classmate tells a joke, and he laughs with a whole grape in his mouth." / "زميلته تحكي نكتة، والطفل يضحك وفي فمه حبة عنب كاملة." | SpO₂ 98% · open |
| 3 | Close shot: boy stands suddenly, hands at throat, wide eyes, silent | "He stands up and grabs his throat. No cough. No sound." / "يقف فجأة ويمسك رقبته. لا سعال ولا صوت." | SpO₂ 94% ↓ · partially blocked |
| 4 | Very close: bluish lips, pulsing ring on the throat, teacher turning | "His lips are turning blue. He can't cough or speak." / "شفتاه تزرقان. لا يستطيع السعال ولا الكلام." | SpO₂ 87% ↓ · blocked |

### Assess hotspots (tap on the patient; choices locked until inspected)
- **Throat/hands:** universal choking sign → possible airway obstruction.
- **Lips:** blue tint = low oxygen.
- **Sound/cough:** no sound and no cough = severe (ineffective) obstruction.
- **SpO₂ + airway cross-section:** oxygen falling, grape blocking the trachea.

### Decide (3 shuffled choices)
- **A (correct):** Kneel to his height, lean him forward, call for help, 5 back blows then 5 abdominal thrusts.
- **B (critical error):** Hold him upside down and shake him.
- **C (critical error):** Give him water to swallow the grape.

### Watch it unfold
- **A:** teacher kneels, leans him forward, calls for help, delivers 5 back blows then 5 abdominal thrusts, grape is expelled, SpO₂ returns to 98%, child breathes and cries. → ⭐⭐⭐
- **B:** teacher inverts and shakes, grape moves deeper, child goes limp, SpO₂ falls to ~70%. → 0★ (critical error)
- **C:** teacher offers a cup, child cannot swallow (no air passes), SpO₂ falls to ~72%. → 0★ (critical error)
No right/wrong label until the sequence ends.

### Score & Master
Stars, XP, verdict, why (medical reasoning), real-life tip, guideline source (AHA/ARC/RCUK family), "Watch correct technique" replay, replay level, next level.

### Screen layout (wireframe in words)
- Top: stage stepper (Story › Assess › Decide › Watch › Score).
- Center (≈95% of the screen): the full scene with real characters and setting.
- Top corner: small HUD card (SpO₂ + airway status).
- Optional dashed inset: "X-ray lens" (airway cross-section), toggleable.
- Pulsing marker on the throat during Assess.
- Bottom: one short caption per beat + a single primary button (Next).
- Allowed controls only: Next · Inspect signs · X-ray lens · Sound · Auto-perform.
- Forbidden: translucent mannequin, camera/layer buttons, CPR popup over the scene.

---

## PART 5 — IMAGE-GENERATION PROMPTS (to create the assets)

Paste the **Style Anchor** at the start of EVERY prompt. Generate the character sheets first, then use them as reference images for all later frames to keep the faces consistent.

**STYLE ANCHOR**
```
Semi-realistic modern vector illustration, soft cinematic lighting, natural proportions, expressive realistic faces (not cartoonish, not chibi), muted navy and teal palette with warm skin tones, culturally appropriate for an Arab school setting, clean edges, no text, no logos, no gore.
```

**1) Character sheet — Mostafa/Youssef (6 yrs)**
```
[Style Anchor] Character sheet of a 6-year-old Arab boy, short dark curly hair, light blue polo shirt, dark trousers, white sneakers. Six poses in one row on a plain light background: neutral, laughing, alert/worried, hands clutching throat with wide eyes (choking), limp/unconscious, relieved recovery. Same face and outfit in every pose.
```

**2) Character sheet — Teacher (rescuer)**
```
[Style Anchor] Character sheet of an Arab woman teacher, about 35, navy blazer over a striped top, ID lanyard. Poses: standing watchful, running toward a child, kneeling at child height, hands positioned for back blows, hands positioned for abdominal thrusts from behind, calling for help.
```

**3) Scene background — school cafeteria**
```
[Style Anchor] Empty school cafeteria, long tables, trays with fruit and sandwiches, large windows with daylight, no people. Wide shot, eye level.
```

**4) Story frames (one image per beat; use the character sheets as reference)**
```
[Style Anchor] Same cafeteria, same boy and teacher.
Frame A: calm lunch, children eating, teacher watching.
Frame B: boy laughing with a whole grape in his mouth, classmate beside him.
Frame C: boy standing, hands at throat, silent, wide eyes, classmates turning.
Frame D: close-up, bluish lips, teacher turning toward him.
```

**5) Outcome frames**
```
[Style Anchor] Same cafeteria, same boy and teacher.
Frame E (correct): teacher kneeling beside the boy, leaning him forward, delivering back blows.
Frame F (correct): teacher behind the boy delivering abdominal thrusts, grape flying out.
Frame G (error, non-graphic): teacher holding the boy upside down.
Frame H (error, non-graphic): teacher offering a cup of water, boy unable to swallow.
```

**NEGATIVE PROMPT**
```
photorealistic skin, horror, blood, text in image, extra fingers, different outfit between frames, cartoon exaggeration.
```

**Notes for later levels (same method):**
- L1/L2/L3: adult character sheets (Youssef/Tariq, wife, children; pregnant or larger-body adult) + dining-room/home/work scenes.
- L7/L8/L9: infant sheet (Nelly/Layan, 8 months) + parent + nursery/high-chair scenes. Make L7, L8 and L9 visually distinct: L7 silent choking and panicked parent, L8 loud cough and parent watching (no maneuver), L9 limp infant and CPR with phone on speaker.
- Always review rescue hand positions and anatomy with a clinician before use.

---

## FINAL REMINDER TO THE BUILDING TOOL

Build ONLY Level 4 first. Corrective Brief (PART 2) has priority. Use the attached images for identity and for what is unacceptable, and PART 4 for story and layout. Do not touch other levels. Keep the character names exactly as written. When finished, STOP and show the result for review.
