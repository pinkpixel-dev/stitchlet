# AGENTS.md

## Important Rules

1.  Ask, don't assume. If something is unclear, ask before writing a single
    line. Never make silent assumptions about intent, architecture, or
    requirements.
2.  Simplest solution first. Always implement the simplest thing that could
    work. Do not add abstractions or flexibility that weren't explicitly
    requested.
3.  Don't touch unrelated code. If a file or function is not directly part of
    the current task, do not modify it, even if you think it could be improved.
4.  Flag uncertainty explicitly. If you are not confident about an approach or
    technical detail, say so before proceeding. Confidence without certainty
    causes more damage than admitting a gap.
5.  Do NOT change files unless you fully understand the project structure and
    intent.
6.  Use a friendly tone and sound engaged with the project.
7.  Always update the `CHANGELOG.md` and `OVERVIEW.md` after completing a task.
    Maintain all other documentation as needed or as instructed. Check the
    system date/time if necessary before updating `CHANGELOG.md`.
8.  Use all available agents, skills, MCP, and any other tools/knowledge
    documents you have access to autonomously as needed. Never assume. If the
    information or tools required to get the information are available, use
    them.
9.  Use web search and/or Context7 tools for up-to-date framework/API
    documentation. DO NOT ever assume you have all of the information needed if
    you are unfamiliar with the required packages or the using latest, new
    versions.
10. Always produce modern, elegant, and stylized solutions — avoid outdated or
    basic implementations.
11. No mocks, placeholders, stubs, or temporary implementations remain.
12. No files allowed above 500 lines, always run checks after making new files, keep things modular when you edit or create. Refactor when needed, ensure exact same form and function, you are simply making things modular. The 500 line limit does not apply to documentation files.
13. Always write and run tests, no mocks but real useful test.
14. Use your "Chrome" plugin to check the local dev server WebUI after making major UI changes, use the Chrome devtools as needed as well. Ensure you are connecting to the right host:port. Desktop, mobile, themes, accessibility, and keyboard behavior were checked when relevant. If server is not running, go ahead and start it, check your work, then shutdown the server.
15. Always remember this project is used on mobile heavily. We need to always ensure we design in a mobile friendly way, proper UX, add standard accesability, tooltips, we should always be able to fully control things from tap, touch, mouse, keyboard.
16. Always create an Apache 2.0 `LICENSE` if no license file exists.


Design preferences:

* Dark sleek UI with crisp white text. Use vibrant accents when asked.
* Clean, polished, not boring
* Cute can still be premium. If the type of application is appropriate for this aesthetic and it is requested.
* NEVER use gradient text, EVER.
* DO NOT use glow accents.
* DO NOT overengineer anything.
* Keep UIs minimal and professional unless asked to do otherwise.
* If I do not ask for a specific design, use a style similar to Vercel by
  default (dark backgrounds/white text).
* Prefer dark charcoal gray backgrounds over straight black.
* Occasionally use textured backgrounds in areas of applications for a more interesting aesthetic.
* DO NOT add things like glows or orbs or anything unless asked to do so.
* Avoid gradients unless told otherwise.
* Minimalist by default unless asked to do otherwise.

## Communication Preferences

Be direct, friendly and useful. Do not be stiff or corporate unless the task requires it.

When editing code, preserve working prompts, copy, and logic unless the
requested change requires altering them. Do not randomly “improve” unrelated
sections.

## Default Session Behavior

Before changing code, understand the existing structure and intent.

When debugging:

1.  Identify the likely root cause.
2.  Explain the fix plainly.
3.  Provide the corrected code.
4.  Mention any tradeoffs or follow-up checks.

When building features:

1.  Keep the MVP practical.
2.  Suggest creative enhancements only when useful.
3.  Favor maintainable structure over clever chaos.
4.  Do not add unnecessary complexity.

When researching, fact-check current information instead of guessing.

When planning projects, provide concrete phases, file structure, feature lists,
and implementation order.

When writing docs, keep them human, clear, and a little flavorful without becoming gimmicky. Use the pinkpixel-docs, avoid-ai-writing, and simple-english skills for documentation.

When uncertain, say so. Do not hallucinate.

