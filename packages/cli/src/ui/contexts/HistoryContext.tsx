/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext } from 'react';
import { HistoryItem } from '../types.js';
import {
  UseHistoryManagerReturn,
  useHistory,
} from '../hooks/useHistoryManager.js';

/**
 * Defines the shape of the value provided by the HistoryContext.
 * It exposes the chat history and functions to manipulate it.
 */
export interface HistoryContextValue {
  history: HistoryItem[];
  addItem: UseHistoryManagerReturn['addItem'];
  clearItems: UseHistoryManagerReturn['clearItems'];
  loadHistory: UseHistoryManagerReturn['loadHistory'];
}

/**
 * Creates the React Context for managing chat history.
 * It will be consumed by components that need access to the history state.
 */
const HistoryContext = createContext<HistoryContextValue | undefined>(
  undefined,
);

/**
 * Provides the chat history context to its children components.
 * It uses the `useHistory` hook to manage the history state.
 */
export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { history, addItem, clearItems, loadHistory } = useHistory();

  const value: HistoryContextValue = {
    history,
    addItem,
    clearItems,
    loadHistory,
  };

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
};

/**
 * Custom hook to consume the HistoryContext.
 * Throws an error if used outside of a HistoryProvider.
 */
export const useHistoryContext = () => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistoryContext must be used within a HistoryProvider');
  }
  return context;
};
