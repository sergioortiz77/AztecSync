import React, { createContext, useContext, useState, useEffect } from 'react';

// Context to simulate Router state
export const RouterContext = createContext<any>({
  params: {},
  push: () => {},
  replace: () => {},
  back: () => {},
});

// Mock Provider Component
export const MockRouterProvider = ({ children, initialParams = {}, onNavigate }: any) => {
  const [params, setParams] = useState(initialParams);

  const push = (route: any) => {
    // Handle both string paths and objects
    const pathname = typeof route === 'string' ? route : route.pathname;
    const newParams = typeof route === 'object' && route.params ? route.params : {};
    
    console.log('Router Push:', pathname, newParams);
    setParams(newParams);
    
    if (onNavigate) {
      onNavigate(pathname);
    }
  };

  const replace = push;
  const back = () => console.log('Router Back');

  return (
    <RouterContext.Provider value={{ params, push, replace, back }}>
      {children}
    </RouterContext.Provider>
  );
};

// Hooks used by the app pages
export const useRouter = () => useContext(RouterContext);
export const useLocalSearchParams = () => useContext(RouterContext).params;

// Components used in _layout files (Dummy implementation to prevent crashes if rendered)
export const Slot = () => null;
export const Stack = ({ children }: any) => <>{children}</>;
Stack.Screen = () => null;
export const Tabs = ({ children }: any) => <>{children}</>;
Tabs.Screen = () => null;
