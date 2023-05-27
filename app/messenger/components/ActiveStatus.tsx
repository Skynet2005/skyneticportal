'use client';

import useActiveChannel from "@/app/utils/messenger/useHooks/useActiveChannel";

const ActiveStatus = () => {
  useActiveChannel();

  return null;
}

export default ActiveStatus;