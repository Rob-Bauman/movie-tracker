declare module 'react-native-vector-icons/Ionicons' {
  import { Icon } from 'react-native-vector-icons/Icon';
  import { Component } from 'react';
  import { IconProps } from 'react-native-vector-icons/Icon';

  export default class Ionicons extends Component<IconProps> {
    static getImageSource(
      name: string,
      size?: number,
      color?: string
    ): Promise<any>;
  }
}