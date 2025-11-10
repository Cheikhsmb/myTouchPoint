declare module 'react-native-flags' {
  import * as React from 'react';
    import { ViewProps } from 'react-native';

  export interface FlagProps extends ViewProps {
    /** ISO 3166-1 alpha-2 country code, e.g. 'SN', 'US' */
    code: string;
    /** predefined sizes (16,24,32,48,64) or any number */
    size?: number;
    /** style of flag image */
    type?: 'flat' | 'shiny';
  }

  export default class Flag extends React.Component<FlagProps> {}
}


