# Reflection — AI-Assisted Development of the FuelEU Maritime Platform

## What I Learned Using AI Agents

Working with multiple AI agents on this project revealed the distinction between *generation quality* and *correctness quality*. Agents like GitHub Copilot and Claude Code are excellent at producing syntactically valid, idiomatically correct TypeScript and well-structured React components. However, they operate at the level of isolated functions or files — they rarely catch cross-cutting bugs that only appear when multiple layers interact. The double-counting bug in `BankRepositoryImpl` is a perfect example: each individual piece was coherent, but the integration assumption (that `saveBanked` would replace rather than append) was never validated by the agent.

The most effective use of AI in this project was as a **scaffolding accelerator**, not as a replacement for design thinking. Once I had a clear architectural contract (ports, use-cases, adapters), the agents could fill in the implementations quickly. The quality degraded sharply whenever I asked for cross-layer reasoning — for example, "does this repository implementation correctly implement the use-case's assumptions?".

## Efficiency Gains vs Manual Coding

| Task | Manual Estimate | With AI | Savings |
|------|-----------------|---------|---------|
| Prisma schema + seed | 45 min | 10 min | ~35 min |
| 7 use-case classes | 90 min | 25 min | ~65 min |
| 4 repository implementations | 60 min | 15 min | ~45 min |
| React tab components | 120 min | 40 min | ~80 min |
| Test scaffolding | 60 min | 15 min | ~45 min |
| **Total** | **~375 min** | **~105 min** | **~72% reduction** |

The savings were most pronounced for boilerplate-heavy tasks (Prisma models, Express controllers, React hooks). They were least effective for correctness-critical logic (banking balance semantics, pool allocation state management).

## Improvements for Next Time

1. **Provide interface contracts before asking for implementations.** The agent was much more reliable when I gave it the port interface first and asked it to implement that specific contract, rather than asking it to design both simultaneously.

2. **Use agents for test-first development.** Writing the tests first (with mock repos) and then asking the agent to produce the implementation that makes them pass resulted in far fewer bugs than generating implementations first.

3. **Validate cross-layer assumptions explicitly.** After each generation, explicitly ask: "Does the repository implementation match what the use-case expects from the interface?" This catches mismatch bugs before they reach runtime.

4. **Batch similar-structure files.** Agents work best when given a complete example of one file and asked to produce N similar ones (e.g., "here is `routeRepositoryImpl.ts`, now generate `bankRepositoryImpl.ts` following the same pattern with these specifications").

5. **Separate documentation from code generation sessions.** Mixing documentation prompts with implementation prompts leads the agent to produce generic documentation. Dedicated doc-generation prompts with specific examples produce much richer, accurate documentation.