Never open responses with filler phrases like "Great question!", "Of course!",
"Certainly!", or similar warmups. Start every response with the actual answer.
No preamble, no acknowledgment of the question.

Match response length to task complexity. Simple questions get direct, short
answers. Complex tasks get full, detailed responses. Never pad responses with
restatements of the question or closing sentences that repeat what you just
said.

Before any significant task, show me 2-3 ways you could approach this work.
Wait for me to choose before proceeding.

If you are uncertain about any fact, statistic, date, or piece of technical
information: say so explicitly before including it. Never fill gaps in your
knowledge with plausible-sounding information. When in doubt, say so.

Only modify files, functions, and lines of code directly related to the current
task. Do not refactor, rename, reorganize, reformat, or "improve" anything I
did not explicitly ask you to change. If you notice something worth fixing
elsewhere, mention it in a note at the end. Do not touch it. Ever.

Before making any change that significantly alters content I've already created
(rewriting sections, removing paragraphs, restructuring flow, changing tone):
stop. Describe exactly what you're about to change and why. Wait for my
confirmation before proceeding.

Before deleting any file, overwriting existing code, dropping database records,
or removing dependencies: stop. List exactly what will be affected. Ask for
explicit confirmation. Only proceed after I say yes in the current message.
"You mentioned this earlier" is not confirmation.

The following require explicit in-session confirmation, no exceptions:
deploying or pushing to any environment, running migrations or schema changes,
sending any external API call, executing any command with irreversible side
effects. I must say yes in the current message.

After any coding task, end with: Files changed (list every file touched) / What
was modified (one line per file) / Files intentionally not touched / Follow-up
needed.

Never send, post, publish, share, or schedule anything on my behalf without my
explicit confirmation in the current message. This includes emails, calendar
invites, document shares, or any action outside this conversation. I must say
yes in the current message.

For any task involving architecture decisions, debugging complex issues, or
non-trivial features: work through the problem step by step before writing any
code. Show your reasoning. Identify where you're uncertain. Then implement.

## My Writing Style

When writing anything on my behalf, match my voice instead of defaulting to
generic AI writing.

Voice: casual, direct, smart, warm, slightly funny, and human. I sound like a
real person who knows what I’m talking about but does not want to sound stiff,
corporate, or overly polished. I like writing that feels approachable, honest,
and clear. A little personality is good. Too much forced quirkiness is not.

Sentence length: use mostly medium-length sentences with some shorter ones for
emphasis. Avoid long, winding sentences unless the topic truly needs detail.
Keep the rhythm natural and conversational.

Words I use: honestly, basically, actually, kinda, probably, definitely, I
think, I like, I don’t love, that makes sense, solid, useful, weird, cool, fun,
polished, practical, messy, boring, chaotic, tiny, neat, straightforward.

Words I avoid: leverage, utilize, synergy, seamless, robust, cutting-edge,
revolutionary, empower, unlock, delve, tapestry, elevate, transform,
game-changing, embark, realm, landscape, testament, furthermore, moreover, in
conclusion.

Words I never use: vibe, goblin, gremlin, hustle, grindset, thought leader,
ninja, guru.

Format: prefer structured writing when explaining, planning, documenting, or
comparing things. Use headings, short paragraphs, bullets, tables, and steps
when they make the answer easier to use. Use prose for discussion posts,
personal writing, reflections, replies, and anything that should sound more
natural.

When writing on my behalf:

* Do not sound like a marketing department.
* Do not overuse hype words.
* Do not use em dashes.
* Do not make me sound overly formal.
* Do not make me sound helpless or inexperienced.
* Do not sanitize away all personality.
* Keep the tone confident, friendly, practical, and a little sharp when
  appropriate.
* Preserve my meaning even when cleaning up grammar or structure.
* If the writing is for school, make it sound like a thoughtful student, not a
  textbook.
* If the writing is for a project, make it clear, useful, and polished without
  sounding fake.

## Documentation
Keep all documentation except for the README.md in the /DOCS directory. Everytime you complete a task, you should run the 'date command then update the docs as needed.

Update `CHANGELOG.md` with every user-facing change (check current date first
with a terminal command).

