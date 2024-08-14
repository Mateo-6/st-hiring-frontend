import { useEffect, useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import to from 'await-to-js';
import { useFormik } from 'formik';
import { ClientID, DeliveryMethod, MobileSetting } from '../../models/settings';
import { useAppDispatch, useAppSelector } from '../../hooks/store';

// Material UI
import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';

// Styled Components
import { FormContainer } from './styled';

// Services
import {
  getSettingsByClientId,
  getClientsId,
  updateSettingsByClientId,
} from '../../services/settings/settings-service';

// Redux
import { saveNewSettings } from '../../store/reducers/settingSlice';

// Components
import { GenericFormCheck } from '../../components/generic-formcontrollabel';

export function SettingsPage() {
  // State and hooks
  const [clientsId, setClientsId] = useState([]);
  const dispatch = useAppDispatch();
  const setting = useAppSelector((state) => state.settings);

  // Logic
  const getClientsIdService = async () => {
    const [err, response] = await to(getClientsId());
    if (err) {
      console.error(err);
      return;
    }
    const { data } = response;
    setClientsId(data);
  };

  const getSettingsByClientIdService = async () => {
    const [err, response] = await to(getSettingsByClientId(values.clientId));
    if (err) {
      console.error(err);
      return;
    }
    const { data } = response;
    dispatch(saveNewSettings(data));
    setValues(data as MobileSetting);
  };

  const handleFormSubmit = async (formValues: MobileSetting) => {
    const [err] = await to(updateSettingsByClientId(formValues));
    if (err) {
      console.error(err);
      toast.success('Something is wrong while updating settings');
      return;
    }

    toast.success('Settings updated sucesfully!');
  };

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
      .join(', ');

  const { values, setValues, handleSubmit, handleChange } = useFormik<MobileSetting>({
    initialValues: setting,
    onSubmit: handleFormSubmit,
  });

  // Component effect
  useEffect(() => {
    getClientsIdService();
  }, []);

  useEffect(() => {
    getSettingsByClientIdService();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.clientId]);

  const memoizedClientsId = useMemo(() => clientsId, [clientsId]);

  const formConstraints = Object.entries(values).filter((e) => typeof e[1] === 'object' && !Array.isArray(e[1]));

  return (
    <FormContainer>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <FormControl sx={{ width: '100%' }}>
              <InputLabel id="client-id">Client ID</InputLabel>
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
                    <MenuItem key={client._id} value={client.clientId}>
                      Client {client.clientId}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6}>
            <FormControl sx={{ width: '100%' }}>
              <InputLabel id="delivery-methods">Delivery Methods</InputLabel>
              <Select
                id="delivery-methods"
                name="deliveryMethods"
                label="Delivery Methods"
                multiple
                value={values.deliveryMethods
                  .filter((dm: DeliveryMethod) => dm.selected)
                  .map((dm: DeliveryMethod) => dm.enum)}
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
                value={values.printer.id ?? ''}
                onChange={(e) => {
                  handleChange(e);
                }}
                placeholder="Printer id"
                helperText="You can leave it blank or modify it here"
              ></TextField>
            </FormControl>
          </Grid>
          {formConstraints.map((element, i: number) => (
            <GenericFormCheck key={i} element={element} handleChange={handleChange} />
          ))}
          <Grid container direction="row" justifyContent="flex-end" alignItems="flex-end">
            <FormControl>
              <Button type="submit" variant="contained">
                Submit
              </Button>
            </FormControl>
          </Grid>
        </Grid>
      </form>
    </FormContainer>
  );
}
