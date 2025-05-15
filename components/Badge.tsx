import { useUser } from "@clerk/clerk-react";

/**
 * Displays a badge indicating the user is logged in, optionally showing the user's full name if available.
 *
 * @returns A paragraph element with a badge showing "Logged in" or "Logged in as [fullName]".
 */
export default function Badge() {
    const { user } = useUser();
    
    return (
        <p className="badge">
            <span>Logged in{user?.fullName ? ` as ${user.fullName}` : ""}</span>
        </p>
    );
}