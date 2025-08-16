import { useState } from "react";

export const useEditMode = () => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editedData, setEditedData] = useState<any>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  // Enter edit mode
  const enterEditMode = (currentData: any) => {
    setEditedData(currentData);
    setIsEditMode(true);
    setHasUnsavedChanges(false);
  };

  // Exit edit mode
  const exitEditMode = () => {
    setIsEditMode(false);
    // Keep editedData for preview
  };

  // Reset changes
  const resetChanges = () => {
    setEditedData(null);
    setHasUnsavedChanges(false);
    setIsEditMode(false);
  };

  // Apply changes to cache
  const applyChanges = (selectedKey: string, mutate: Function) => {
    if (!selectedKey || !editedData) return;

    try {
      mutate(selectedKey, editedData, false);
      setHasUnsavedChanges(false);
      setEditedData(null);
    } catch (error) {
      // Error handling can be added here
    }
  };

  // Handle JSON editing - onEdit for react-json-view/editor
  const handleEdit = (option: {
    value: unknown;
    oldValue: unknown;
    keyName?: string | number;
    parentName?: string | number;
    namespace?: Array<string | number>;
    type?: "value" | "key";
  }) => {
    // Mark as having unsaved changes
    setHasUnsavedChanges(true);

    // Update editedData with the new value using namespace path
    if (editedData && option.namespace) {
      // Create a deep copy of current edited data
      const updatedData = JSON.parse(JSON.stringify(editedData));

      // Navigate to the correct location using namespace path
      let current = updatedData;
      for (let i = 0; i < option.namespace.length - 1; i++) {
        current = current[option.namespace[i]];
      }

      // Set the new value at the final key
      const finalKey = option.namespace[option.namespace.length - 1];
      if (option.type === "value") {
        current[finalKey] = option.value;
      } else if (option.type === "key") {
        // Handle key rename
        delete current[option.oldValue as string | number];
        current[option.value as string | number] = current[finalKey];
      }

      setEditedData(updatedData);
    }

    // Return true to allow the edit
    return true;
  };

  // Handle adding new properties - onAdd for react-json-view/editor
  const handleAdd = (
    keyOrValue: string,
    newValue: object,
    value: object,
    isAdd: boolean
  ) => {
    if (!isAdd) return false;

    // Update editedData with the new value and mark as changed
    setEditedData(value);
    setHasUnsavedChanges(true);
    return true; // Allow the addition
  };

  // Handle deleting properties - onDelete for react-json-view/editor
  const handleDelete = (
    keyName: string | number,
    value: object,
    parentValue: object | null,
    opt: { namespace?: (string | number)[] }
  ) => {
    // Update editedData with the modified parent value and mark as changed
    setEditedData(parentValue);
    setHasUnsavedChanges(true);
    return true; // Allow the deletion
  };

  // Reset when key changes
  const resetForNewKey = () => {
    setIsEditMode(false);
    setEditedData(null);
    setHasUnsavedChanges(false);
  };

  return {
    isEditMode,
    editedData,
    hasUnsavedChanges,
    enterEditMode,
    exitEditMode,
    resetChanges,
    applyChanges,
    handleEdit,
    handleAdd,
    handleDelete,
    resetForNewKey,
  };
};
