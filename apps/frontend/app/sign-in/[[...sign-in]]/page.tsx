import { SignIn } from "@clerk/nextjs";

export default function Page() {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  const clerkEnabled = Boolean(publishableKey && !publishableKey.includes("..."));

  if (!clerkEnabled) {
    return (
      <div className="flex justify-center items-center h-screen text-center px-6">
        <div className="max-w-md space-y-3">
          <h1 className="text-2xl font-black">Auth not configured</h1>
          <p className="text-sm text-gray-400">
            Set <code className="font-mono">NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> to enable
            sign-in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <SignIn />
    </div>
  );
}
