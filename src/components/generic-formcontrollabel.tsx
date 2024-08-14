// Material UI
import { Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid } from '@mui/material';

import {
  CustomerInfo,
  DeliveryMethod,
  FulfillmentFormat,
  PaymentMethods,
  PrintingFormat,
  Scanning,
  TicketDisplay,
} from '../models/settings';

interface IProps {
  element: Array<
    string &
      (CustomerInfo | DeliveryMethod | FulfillmentFormat | PaymentMethods | PrintingFormat | Scanning | TicketDisplay)
  >;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleChange: any;
}

export function GenericFormCheck(props: IProps) {
  const { element, handleChange } = props;

  const formatLabel = (label: string) => {
    return label
      .replace(/([A-Z])/g, ' $1') // Add space when uppercase is found
      .replace(/^\s*/, '') // Remove space at beginning
      .replace(/^\w/, (c: string) => c.toUpperCase()); // Convert uppercose first letter
  };

  const label = formatLabel(element[0]);

  return (
    <Grid item xs={12} sm={12} md={3} lg={2}>
      <FormControl>
        <FormLabel>{label}</FormLabel>
        <FormGroup>
          {(
            Object.keys(element[1]) as Array<
              keyof (
                | CustomerInfo
                | DeliveryMethod
                | FulfillmentFormat
                | PaymentMethods
                | PrintingFormat
                | Scanning
                | TicketDisplay
              )
            >
          ).map(
            (
              key: keyof (
                | CustomerInfo
                | DeliveryMethod
                | FulfillmentFormat
                | PaymentMethods
                | PrintingFormat
                | Scanning
                | TicketDisplay
              ),
              i: number,
            ) => (
              <FormControlLabel
                key={i}
                name={`${element[0]}.${key}`}
                value={element[1][key]}
                onChange={handleChange}
                control={<Checkbox checked={Boolean(element[1][key])} />}
                label={`${formatLabel(key)}`}
              />
            ),
          )}
        </FormGroup>
      </FormControl>
    </Grid>
  );
}
