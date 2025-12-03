# Source Tracking Documentation

## Overview

The polaroid system tracks where users come from when creating their cards. This information is displayed as a badge on the polaroid and stored in the database for analytics and printable card determination.

## When Source Badges Are Shown

Source badges appear on polaroid cards **next to the MAX button** (when present) when the source is **not** "direct". Badges are displayed with inverted colors (white background with colored text) and show:
- `event` - Blue badge labeled "From Event" - indicates the user came from an event promotion
- `x` - Black badge labeled "From X" - indicates the user came from X/Twitter
- `github` - Dark gray badge labeled "From GitHub" - indicates the user came from GitHub
- `shared` - Purple badge labeled "Referred" - indicates the user was referred by another user
- `direct` - **No badge shown** (default for direct visits)

## How Source Tracking Works

### 1. URL Parameter Detection

When a user visits the site, the `TrackingContext` analyzes:

- **UTM Parameters**: `?utm_source=event` or `?utm_source=x` or `?utm_source=github`
- **Referral Parameter**: `?ref={userId}` - Used when someone shares their referral link
- **Document Referrer**: The HTTP referrer header (e.g., `twitter.com`, `github.com`)

### 2. Source Determination Priority

Sources are determined in this order of priority:

1. **`event`** - If `utm_source=event` is present
2. **`shared`** - If `ref` parameter is present (user was referred by another user)
3. **`x`** - If referrer contains `twitter.com` or `x.com`, OR `utm_source=x` or `utm_source=twitter`
4. **`github`** - If referrer contains `github.com` OR `utm_source=github`
5. **`direct`** - Default fallback for all other cases

### 3. Persistence Across Auth Redirects

The tracking information is stored in `localStorage` with the key `polaroid-tracking` to persist across OAuth redirects. This ensures the source is captured even after the user authenticates and is redirected back to the site.

### 4. Database Storage

When a polaroid is created, the following fields are stored:

- **`source`** (TEXT): The determined source type (`event`, `x`, `github`, `shared`, or `direct`)
- **`referred_by`** (UUID): The user ID from the `ref` parameter, if present (references `auth.users.id`)

## Source Types Explained

### `event` - Event Attendees
- **Trigger**: `?utm_source=event` in URL
- **Badge**: White badge with blue text and border, labeled "From Event"
- **Use Case**: Printable cards for event attendees
- **Example URL**: `https://cafe.com/?utm_source=event`
- **Meaning**: Clearly indicates the user discovered the site through an event promotion

### `x` - X/Twitter Traffic
- **Trigger**: 
  - Referrer contains `twitter.com` or `x.com`
  - OR `?utm_source=x` or `?utm_source=twitter`
- **Badge**: White badge with black text and border, labeled "From X"
- **Use Case**: Track social media traffic from X/Twitter
- **Example URL**: `https://cafe.com/?utm_source=x`
- **Meaning**: Shows the user came from X/Twitter social media platform

### `github` - GitHub Traffic
- **Trigger**:
  - Referrer contains `github.com`
  - OR `?utm_source=github`
- **Badge**: White badge with dark gray text and border, labeled "From GitHub"
- **Use Case**: Track traffic from GitHub
- **Example URL**: `https://cafe.com/?utm_source=github`
- **Meaning**: Indicates the user discovered the site through GitHub

### `shared` - User Referrals
- **Trigger**: `?ref={userId}` in URL
- **Badge**: White badge with purple text and border, labeled "Referred"
- **Use Case**: Track when users share their referral link
- **Example URL**: `https://cafe.com/?ref=abc123-def456-ghi789`
- **Note**: The `referred_by` field stores the referring user's ID
- **Meaning**: Shows the user was referred by another community member

### `direct` - Direct Visits
- **Trigger**: No matching conditions above
- **Badge**: **No badge displayed**
- **Use Case**: Default for direct visits, bookmarks, or unknown sources

## Printable Cards

Cards with `source=event` are considered **printable** for physical distribution at events. All other sources (`x`, `github`, `shared`, `direct`) are **not printable**.

## Implementation Details

### Frontend Components

- **`TrackingContext`** (`src/contexts/tracking-context.tsx`): Captures and stores tracking data
- **`SourceBadge`** (`src/components/polaroid/source-badge.tsx`): Renders the badge on polaroid cards
- **`PolaroidCard`** (`src/components/polaroid/polaroid-card.tsx`): Displays the badge when source is provided

### Backend

- **`create-polaroid`** edge function: Accepts `source` and `referred_by` parameters and stores them in the database
- **Database columns**: `polaroids.source` and `polaroids.referred_by`

## Example Usage

### Sharing a Referral Link

When a user clicks "Share link" in the editor, it generates:
```
https://cafe.com/?ref={userId}
```

When someone visits via this link:
- `source` = `shared`
- `referred_by` = `{userId}`
- Badge shows: Purple "Shared" badge

### Event Promotion

For event promotion, use:
```
https://cafe.com/?utm_source=event
```

When someone visits via this link:
- `source` = `event`
- Badge shows: Blue "Event" badge
- Card is printable

### Social Media Sharing

When sharing on X/Twitter with referral:
```
https://cafe.com/p/{slug}?ref={userId}
```

This combines:
- Slug for pretty URL
- Ref parameter for referral tracking
- Result: `source` = `shared` (ref takes priority)

## Database Schema

```sql
ALTER TABLE public.polaroids 
  ADD COLUMN source TEXT DEFAULT 'direct',
  ADD COLUMN referred_by UUID REFERENCES auth.users(id);
```

## Notes

- Source is determined **once** when the user first visits and persists via localStorage
- The source badge is **read-only** and cannot be changed after polaroid creation
- Direct visits (`source=direct`) do not display a badge to keep the UI clean
- The tracking system respects user privacy by only storing the source type, not full URLs or browsing history

