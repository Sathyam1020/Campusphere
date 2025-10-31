"use client"

import {create} from "zustand";

export type AccountType = "student" | "teacher" | "admin";

interface AccountState {
  accountType: AccountType;
  setAccountType: (type: AccountType) => void;
}

export const useAccountStore = create<AccountState>((set: any) => ({
  // Hardcoded to student for testing as requested
  accountType: "student",
  setAccountType: (type: AccountType) => set({ accountType: type }),
}));

export default useAccountStore;
