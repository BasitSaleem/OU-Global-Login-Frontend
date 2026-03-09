"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";
import { CoachMarkTour, CoachMarkStep } from "./CoachMark";

interface CoachMarkContextType {
    startTour: (steps: CoachMarkStep[]) => void;
    stopTour: () => void;
    isRunning: boolean;
}

const CoachMarkContext = createContext<CoachMarkContextType | undefined>(undefined);

export const CoachMarkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [steps, setSteps] = useState<CoachMarkStep[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    const startTour = useCallback((newSteps: CoachMarkStep[]) => {
        setSteps(newSteps);
        setIsRunning(true);
    }, []);

    const stopTour = useCallback(() => {
        setIsRunning(false);
    }, []);

    const contextValue = useMemo(() => ({
        startTour,
        stopTour,
        isRunning
    }), [startTour, stopTour, isRunning]);

    return (
        <CoachMarkContext.Provider value={contextValue}>
            {children}
            <CoachMarkTour
                steps={steps}
                run={isRunning}
                onFinish={stopTour}
                onSkip={stopTour}
            />
        </CoachMarkContext.Provider>
    );
};

export const useCoachMark = () => {
    const context = useContext(CoachMarkContext);
    if (context === undefined) {
        throw new Error("useCoachMark must be used within a CoachMarkProvider");
    }
    return context;
};
