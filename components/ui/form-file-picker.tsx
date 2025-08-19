const FormFilePicker = React.forwardRef<
  React.ComponentRef<typeof FilePicker>,
  FormItemProps<typeof FilePicker, FilePickerResult[]>
>(({ label, description, value, onChange, ...props }, ref) => {
  const { error, formItemNativeID, formDescriptionNativeID, formMessageNativeID } = useFormField();

  return (
    <FormItem>
      {!!label && <FormLabel nativeID={formItemNativeID}>{label}</FormLabel>}
      <FilePicker
        ref={ref!}
        aria-labelledby={formItemNativeID}
        aria-describedby={
          !error
            ? `${formDescriptionNativeID}`
            : `${formDescriptionNativeID} ${formMessageNativeID}`
        }
        aria-invalid={!!error}
        onFileSelect={(result) => {
          if (!result.canceled && result.assets) {
            onChange?.(result.assets);
          }
        }}
        {...props}
      />
      {!!description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
});

FormFilePicker.displayName = 'FormFilePicker';
