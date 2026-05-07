import { createContext, useContext } from 'react';
import type { ReactElement, ReactNode } from 'react';

const V1UserWorkloadPrototypeContext = createContext(false);

export function V1UserWorkloadPrototypeProvider({
    children,
}: {
    children: ReactNode;
}): ReactElement {
    return (
        <V1UserWorkloadPrototypeContext.Provider value>
            {children}
        </V1UserWorkloadPrototypeContext.Provider>
    );
}

export function useIsV1UserWorkloadPrototype(): boolean {
    return useContext(V1UserWorkloadPrototypeContext);
}
