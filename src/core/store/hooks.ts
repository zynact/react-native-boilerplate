import { useDispatch, useSelector } from 'react-redux';

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
