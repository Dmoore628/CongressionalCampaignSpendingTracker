# How to Deploy to Vercel (Free)

Your application is ready for serverless deployment. Follow these steps to host it for free.

## 1. Push to GitHub
Your project is a git repository but needs to be on GitHub.
1.  Create a **new repository** on [GitHub.com](https://github.com/new) (name it `campaign-spending-tracker` or similar).
2.  Run these commands in your terminal:
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git branch -M main
    git add .
    git commit -m "Ready for deploy"
    git push -u origin main
    ```

## 2. Deploy on Vercel
1.  Go to [Vercel.com](https://vercel.com) and log in.
2.  Click **Add New...** -> **Project**.
3.  Select your GitHub repository and click **Import**.

## 3. Configure Environment Variables
This is the most important step for your app to work!
1.  On the "Configure Project" screen, look for **Environment Variables**.
2.  Add the following:
    *   **Key**: `FEC_API_KEY`
    *   **Value**: (Paste your key from `.env`)

## 4. Deploy
1.  Click **Deploy**.
2.  Wait ~1-2 minutes.
3.  Your site will be live!

> **Note**: Access your site at the URL Vercel provides (e.g., `campaign-tracker.vercel.app`).
