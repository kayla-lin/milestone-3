import React, { useState } from "react";

const useDisclosure = () => {
  const [open, setOpen] = useState(false);

  // Modal helper
  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return { open, showDrawer, onClose };
};

export default useDisclosure;
