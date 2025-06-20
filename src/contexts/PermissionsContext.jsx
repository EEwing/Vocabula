"use client"

import React, { createContext, useContext, useMemo } from 'react'

const PermissionsContext = createContext(null)

/**
 * PermissionsProvider wraps children and provides permission info for a given object.
 *
 * @param {object} props
 * @param {boolean} props.isOwner - Whether the user is the owner (precomputed)
 * @param {boolean} props.isEnrolled - Whether the user is enrolled (precomputed)
 * @param {React.ReactNode} props.children
 */
export function PermissionsProvider({ isOwner, isEnrolled, children }) {
  // isHidden: default to false, extend as needed
  const value = useMemo(() => ({
    isOwner,
    isEnrolled: isEnrolled || isOwner,
    isHidden: !(isOwner || isEnrolled)
  }), [isOwner, isEnrolled])

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  )
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