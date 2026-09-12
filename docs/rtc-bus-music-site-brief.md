# Project Brief — "RTC Bus" 90s Telugu Music Site

> Handoff document. This is written so a fresh session (with no prior chat history) understands the full context, the concept, the aesthetic, the tech approach, and the build order. Read the whole thing before writing any code.

---

## 1. What we're building (one line)

A single-page website that plays old 90s Telugu songs from a YouTube playlist, wrapped in a beautiful, atmospheric "world" — the inside of a night/dawn RTC bus — so that Telugu people feel an instant hit of nostalgia. The playlist is just an embedded YouTube playlist; **the product is the vibe.**

## 2. Where the idea comes from (reference sites)

There are a few sites that recently went viral doing exactly this pattern. Each one picks a specific, culturally-loaded *place* where certain music genuinely played, renders it as warm painterly AI art, and plays a matching YouTube playlist behind a custom UI:

- **truckdrivermusic.in** ("ट्रक ड्राइवर / Truck Wala Music") — POV of a decorated Indian truck cabin at golden hour, mountains behind, plays old Hindi/Punjabi truck-driver songs. Has a "326 listening" live counter and a "Support me" link.
- **chaitapri.wtf** ("चाय टपरी") — a roadside chai tapri (tea stall) with people sitting on benches. Has a **time-of-day cycle** (12am / 5am / 7am / 12pm / 4pm / 7pm / 8pm) where the scene, the copy, and the playlist mood change with the time. Copy example: *"Nobody's in a hurry. The bench has been occupied since noon."* Has an "8 at the tapri" counter and a "Watch on YouTube" button.
- There are others in the same genre (e.g. a saloon/barbershop one — `saloon.wtf`).

**Why they work:** they don't sell a playlist, they sell a *milieu* — a shared cultural memory of a place where that music lived. The song list is trivially an embedded YouTube playlist. The magic is the art + the copy + the specific chosen setting.

**Our angle / gap in the market:** there is currently **no such site for old Telugu songs.** We're claiming that space. The chosen setting must be something *both Andhra and Telangana people* share, so it feels pan-Telugu, not regional.

## 3. The chosen world (LOCKED — this is the concept)

**Setting: the inside of a moving APSRTC / TSRTC bus, at dawn.**

The RTC bus is the Telugu cousin of the truck, but broader in appeal — nearly every Telugu person has taken an overnight/early-morning RTC bus to their ooru (hometown). The cassette/radio up front, SP Balasubrahmanyam melodies drifting over the engine hum on a long journey, the whole bus quiet and half-asleep — this is a deeply shared memory.

**Exact moment we are capturing:**

- **Time:** dawn (first light, sky going from dark blue to warm orange on the horizon).
- **Point of view:** we (the viewer) are a passenger sitting somewhere around the **2nd to 4th row** of the bus. We are looking **forward down the aisle**, through the large front windshield, at the **road unspooling ahead** and the **driver driving the bus**. So the composition is: interior of the bus in the foreground/sides (seat backs, aisle, maybe silhouettes of sleeping passengers, curtains, the metal ceiling/handrails), and through the windshield the open road + dawn sky.
- **Mood:** calm, still, quiet. Everyone is half-asleep / drowsy. The bus is peaceful. Gentle motion. Nobody's talking. Just the road, the light coming up, and the music.

**Music mood:** old 90s Telugu songs — melodic, nostalgic, the SP Balasubrahmanyam / K. S. Chithra / Mano era, Ilaiyaraaja & M. M. Keeravani soundscape. Slow-to-mid tempo comfort songs that fit a sleepy dawn journey. Nothing high-energy.

**One-line feel:** *the peaceful half-asleep hour on a dawn RTC bus, road opening up ahead, old melodies playing softly.*

## 4. Atmosphere copy (the "soul" text)

The reference sites all have a few lines of evocative copy that set the scene. We want the same — short, sensory, in Telugu-flavoured English. Draft options (pick/refine one, or the Telugu title + one block of body copy):

