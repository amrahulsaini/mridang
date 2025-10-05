# Instagram Reels - Quick Start Guide

## ✅ All Tasks Completed!

Your Instagram Reels feature is now fully integrated into your Mridang website! Here's what was done:

### 📦 What Was Created

1. **Instagram Reels Component** (`app/components/InstagramReels.tsx`)
   - Beautiful Instagram-style gradient design
   - Fully responsive
   - Auto-loads Instagram embed script

2. **Admin Panel** (`app/admininstareels/page.tsx`)
   - Password-protected admin interface
   - Easy-to-use form to add/edit/remove reels
   - Located at: `/admininstareels`

3. **API Routes**
   - `/api/instagram-reels` - Public endpoint to fetch reels
   - `/api/admin/instagram-reels` - Admin endpoint to manage reels

4. **Database Table** (`instagram_reels`)
   - Stores embed codes
   - Supports ordering and active/inactive status

### 🚀 Next Steps (Do These NOW!)

#### Step 1: Run the SQL Migration

Open your MySQL terminal and run:

```bash
mysql -u mrid_mridang -p mrid_mridang < RUN_THIS_SQL.sql
```

Or manually run the SQL file I created: `RUN_THIS_SQL.sql`

#### Step 2: Set Admin Password

Add this to your `.env.local` file:

```env
ADMIN_PASSWORD=YourSecurePasswordHere123!
```

**Important:** Replace `YourSecurePasswordHere123!` with your actual password!

#### Step 3: Restart Your Dev Server

```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

### 🎉 You're Done! 

Now:
- Visit your homepage → You'll see the 3 Instagram reels before the newsletter section
- Visit `/admininstareels` → Manage your reels

### 🎨 Design Features

The Instagram Reels section features:
- **Instagram gradient border** (purple to orange) on hover
- **"Follow Our Journey"** heading
- **Responsive grid layout** (3 columns on desktop, 1 on mobile)
- **Smooth animations** and transitions
- **Professional styling** matching Instagram's brand

### 📱 How to Update Reels Later

1. Go to: `yourdomain.com/admininstareels`
2. Enter your admin password
3. For each reel:
   - Go to Instagram reel → Click "..." → Select "Embed"
   - Copy the entire `<blockquote>` code
   - Paste into the admin panel
4. Click "Update Reels"

That's it! The reels will automatically appear on your homepage.

### 📍 Location on Homepage

The reels appear in this order:
1. Header
2. Product Grid
3. **→ Instagram Reels** ← NEW!
4. FAQ & Reviews
5. Newsletter (Footer)
6. Footer

### ⚡ Quick Test

After running the SQL:

```bash
# Check if table was created
mysql -u mrid_mridang -p -e "DESCRIBE instagram_reels" mrid_mridang

# Check if data was inserted
mysql -u mrid_mridang -p -e "SELECT COUNT(*) FROM instagram_reels" mrid_mridang
```

Should show 3 reels!

### 🔒 Security

- Admin panel is password-protected
- Password checked server-side (secure)
- No sensitive data exposed to client

---

**Need help?** Check the full documentation in `INSTAGRAM_REELS_SETUP.md`
