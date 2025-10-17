// src/redux/tokenSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { setLocalData } from '../config'

interface Token {
  id: string;
  name: string;
  symbol: string;
  image?: string;
  current_price?: number;
  holding ?: number
}


interface TokenState {
  selectedTokens: Token[];
}

const initialState: TokenState = {
  selectedTokens: [],
};

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {

    //set token
    setToken : (state, action: PayloadAction<Token>) => {
      state.selectedTokens = action.payload ;
    },

    //  Add a token to selected list
    addToken: (state, action: PayloadAction<Token>) => {
      const exists = state.selectedTokens.some(t => t.id === action.payload.id);
      if (!exists) {
        state.selectedTokens.push(action.payload);
      }
    },

    //  Remove token by id
    removeToken: (state, action: PayloadAction<string>) => {
      state.selectedTokens = state.selectedTokens.filter(t => t.id !== action.payload);
    },

    //  Add or update a holding
    updateHolding: (state, action: PayloadAction<Token>) => {
      const existing = state.selectedTokens.find(h => h.id === action.payload.id);
      if (existing) {
        existing.holding = action.payload.holding;
      } 
    },

    //  Clear all tokens
    clearAll: (state) => {
      state.selectedTokens = []
    },
  },
});

export const { setToken , addToken, removeToken, updateHolding, clearAll } = tokenSlice.actions;
export default tokenSlice.reducer;
