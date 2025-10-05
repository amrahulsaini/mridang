# Instagram Reels Feature - Setup Guide

## Overview
Instagram reels have been successfully integrated into your Mridang website. The reels appear on the homepage before the newsletter section.

## Features Implemented

1. **Instagram Reels Component** - Displays Instagram reels with a beautiful Instagram-gradient styled design
2. **Admin Panel** - Located at `/admininstareels` to manage the reels
3. **Database Storage** - Reels are stored in the database for easy management
4. **API Routes** - RESTful APIs to fetch and update reels

## Setup Instructions

### 1. Run Database Migration

You need to run the SQL migration to create the `instagram_reels` table:

```bash
# Connect to your MySQL database
mysql -u mrid_mridang -p mrid_mridang

# Then run the migration file
source database/migrations/006_instagram_reels.sql
```

Or manually execute the SQL:

```sql
-- Create table for Instagram reels embeds
CREATE TABLE IF NOT EXISTS instagram_reels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    embed_code TEXT NOT NULL,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_instagram_reels_active ON instagram_reels(is_active, display_order);
```

### 2. Insert Initial Reels

The migration file includes the 3 reels you provided. They will be automatically inserted when you run the migration.

### 3. Set Admin Password

Make sure you have the `ADMIN_PASSWORD` environment variable set in your `.env.local` file:

```env
ADMIN_PASSWORD=your_secure_password_here
```

This password will be used to access the admin panel at `/admininstareels`.

## Using the Admin Panel

### Access the Admin Panel

1. Navigate to: `https://yourdomain.com/admininstareels`
2. Enter the admin password (from `ADMIN_PASSWORD` in `.env.local`)
3. You'll see a form to manage your Instagram reels

### How to Add/Update Reels

1. Go to any Instagram reel you want to display
2. Click the three dots (...) menu on the reel
3. Select "Embed"
4. Copy the entire embed code (it's a long `<blockquote>` HTML snippet)
5. Paste it into the textarea in the admin panel
6. Click "Update Reels"

### Managing Multiple Reels

- Click "Add Another Reel" to add more reels
- Click "Remove" to delete a reel
- You can reorder reels by changing their position in the form (top to bottom = left to right on homepage)

## File Structure

```
app/
├── components/
│   ├── InstagramReels.tsx              # Main reels display component
│   └── InstagramReels.module.css       # Styling with Instagram gradient
├── admininstareels/
│   ├── page.tsx                         # Admin panel page
│   └── AdminInstaReels.module.css      # Admin panel styling
├── api/
│   ├── instagram-reels/
│   │   └── route.ts                    # Public API to fetch reels
│   └── admin/
│       └── instagram-reels/
│           └── route.ts                # Admin API to update reels
├── lib/
│   └── database.ts                      # Added getInstagramReels() function
└── page.tsx                             # Updated to include InstagramReels component

database/
└── migrations/
    └── 006_instagram_reels.sql         # Database migration
```

## Design Features

### Instagram-Style Design
- Beautiful gradient border on hover (Instagram's signature purple-to-orange gradient)
- Smooth transitions and animations
- Responsive grid layout
- Shadow effects on hover
- Professional styling matching Instagram's brand

### Responsive Design
- Desktop: 3 columns (or 2 if only 2 reels)
- Tablet: 2 columns or 1 column depending on screen size
- Mobile: Single column layout
- All reels are properly centered and sized

## API Endpoints

### Public Endpoints

**GET** `/api/instagram-reels`
- Fetches all active reels
- No authentication required
- Returns: `{ reels: [...] }`

### Admin Endpoints

**GET** `/api/admin/instagram-reels`
- Fetches all reels (including inactive ones)
- Used by admin panel

**POST** `/api/admin/instagram-reels`
- Updates all reels
- Requires admin password in request body
- Body: `{ password: "...", reels: [...] }`

## Security

- Admin panel is password-protected
- Password verification happens on the server
- No client-side password exposure
- SQL injection protection through parameterized queries

## Troubleshooting

### Reels Not Showing Up

1. Make sure you ran the database migration
2. Check that reels exist in the database:
   ```sql
   SELECT * FROM instagram_reels WHERE is_active = 1;
   ```
3. Verify the embed codes are complete and valid

### Admin Panel Not Working

1. Verify `ADMIN_PASSWORD` is set in `.env.local`
2. Restart your Next.js development server after setting environment variables
3. Check browser console for any errors

### Instagram Embeds Not Loading

1. Make sure the Instagram embed script is loading (check browser console)
2. Verify the embed codes are complete (they should start with `<blockquote class="instagram-media"`)
3. Check for any Content Security Policy issues in browser console

## Next Steps

1. Run the database migration
2. Set the `ADMIN_PASSWORD` in `.env.local`
3. Access `/admininstareels` and verify the initial reels
4. Update or add more reels as needed
5. The reels will automatically appear on the homepage!

## Support

If you encounter any issues, check:
- Database connection is working
- Migration was successful
- Admin password is correctly set
- Browser console for JavaScript errors
