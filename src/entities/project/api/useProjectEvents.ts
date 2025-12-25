import { useEffect, useState, useCallback, useRef } from 'react';
import { DEFAULT_URL } from '@/shared/api/const';
import Cookies from 'js-cookie';
import { ECookieKey } from '@/shared/services/cookie/ECookieKey';

export type AnalysisStatus = 'pending' | 'completed' | 'failed';

interface UseProjectEventsOptions {
    projectId: string;
    onAnalysisCompleted?: () => void;
    onAnalysisFailed?: (error: string) => void;
}

/**
 * Хук для polling статуса анализа проекта
 * Вместо SSE используем периодические запросы к API
 */
export const useProjectEvents = ({ 
    projectId, 
    onAnalysisCompleted, 
    onAnalysisFailed 
}: UseProjectEventsOptions) => {
    const [analysisStatus, setAnalysisStatus] = useState<AnalysisStatus>('pending');
    const [error, setError] = useState<string | null>(null);
    const [isPolling, setIsPolling] = useState(false);
    const pollingIntervalRef = useRef<number | null>(null);
    const lastStatusRef = useRef<AnalysisStatus>('pending');

    const checkStatus = useCallback(async () => {
        if (!projectId) {
            console.warn('[useProjectEvents] No projectId provided, skipping polling');
            return;
        }

        try {
            console.log(`[useProjectEvents] Polling project status for: ${projectId}`);
            
            // Получаем токен из cookies
            const tokenRaw = Cookies.get(ECookieKey.ACCESS_TOKEN);
            const token = tokenRaw ? JSON.parse(tokenRaw) : null;
            
            console.log('[useProjectEvents] Token available:', !!token);
            
            if (!token) {
                console.error('[useProjectEvents] No access token found in cookies');
                setError('No access token');
                return;
            }
            
            const response = await fetch(`${DEFAULT_URL}/api/project-service/Projects/${projectId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch project: ${response.statusText}`);
            }

            const project = await response.json();
            console.log('[useProjectEvents] Project data received:', project);

            // Проверяем статус анализа
            if (project.analysisResult) {
                const status = project.analysisResult.status.toLowerCase();
                console.log(`[useProjectEvents] Analysis status: ${status}`);

                // Обновляем статус только если он изменился
                if (status !== lastStatusRef.current) {
                    lastStatusRef.current = status as AnalysisStatus;
                    setAnalysisStatus(status as AnalysisStatus);

                    if (status === 'completed') {
                        console.log('[useProjectEvents] Analysis completed!');
                        if (onAnalysisCompleted) {
                            onAnalysisCompleted();
                        }
                        // Останавливаем polling после завершения
                        if (pollingIntervalRef.current) {
                            clearInterval(pollingIntervalRef.current);
                            pollingIntervalRef.current = null;
                            setIsPolling(false);
                        }
                    } else if (status === 'failed') {
                        console.error('[useProjectEvents] Analysis failed!');
                        const errorMessage = project.analysisResult.errorMessage || 'Analysis failed';
                        setError(errorMessage);
                        if (onAnalysisFailed) {
                            onAnalysisFailed(errorMessage);
                        }
                        // Останавливаем polling после ошибки
                        if (pollingIntervalRef.current) {
                            clearInterval(pollingIntervalRef.current);
                            pollingIntervalRef.current = null;
                            setIsPolling(false);
                        }
                    }
                }
            } else {
                console.log('[useProjectEvents] No analysis result yet');
            }
        } catch (err) {
            console.error('[useProjectEvents] Error polling project status:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
        }
    }, [projectId, onAnalysisCompleted, onAnalysisFailed]);

    const startPolling = useCallback((immediate = true) => {
        if (!projectId) {
            console.warn('[useProjectEvents] No projectId provided, skipping polling');
            return;
        }

        console.log('[useProjectEvents] Starting polling for project:', projectId);
        setIsPolling(true);

        // Проверяем статус сразу или с задержкой
        if (immediate) {
            checkStatus();
        } else {
            // Задержка 2 секунды, чтобы backend успел:
            // 1. Удалить старый AnalysisResult
            // 2. Загрузить файл
            // 3. Document Analysis Service начал обработку
            setTimeout(() => checkStatus(), 2000);
        }

        // Затем проверяем каждые 3 секунды
        pollingIntervalRef.current = window.setInterval(() => {
            checkStatus();
        }, 3000);
    }, [projectId, checkStatus]);

    const stopPolling = useCallback(() => {
        console.log('[useProjectEvents] Stopping polling');
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
        }
        setIsPolling(false);
    }, []);

    const resetStatus = useCallback(() => {
        console.log('[useProjectEvents] Resetting status and restarting polling');
        setAnalysisStatus('pending');
        setError(null);
        lastStatusRef.current = 'pending';
        
        // Останавливаем текущий polling
        stopPolling();
        
        // Запускаем заново с задержкой перед первой проверкой
        // Это дает время backend обновить статус после загрузки нового файла
        startPolling(false);
    }, [stopPolling, startPolling]);

    // Начинаем polling при монтировании компонента
    useEffect(() => {
        startPolling();

        // Останавливаем polling при размонтировании
        return () => {
            console.log('[useProjectEvents] Cleaning up polling');
            stopPolling();
        };
    }, [startPolling, stopPolling]);

    return {
        analysisStatus,
        error,
        isPolling,
        resetStatus
    };
};
