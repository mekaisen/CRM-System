import type { ActionReducerMapBuilder, AsyncThunk, Draft } from '@reduxjs/toolkit';

export interface IAsyncParticle<T> {
  data: T | null;
  error: any | null;
  status: 'fulfilled' | 'idle' | 'pending' | 'rejected';
}

export const initAsyncParticle = <T extends unknown>(data: T | null = null): IAsyncParticle<T> => ({
  data,
  error: null,
  status: 'idle'
});

interface IAsyncDataStatus {
  hasError: boolean;
  isLoaded: boolean;
  isLoading: boolean;
}

export const getAsyncDataStatus = (data: IAsyncParticle<unknown>): IAsyncDataStatus => ({
  hasError: data?.status === 'rejected',
  isLoading: data?.status === 'pending',
  isLoaded: data?.status === 'fulfilled'
});

export const getAsyncRequestData = <T>(
  stateParam: IAsyncParticle<T>
): {
  data: T | null;
  error: any;
  status: IAsyncDataStatus;
} => ({
  data: stateParam?.data,
  error: stateParam?.error,
  status: getAsyncDataStatus(stateParam)
});
export const addAsyncBuilderCases = <TState, RQ, RS>(
  builder: ActionReducerMapBuilder<TState>,
  sliceMethod: AsyncThunk<RS, RQ, { rejectValue: string }>,
  key: keyof TState
) => {
  builder.addCase(sliceMethod.pending, (state: Draft<TState>) => {
    const stateDraft = state as Record<keyof TState, IAsyncParticle<unknown>>;
    stateDraft[key].status = 'pending';
  });
  builder.addCase(sliceMethod.fulfilled, (state: Draft<TState>, action) => {
    const stateDraft = state as Record<keyof TState, IAsyncParticle<unknown>>;
    stateDraft[key].status = 'fulfilled';
    stateDraft[key].data = action.payload;
  });
  builder.addCase(sliceMethod.rejected, (state: Draft<TState>, action) => {
    const stateDraft = state as Record<keyof TState, IAsyncParticle<unknown>>;
    stateDraft[key].error = action.payload;
    stateDraft[key].status = 'rejected';
  });
};