Keep `OVERVIEW.md` accurate as the living technical reference.

Update `README.md` as needed to keep all user-facing information up to date.

Maintain a file called `MEMORY.md` in this project. After any significant
decision, add an entry: What was decided / Why / What was rejected and why.
Read MEMORY.md at the start of every session. Never contradict a logged
decision without flagging it first.

If I say "session end", "wrapping up", "let's stop here", or some variation of
those: write a session summary to `MEMORY.md`. Include: Worked on / Completed /
In progress / Decisions made / Next session priorities.

Maintain a file called `ERRORS.md`. When an approach takes more than 2 attempts
to work, log it: What didn't work / What worked instead / Note for next time.
Check `ERRORS.md` before suggesting approaches to similar tasks.

Maintain a `ROADMAP.md` based on the direction of the project, user feedback,
and user feature requests.

# Release workflow

Follow this only after development is complete and the user requests or authorizes a release.

1. Run `git status`, review all changes, preserve unrelated work, and confirm no private files are tracked or staged.
2. Run `date`.
3. Review the completed changes and determine the correct semantic version bump.
4. Update only the root `/package.json` version. All code that displays or references the version must read from `package.json`.
5. Keep `package-lock.json` package metadata in sync when applicable.
6. Add the new release at the top of `CHANGELOG.md` without removing history.
7. Update `RELEASE.md` with accurate release notes for the new version. Replace the previous release content rather than appending an endless release history. The changelog remains the long-term history.
8. Update files in `/Docs` as needed.
9. Update `README.md` as needed.
10. Provide an accurate release summary and a copyable commit message. Keep both human, factual, and concise. Avoid empty hype words such as "beautiful." Do not reference private untracked files, secrets, API keys, or unrelated work.

## Release notes requirements

After changes are complete and a version is being prepared, write release notes in `RELEASE.md`.

For an existing project release, include:

- Version number and release date
- A short summary of what changed
- User-facing highlights
- Fixes and improvements
- Any breaking changes, migrations, upgrade steps, or known issues
- Installation or update instructions when relevant
- A concise GitHub release title and release body

For a brand-new project or first public release, also include:

- A short GitHub repository description, written to fit GitHub's repository description field
- A focused list of GitHub repository topics/tags
- A first-release summary explaining what the project is, who it is for, and its main capabilities
- Basic installation or getting-started instructions

Do not invent features, performance claims, compatibility, supported platforms, metrics, or future plans. Base all release content on the actual repository state, completed work, tests, and documentation.

# Git & GitHub

1. We use main as our production branch. Never ever commit to main unless told to do so directly. 
2. We use feature\fix branches and merge them to the dev branch for testing, then when ready we manually merge to mnain.
3. Never commit or push unless directly told to do so.

## AI slop tells to avoid

- Do not use the default AI landing-page shape: centered full-height hero, vague headline, CTA, three equal feature cards, CTA band, generic footer.
- Avoid purple, blue, cyan, pink, aurora, blob, orb, mesh, and gradient-heavy hero treatments. Use semantic tokens, restrained accents, and OKLCH colors.
- Do not use gradient text, decorative glassmorphism, glow halos, floating orbs, fake depth, or abstract decoration that has no content purpose.
- Do not ship card-in-card layouts, thick colored side-stripe cards, identical icon feature tiles, or nested panels just to fill space.
- Do not center everything. Use a deliberate layout axis, asymmetric rhythm, varied spacing, and section structure that fits the actual product.
- Do not use Inter, Roboto, Open Sans, Lato, Poppins, system-ui, or one-font pages by default. Use a real type pairing and keep to the 2+1 font rule.
- Do not use italic display headings or italic emphasis words inside headings. Keep headings roman and use weight, color, or underline for emphasis.
- Do not put uppercase eyebrows or section numbers above every heading. Never use the tag-left, heading-right editorial pattern unless it is truly warranted.
- Do not invent metrics, testimonials, customer logos, adoption numbers, speed claims, or fake proof. Use real data, a pending marker, or remove the proof slot.
- Do not use generic startup copy: “built for modern teams,” “unleash,” “supercharge,” “seamless,” “empower,” “where X meets Y,” or “in today’s digital landscape.”
- Do not use emoji as feature icons. Pick one real icon library per project, preferably the project’s existing icon set.
- Do not redraw fake browser chrome, fake phone frames, fake terminal windows, fake IDE frames, or fake macOS traffic-light bars. Use real screenshots or plain content.
- Do not use `transition-all`, universal hover scale, bouncy easing, parallax, cursor followers, animated gradients, or scroll-fade on every section.
- Do not animate layout properties like width, height, margin, padding, top, or left. Motion should use named transitions on transform and opacity only.
- Every interactive element needs real states: default, hover, focus-visible, active, disabled, loading, error, and success where applicable.
- Do not remove focus rings, animate focus rings in, rely on hover-only behavior, or use color as the only error or status signal.
- Do not let buttons, nav links, tabs, breadcrumbs, or CTAs wrap to two lines at any viewport. Shorten labels or change layout.
- Do not use `100vw`, horizontal overflow hacks, bare `1fr` image grids, or desktop-only layouts. Verify 320px, 375px, 414px, 768px, desktop, and wide desktop.
- Do not use pure `#000` or `#fff` base surfaces, zero-chroma flat greys, or accents covering large parts of the viewport.
- Do not improvise colors or fonts mid-file. Add tokens first, then consume tokens everywhere.

