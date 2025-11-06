# RUN THIS SQL ON YOUR SERVER

**IMPORTANT:** Run this SQL command on your MySQL server to add the missing columns to the Categories table.

## Open MySQL and run:

```sql
USE mrid_mridang;

ALTER TABLE `Categories`
ADD COLUMN `image` TEXT DEFAULT NULL AFTER `category_name`,
ADD COLUMN `kefeatures` TEXT DEFAULT NULL AFTER `image`;

-- Verify the changes
DESCRIBE Categories;
```

## Expected Output:
You should see these columns in the Categories table:
- category_id (int)
- category_name (varchar)
- image (text) ← NEW
- kefeatures (text) ← NEW
- arrange_order (int)

## After running this SQL:
1. Restart your PM2 process: `pm2 restart mridang`
2. The category edit page will now save images and key features properly
3. Dropbox images will display correctly with the updated URL converter

---

## What This Fixes:
✅ Key features field will save your input (no more duplicate text)
✅ Category images from Dropbox will display on the website
✅ Both fields will persist in the database
