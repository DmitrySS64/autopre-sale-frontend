// pages/project_page/contexts/ProjectContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Типы для данных проекта
interface ProjectData {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
}

interface ProjectState {
    projectId: string;
    projectData: ProjectData | null;
    isLoading: boolean;
    error: string | null;
}

interface ProjectContextType {
    state: ProjectState;
    setProjectData: (data: ProjectData) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    refreshProject: () => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Reducer для управления состоянием проекта
type ProjectAction =
    | { type: 'SET_PROJECT_DATA'; payload: ProjectData | null }
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'REFRESH_PROJECT' };

const projectReducer = (state: ProjectState, action: ProjectAction): ProjectState => {
    switch (action.type) {
        case 'SET_PROJECT_DATA':
            return {
                ...state,
                projectData: action.payload || null,
                isLoading: false,
                error: null
            };
        case 'SET_LOADING':
            return {
                ...state,
                isLoading: action.payload
            };
        case 'SET_ERROR':
            return {
                ...state,
                error: action.payload,
                isLoading: false
            };
        case 'REFRESH_PROJECT':
            return {
                ...state,
                isLoading: true,
                error: null
            };
        default:
            return state;
    }
};

export const ProjectProvider: React.FC<{ children: React.ReactNode; projectId: string }> = ({
    children,
    projectId
}) => {
    const [state, dispatch] = useReducer(projectReducer, {
        projectId,
        projectData: null,
        isLoading: true,
        error: null,
    });

    const setProjectData = (data: ProjectData) => {
        dispatch({ type: 'SET_PROJECT_DATA', payload: data });
    };

    const setLoading = (loading: boolean) => {
        dispatch({ type: 'SET_LOADING', payload: loading });
    };

    const setError = (error: string | null) => {
        dispatch({ type: 'SET_ERROR', payload: error });
    };

    const refreshProject = () => {
        dispatch({ type: 'REFRESH_PROJECT' });
    };

    // При смене projectId сбрасываем состояние
    useEffect(() => {
        dispatch({
            type: 'SET_PROJECT_DATA',
            payload: null
        });
        dispatch({
            type: 'SET_LOADING',
            payload: true
        });
        dispatch({
            type: 'SET_ERROR',
            payload: null
        });
    }, [projectId]);

    return (
        <ProjectContext.Provider value={{
            state,
            setProjectData,
            setLoading,
            setError,
            refreshProject
        }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProjectContext = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error('useProjectContext must be used within ProjectProvider');
    }
    return context;
};