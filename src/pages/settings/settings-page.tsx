import { useEffect, useState, useMemo } from "react";
import { toast } from 'react-toastify';
import to from "await-to-js";
import { useFormik } from "formik";
import { 
  ClientID, 
  CustomerInfo, 
  DeliveryMethod, 
  FulfillmentFormat, 
  MobileSetting, 
  PaymentMethods, 
  PrintingFormat, 
  Scanning, 
  TicketDisplay } from "../../models/settings";
  import { useAppDispatch, useAppSelector } from "../../hooks/store";
  
  // Material UI
  import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormLabel,
    Grid,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    TextField,
  } from "@mui/material";
  
  // Styled Components
  import { FormContainer } from './styled';

  // Services
  import { getSettingsByClientId, getClientsId, updateSettingsByClientId } from "../../services/settings/settings-service";

  // Redux
  import { saveNewSettings } from "../../store/reducers/settingSlice";

export function SettingsPage() {
  // State and hooks
  const [clientsId, setClientsId] = useState([]);
  const dispatch = useAppDispatch();
  const setting = useAppSelector((state) => state.settings);

  // Logic
  const getClientsIdService = async () => {
    const [err, response] = await to(getClientsId());
    if(err) {
      console.error(err);
      return;
    }
    const { data } = response;
    setClientsId(data);
  }

  const getSettingsByClientIdService = async () => {
    const [err, response] = await to(getSettingsByClientId(values.clientId));
    if(err) {
      console.error(err);
      return;
    }
    const { data } = response;
    dispatch(saveNewSettings(data));
    setValues(data as MobileSetting);
  }

  const handleFormSubmit = async (formValues: MobileSetting) => {
    const [err] = await to(updateSettingsByClientId(formValues));
    if(err) {
      console.error(err);
      toast.success('Something is wrong while updating settings');
      return;
    }

    toast.success('Settings updated sucesfully!')
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDmSelectChange = (e: any) => {
    const selectedDMs = e.target.value as unknown as string[];
    const updatedDeliveryMethods = values.deliveryMethods.map((dm: DeliveryMethod) => ({
      ...dm,
      selected: selectedDMs.includes(dm.enum),
    }));
    setValues({ ...values, deliveryMethods: updatedDeliveryMethods });
  };

  const renderValue = () =>
    (values.deliveryMethods ?? [])
      .filter((dm: DeliveryMethod) => dm.selected)
      .map((dm: DeliveryMethod) => dm.enum)
      .join(", ");

  const { values, setValues, handleSubmit, handleChange } = useFormik<MobileSetting>({
    initialValues: setting,
    onSubmit: handleFormSubmit
  });

  // Component effect
  useEffect(() => {
    getClientsIdService();
  }, [])

  useEffect(() => {
    getSettingsByClientIdService();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.clientId])

  const memoizedClientsId = useMemo(() => clientsId, [clientsId]);

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <FormControl sx={{ width: '100%' }}>
              <InputLabel id="client-id" >Client ID</InputLabel>
              <Select
                labelId="client-id"
                id="client-id-select"
                value={values.clientId ?? ''}
                label="Client ID"
                name="clientId"
                onChange={handleChange}
              >
                {memoizedClientsId &&
                  memoizedClientsId.map((client: ClientID) => (
                    <MenuItem key={client._id} value={client.clientId}>Client {client.clientId}</MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <FormControl sx={{ width: '100%' }}>
              <InputLabel id="delivery-methods" >Delivery Methods</InputLabel>
              <Select
                id="delivery-methods"
                name="deliveryMethods"
                label="Delivery Methods"
                multiple
                value={values.deliveryMethods.filter((dm: DeliveryMethod) => dm.selected).map((dm: DeliveryMethod) => dm.enum)}
                renderValue={renderValue}
                onChange={handleDmSelectChange}
              >
                {setting &&
                  setting.deliveryMethods &&
                  setting.deliveryMethods.map((deliveryMethod: DeliveryMethod, i: number) => (
                    <MenuItem key={i} value={deliveryMethod.enum}>
                      <ListItemText primary={deliveryMethod.name} />
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <FormControl sx={{ width: '100%' }}>
              <FormLabel>Printer</FormLabel>
              <TextField
                name="printer.id"
                value={values.printer.id ?? ""}
                onChange={(e) => {
                  handleChange(e);
                }}
                placeholder="Printer id"
                helperText="You can leave it blank or modify it here"
              ></TextField>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={2}>
            <FormControl>
              <FormLabel>Fulfillment Format</FormLabel>
              <Grid>
                <FormGroup>
                  {(Object.keys(values.fulfillmentFormat) as Array<keyof FulfillmentFormat>).map(
                    (key: keyof FulfillmentFormat, i: number) => (
                      <FormControlLabel
                        key={i}
                        name={`fulfillmentFormat.${key}`}
                        value={values.fulfillmentFormat[key]}
                        onChange={handleChange}
                        control={<Checkbox checked={values.fulfillmentFormat[key]} />}
                        label={`${key}`}
                      />
                    ),
                  )}
                </FormGroup>
              </Grid>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={2}>
            <FormControl>
              <FormLabel>Printing Format</FormLabel>
              <Grid>
                <FormGroup>
                  {(Object.keys(values.printingFormat) as Array<keyof PrintingFormat>).map(
                    (key: keyof PrintingFormat, i: number) => (
                      <FormControlLabel
                        key={i}
                        name={`printingFormat.${key}`}
                        value={values.printingFormat[key]}
                        onChange={handleChange}
                        control={<Checkbox checked={values.printingFormat[key]} />}
                        label={`${key}`}
                      />
                    ),
                  )}
                </FormGroup>
              </Grid>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={2}>
            <FormControl>
              <FormLabel>Scanning</FormLabel>
              <Grid>
                <FormGroup>
                  {(Object.keys(values.scanning) as Array<keyof Scanning>).map((key: keyof Scanning, i: number) => (
                    <FormControlLabel
                      key={i}
                      name={`scanning.${key}`}
                      value={values.scanning[key]}
                      onChange={handleChange}
                      control={<Checkbox checked={values.scanning[key]} />}
                      label={`${key}`}
                    />
                  ))}
                </FormGroup>
              </Grid>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={2}>
            <FormControl>
              <FormLabel>Payment Methods</FormLabel>
              <Grid>
                <FormGroup>
                  {(Object.keys(values.paymentMethods) as Array<keyof PaymentMethods>).map(
                    (key: keyof PaymentMethods, i: number) => (
                      <FormControlLabel
                        key={i}
                        name={`paymentMethods.${key}`}
                        value={values.paymentMethods[key]}
                        onChange={handleChange}
                        control={<Checkbox checked={values.paymentMethods[key]} />}
                        label={`${key}`}
                      />
                    ),
                  )}
                </FormGroup>
              </Grid>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={2}>
            <FormControl>
              <FormLabel>Ticket Display</FormLabel>
              <Grid>
                <FormGroup>
                  {(Object.keys(values.ticketDisplay) as Array<keyof TicketDisplay>).map(
                    (key: keyof TicketDisplay, i: number) => (
                      <FormControlLabel
                        key={i}
                        name={`ticketDisplay.${key}`}
                        value={values.ticketDisplay[key]}
                        onChange={handleChange}
                        control={<Checkbox checked={values.ticketDisplay[key]} />}
                        label={`${key}`}
                      />
                    ),
                  )}
                </FormGroup>
              </Grid>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={2}>
            <FormControl>
              <FormLabel>Customer Info</FormLabel>
              <Grid>
                <FormGroup>
                  {(Object.keys(values.customerInfo) as Array<keyof CustomerInfo>).map(
                    (key: keyof CustomerInfo, i: number) => (
                      <FormControlLabel
                        key={i}
                        name={`customerInfo.${key}`}
                        value={values.customerInfo[key]}
                        onChange={handleChange}
                        control={<Checkbox checked={values.customerInfo[key]} />}
                        label={`${key}`}
                      />
                    ),
                  )}
                </FormGroup>
              </Grid>
            </FormControl>
          </Grid>
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="flex-end"
          >
            <FormControl>
              <Button type="submit" variant="contained">Submit</Button>
            </FormControl>
          </Grid>
        </Grid>
      </form>
    </FormContainer>
  );
}