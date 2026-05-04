# AI Onboarding Documentation Benchmark

> Same 4 prompts, same repo (`expressjs/express`), 4 different AI tools.

## Tools Tested

| Tool | Model | Interaction | Automated |
|------|-------|-------------|-----------|
| **IBM Bob** (ours) | IBM Bob CLI | One command: `npx repo-onboarder <url>` | ✅ Fully |
| **ChatGPT** | GPT-4o | Manual prompt, copy-paste | ❌ |
| **Perplexity** | Sonar | Manual prompt, copy-paste | ❌ |
| **Manus AI** | Manus | Manual prompt, copy-paste | ❌ |

---

## Task 1: README-GENERATED.md

| Aspect | IBM Bob | ChatGPT 4o | Perplexity Sonar | Manus AI |
|--------|---------|------------|------------------|----------|
| **Length** | ~100 lines, full README | ~60 lines, solid | ~15 lines, summary | ~40 lines, table-based |
| **Badges** | ✅ NPM version, downloads, license | ❌ | ❌ | ❌ |
| **Code example** | ✅ Full quick start | ✅ Basic example | ❌ | ❌ |
| **Install instructions** | ✅ | ✅ | ❌ | ❌ |
| **Use cases** | ✅ 6 detailed use cases | ✅ 5 use cases | ✅ Brief | ✅ 5 use cases |
| **Production-ready** | ✅ Drop into a real repo | ⚠️ Close, needs polish | ❌ Notes quality | ⚠️ Decent but incomplete |

**Winner: IBM Bob** — most complete, production-ready README with badges, code, and install steps.

---

## Task 2: ARCHITECTURE.md

| Aspect | IBM Bob | ChatGPT 4o | Perplexity Sonar | Manus AI |
|--------|---------|------------|------------------|----------|
| **Length** | ~300 lines | ~80 lines | ~30 lines | ~200 lines |
| **Design patterns** | 6 patterns with code examples | 4 patterns listed | 2-3 mentioned briefly | 5 patterns with explanations |
| **Component detail** | Full breakdown: router, middleware, req/res, views, security, performance | Good breakdown of 5 components | Brief file mentions | Detailed 6-component breakdown |
| **Request flow diagram** | ✅ ASCII diagram | ✅ Numbered lifecycle | ❌ | ❌ |
| **Security section** | ✅ Dedicated section | ❌ | ❌ | ❌ |
| **Performance section** | ✅ Dedicated section | ❌ | ❌ | ❌ |
| **Trade-offs discussed** | ✅ For each decision | ❌ | ❌ | ❌ |

**Winner: IBM Bob** — deepest analysis with security, performance, trade-offs, and code examples. Manus AI is a solid second.

---

## Task 3: GETTING-STARTED.md

| Aspect | IBM Bob | ChatGPT 4o | Perplexity Sonar | Manus AI |
|--------|---------|------------|------------------|----------|
| **Length** | Full guide, ~120 lines | ~60 lines | ~15 lines | ~100 lines |
| **File reading order** | ✅ Ordered with explanations | ✅ Numbered list | ✅ Brief list | ✅ Ordered with rationale |
| **Setup steps** | Clone, install, verify, test, lint | Clone, install, test | Clone, install | Clone, install, verify Node version |
| **Dev workflows** | Feature branch, bug fix, specific tests — all with commands | Basic: make changes, test, debug | "Run tests: `npm test`" | Test, lint, examples, debug — with commands |
| **Testing philosophy** | ✅ TDD approach, coverage, supertest | ❌ | ❌ | ❌ |
| **Resources/links** | ✅ Docs, API ref, migration guide, discussions | ✅ Contribution steps | ❌ | ❌ |

**Winner: IBM Bob** — most actionable guide with real workflows. Manus AI again a strong second.

---

## Task 4: TESTS-GENERATED.js

| Aspect | IBM Bob | ChatGPT 4o | Perplexity Sonar | Manus AI |
|--------|---------|------------|------------------|----------|
| **Test count** | 43 tests, 10 categories | 9 tests | ~10 tests, 5 categories | ~20 tests, 3 categories |
| **Framework** | Mocha + Supertest (matches Express) | Jest + Supertest | Supertest + assert | Mocha + Supertest |
| **Coverage areas** | Routing, middleware, req/res, errors, edge cases, static files, settings, views | Routing, middleware, errors, params, edge cases | Routing, middleware, edge cases | App, request, response |
| **Edge cases** | Empty responses, large payloads, special chars, concurrency, timeouts | Empty response, large payload | Empty middleware, invalid use(), trust proxy | req.fresh/stale, req.is(), cookies, views |
| **req/res testing** | ✅ Comprehensive | ❌ Basic | ❌ Basic | ✅ Detailed (headers, cookies, redirect, render) |
| **Runnable** | ✅ | ⚠️ Uses Jest (Express uses Mocha) | ⚠️ Mixed frameworks | ✅ Matches Express test setup |

**Winner: IBM Bob** — 4x more tests with broadest coverage. Manus AI has the best req/res detail among competitors.

---

## Overall Comparison

| Dimension | IBM Bob | ChatGPT 4o | Perplexity Sonar | Manus AI |
|-----------|---------|------------|------------------|----------|
| **README quality** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |
| **Architecture depth** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **Getting started** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐ |
| **Tests** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Automation** | ⭐⭐⭐⭐⭐ | ⭐ | ⭐ | ⭐ |
| **Effort required** | One command | Manual prompt + copy | Manual prompt + copy | Manual prompt + copy |

### Key Takeaways

1. **IBM Bob produces the highest quality output across all 4 tasks** — deeper analysis, more actionable content, and production-ready formatting.
2. **Manus AI is the strongest competitor** — particularly on architecture and tests, with good depth and structure.
3. **ChatGPT 4o is solid but surface-level** — good structure, but lacks the depth of Bob and Manus.
4. **Perplexity is the weakest** — outputs read like chat summaries, not standalone documents.
5. **Automation is the killer feature** — all competitors require manual copy-paste interaction. Our tool does it in one command with zero effort.

---

*Benchmark conducted on May 4, 2026 against `expressjs/express` repository.*
