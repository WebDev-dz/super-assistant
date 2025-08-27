import * as React from 'react';
import { View } from 'react-native';
import { Input } from './input';

interface OtpInputProps {
  otpCode: string;
  setOtpCode: React.Dispatch<React.SetStateAction<string>>;
}

export function OtpInput({ otpCode, setOtpCode }: OtpInputProps) {
  const handleChange = (text: string, index: number) => {
    const newOtp = otpCode.split('');
    newOtp[index] = text.slice(-1); // Only take the last character
    setOtpCode(newOtp.join(''));
  };

  // Ensure otpCode is split into an array for rendering, padding with empty strings if needed
  const otpArray = otpCode.padEnd(6, '').split('').slice(0, 6);

  return (
    <View className="flex-row justify-center space-x-4">
      {otpArray.map((digit, index) => (
        <Input
          key={index}
          value={digit}
          onChangeText={(text) => handleChange(text, index)}
          className={`w-16 h-16 text-center ${
            digit !== '' ? 'border-gray-300 bg-gray-100' : 'border-gray-200 bg-white'
          }`}
          appearance="soft"
          keyboardType="numeric"
          maxLength={1}
          textContentType="oneTimeCode"
          autoFocus={index === 0}
        />
      ))}
    </View>
  );
}