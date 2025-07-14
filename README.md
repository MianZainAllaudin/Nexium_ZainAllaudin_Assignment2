# Blog Summarizer

## Blog Summarizer & Urdu Translator

A modern Next.js app to scrape blog posts, generate summaries, translate them to Urdu, and save results in MongoDB and Supabase. Built with ShadCN UI.

---

## Features

- **Scrape blog content from any URL**
- **Simulate AI summary (static logic)**
- **Translate summary to Urdu using a JavaScript dictionary**
- **Save full blog text to MongoDB**
- **Save summary and Urdu translation to Supabase**
- **Responsive UI with ShadCN and Tailwind CSS**

---

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── scrape/route.ts           # Scrape blog content from a URL
│   │   ├── summarize/route.ts        # Summarize blog text (mock or library)
│   │   ├── translate/route.ts        # Translate summary to Urdu (dictionary)
│   │   └── save-to-mongo/route.ts    # Save full text to MongoDB
│   ├── lib/
│   │   ├── mongodb.ts                # MongoDB connection and helpers
│   │   └── supabase.ts               # Supabase client setup
│   ├── page.tsx                      # Main BlogSummarizer UI and logic
│   └── globals.css                   # Global styles (Tailwind/ShadCN)
├── components/
│   └── ui/
│       ├── button.tsx                # Button UI component
│       ├── input.tsx                 # Input UI component
│       └── card.tsx                  # Card UI component
├── .env.local                        # Environment variables (not committed)
├── .env.example                      # Example env file (safe to share)
├── package.json
├── tsconfig.json
└── README.md
```

---

## Setup & Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy .env.example to `.env.local` and fill in your credentials.

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Sign in to [Supabase.com](https://supabase.com/)
**Go to SQL Editor and then run this Query**
  ```bash
CREATE TABLE summaries (
     id SERIAL PRIMARY KEY,
     url TEXT,
     summary TEXT,
     urdu_translation TEXT,
     created_at TIMESTAMP DEFAULT NOW()
);
   ```

## Usage

- **Enter a blog URL** and click **Summarize**.
- The app will scrape the blog, generate a summary, translate it to Urdu, and save results to MongoDB and Supabase.
- View the English summary and Urdu translation in the UI.

---

## Deployment

https://blogsummarizer.vercel.app/

---

## License

Proprietary License

Copyright (c) 2025 Zain Allaudin

All rights reserved.

This software and associated documentation files (Blog Summarizer) are the exclusive property of Zain Allaudin. Unauthorized copying, modification, distribution, or use of the Software, in whole or in part, is strictly prohibited without prior written permission from the copyright holder.

The Software is provided "as is," without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and noninfringement. In no event shall the copyright holder be liable for any claim, damages, or other liability, whether in an action of contract, tort, or otherwise, arising from, out of, or in connection with the Software or the use or other dealings in the Software.

For inquiries regarding licensing, please contact Zain Allaudin.

email: zainallaudin007@gmail.com

---
