import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AuthenticatePage() {
    const router = useRouter();
    const { state } = router.query;

    useEffect(() => {
        if (!state) return;

        // Simulate authentication process
        setTimeout(async () => {
            // Call your local auth server to complete authentication
            await fetch('http://localhost:4000/v1/auth/complete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ state }),
            });

            // Close the window
            window.close();
        }, 2000);
    }, [state]);

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">Authenticating...</h1>
                <p>Please wait while we complete the authentication process.</p>
            </div>
        </div>
    );
} 