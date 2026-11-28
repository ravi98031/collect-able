# Admin panel and database setup (Supabase)

After this setup you edit products, prices, sizes, photos, the drop date, shipping and contact details from
`https://YOUR-SITE/admin/` and the changes go live on the website straight away.

## One-time setup

1. Go to **supabase.com**, sign up, click **New project**. Pick a name, set a database password (save it), choose the nearest region (for India, Mumbai), and create it. Wait about two minutes.
2. In Supabase open **SQL Editor**, then **New query**.
3. Open `supabase/setup.sql` from this folder. Replace `YOUR-EMAIL@example.com` with the email you will log in with. Paste the whole file into the query box and click **Run**. It should say Success.
4. Open **Authentication**, then **Users**, then **Add user**, then **Create new user**. Use the same email and a strong password. Tick **Auto Confirm User**.
5. (Recommended) In **Authentication**, **Sign In / Providers**, **Email**, turn off **Allow new users to sign up**, so only you can have an account.
6. Open **Project Settings**, then **API**. Copy the **Project URL** and the **anon public** key (it may be called publishable key).
7. Edit `supabase-config.js` and paste both between the quotes. On GitHub: click the file, click the pencil, edit, **Commit changes**.
8. Upload the new files from this folder to GitHub (same way as before, drag the contents in). This adds the `admin` and `supabase` folders and updates the site files.
9. Open `https://YOUR-SITE/admin/`, log in, press **Import my current products** once, then edit anything.

## Using it

- **Products tab:** add, edit, hide or delete products. Upload a photo and it replaces the drawing on cards and product pages. Photos are shrunk automatically.
- **Settings tab:** drop name and date, free shipping limit, shipping fee, WhatsApp, Instagram, email.
- Visitors may need to refresh once to see a change.

## Safety rules

- Only paste the **anon public** key. Never paste the **service_role** key anywhere.
- Only emails listed in the `admins` table can change anything, even though the admin page is public.
- If the database is empty or unreachable, the site falls back to `js/products.js` and `js/config.js`, so it never breaks.

## Not covered yet

Page text (About, FAQ, Contact), colours, real customer accounts, orders and inner circle emails. These are the next steps.
