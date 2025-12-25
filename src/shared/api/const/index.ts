const IS_STUB = false; // Отключаем stub режим - используем реальный API
const DEFAULT_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

console.log('API Configuration:', { IS_STUB, DEFAULT_URL });

export { IS_STUB, DEFAULT_URL };