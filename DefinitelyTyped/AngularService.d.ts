

interface IAzureService {
    query<T>(tableName: string, parameters?: IAzureParameters, withFilterFn?: Function): ng.IPromise<T>;
    insert<T>(tableName: string, obj: T, withFilterFn?: Function): ng.IPromise<any>;
    update<T>(tableName: string, obj: T, withFilterFn?: Function): ng.IPromise<any>;
    del<T>(tableName: string, obj: T, withFilterFn?: Function): ng.IPromise<any>;
    getAll<T>(tableName: string, withFilterFn?: Function): ng.IPromise<T>;
    getById<T>(tableName: string, id: string, withFilterFn?: Function): ng.IPromise<T>;
    read<T>(tableName: string, parameters?: IAzureParameters, withFilterFn?:Function): ng.IPromise<T>;
    login(oauthProvider: string, token: Object): ng.IPromise<any>;
    setCurrentUser(userObj: Object): void;
    getCurrentUser(): Object;
    logout(): void;
    isLoggedIn(): boolean;
    invokeApi<T>(name: string, params: IAzureApiParameters): ng.IPromise<T>;
}

interface IAzureParameters {
    criteria?: Object;
    params?: Array<string>;
    columns?: Array<string>;
    take?: number;
    skip?: number;
    orderBy?: Array<IAzureParamOrderBy>;
    column?: string;
    direction?: string;
}

interface IAzureApiParameters {
    method: string;
    body?: Object;
    parameters?: Object;
    headers?: Object;
}

interface IAzureParamOrderBy {
    column: string;
    direction: string;
}

