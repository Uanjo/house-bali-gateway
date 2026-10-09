<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application rules
- Keep VSL media and checkout configuration in `src/lib/vsl-config.ts`; this provides one replacement point for user-supplied destinations.
- Isolate playback and watch-time gating in `src/components/vsl-player.tsx`; CTA visibility must depend on real playback rather than elapsed page time.
- Define page visual styling and button variants in the shared design system; this keeps the branded experience consistent.
