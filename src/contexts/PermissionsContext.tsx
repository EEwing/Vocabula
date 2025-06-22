"use client"

import React, { createContext, useContext, useMemo, useState } from 'react'

type AtLeastRole = 'owner' | 'enrolled';
interface PermissionsObject {
  isOwner: boolean,
  isEnrolled: boolean,
  isHidden: boolean,
  setEnrolled: (enrolled: boolean) => void,
  atLeast: (role: AtLeastRole) => boolean
}

const PermissionsContext = createContext<PermissionsObject | null>(null)

/**
 * PermissionsProvider wraps children and provides permission info for a given object.
 *
 * @param {object} props
 * @param {boolean} props.isOwner - Whether the user is the owner (precomputed)
 * @param {boolean} props.isEnrolled - Whether the user is enrolled (precomputed)
 * @param {React.ReactNode} props.children
 */
export function PermissionsProvider({ isOwner, isEnrolled: initialEnrolled, children }) {
  const [isEnrolled, setEnrolled] = useState(initialEnrolled);
  const atLeast = (role: AtLeastRole) => {
    if (role === 'owner') return isOwner;
    if (role === 'enrolled') return isOwner || isEnrolled;
    return false;
  };
  const value = useMemo(() => ({
    isOwner,
    isEnrolled,
    isHidden: !(isOwner || isEnrolled),
    setEnrolled,
    atLeast,
  }), [isOwner, isEnrolled]);
  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  );
}

/**
 * usePermissions hook to access { isOwner, isEnrolled, isHidden } for the current object.
 * Must be used within a PermissionsProvider.
 */
export function usePermissions() {
  const context = useContext(PermissionsContext)
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider')
  }
  return context
}

// Usage example:
// <PermissionsProvider isOwner={true} isEnrolled={true}>
//   ...
//   const { isOwner, isEnrolled, isHidden } = usePermissions()
// </PermissionsProvider> 