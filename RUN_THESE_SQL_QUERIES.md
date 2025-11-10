# 🚀 SQL QUERIES TO RUN - COPY & PASTE THIS

## Database: `mrid_mridang`

---

## ⭐ MINIMUM REQUIRED - JUST RUN THIS ONE QUERY:

```sql
ALTER TABLE Products 
ADD COLUMN custom_key_features TEXT DEFAULT NULL 
COMMENT 'Free-form key features text entered by user';
```

**That's it!** This is the ONLY query you MUST run. After this, the feature will work.

---

## 🔍 VERIFY IT WORKED:

```sql
DESCRIBE Products;
```

You should see `custom_key_features` column in the list.

---

## 📊 OPTIONAL QUERIES (Only if needed):

### Option A: Copy existing key features data (if you have any)

```sql
UPDATE Products p
SET custom_key_features = (
    SELECT GROUP_CONCAT(kf.feature_text SEPARATOR '\n')
    FROM Product_KeyFeatures pkf
    JOIN KeyFeatures kf ON pkf.feature_id = kf.feature_id
    WHERE pkf.product_id = p.id
    GROUP BY pkf.product_id
)
WHERE EXISTS (
    SELECT 1 FROM Product_KeyFeatures pkf WHERE pkf.product_id = p.id
);
```

### Option B: Drop old tables (after verifying everything works)

```sql
-- Drop junction table
DROP TABLE IF EXISTS Product_KeyFeatures;

-- Drop reference table (optional)
DROP TABLE IF EXISTS KeyFeatures;
```

---

## 📝 HOW TO RUN:

### Method 1: phpMyAdmin
1. Login to phpMyAdmin
2. Select database: **mrid_mridang**
3. Click "SQL" tab
4. Paste the first query
5. Click "Go"
6. Done! ✅

### Method 2: Command Line
```bash
mysql -u your_username -p mrid_mridang
```
Then paste the query and press Enter.

### Method 3: SSH + MySQL
```bash
ssh your-server
mysql -u your_username -p
use mrid_mridang;
# Paste the ALTER TABLE query
```

---

## ✅ AFTER RUNNING THE QUERY:

✔️ Feature is ready to use immediately  
✔️ Go to admin panel → Edit any product  
✔️ You'll see "Custom Key Features" textarea  
✔️ Type features (one per line with • bullet)  
✔️ Save product  
✔️ View product on website → See features displayed beautifully  

---

## 🎯 QUICK SUMMARY:

**What you need to do**: Run the first ALTER TABLE query in your MySQL database

**What it does**: Adds a new column to store custom key features text

**Time needed**: 5 seconds

**Risk**: Very low (just adds a column, doesn't delete anything)

---

## 💡 EXAMPLE:

After running the query, admins can type in product edit:
```
• Handcrafted Design
• Premium Materials  
• Traditional Techniques
• Unique Sound Quality
```

Customers will see it displayed as a beautiful bullet list on the product page!

---

## 🔥 COPY THIS NOW:

```sql
ALTER TABLE Products ADD COLUMN custom_key_features TEXT DEFAULT NULL COMMENT 'Free-form key features text entered by user';
```

---

**That's literally all you need! Just one query. Code is already live on GitHub. 🚀**
