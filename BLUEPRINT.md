# AI-Powered Battery Fitness Assessment — Development Blueprint
**Internal engineering spec for the hackathon build**
Target: NeGD / MeitY / MYAS National Hackathon · Prize Pool ₹46L+ · Deadline: Registration closes 1st week Aug 2026

Stack locked: **React Native** · AI-demo tests: **Height, Vertical Jump, Broad Jump, Sit-ups** · Differentiator: **Universal Calibration Marker**

---

## 0. Strategy in one paragraph

The brief explicitly says judging is on *approach and honest evidence*, not on hitting production accuracy (Section 11 of the Concept Note). So we are not trying to brute-force all 10 tests badly — we're doing **4 tests extremely well**, with a rigorous validation report, an honest limitations log, and one genuinely novel piece of engineering (the calibration marker) that a generic team using raw MediaPipe won't have. The remaining 6 tests get clean, fast manual-entry fallback so the app still feels complete end-to-end. This blueprint is organized so each engineer can pick up a module and start immediately.

---

## 1. Why these 4 tests + the calibration angle

| Test | Difficulty (per spec) | Why we chose it |
|---|---|---|
| Height | Medium-High | Needs pixel→cm calibration — perfect showcase for our marker |
| Vertical Jump | Medium-High | Flight-time physics is well-understood; frame-rate sensitive, which our confidence indicator handles gracefully |
| Broad Jump | Medium-High | Same calibration technique reused → shows architectural reuse, not one-off hacks |
| Sit-Ups | Medium | Joint-angle state machine is tractable with MediaPipe Pose; good rep-counting demo |

**The core insight driving our novelty claim:** the spec's own difficulty table says Height, Vertical Jump and Broad Jump are all hard specifically because *"a phone camera sees a flat 2D image... without a known-size reference object in the frame, the AI cannot convert pixels to centimetres."* Three of our four tests share this exact bottleneck. So instead of solving calibration three separate times, we build **one reusable calibration module** and get 3x the leverage from it. This is the single biggest lever for both accuracy and judging impressiveness — see Section 6.

---

## 2. Tech Stack

### 2.1 App layer
| Component | Choice | Why |
|---|---|---|
| Framework | **React Native 0.7x + TypeScript** | Single codebase → satisfies Android mandatory + iOS bonus deliverable for free |
| State management | **Zustand** (or Redux Toolkit if team prefers) | Lightweight, testable, keeps the AI pipeline's frame-by-frame state out of component re-render churn |
| Camera | **`react-native-vision-camera`** with Frame Processors (Worklets/JSI) | Gives real-time frame access on the UI thread's shadow worklet — needed for live overlay + on-the-fly pose inference, not just record-then-process |
| On-device inference | **`react-native-fast-tflite`** (TensorFlow Lite via JSI, runs inside VisionCamera frame processors) + **ML Kit Pose Detection** via `@react-native-ml-kit/pose-detection` (Android/iOS native wrapper around MediaPipe BlazePose) | On-device, no network — fastest path to a working pose pipeline, and frame processors avoid the JS-bridge bottleneck that plain RN would hit |
| Local DB | **`op-sqlite`** (fast JSI SQLite) with **SQLCipher** encryption enabled, or **WatermelonDB** if reactive queries are preferred | Encrypted local storage requirement (Section 6.3) |
| Video storage | App-private encrypted directory (`react-native-fs`, app sandbox path) + file-level AES via `react-native-aes-crypto` | Never touches shared/public storage → reduces accidental cloud-backup leakage risk |
| PDF report card | **`react-native-html-to-pdf`** (template-based HTML → PDF) or **`pdf-lib`** for programmatic layout | Fully offline PDF generation, bilingual text rendering |
| Localization | **`i18next` + `react-i18next`** with `en.json` / `hi.json` resource bundles | Hindi + English minimum requirement |
| Background upload | **`react-native-background-upload`** (native iOS/Android upload tasks) driving a resumable chunked-upload queue, coordinated with **`react-native-background-fetch`** for retry scheduling | Satisfies "uploading should happen in background" requirement |

### 2.2 AI models (all on-device, all pre-trained — no custom training data exists per spec Section 8.1)
| Test | Model | Notes |
|---|---|---|
| Height | ML Kit Pose Detection (BlazePose, 33 keypoints) + calibration module | Head-top estimated via keypoint extrapolation above eye landmarks |
| Vertical Jump | Pose Detection, tracked hip/ankle y-coordinate across frames | Flight-time method: `h = g·t²/8` |
| Broad Jump | Pose Detection, ankle-landing keypoint + calibration module | Ground-plane homography from marker |
| Sit-Ups | Pose Detection, torso/knee joint-angle state machine | Angle threshold state machine: UP / DOWN / INVALID |

