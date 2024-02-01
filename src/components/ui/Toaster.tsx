"use client"

import { useTheme } from '@/utils/Theme/useTheme';
import * as React from 'react';
import { Toaster } from 'sonner';

const ToasterContainer: React.FunctionComponent = () => {
    const { theme } = useTheme()
    return (
        <Toaster theme={theme} />
    );
};

export default ToasterContainer;
