import { create } from 'zustand';

// Shared student profile shape used by ProfileSidebar and BasicInfoTab
export interface StudentProfileData {
    id?: number;
    name: string;
    email?: string;
    image: string | null;
    status?: string;
    mobile?: string;
    affiliate_id?: string;
    refer_code?: string | null;
}

interface ModalStore {
    isCheckoutBookModalOpen: boolean;
    isCheckoutModalOpen: boolean;
    isLoginModalOpen: boolean;
    isAnotherModalOpen: boolean;
    isCourseModalOpen: boolean;
    isBuyNowClicked: boolean;
    clicked: boolean;
    buyNowProduct: any | null;
    isAIChatOpen: boolean;
    isHotlineModalOpen: boolean;
    isFAQModalOpen: boolean;
    isTicketModalOpen: boolean;

    // --- ADDED: Wallet trigger states ---
    walletUpdateTrigger: number;

    // --- ADDED: Profile image update trigger ---
    profileUpdateTrigger: number;

    // --- ADDED: Shared student profile data ---
    studentProfile: StudentProfileData | null;
    setStudentProfile: (data: StudentProfileData | null) => void;

    // --- ADDED: Wallet Balance ---
    walletBalance: string | null;
    setWalletBalance: (balance: string | null) => void;

    // --- ADDED: Blob preview URL from FileReader after a successful image upload ---
    profileBlobPreview: string | null;
    setProfileBlobPreview: (url: string | null) => void;
    setIsAIChatOpen: (isOpen: boolean) => void;
    setIsHotlineModalOpen: (isOpen: boolean) => void;
    setIsFAQModalOpen: (isOpen: boolean) => void;
    setIsTicketModalOpen: (isOpen: boolean) => void;

    // Toggle state methods
    toggleClicked: () => void;
    setCartOpen: (isOpen: boolean) => void;
    setCheckoutModalOpen: (isOpen: boolean) => void;

    //methods for buy now
    openBuyNow: (product: any) => void;
    closeBuyNow: () => void;
    toggleBuyNow: () => void;

    // Methods for Checkout Modal
    openCheckoutModal: () => void;
    closeCheckoutModal: () => void;
    toggleCheckoutModal: () => void;

    // Methods for Login Modal
    openLoginModal: () => void;
    closeLoginModal: () => void;
    toggleLoginModal: () => void;

    // Methods for Another Modal
    openAnotherModal: () => void;
    closeAnotherModal: () => void;
    toggleAnotherModal: () => void;

    // Methods for Course Modal
    openCourseModal: () => void;
    closeCourseModal: () => void;
    toggleCourseModal: () => void;

    // Alternative change method for Checkout Modal
    changeCheckoutModal: () => void;

    // --- ADDED: Wallet trigger method ---
    triggerWalletUpdate: () => void;

    // --- ADDED: Profile update trigger method ---
    triggerProfileUpdate: () => void;
}

const useModalStore = create<ModalStore>((set) => ({
    // Initial states
    isCheckoutBookModalOpen: false,
    isCheckoutModalOpen: false,
    isLoginModalOpen: false,
    isAnotherModalOpen: false,
    isCourseModalOpen: false,
    isBuyNowClicked: false,
    clicked: false,
    buyNowProduct: null,
    isAIChatOpen: false,
    isHotlineModalOpen: false,
    isFAQModalOpen: false,
    isTicketModalOpen: false,

    // --- ADDED: Initial state for wallet trigger ---
    walletUpdateTrigger: 0,

    // --- ADDED: Initial state for profile update trigger ---
    profileUpdateTrigger: 0,

    // --- ADDED: Initial student profile state ---
    studentProfile: null,
    setStudentProfile: (data) => set({ studentProfile: data }),

    // --- ADDED: Initial wallet balance ---
    walletBalance: null,
    setWalletBalance: (balance) => set({ walletBalance: balance }),

    // --- ADDED: Initial blob preview state ---
    profileBlobPreview: null,
    setProfileBlobPreview: (url) => set({ profileBlobPreview: url }),

    // Toggle clicked state
    toggleClicked: () => set((state) => ({ clicked: !state.clicked })),
    setCartOpen: (isOpen: boolean) => set({ clicked: isOpen }),
    setCheckoutModalOpen: (isOpen: boolean) => set({ isCheckoutModalOpen: isOpen }),
    setIsAIChatOpen: (isOpen: boolean) => set({ isAIChatOpen: isOpen }),
    setIsHotlineModalOpen: (isOpen: boolean) => set({ isHotlineModalOpen: isOpen }),
    setIsFAQModalOpen: (isOpen: boolean) => set({ isFAQModalOpen: isOpen }),
    setIsTicketModalOpen: (isOpen: boolean) => set({ isTicketModalOpen: isOpen }),

    // Buy Now Controls
    openBuyNow: (product: any) => set({ buyNowProduct: product, isCheckoutBookModalOpen: true }),
    closeBuyNow: () => set({ buyNowProduct: null, isCheckoutBookModalOpen: false }),
    toggleBuyNow: () => set((state) => ({ isCheckoutBookModalOpen: !state.isCheckoutBookModalOpen })),

    // Checkout Modal Controls
    openCheckoutModal: () => set({ isCheckoutModalOpen: true }),
    closeCheckoutModal: () => set({ isCheckoutModalOpen: false }),
    toggleCheckoutModal: () => set((state) => ({ isCheckoutModalOpen: !state.isCheckoutModalOpen })),
    changeCheckoutModal: () => set((state) => ({ isCheckoutModalOpen: !state.isCheckoutModalOpen })), // Additional method

    // Login Modal Controls
    openLoginModal: () => set({ isLoginModalOpen: true }),
    closeLoginModal: () => set({ isLoginModalOpen: false }),
    toggleLoginModal: () => set((state) => ({ isLoginModalOpen: !state.isLoginModalOpen })),

    // Another Modal Controls
    openAnotherModal: () => set({ isAnotherModalOpen: true }),
    closeAnotherModal: () => set({ isAnotherModalOpen: false }),
    toggleAnotherModal: () => set((state) => ({ isAnotherModalOpen: !state.isAnotherModalOpen })),

    // Course Modal Controls
    openCourseModal: () => set({ isCourseModalOpen: true }),
    closeCourseModal: () => set({ isCourseModalOpen: false }),
    toggleCourseModal: () => set((state) => ({ isCourseModalOpen: !state.isCourseModalOpen })),

    // --- ADDED: Method to trigger wallet update ---
    triggerWalletUpdate: () => set((state) => ({
        walletUpdateTrigger: state.walletUpdateTrigger + 1
    })),

    // --- ADDED: Method to trigger profile image refresh across the app ---
    triggerProfileUpdate: () => set((state) => ({
        profileUpdateTrigger: state.profileUpdateTrigger + 1
    })),
}));

export default useModalStore;