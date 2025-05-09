export default {
    providers: [
      {
        // Use the domain without the https:// prefix
        // The NEXT_PUBLIC_CLERK_FRONTEND_API_URL typically looks like https://neat-hamster-27.clerk.accounts.dev
        // We need to extract just the domain part: neat-hamster-27.clerk.accounts.dev
        domain: process.env.NEXT_PUBLIC_CLERK_FRONTEND_API_URL?.replace(/^https?:\/\//, ""),
        applicationID: "convex",
      },
    ]
  };