export const CURSOR_PROMPT = `This is a starter prompt to help you build a "Cafe Cursor" polaroid-style developer card application. This is a full-stack web app where developers create personalized polaroid-style cards showcasing their Cursor IDE setup, tech stack, and profile.

**Important:** This is a starting point for iterative development. Work in small steps, ask clarifying questions, test frequently, and refine based on feedback. Don't try to generate everything at once—build incrementally and verify each piece works before moving forward.

## Core Concept
Users create digital polaroid cards (like physical instant photos) that display:
- Their profile photo (uploaded/zoomed/panned)
- Social handles (@username)
- Cursor IDE configuration (models, features, plan tier)
- Tech stack badges
- A themed stamp in the corner
- Decorative tape strips at the top

Cards can be exported as high-res PNGs for physical printing (100×148mm paper, 2 per sheet) or shared online with OG image generation.

## Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite 7 for build tooling
- Tailwind CSS 4 with CSS variables for theming
- React Router v7 for routing
- React Query (TanStack Query) for server state
- React Hook Form for form management
- Zustand for client state management
- modern-screenshot (domToPng) for image generation
- Lucide React for icons
- date-fns for date formatting

**Backend:**
- Supabase (PostgreSQL + Storage + Edge Functions)
- Deno runtime for Edge Functions
- Supabase Auth (OAuth: GitHub, X/Twitter)
- Supabase Realtime for live updates
- Supabase Storage for image hosting

**Deployment:**
- Vercel for frontend hosting
- Supabase Edge Functions for API endpoints
- Vercel Analytics & Speed Insights

## Database Schema

**polaroids table:**
- id (UUID, primary key)
- user_id (UUID, foreign key to auth.users)
- image_url (TEXT) - rendered polaroid image URL
- source_image_url (TEXT) - original uploaded photo URL
- og_image_url (TEXT) - Open Graph image for social sharing
- profile (JSONB) - complete user profile data:
  - handles: Array<{handle: string, platform: "x" | "linkedin"}>
  - primaryModel: string (e.g., "composer-1")
  - secondaryModel: string (e.g., "gpt-5.1")
  - favoriteFeature: "agent" | "tab" | "voice" | "browser" | "rules"
  - planTier: "free" | "pro" | "pro-plus" | "ultra" | "student"
  - projectType: string (what they're building)
  - extras: string[] (tech stack tags)
  - isMaxMode: boolean
  - cursorSince: "day-1" | "2023" | "2024" | "2025" | "recently"
  - stampRotation: number (random rotation for stamp)
  - generatedAt: string (ISO date)
  - polaroidTheme: "classic" | "minimal" | "web" | "sakura" | "tokyo" | "cyberpunk" | "matrix"
- slug (TEXT, unique) - URL-friendly identifier for sharing
- source (TEXT) - tracking source
- referred_by (UUID, nullable) - referral tracking
- created_at, updated_at (timestamps)

**polaroid_likes table:**
- id (UUID)
- polaroid_id (UUID, foreign key)
- user_id (UUID, foreign key)
- created_at (timestamp)

**like_notifications table:**
- id (UUID)
- polaroid_id (UUID)
- owner_id (UUID) - polaroid owner
- actor_id (UUID) - user who liked
- created_at (timestamp)

**Storage Bucket: "polaroids"**
- Structure: \`{user_id}/{polaroid_id}.{ext}\`
- Public read access
- Cache control headers for CDN

## Edge Functions (Deno Runtime)

1. **create-polaroid**: Creates new polaroid with profile data, uploads source image, generates slug
2. **get-polaroids**: Fetches community cards with pagination, sorting (likes/date), filtering
3. **get-polaroid-by-id**: Gets single card by ID (public access, no auth required)
4. **get-polaroid-by-slug**: Gets single card by slug for sharing (public access)
5. **update-polaroid**: Updates profile/image, handles image replacement, generates rendered portrait
6. **delete-polaroid**: Deletes card and associated storage files
7. **toggle-polaroid-like**: Like/unlike functionality with notification creation
8. **get-like-notifications**: Fetches notifications for authenticated user
9. **set-mark-for-printing**: Mark/unmark card for printing (one per user, uses RPC function)
10. **mark-polaroid-printed**: Admin-only endpoint to record print events and clear print marks
11. **get-admin-polaroids**: Admin-only endpoint for moderation with search, filters, pagination

All functions use Supabase service role key, validate auth where required, and implement proper error handling with CORS headers.

## Key Features

### 1. Image Upload & Editing
- Drag & drop or file picker
- Image compression (max 2000px dimension)
- Zoom slider (0.5x - 2x)
- Pan controls (X/Y sliders, -150 to +150)
- Real-time preview with aspect-square image area
- Image filters per theme

### 2. Profile Form
- Multiple social handles (X, LinkedIn) with platform icons
- Cursor model selectors (coding & thinking models)
- Feature selector (Agent Mode, Tab, Voice, Browser, Rules)
- Plan tier selector
- Project type input
- Tech stack tags (free text, max 10)
- Max Mode toggle
- Cursor tenure selector
- Theme selector with visual previews

### 3. Theme System
7 themes, each with:
- Unique color palette (accent, text, badges)
- Custom fonts (display, body, mono)
- Stamp design (circular/square, themed content)
- Tape strip gradient
- Badge styles (pill, square, outline, minimal, tag)
- Background pattern (subtle decorative element)
- Image filter (contrast/saturation adjustments)

Themes:
- **classic**: Orange accent, Cafe Cursor branding
- **minimal**: Gray tones, clean geometric
- **web**: Blue hyperlink colors, browser aesthetic
- **sakura**: Pink cherry blossom, Japanese spring
- **tokyo**: Hot pink + cyan neon, cyberpunk nightlife
- **cyberpunk**: Yellow + cyan, Blade Runner style
- **matrix**: Pure green, digital rain aesthetic

### 4. Autosave System
- Debounced saves (1s delay)
- Tracks profile/image changes
- Generates rendered portrait on profile change
- Shows sync status (idle/saving/saved/error)
- Handles race conditions with refs

### 5. Print Pipeline
1. **DOM Render**: React component renders with white bg (#ffffff), all styling/images/text
2. **Screenshot**: modern-screenshot (domToPng) captures at 4x scale (1360×1836px from 340×459px base)
3. **Storage**: Data URL → blob → Supabase Storage with cache-busting query params (?v=timestamp)
4. **Print Ready**: Optimized for 100×148mm paper, 340×459px aspect ratio (74:100mm when rotated 90°)

Print dimensions calculated from constants:
- Paper: 100×148mm (4×6 inches)
- 2 polaroids side by side (rotated 90°)
- Each polaroid: 74mm wide × 100mm tall (when rotated)
- Pixel dimensions: 340×459px (maintains 0.74 aspect ratio)

### 6. Community Features
- Public feed of all cards
- Like/unlike functionality
- Like notifications with actor info
- Real-time updates via Supabase Realtime
- Sorting (newest, most liked)
- Filtering (MAX mode only)

### 7. Internationalization
- English & Spanish support
- Language toggle in header
- All UI text translated
- Date formatting localized

## UI/UX Details

### Layout
- Sticky header with logo, nav, notifications, language toggle
- Main editor section with form on left, preview on right
- 3D tilt effect on polaroid hover (mouse tracking)
- Responsive design (mobile-first)
- Dark/light theme support (CSS variables)

### Polaroid Card Component
- White background (#ffffff) for printing
- Fixed dimensions: 340×459px (print-optimized aspect ratio)
- Padding: pt-5, px-3, pb-3
- Paper texture overlay
- Shadow effects
- Tape strips at top corners (theme-specific gradients)
- Image area: aspect-[4/3] (slightly landscape)
- Caption area with profile info, badges, stamp
- Stamp positioned bottom-right, scaled 88%, rotated randomly

### Form Components
- Theme selector: Grid of mini previews showing tape, stamp shape, colors
- Image picker: Drag zone with visual feedback
- Sliders: Custom styled with accent colors
- Badge inputs: Tag-style with remove buttons
- Validation: Real-time error display

### Animations
- Smooth transitions (200-500ms)
- Hover effects (scale, rotate)
- Loading states (spinners, skeletons)
- Toast notifications
- Tilt effect on polaroid (3D transform)

## State Management

**Zustand Stores:**
- polaroid-store: Active polaroid, new card requests, editor key
- editor-ui-store: Sharing state, tilt effect state
- ui-store: Modal states, new card choice
- theme-store: Dark/light mode
- community-store: Community feed state

**React Query:**
- Polaroid CRUD operations
- Community feed queries
- Notifications queries
- Optimistic updates for likes

## Security

- Row Level Security (RLS) on all tables
- Users can only CRUD their own polaroids
- Public read access for published cards
- Admin role check for admin endpoints
- Auth required for create/update/delete
- Image upload validation (type, size)

## Performance

- Image compression before upload
- Lazy loading for community feed
- Debounced autosave
- Optimistic UI updates
- CDN caching with cache-busting
- Code splitting with React Router
- Vite optimizations

## File Structure

\`\`\`
src/
  components/
    polaroid/        # Polaroid card components
    form/            # Form inputs
    layout/          # Header, footer, shell
    sections/        # Page sections
    pages/           # Page components
    ui/              # Reusable UI components
  hooks/             # Custom React hooks
  stores/             # Zustand stores
  contexts/          # React contexts (auth, language, tracking)
  constants/         # Theme configs, translations, data
  lib/                # Supabase client, utilities
  types/              # TypeScript types
  pages/              # Route pages
supabase/
  functions/          # Edge Functions
  migrations/         # Database migrations
\`\`\`

## Implementation Notes

- Use TypeScript strictly (no \`any\`)
- Follow React 19 patterns (use hooks, avoid class components)
- Use Tailwind utility classes, avoid inline styles where possible
- Implement proper error boundaries
- Handle loading/error states everywhere
- Use semantic HTML
- Ensure accessibility (ARIA labels, keyboard navigation)
- Mobile-responsive design
- Print-friendly CSS (white backgrounds, proper sizing)

## Print Specifications

- Target paper: 100×148mm (4×6 inches)
- Layout: 2 polaroids side by side (rotated 90°)
- Each polaroid: 74mm × 100mm (when rotated)
- Pixel dimensions: 340×459px
- Aspect ratio: 0.74 (height/width)
- Export scale: 4x for high-res (1360×1836px)
- Background: Pure white (#ffffff)
- Format: PNG with transparency where needed

## Development Approach

**Start with:**
1. Set up the project structure (Vite + React + TypeScript)
2. Configure Supabase connection and auth
3. Build the basic form and preview components
4. Implement one theme first (classic), then add others
5. Add autosave functionality
6. Implement export/print pipeline
7. Add community features incrementally

**Iterate and refine:**
- Test each feature as you build it
- Ask questions if requirements are unclear
- Make small, focused changes
- Verify functionality before moving to the next feature
- Refactor when needed, but prioritize working code first

Build this application following modern React best practices, ensuring type safety, performance, and excellent user experience. Remember: this is a starting point—work iteratively and don't hesitate to ask for clarification or make adjustments as you go.`;