All models are **quantized INT8 TFLite**, chosen deliberately for 3GB-RAM / budget-Android compatibility (Section 8.2 of concept note explicitly flags budget phones as the real target, not flagship devices).

### 2.3 Backend (bonus deliverable — sync/dashboard only, NEVER touches video)
| Component | Choice | Why |
|---|---|---|
| API | **FastAPI (Python)** or **NestJS (TS)** — pick based on team skill | Stateless REST, easy OpenAPI spec generation for the mandatory API_Spec.yaml |
| DB | PostgreSQL | Athlete profiles, de-identified scores, sync metadata — never raw video |
| Deployment | Docker Compose locally; architecture doc describes sovereign-cloud deployment (NIC cloud / MeghRaj) for production | We are **not required to deploy this publicly** — Section 7.1 forbids athlete video on commercial cloud. Backend receiving only de-identified numeric results is compliant; we keep video 100% on-device/local hardware always. |
| Queue | Simple table-backed resumable upload queue (chunked, byte-range) | Matches LLD requirement 4.2.5 |

**Critical compliance rule (non-negotiable):** the React Native app must NEVER upload raw video anywhere except a server the team physically controls (a laptop/local box), and ideally not at all during the hackathon demo. Only de-identified scores may go to any backend, and only that backend may optionally call a cloud LLM for feedback text (Section 6.3 bonus deliverable #5).

---

## 3. System Architecture (HLD summary)

```
┌─────────────────────────────────────────────────────────────────┐
│                      REACT NATIVE APP (Android/iOS)              │
│                                                                   │
│  UI Layer (React Navigation + Zustand)                           │
│   ├─ Onboarding/Login (NSRS/APAAR mock, local test accounts)     │
│   ├─ Individual Mode          ├─ Coach/Assessor Mode             │
│   │                            (athlete-wise / test-wise toggle) │
│                                                                   │
│  Test Workflow Engine                                            │
│   ├─ Protocol instruction screens (per test)                     │
│   ├─ Capture guidance overlay (silhouette, distance, angle)      │
│   └─ Video/photo recording controller (duration/size enforcement)│
│                                                                   │
│  AI Inference Engine                                              │
│   ├─ Calibration Module  ◄── marker detection (all 3 dist. tests)│
│   ├─ Pose Detection (ML Kit/MediaPipe, on-device)                │
│   ├─ Per-test measurement logic (state machines, physics calc)   │
│   └─ Confidence Scorer                                           │
│                                                                   │
│  Local Data Layer                                                │
│   ├─ op-sqlite/SQLCipher DB (athletes, results, sessions, queue) │
│   ├─ Encrypted video/photo file store (app-private dir)          │
│   └─ Offline sync queue (resumable, chunked)                     │
│                                                                   │
│  Report Card Generator (pdf package, bilingual, on-device)       │
└──────────────────────────┬────────────────────────────────────────┘
                            │  (numeric results + metadata ONLY,
                            │   NEVER video — only when online)
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│         BACKEND (sovereign infra in production; local box now)  │
│  FastAPI/NestJS API  →  PostgreSQL (de-identified results)      │
│  Optional: Cloud LLM call for narrative feedback (text only)    │
│  Future integration stubs: NSRS · APAAR · Khelo India Portal    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 4. AI Pipeline — per test detail

### 4.1 Height
1. Athlete stands still against a wall; calibration marker (see Sec. 6) placed in-frame at a known height/position.
2. ML Kit Pose Detection extracts 33 keypoints, one representative stable frame selected (lowest inter-frame keypoint jitter over a 1s window).
3. Head-top estimated by extrapolating a fixed offset above the eye/ear keypoints (calibrated empirically against a small validation set — document this assumption explicitly in the model card).
4. Marker's known real-world size converts the pixel distance (feet-keypoint to head-top-estimate) into centimeters.
5. Confidence score = f(keypoint visibility scores, frame stability, marker detection confidence).

### 4.2 Vertical Jump
1. Track hip-center (or ankle) keypoint y-coordinate across all frames of the jump video.
2. Detect take-off frame (sudden upward acceleration of ankle keypoints past a velocity threshold) and landing frame (ankle y-coordinate returns to baseline).
3. Flight time `t` = (landing_frame − takeoff_frame) / fps.
4. Height = `g·t² / 8` (standard flight-time formula), where g = 9.81 m/s².
5. Best of multiple attempts auto-selected by max computed height with confidence ≥ threshold.
6. **Known limitation to disclose honestly:** at 30fps, one dropped/misdetected frame shifts result by 2-4cm (this is stated directly in the concept note — put it verbatim-in-spirit into the Known Issues Log, don't hide it).

### 4.3 Broad Jump
1. Calibration marker placed at the take-off line, camera positioned side-on covering both take-off and landing zone.
2. Ground-plane homography computed from the marker's known dimensions → converts any pixel on the ground plane to real-world distance.
3. Ankle-landing keypoint (rearmost heel on landing) detected as the frame where vertical ankle velocity crosses zero after peak flight.
4. Distance = homography-transformed pixel distance between take-off line and landing point.

### 4.4 Sit-Ups
1. Pose Detection tracks torso angle (shoulder-hip-knee) each frame.
2. State machine: `DOWN` (torso angle > 150°) → `UP` (torso angle < 60°, elbows past knee-adjacent keypoints) → back to `DOWN` = 1 valid rep.
3. Invalid-rep filtering: reps that don't reach the `UP` angle threshold, or where hands unclasp (wrist-neck keypoint distance exceeds threshold), are not counted — directly reflecting the protocol's fault rules (Test IX).
4. Count freezes at timer expiry (30s U-12 / 45s 12+).

---

## 5. The 6 manual-fallback tests

Weight, Sit & Reach, Medicine Ball Throw, 30m Sprint, Shuttle Run, Endurance Run get a clean manual-entry UI:
- Same protocol-instruction screen as AI tests (parity of UX)
- Simple numeric entry with unit-aware validation (cm/kg/sec as appropriate)
- Optional OCR for Weight (Google ML Kit Text Recognition on the scale-display photo — still on-device, still bonus-eligible)
- All feed the same report card + local DB schema, so the app never feels "half AI, half broken"

This keeps scope realistic while still delivering all 10 tests functionally, per the mandatory-deliverable minimum (3-4 AI tests + fallback for the rest).

---

## 6. THE DIFFERENTIATOR — Universal Calibration Marker

This is the centerpiece of our pitch. Design it as a genuinely reusable sub-system, not a one-off hack.

### 6.1 Design
- A printable **A4-sized ArUco/checkerboard fiducial marker** (open-source, detectable via OpenCV's ArUco module — wired in as a native module, or run directly inside a **VisionCamera Frame Processor** using a small custom C++/Kotlin/Swift binding via JSI) with a known physical size (e.g., 21cm × 29.7cm, standard A4 — zero extra equipment cost for any school in India).
- Printed once, laminated, reused across Height, Vertical Jump, and Broad Jump stations — this reuse across 3 tests **is** the novelty: most teams will hack a separate solution per test.
- Detected automatically the moment it enters frame — app shows a green outline + "Calibration locked" confidence badge, so the PE teacher gets instant visual confirmation with zero technical understanding required.

### 6.2 Why this matters for judging
- Directly answers the concept note's own stated blocker ("the AI cannot convert pixels to centimetres" without a reference object) — we're not routing around the hard part, we're solving the hard part they named.
- One module → three tests → disproportionate accuracy gain relative to engineering effort. This is exactly the kind of "innovative, scalable, practically deployable" solution Section 4 (Objective) asks for.
- Zero-cost, zero-infrastructure deployment story: printable on any office printer, works in a dusty school ground, matches the "no reliance on stadiometer" requirement in Test 1's own protocol doc.

### 6.3 Fallback if marker isn't in frame
Graceful degradation: without the marker, fall back to a rough anthropometric estimate (average forearm-length ratio heuristics) with a visibly lower confidence score and a UI warning — never silently give a falsely precise number. This "never lie about confidence" principle should be a stated design philosophy in the HLD document, since it maps directly to Section 6.2's "confidence indicator" requirement across the whole app, not just this feature.

---

## 7. Video & Storage compliance (hard rules, do not skip)

- One video per test per athlete (retakes allowed, but only latest kept/uploaded)
- Enforce per-test min/max duration **at point of capture** (block recording start if under minimum after stop, warn approaching max, auto-stop at max) — implement as a `VideoConstraintService` used identically by every test screen
- 720p/30fps/MP4 minimum; reject below threshold
- Metadata auto-tag: test name, athlete ID, timestamp, GPS (via `react-native-geolocation-service` / `@react-native-community/geolocation`, cached last-known location if GPS unavailable indoors)
- Size limit has 50% tolerance for teams recording 1080p/120fps — build this into the validator, don't hardcode the baseline number
- Local storage: SQLCipher-encrypted DB + AES-encrypted video files, must survive app crash (write video to disk immediately post-capture, DB row committed before showing "done" to user — no in-memory-only state)
- Support 500 athlete sessions locally minimum — do a storage math check as part of QA (500MB–1GB per athlete × 500 = up to 500GB; flag if target device storage is a constraint, document this in Known Issues)
- Delete-after-sync option surfaced to user once cloud sync (numeric results only, never video) completes

---

## 8. Offline-first & Sync Design

- **Everything works with airplane mode on** — this will be live-demoed by evaluators, so build and test this path first, not last.
- Local queue table (`sync_queue`) with status: `PENDING → UPLOADING → SYNCED / FAILED`, retried with exponential backoff via `react-native-background-fetch` when connectivity returns (`@react-native-community/netinfo` listener)
- Conflict resolution: same athlete assessed on two devices → last-write-wins on a per-test-result basis, keyed by `(athlete_id, test_id, attempt_timestamp)`, with a manual merge UI as a stretch goal
- Only de-identified numeric scores + metadata sync — reiterate: **video never leaves the device** in our default configuration

---

## 9. Report Card

- Generated on-device within seconds of battery completion (`pdf` package, template-based layout)
- Bilingual (Hindi/English) via ARB-driven string templates
- Raw scores for all 10 tests, clearly separating AI-measured (with confidence badge) from manually-entered
- Percentile/rank fields explicitly labeled "Illustrative — Indian norms not yet established" per Section 8.5 — do this precisely, it's a compliance point the judges will specifically check for
- PDF export works fully offline

---

## 10. Data Protection Compliance Checklist (map directly to submission requirements)

- [ ] Written parental/guardian consent template for any athlete under 18 used during validation footage collection
- [ ] Informed consent template for adult athletes
- [ ] No video ever touches AWS/GCP/Azure/Colab/Kaggle/Drive/Dropbox — architecture diagram should visibly show this boundary
- [ ] Signed team declaration (all members) — draft this early, don't leave it to submission day
- [ ] Data inventory table: subjects recorded, ages, minor flag, storage location, deletion date (≤30 days post-hackathon)

---

## 11. Suggested Team Split (adjust to team size)

| Role | Owns |
|---|---|
| React Native/App Lead | Navigation, state, UI screens, localization |
| AI/CV Engineer | Pose pipeline, calibration marker module, per-test measurement logic |
| Data/Backend Engineer | op-sqlite/SQLCipher schema, sync queue, FastAPI/NestJS backend, Docker |
| QA/Validation Lead | Ground-truth measurement (tape measure/stopwatch), accuracy validation report, device matrix testing (1 budget + 1 mid-range phone minimum) |
| Docs/PM | HLD/LLD, model cards, known-issues log, submission packaging, deck |

---

## 12. Build Order (recommended sequence, ~2-3 week sprint)

1. **Week 1:** op-sqlite/SQLCipher schema + core navigation shell (React Navigation) + VisionCamera capture screen with duration/size enforcement (unglamorous but everything depends on it)
2. **Week 1-2:** Calibration marker detection module (build once, test in isolation with static images before wiring into any test)
3. **Week 2:** Height + Vertical Jump pipelines (reuse calibration module) → get one test fully working end-to-end including report card before parallelizing
4. **Week 2-3:** Broad Jump + Sit-Ups pipelines in parallel with manual-fallback screens for the other 6
5. **Week 3:** Offline sync queue, PDF report card polish, bilingual pass, device-matrix validation testing, docs/model-cards/declaration package, demo video with airplane-mode segment
6. **Final days:** Rehearse the 8-min pitch + 7-min live demo + buffer for Q&A — practice the offline demo specifically, since that's a scripted evaluator action

---

## 13. Submission Package Mapping (so nothing is missed)

| Deliverable | Where it comes from in this blueprint |
|---|---|
| APK + install docs | Section 2, 11 |
| Source + Git history | Standard repo hygiene from day 1 — commit early/often, don't squash before submission |
| HLD | Section 3 (expand into full 8-15 page doc) |
| LLD | Sections 4, 7, 8 (expand into full 10-20 page doc) |
| Model cards | Section 4 + Section 2.2 table |
| Validation report | Section 11 QA role + Section 6.3 honesty principle |
| Demo video | Section 8 (script the offline segment specifically) |
| Data protection declaration | Section 10 |
| Known issues log | Pull directly from every "Known limitation to disclose" note throughout this doc |

---

*This is a living document — as engineering reveals real constraints (e.g., ML Kit Pose Detection accuracy on Indian clothing), update the Known Issues section immediately rather than at submission time. Honesty about limitations is explicitly rewarded by the judging criteria — don't over-polish this away.*
