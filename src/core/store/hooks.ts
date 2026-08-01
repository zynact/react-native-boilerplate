import { useDispatch, useSelector, useStore } from 'react-redux';

import type { AppDispatch, RootState } from './store';

/**
 * Typed dispatch hook – use instead of plain useDispatch()
 */
export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();

/**
 * Typed selector hook – use instead of plain useSelector()
 * @example const accessToken = useAppSelector((s) => s.auth.accessToken);
 */
export const useAppSelector = useSelector.withTypes<RootState>();

/**
 * Typed store hook – use instead of plain useStore()
 * Useful for imperative access to the store instance inside React components.
 * For outside-React access (services, utils), import the store directly.
 *
 * @example const store = useAppStore(); store.getState().auth.isAuthenticated;
 */
export const useAppStore = useStore.withTypes<RootState>();
