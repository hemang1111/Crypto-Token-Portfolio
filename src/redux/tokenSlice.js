// src/redux/tokenSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { setLocalData } from '../config';
const initialState = {
    selectedTokens: [],
};
const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
        //set token
        setToken: (state, action) => {
            state.selectedTokens = action.payload;
        },
        // ✅ Add a token to selected list
        addToken: (state, action) => {
            const exists = state.selectedTokens.some(t => t.id === action.payload.id);
            if (!exists) {
                state.selectedTokens.push(action.payload);
                // setLocalData('watchList',state.selectedTokens)
            }
        },
        // ✅ Remove token by id
        removeToken: (state, action) => {
            state.selectedTokens = state.selectedTokens.filter(t => t.id !== action.payload);
            // setLocalData('watchList',state.selectedTokens)
            //   state.holdings = state.holdings.filter(h => h.id !== action.payload);
        },
        // ✅ Add or update a holding
        updateHolding: (state, action) => {
            const existing = state.selectedTokens.find(h => h.id === action.payload.id);
            if (existing) {
                existing.holding = action.payload.holding;
            }
            // else {
            //     state.selectedTokens.holdings.push(action.payload);
            //   }
        },
        // ✅ Clear all tokens
        clearAll: (state) => {
            state.selectedTokens = [];
        },
    },
});
export const { setToken, addToken, removeToken, updateHolding, clearAll } = tokenSlice.actions;
export default tokenSlice.reducer;
