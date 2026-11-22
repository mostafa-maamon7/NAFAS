# NAFAS (نَفَس) — Interactive Choking First-Aid Simulation Platform

**NAFAS (نَفَس)** is a bilingual (English LTR + Modern Standard Arabic RTL) clinical-grade educational simulation platform that teaches choking first aid across **Adults (18+ & Pregnancy)**, **Children (1–8 years)**, and **Infants (< 1 year)** through 9 story-driven, interactive levels aligned with **AHA**, **Australian Resuscitation Council (ARC)**, and **Resuscitation Council UK** guidelines.

---

## 1. Architecture Overview

- **`src/types/nafas.ts`**: Strongly typed schema for the 5-stage gameplay loop (`LevelPlayPhase`: `'story_intro' | 'assess_signs' | 'decision_crisis' | 'live_acting_out' | 'final_debrief'`), articulated character rig poses (`RigPoseId`), interactive clinical hotspots (`AssessSignHotspot`), micro-interactions (`MicroInteractionType`), and player ranks (`PlayerRankInfo`).
- **`src/components/RiggedSceneCanvas.tsx`**: Layered, articulated SVG character and environment animation engine supporting:
  - 4 environments (`family_dining`, `home_workplace_lounge`, `school_cafeteria`, `home_nursery`)
  - 4 victim rigs (`youssef_adult`, `salma_pregnant`, `mostafa_child`, `nelly_infant`) + rescuer rigs
  - 15 dynamic poses, cyanosis lip tinting (`SpO₂ <= 86%`), clickable Stage 2 clinical sign hotspots, and Stage 4 hand-landmark + rhythmic 5-tap micro-interactions.
- **`src/components/LiveAirwayVisualizer.tsx`**: Live anatomical upper-airway and trachea cross-section showing foreign-body bolus displacement, airflow stream, diaphragm surge, and SpO₂ percentage.
- **`src/components/CinematicStoryPlayer.tsx`**: Data-driven 5-stage level player:
  1. **Stage 1 (`story_intro`)**: 3 animated story beats establishing the person, location, and incident.
  2. **Stage 2 (`assess_signs`)**: Interactive clinical sign inspection (choices remain locked until Stage 2 is completed).
  3. **Stage 3 (`decision_crisis`)**: 3 randomized clinical choices per attempt with zero spoilers and an optional 20-second Challenge Mode timer.
  4. **Stage 4 (`live_acting_out`)**: Interactive anatomical hand-placement + 5 rhythmic thrusts (skippable) followed by a 3-beat animated consequence playback before any right/wrong verdict is revealed.
  5. **Stage 5 (`final_debrief`)**: Verdict banner, `0–3★`, XP, physiological explanation (*Why it worked or failed*), guideline citation (`AHA · ARC · RCUK`), practical tip, and *"Watch Correct Technique Live"* replay.
- **`src/data/storyLevels.ts`**: Contains all 9 bilingual levels (`L1`–`L9`) and runtime schema validator `validateStoryLevels()`.

---

## 2. How to Add a New Level

All levels are 100% data-driven. No view or player code needs to be modified to add a new level:

1. Open `src/data/storyLevels.ts`.
2. Append a new `StoryLevel` object to the `STORY_LEVELS` array with:
   - `id`, `code` (e.g., `'L10'`), `levelNumber`, `campaignOrder`, and `ageCategory` (`'adult' | 'child' | 'infant'`).
   - `scene`: pick from existing `location`, `victim`, `rescuer`, and `obstruction` IDs.
   - `storyBeats`: 3–4 narrative beats with `rigPose`, `airwayMode`, `spo2`, and `heartRate`.
   - `assessHotspots`: 3 clickable clinical sign hotspots (`xPct`, `yPct`, `cueCategory`, `label`, `finding`, `severity`).
   - `choices`: exactly 3 `StoryLevelChoice` entries (`1` `'correct'` `3★`, `1` `'suboptimal'` `1★`, `1` `'critical_error'` `0★`), each with 3 `playbackBeats`.
   - `clinicalReviewItem`: clinical focus and verification note for the **Clinical Review Checklist** in `AboutView`.
3. `validateStoryLevels(STORY_LEVELS)` runs automatically at module load to verify that the new level meets all structural and bilingual constraints.

---

## 3. How to Add a New Language

1. Extend `Language` in `src/types/nafas.ts` (e.g., `export type Language = 'en' | 'ar' | 'fr';`) and add the language key to `BilingualText`.
2. Add the UI dictionary entry in `src/data/translations.ts`.
3. Populate the new language strings on each `StoryLevel` in `src/data/storyLevels.ts`, `LEARNING_ARTICLES` in `src/data/learningContent.ts`, and `VERIFIED_QA_ITEMS` in `src/data/verifiedAiKnowledge.ts`.

---

## 4. Clinical Review Checklist (For Licensed Clinician Sign-Off)

| Level | Scenario & Patient | Clinical Focus | Guideline Rules Verified (AHA · ARC · RCUK) |
| :--- | :--- | :--- | :--- |
| **L1** | *The First Cough at Dinner* — Youssef (34y) | Mild vs. Severe Airway Obstruction | Effective cough present: encourage coughing & monitor; do not deliver back blows or water. |
| **L2** | *Silent at the Table* — Youssef (34y) | Conscious Adult Severe Choking | Universal choking sign + silent airway: alternate 5 interscapular back blows & 5 abdominal thrusts above navel. |
| **L3** | *When Standard Doesn't Fit* — Salma (31y, 3rd Trimester) | Choking in Late Pregnancy + Unresponsive Transition | Never perform abdominal thrusts in late pregnancy; use sternal chest thrusts and transition to 30:2 supine CPR if unresponsive. |
| **L4** | *Cafeteria Alarm* — Mostafa (6y) | Conscious Child Severe Choking (Whole Grape) | Kneel behind child; alternate 5 back blows & 5 calibrated abdominal thrusts; never shake upside down or give water. |
| **L5** | *Forceful Cough at Recess* — Mostafa (6y) | Pediatric Mild Airway Obstruction | Loud forceful cough with air exchange: encourage coughing and keep child upright and calm. |
| **L6** | *Unresponsive in the Cafeteria* — Mostafa (6y) | Unresponsive Child Choking & Pediatric CPR | Lower to firm floor, start 30:2 CPR (~5 cm depth), visually inspect mouth before breaths, never perform blind finger sweeps. |
| **L7** | *Silent in the Nursery* — Nelly (8m) | Conscious Infant Severe Choking | Support prone on forearm head-lower-than-chest: 5 back blows + 5 two-finger chest thrusts. **NEVER** perform abdominal thrusts on an infant. |
| **L8** | *Loud Cry & Cough in the Nursery* — Nelly (8m) | Infant Mild Airway Obstruction | Loud cry and forceful cough indicate open airway; hold upright and monitor without forceful back blows. |
| **L9** | *Unresponsive in the Nursery* — Nelly (8m) | Unresponsive Infant Choking & Infant CPR | Firm flat surface, 30:2 two-finger sternal CPR (~4 cm / 1.5 in depth), visual-only mouth check, gentle mouth-to-mouth-and-nose puffs. |
