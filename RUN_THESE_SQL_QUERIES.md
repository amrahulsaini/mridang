# SQL Queries to Run on Your Server

## ⚠️ IMPORTANT: Run these queries in order!

These queries will:
1. Add a new `custom_key_features` TEXT column to the Products table
2. Optionally copy existing key features data to the new field
3. Remove the old `Product_KeyFeatures` junction table

---

## Step 1: Add the new custom_key_features column

```sql
ALTER TABLE Products 
ADD COLUMN custom_key_features TEXT DEFAULT NULL 
COMMENT 'Free-form key features text entered by user';
```

---

## Step 2: (OPTIONAL) Copy existing key features to new field

**⚠️ Only run this if you want to preserve existing key features data!**

```sql
UPDATE Products p
SET custom_key_features = (
    SELECT GROUP_CONCAT(kf.feature_text SEPARATOR ', ')
    FROM Product_KeyFeatures pkf
    JOIN KeyFeatures kf ON pkf.feature_id = kf.feature_id
    WHERE pkf.product_id = p.id
    GROUP BY pkf.product_id
)
WHERE EXISTS (
    SELECT 1 FROM Product_KeyFeatures pkf WHERE pkf.product_id = p.id
);
```

---

## Step 3: Drop the junction table

**⚠️ This will permanently delete all key feature relationships!**

```sql
DROP TABLE IF EXISTS Product_KeyFeatures;
```

---

## Step 4: (OPTIONAL) Drop KeyFeatures table if not needed

**Only run this if you're sure you don't need the KeyFeatures table anymore:**

```sql
DROP TABLE IF EXISTS KeyFeatures;
```

---

## ✅ After running these queries:

1. Your admin page will now show a simple textarea for key features
2. Users can type ANYTHING they want in the key features field
3. No more checkboxes or dropdown selections
4. The text is stored directly in the `Products.custom_key_features` column

## 🎉 Done!

All code changes have been pushed to GitHub. Once you run these SQL queries on your server, the new key features system will be ready to use!
