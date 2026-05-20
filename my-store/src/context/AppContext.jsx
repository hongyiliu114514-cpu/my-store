import { createContext, useContext } from 'react';

// 使用唯一的哨兵对象，与 null/undefined 区分，准确判断 Provider 是否挂载
const NO_PROVIDER = Symbol('AppContext: no provider');

const AppContext = createContext(NO_PROVIDER);

export function useAppContext() {
  const ctx = useContext(AppContext);

  // 只有当 context 值严格等于哨兵对象时，才说明 Provider 未挂载
  if (ctx === NO_PROVIDER) {
    throw new Error(
      'useAppContext must be used within AppContext.Provider. ' +
      '请确保调用 useAppContext 的组件在 <AppContext.Provider> 内部。'
    );
  }

  return ctx;
}

export default AppContext;
