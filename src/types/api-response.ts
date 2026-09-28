export interface ApiResponse<T> {
    meta: Meta;
    data?: T,
    errors?: any
}

interface Meta {
    success: string;
    status_code: number;
    message: string;
}
