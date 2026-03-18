interface ResponseError<D = any> extends Error {
    name: string;
}
interface RequestOptions {
    prefix?: string
    timeout?:number
    errorHandler?: (error: ResponseError) => void
}


interface RequestMethod {

    <T>(url: string, options): Promise<T>
}

interface Extend {
    (options: RequestOptions): RequestMethod
}