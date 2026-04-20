export const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://admin.goldenlifeltd.com';

/**
 * Detects if the current context is for a Vendor (based on URL)
 */
export const isVendorContext = () => {
    return window.location.pathname.includes('/vendor') || !!sessionStorage.getItem('vendor_session');
};

/**
 * Gets the authentication token from session storage.
 * Prioritizes the session matching the current context.
 */
export const getAuthToken = () => {
    // Check path to prioritize session
    const isVendorPath = window.location.pathname.startsWith('/vendor');
    const isDashboardPath = window.location.pathname.startsWith('/dashboard');

    const vendorSession = sessionStorage.getItem("vendor_session");
    const studentSession = sessionStorage.getItem("student_session");

    let session = null;

    if (isVendorPath) {
        session = vendorSession || studentSession;
    } else if (isDashboardPath) {
        session = studentSession || vendorSession;
    } else {
        // Public routes or others: prioritize student then vendor
        session = studentSession || vendorSession;
    }

    if (!session) return null;
    try {
        const parsed = JSON.parse(session);
        // Expiry check
        if (parsed.expiry && new Date().getTime() > parsed.expiry) {
            return null;
        }
        return parsed.token || null;
    } catch {
        return null;
    }
};