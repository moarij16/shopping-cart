import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const url = "https://course-api.com/react-useReducer-cart-project";

const initialState = {
  cartItems: [],
  amount: 0,
  total: 0,
  isLoading: true,
};

export const getCartItems = createAsyncThunk(
  "cart/getCartItems",
  async (thunkAPI) => {
    try {
      const resp = await axios(url);
      return resp.data;
    } catch (err) {
      return thunkAPI.rejectWithValue("something went wrong");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cartItems = [];
    },
    removeItem: (state, action) => {
      const itemId = action.payload;
      state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
    },
    increase: (state, { payload }) => {
      const CartItems = state.cartItems.find((item) => item.id === payload.id);
      CartItems.amount = CartItems.amount + 1;
    },
    decrease: (state, { payload }) => {
      const CartItems = state.cartItems.find((item) => item.id === payload.id);
      CartItems.amount = CartItems.amount - 1;
    },
    calculateTotal: (state) => {
      let totalAmount = 0;
      let totalPrice = 0;

      state.cartItems.forEach((item) => {
        totalAmount += item.amount;
        totalPrice += item.amount * item.price;
      });

      return {
        ...state,
        amount: totalAmount,
        total: totalPrice,
      };
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getCartItems.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCartItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cartItems = action.payload;
      })
      .addCase(getCartItems.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { clearCart, removeItem, increase, decrease, calculateTotal } =
  cartSlice.actions;

export default cartSlice.reducer;
