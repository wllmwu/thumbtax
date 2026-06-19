import React from "react";

import {
  Button,
  Dialog,
  FieldError,
  Form,
  Heading,
  Input,
  Label,
  NumberField,
  Text,
} from "react-aria-components";

import { useStore } from "#src/state/useStore";
import { SwitchField } from "#src/ui/primitives/SwitchField";

export function SettingsDialog() {
  const preferences = useStore((state) => state.userPreferences);
  const updatePreferences = useStore((state) => state.updatePreferences);

  const [isBrowserSaveEnabled, setIsBrowserSaveEnabled] = React.useState(
    preferences.browserSaveEnabled,
  );
  const [maxHistorySize, setMaxHistorySize] = React.useState(
    preferences.maximumHistorySize,
  );

  const renderContent = React.useCallback(
    ({ close }: { close: () => void }) => (
      <>
        <Heading slot="title">Settings</Heading>
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            updatePreferences({
              browserSaveEnabled: isBrowserSaveEnabled,
              maximumHistorySize: maxHistorySize,
            });
            close();
          }}
        >
          <SwitchField
            label="Autosave to this browser"
            description="When enabled, this browser remembers the data you enter into Thumbtax. Otherwise, you'll lose your progress if you close the tab. Only enable this option on a device that belongs to you. Note: Even when this option is enabled, deleting your browsing history or clearing your cache might also delete your Thumbtax data. Download a save file to keep your data long-term."
            value={isBrowserSaveEnabled}
            onChange={setIsBrowserSaveEnabled}
          />
          <NumberField
            value={maxHistorySize}
            onChange={setMaxHistorySize}
            minValue={0}
            maxValue={1000}
            step={1}
          >
            <Label>Undo window size</Label>
            <Input />
            <Text slot="description">
              The number of your most recent edits that you can undo.
            </Text>
            <FieldError>Must be between 0 and 1000.</FieldError>
          </NumberField>
          <Button slot="close">Cancel</Button>
          <Button type="submit">Save</Button>
        </Form>
      </>
    ),
    [isBrowserSaveEnabled, maxHistorySize, updatePreferences],
  );

  return <Dialog>{renderContent}</Dialog>;
}