- Title (Telugu, big): **ఆర్టీసీ బస్సు** (RTC Bus) — or a more evocative name like **వేకువ ప్రయాణం** (dawn journey) / **రాత్రి బస్సు** (night bus). *(Decide the title during build; "ఆర్టీసీ" is the most instantly recognizable.)*
- Small kicker line: `DAWN · THE 5 AM BUS` (mirrors chaitapri's `AFTERNOON · 12PM – 4PM`).
- Body copy option A: *"The bus has been moving since before sunrise. Half the seats are asleep. Outside, the road is just starting to catch the light — and up front, the same old songs keep playing."*
- Body copy option B: *"Nobody's fully awake yet. The driver knows the road by heart. Somewhere past the windshield the sky is turning orange, and SPB is still singing."*
- Footer: `made with ❤️ by [name]` (doubles as credit + soft marketing, like the reference sites).

## 5. The playlist

- The site owner (Manish) will source the YouTube playlist himself — 90s Telugu songs, ~40–80 tracks, matching the sleepy-dawn mood.
- Build should take a **YouTube playlist ID** as the single source of truth (easy to swap). Keep individual video IDs as a possible backup in case some get region-blocked/removed.
- **Do not hardcode a giant list in code** if a playlist ID works — load via the playlist so it's editable on YouTube without redeploying.

## 6. Technical approach

The reference sites are almost certainly just the **YouTube IFrame Player API** with a custom UI on top. Plan:

- Load the **YouTube IFrame Player API**, create a player with `listType: 'playlist'` and the playlist ID.
- **Hide the actual video** (the player exists but is visually offscreen / behind the art / sized to 0 or covered) — we only want the audio + our own controls.
- Build a **custom player UI**: play/pause, next, previous, current song title + artist, progress bar / elapsed + total time. Wire the buttons to the API: `playVideo()`, `pauseVideo()`, `nextVideo()`, `previousVideo()`, `getCurrentTime()`, `getDuration()`, and read metadata via `getVideoData()`.
- **Autoplay caveat:** browsers block autoplay with sound. The page must start paused and require a **first user click** ("tap to start" / a big play button) before audio begins. Handle this explicitly.
- Optional nice-to-have (later, mirrors chaitapri): a **time-of-day cycle** that swaps the art/copy/playlist by real clock time. NOT needed for v1 — our whole concept is locked to dawn, so v1 can be a single fixed dawn scene. Note it as a future extension only.
- A **"Watch on YouTube"** link (like chaitapri) that opens the current track on YouTube is a cheap, nice touch.

### The "listening" counter (the only real backend piece)

The reference sites show a live counter ("326 listening", "8 at the tapri").

- **v1: fake it.** Show a believable number that drifts slightly over time (e.g. base number + small random walk). This keeps v1 fully static and free to host. Perfectly acceptable for launch.
- **Later (real version):** build a genuine presence counter as a small systems exercise. Approach: each connected client opens a **WebSocket**; connection = +1, disconnect = -1; hold the count in **Redis** so it's correct across multiple server instances / horizontal scaling. This is the one feature that forces a persistent server rather than a static host.
- **Architectural fork to decide consciously:** if the counter is faked (or dropped), the entire site is **static** → trivial free hosting (Vercel/Netlify). If the counter is real-time, we need a persistent server (small VPS or a platform that supports WebSockets). Decide this on purpose, don't back into it.

## 7. Aesthetic / design direction

- Full-bleed **hero background image** that fills the viewport — the dawn bus-interior POV described in §3. This single image *is* the product; it must be beautiful. Warm, painterly, cinematic, slightly grainy — same family as the reference sites (they look like stylized AI art / painted stills).
- Large Telugu title overlaid on the scene, with a small English subtitle/kicker.
- The atmosphere copy block (§4) placed tastefully over the image (chaitapri puts it lower-left).
- The custom **player UI as a glassy/translucent card** floating over the art (both reference sites do a frosted-glass player card).
- **Mobile-first / fully responsive** — most traffic will be phones. Test the layout on a narrow viewport early, not at the end.
- Small polish: loading state while the player/art loads, subtle fade-ins, maybe a very slight ambient motion. A "Support me" style link is optional.
- The art itself: Manish will generate the hero image (Midjourney or similar); expect many iterations to nail it. Build should treat the hero image as a swappable asset (one image file / URL) so it can be dropped in when ready. Use a placeholder image during development.

> If a `frontend-design` skill is available in the Claude Code environment, consult it before building the UI — this is a design-forward project and the visual quality is the whole point.

## 8. Build order (step by step)

1. **Concept & copy** — already locked (see §3, §4). Finalize the exact title and one copy block.
2. **Playlist** — Manish provides the YouTube playlist ID. (Owner task, can proceed with a placeholder playlist meanwhile.)
3. **Hero artwork** — Manish generates the dawn bus image. Build with a placeholder until it's ready; treat as a swappable asset.
4. **Frontend shell** — static page: full-bleed background, Telugu title, kicker, atmosphere copy, and the custom player UI *look* (no real audio yet). Get it beautiful and responsive.
5. **Wire up YouTube IFrame API** — hidden player, load playlist, connect custom buttons, show current title/progress, handle the first-click-to-start autoplay rule. **This is the core functional milestone** — when this works, it's a working music site.
6. **Listening counter** — fake it for v1 (drifting number). Note the real WebSocket+Redis version as a future task.
7. **Polish** — loading state, mobile pass, keyboard shortcuts (space = play/pause, arrows = next/prev) optional, footer credit, "Watch on YouTube" link.
8. **Deploy & launch** — buy domain (TBD), host (static → Vercel/Netlify if counter is faked; VPS if real-time). Then **actually post it** — Reddit (r/india, r/telugu, r/hyderabad, r/andhra), Twitter/X, Instagram. Note: for these sites the *launch post* drives most of the success, not the build.

**Dependency notes:** steps 1–3 are the creative core and can run in parallel. Steps 4–5 are the technical spine and are the priority for a working v1. Step 6 is optional for v1. Step 8 (launch) is what actually makes it "boom."

## 9. Recommended v1 scope (to avoid over-building)

Ship a **single fixed dawn scene**, static site, faked listening counter, one great hero image, one curated playlist, custom player that works on mobile. That's it. Defer: time-of-day cycle, real presence counter, multiple scenes, support/donation links. Get the beautiful working thing out the door, then post it.

## 10. Tech stack suggestion (open to change)

- Frontend: plain HTML/CSS/JS is genuinely enough here, but React is fine if preferred (the whole app is one screen + a player). Whatever ships a beautiful, responsive single page fastest.
- No backend for v1 (faked counter ⇒ static hosting).
- If/when the real counter is built: a small Node.js WebSocket server + Redis for the shared count (this also happens to be a good hands-on distributed-systems exercise for the owner).

---

### About the owner (context for tone/decisions)
Manish — backend developer (Node.js/Express, MySQL; some Go), ~1 yr experience, comfortable with server-side work but newer to frontend polish and distributed systems. The real-time counter is intentionally framed as a learning opportunity but must not block launch. Prioritize shipping a beautiful, working v1.
