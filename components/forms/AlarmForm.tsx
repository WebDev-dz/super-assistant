import * as React from "react";
import { View } from "react-native";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { Text } from "~/components/ui/text";
import {
  Form,
  FormField,
  FormInput,
  FormTextarea,
  FormRadioGroup,
  FormCombobox,
  FormDatePicker,
  FormSwitch,
  FormDateTimePicker,
  FormTimePicker,
} from "~/components/ui/form";
import { RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { CreateTaskSchema } from "@/lib/validations";


export default function AlarmForm<TValues extends Record<string, any>>({
  form,
}: {
  form: UseFormReturn<TValues>;
}) {
  const showAlarmFields = form.watch("hasAlarm" as any) ?? false;

  return (
    <>
      <FormField
        control={form.control}
        name={"hasAlarm" as any}
        render={({ field }) => (
          <FormSwitch
            {...field}
            label="Set Alarm"
            description="Get notified about this task"
            value={field.value ?? false}
            onChange={field.onChange}
          />
        )}
      />

      {showAlarmFields && (
        <>
          <FormField
            control={form.control}
            name={"alarmMethod" as any}
            render={({ field }) => (
              <FormRadioGroup
                label="Alarm Method"
                description="How should you be notified?"
                {...field}
                className="gap-4 flex-row"
              >
                {(["alert", "alarm"] as const).map((value) => (
                  <View key={value} className="flex-row gap-2 items-center">
                    <RadioGroupItem
                      aria-labelledby={`alarm-method-label-for-${value}`}
                      value={value}
                    />
                    <Label
                      nativeID={`alarm-method-label-for-${value}`}
                      className="capitalize"
                      onPress={() => field.onChange(value)}
                    >
                      {value}
                    </Label>
                  </View>
                ))}
              </FormRadioGroup>
            )}
          />

          <FormField
            control={form.control}
            name={"alarmOffset" as any}
            render={({ field }) => (
              <FormInput
                label="Alarm Offset (minutes)"
                placeholder="15"
                description="How many minutes before the due date?"
                keyboardType="numeric"
                {...field}
                value={field.value?.toString()}
                onChangeText={(text) => {
                  const num = parseInt(text);
                  field.onChange(isNaN(num) ? undefined : num);
                }}
              />
            )}
          />

          <FormField
            control={form.control}
            name={"alarmAbsoluteDate" as any}
            render={({ field }) => (
              <FormTimePicker
                label="Custom Alarm Date"
                description="Or set a specific alarm date/time"
                mode="time"
                {...field}
              />
            )}
          />
        </>
      )}
    </>
  );
}
