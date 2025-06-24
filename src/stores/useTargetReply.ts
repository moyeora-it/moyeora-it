import { create } from 'zustand';

export type TargetReplyStore = {
  targetReplyId: null | number;
  targetRereplyId: null | number;
  setTargetReply: (input: {
    targetReplyId?: number | null;
    targetRereplyId?: number | null;
  }) => void;
};

export const useTargetReplyStore = create<TargetReplyStore>((set) => ({
  targetReplyId: null,
  targetRereplyId: null,
  setTargetReply: (input) => set((state) => ({ ...state, ...input })),
}));
