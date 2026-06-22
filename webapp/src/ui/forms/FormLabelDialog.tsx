import React from "react";

import { Button, Dialog, Form, Heading } from "react-aria-components";

import { useStore } from "#src/state/useStore";
import { TextField } from "#src/ui/primitives/TextField";

import type { FormClass } from "@thumbtax/common";
import type { FormInstanceId } from "#src/common/types/formInstanceId";

type Props = {
  formClass: FormClass;
  instanceId: FormInstanceId;
};

export function FormLabelDialog({ formClass, instanceId }: Props) {
  const currentLabel = useStore(
    (state) =>
      state.applicationState.formInstances[formClass]?.find(
        (instance) => instance.id === instanceId,
      )?.label ?? "",
  );
  const setFormInstanceLabel = useStore((state) => state.setFormInstanceLabel);

  const [newLabel, setNewLabel] = React.useState(currentLabel);

  const renderContent = React.useCallback(
    ({ close }: { close: () => void }) => (
      <>
        <Heading slot="title">Set form label</Heading>
        <Form
          onSubmit={(event) => {
            event.preventDefault();
            setFormInstanceLabel(formClass, instanceId, newLabel);
            close();
          }}
        >
          <TextField
            label="New label"
            value={newLabel}
            onChange={setNewLabel}
            autoFocus
            errorMessage={
              newLabel.length === 0 ? "Label is required" : undefined
            }
          />
          <Button slot="close">Cancel</Button>
          <Button type="submit">Done</Button>
        </Form>
      </>
    ),
    [formClass, instanceId, newLabel, setFormInstanceLabel],
  );

  return <Dialog>{renderContent}</Dialog>;
}