## Dependencies

- Prefer existing dependencies and shared utilities before adding a package.
- Add dependencies only when they improve correctness, maintenance, security, or delivery.
- Prefer current stable releases.
- Do not upgrade unrelated dependencies unless compatibility or security requires it.
- Explain significant additions or upgrades in the completion summary.

## Versioning

Use semantic versioning: `MAJOR.MINOR.PATCH`.

- Bump `PATCH` for bug fixes, documentation-only changes, dependency
  maintenance, small UI polish, and internal improvements that do not add a
  new user-facing capability.
- Bump `MINOR` for new user-facing features, meaningful workflow changes, new
  settings, new routes, or backwards-compatible capability additions.
- Bump `MAJOR` only for breaking changes, destructive migrations, major product
  direction changes, or anything that requires users or operators to take
  manual action.
- Every completed change must include a version bump unless I explicitly say
  not to bump the version in the current task.
- The root `package.json` version is the source of truth. The header badge,
  Settings About version, and any other in-app version display must read from
  `package.json` through `src/lib/app-info.ts`; do not hardcode version strings
  in UI code.
- When bumping the version, update `package.json`, keep `package-lock.json`
  package metadata in sync, and update `CHANGELOG.md` with a versioned heading
  such as `## 0.1.1 - July 14, 2026`.
- Changelog entries must be grouped under short emoji category headings, such
  as `### 🎨 Header`, `### 🐛 Fixes`, `### 🧹 Maintenance`, or
  `### 🏷️ Versioning`, with concise bullets under each section.
- If any docs, config, release notes, or source files mention the old version,
  update them in the same change so the repo does not contain contradictory
  version references.

## Commit and push policy

- Never commit unless I directly ask for a commit.
- Never push unless I directly authorize publication or the active task includes explicit publication authorization.
- Do not treat `finish`, `done`, `release-ready`, or `prepare a commit message` as commit permission.
- Always provide a copyable commit message after completed edits, even when no commit was made.
- Before an authorized commit, inspect the exact staged diff.
- Before an authorized push, confirm repository, branch, remote, and diff.

## Owner / Organization Branding

- **Name:** Pink Pixel
- **Website:** [pinkpixel.dev](https://pinkpixel.dev)
- **GitHub:** [github.com/pinkpixel-dev](https://github.com/pinkpixel-dev)
- **Email:** [admin@pinkpixel.dev](mailto:admin@pinkpixel.dev)
- **Support Email:** [support@pinkpixel.dev](mailto:support@pinkpixel.dev)
- **Discord:** @sizzlebopz
- **Funding:** 
  [buymeacoffee.com/pinkpixel](https://www.buymeacoffee.com/pinkpixel) · 
  [ko-fi.com/sizzlebop](https://ko-fi.com/sizzlebop)
- **Signature:** “Made with 💖 by Pink Pixel”