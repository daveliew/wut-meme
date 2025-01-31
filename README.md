# Wut Meme - Solana Wallet Analysis

A simple web application to analyze a wallet's trading activity for specific tokens on Solana.

## MVP Features

1. **Input Interface**
   - Wallet address input field
   - Token address input field
   - Analysis trigger button

2. **Trade Analysis**
   - Track buy/sell transactions for specified wallet and token
   - Calculate average buy price
   - Calculate average sell price
   - Compute net position

3. **Data Visualization**
   - Price chart showing token price over time
   - Trade markers overlaid on price chart (buys/sells)
   - Stats display showing key metrics

## Example Usage

```bash
Wallet: MfDuWeqSHEqTFVYZ7LoexgAK9dxk7cy4DFJWjWMGVWa
Token: FeR8VBqNRSUD5NtXAj2n3j1dAHkZHfyDktKuLXD4pump
```

## Tech Stack

- Next.js 13+ with App Router
- TypeScript
- TailwindCSS
- Chart.js / react-chartjs-2
- @solana/web3.js

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
