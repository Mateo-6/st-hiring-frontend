import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { MobileSetting } from '../../models/settings';

export const getMobileSettingDefaultValues: MobileSetting = {
  clientId: 1,
  deliveryMethods: [],
  fulfillmentFormat: {
    rfid: false,
    print: false,
  },
  printer: {
    id: '',
  },
  printingFormat: {
    formatA: false,
    formatB: false,
  },
  scanning: {
    scanManually: false,
    scanWhenComplete: false,
  },
  paymentMethods: {
    cash: false,
    creditCard: false,
    comp: false,
  },
  ticketDisplay: {
    leftInAllotment: false,
    soldOut: false,
  },
  customerInfo: {
    active: false,
    basicInfo: false,
    addressInfo: false,
  },
};

const getInitialState = (): MobileSetting => {
  return getMobileSettingDefaultValues;
};

export const settingsSlice = createSlice({
  name: 'setting',
  initialState: getInitialState(),
  reducers: {
    saveNewSettings(_state, action: PayloadAction<MobileSetting>) {
      return action.payload;
    },
  },
});

export default settingsSlice.reducer;

export const { saveNewSettings } = settingsSlice.actions;
