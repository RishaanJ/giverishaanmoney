import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Titles scale with donation amount
function titleFor(amount: number): string {
  if (amount >= 500) return "Savior of Rishaan";
  if (amount >= 200) return "Rishaan's Guardian Angel";
  if (amount >= 100) return "The One Rishaan Called";
  if (amount >= 50)  return "Rishaan Ate Because of You";
  if (amount >= 20)  return "Rishaan Approved";
  if (amount >= 10)  return "Not Like the Others";
  return "Keeper of the Flame";
}

// Simple static profanity list — word boundaries checked, case-insensitive
const BAD_WORDS = [
  "fuck", "fucker", "fucking", "fck",
  "shit", "shite",
  "ass", "asshole", "arse",
  "bitch",
  "cunt",
  "dick", "cock",
  "pussy",
  "bastard",
  "nigger", "nigga",
  "faggot", "fag",
  "slut", "whore",
  "piss", "prick",
  "wanker", "twat",
  "bollocks", "bugger",
  "damn", "crap",
];

const PROFANITY_RE = new RegExp(
  `\\b(${BAD_WORDS.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\b`,
  "gi"
);

function cleanName(name: string): string {
  return name.replace(PROFANITY_RE, "*******");
}

export async function GET() {
  const sessions = await stripe.checkout.sessions.list({
    limit: 100,
  });

  const paid = sessions.data
    .filter((s) => s.payment_status === "paid" && s.amount_total)
    .map((s) => {
      const amount = Math.round((s.amount_total ?? 0) / 100);
      const rawName = s.metadata?.donor_name || "Anonymous";
      return {
        name: cleanName(rawName),
        amount,
        title: titleFor(amount),
      };
    })
    .sort((a, b) => b.amount - a.amount);

  return Response.json(paid);
}
