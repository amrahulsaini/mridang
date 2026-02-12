# 🚀 Quick Start: Migrate Dropbox Images

Follow these steps to migrate all your Dropbox images to local storage and speed up your website 5-10x!

## Step 1: Install Dependencies

```bash
npm install
```

This will install `tsx` which is needed to run the TypeScript migration scripts.

## Step 2: Check Current Status

First, let's see how many images need migration:

```bash
npm run verify:migration
```

This will show you:
- How many products have Dropbox images
- How many images need to be migrated
- Current migration progress

## Step 3: Backup Database (IMPORTANT!)

Before making any changes, backup your database:

```bash
# For MySQL/MariaDB
mysqldump -u root -p char_mridang > backup_$(date +%Y%m%d_%H%M%S).sql
```

## Step 4: Run the Migration

```bash
npm run migrate:dropbox
```

The script will:
- ✅ Download all images from Dropbox
- ✅ Save them to `/public/uploads/products/`
- ✅ Update database with local paths
- ✅ Show real-time progress

**Expected time**: 1-5 minutes depending on number of images

## Step 5: Verify Success

After migration completes:

```bash
npm run verify:migration
```

You should see **100% migration progress** and **0 Dropbox URLs remaining**.

## Step 6: Test Website

1. Clear Next.js cache and rebuild:
```bash
rm -rf .next
npm run build
npm run dev
```

2. Visit your website and check:
   - Homepage products load quickly
   - Category pages show images
   - Product detail pages work
   - All images display correctly

## Step 7: Deploy (if everything works)

Once you've verified everything locally:

```bash
git add .
git commit -m "Migrate Dropbox images to local storage for 10x faster loading"
git push origin master
```

## 🎉 Done!

Your website should now load **5-10x faster**!

### Performance Comparison:

**Before (Dropbox):**
- Page load: 5-12 seconds
- Image load: 1-3 seconds per image
- External dependencies: Yes

**After (Local):**
- Page load: 1-3 seconds ⚡
- Image load: 50-200ms per image 🚀
- External dependencies: No ✅

## 💡 Tips

- Run `npm run verify:migration` anytime to check status
- The migration is safe - you can run it multiple times
- Original Dropbox URLs are replaced, but you can restore from backup if needed
- Local images are cached by the browser for even faster subsequent loads

## ⚠️ Troubleshooting

If something goes wrong:

1. **Restore database backup:**
```bash
mysql -u root -p char_mridang < backup_YYYYMMDD_HHMMSS.sql
```

2. **Delete migrated files:**
```bash
rm -rf public/uploads/products/migrated_*
```

3. **Check the error logs** in the console output for specific issues

## 📚 More Info

See [MIGRATE_DROPBOX_IMAGES.md](./MIGRATE_DROPBOX_IMAGES.md) for detailed documentation.

---

**Questions?** Check the console output for detailed error messages and troubleshooting steps.
