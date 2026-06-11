# Prompt Appendix

This appendix records the key prompts used to develop and refine Ledgerly.
Minor follow-up wording and repeated requests have been consolidated.

## Product and Full-Stack Build

> Build Ledgerly as a fully functional application using React for the
> frontend and Python for the backend. Connect the backend to Supabase so real
> user profiles, tasks, notifications, and settings are saved and retrieved.
> Preserve the existing MVP workflows and prepare the project for Vercel.

## Visual Redesign

> Rebuild the complete frontend around the Atelier + Planner direction.
> Preserve existing behaviour and backend contracts while replacing the
> fragmented styling with one responsive, accessible design system. Use the
> warm-paper palette, supplied logo assets, compact navigation, planner-style
> calendar, contextual task panels, and purposeful motion.

## Mobile Experience

> Optimise every page for phones. Use mobile bottom navigation, accessible
> touch targets, responsive reports, compact calendar navigation, and
> bottom-sheet task details. Ensure there is no horizontal overflow.

## Annual Compliance Planning

> Expand the annual calendar with realistic obligations, especially during
> June and July. Keep the full year useful without making it overwhelming.
> Add progressive disclosure, status filters, and interactive task groups.

## Interaction and Polish

> Make expected controls interactive across reports, notifications, pricing,
> roadmap items, metrics, and task groups. Add tasteful motion and feedback so
> the application feels complete, modern, and professional.

## Authentication and Security

> Add baseline password requirements and secure authentication handling.
> Store credentials in environment variables, keep the Supabase service role
> key out of frontend code, validate protected backend requests, and ensure
> user data remains scoped to the authenticated user.

## Reports

> Replace the text export with a concise, visually polished PDF compliance
> report using the Ledgerly brand system and actual logo. Make report
> generation reliable across local and deployed environments.

## Repository and Deployment

> Prepare the GitHub repository for assessment. Keep the walkthrough concise,
> clearly document the React frontend, Python backend, Supabase integration,
> Vercel deployment, environment variable security, repository structure, and
> `.gitignore`.

## Copy and Accessibility

> Remove em dashes from application copy. Use concise plain language, visible
> focus states, semantic labels, keyboard support, reduced-motion behaviour,
> and status indicators that do not rely on colour alone.
