export const templates = {
    "hooks/get": (namePascal, nameCamel, nameKebab, snakeCase) =>
        `
        import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

        import { QueryKeys } from 'shared/constants';

        import { get${namePascal}, get${namePascal}s } from '../api';
        import { IGet${namePascal}sParams } from '../types';

        export const useGet${namePascal}s = (query: IGet${namePascal}sParams) => {
            return useQuery({
                queryKey: [QueryKeys.GET_${snakeCase.toUpperCase()}S, query],
                queryFn: ({ signal }) => get${namePascal}s(query, signal),
            });
        };

        export const useGet${namePascal}sInfiniteScroll = (query: IGet${namePascal}sParams) => {
            return useInfiniteQuery({
                initialPageParam: 1,
                queryKey: [QueryKeys.GET_INFINITE_${snakeCase.toUpperCase()}S, query],
                queryFn: ({ pageParam }) => get${namePascal}s({ ...query, page: pageParam }),
                getNextPageParam: lastPage => lastPage.data.nextPage,
            });
        };

        export const useGetGroup = (${nameCamel}Id: string) => {
            return useQuery({
                queryKey: [QueryKeys.GET_${snakeCase.toUpperCase()}S, ${nameCamel}Id],
                queryFn: ({ signal }) => get${namePascal}(${nameCamel}Id, signal),
            });
        };
    `.trim(),

    "hooks/put": (namePascal, nameCamel, nameKebab, snakeCase) =>
        `
        import { useMutation } from '@tanstack/react-query';
        import { IUpdate${namePascal} } from "../types"
        import { QueryKeys } from 'shared/constants';
        import { queryClient } from 'shared/lib';

        import { update${namePascal} } from '../api';

        export const useUpdate${namePascal} = () => {

            return useMutation({
                onSuccess(data) {
                    console.log(data)
                    queryClient.invalidateQueries({
                        queryKey: [QueryKeys.GET_${snakeCase.toUpperCase()}S],
                    });
                    queryClient.invalidateQueries({
                        queryKey: [QueryKeys.GET_INFINITE_${snakeCase.toUpperCase()}S],
                    });
                },
                onError(error) {
                    console.error(error);
                },
                mutationFn: ({${nameCamel}Id, ...payload}: IUpdate${namePascal} & {
                    ${nameCamel}Id: string;
                }) => update${namePascal}(${nameCamel}Id, payload),
            });
        };
    `.trim(),

    "hooks/patch": (namePascal, nameCamel, nameKebab, snakeCase) =>
        `
        import { useMutation } from '@tanstack/react-query';

        import { QueryKeys } from 'shared/constants';
        import { queryClient } from 'shared/lib';

        import { toggle${namePascal} } from '../api';

        export const useToggle${namePascal} = () => {

            return useMutation({
                onSuccess(data) {
                    console.log(data)
                    queryClient.invalidateQueries({
                        queryKey: [QueryKeys.GET_${snakeCase.toUpperCase()}S],
                    });
                    queryClient.invalidateQueries({
                        queryKey: [QueryKeys.GET_INFINITE_${snakeCase.toUpperCase()}S],
                    });
                },
                onError(error) {
                    console.error(error);
                },
                mutationFn: (${nameCamel}Id: string) => toggle${namePascal}(${nameCamel}Id),
            });
        };
    `.trim(),

    "hooks/post": (namePascal, nameCamel, nameKebab, snakeCase) =>
        `
        import { useMutation } from '@tanstack/react-query';
        import { ICreate${namePascal} } from "../types"
        import { QueryKeys } from 'shared/constants';
        import { queryClient } from 'shared/lib';

        import { create${namePascal} } from '../api';

        export const useCreate${namePascal} = () => {

            return useMutation({
                onSuccess(data) {
                    console.log(data)
                    queryClient.invalidateQueries({
                        queryKey: [QueryKeys.GET_${snakeCase.toUpperCase()}S],
                    });
                    queryClient.invalidateQueries({
                        queryKey: [QueryKeys.GET_INFINITE_${snakeCase.toUpperCase()}S],
                    });
                },
                onError(error) {
                    console.error(error);
                },
                mutationFn: (payload: ICreate${namePascal}) => create${namePascal}(payload),
            });
        };
    `.trim(),

    "hooks/delete": (namePascal, nameCamel, nameKebab, snakeCase) =>
        `
        import { useMutation } from '@tanstack/react-query';

        import { QueryKeys } from 'shared/constants';
        import { queryClient } from 'shared/lib';

        import { delete${namePascal} } from '../api';

        export const useDelete${namePascal} = () => {

            return useMutation({
                onSuccess(data) {
                    console.log(data)
                    queryClient.invalidateQueries({
                        queryKey: [QueryKeys.GET_${snakeCase.toUpperCase()}S],
                    });
                    queryClient.invalidateQueries({
                        queryKey: [QueryKeys.GET_INFINITE_${snakeCase.toUpperCase()}S],
                    });
                },
                onError(error) {
                    console.error(error);
                },
                mutationFn: (${nameCamel}Id: string) => delete${namePascal}(${nameCamel}Id),
            });
        };
    `.trim(),

    "hooks/index": (namePascal, nameCamel, nameKebab, snakeCase) =>
        `
        export * from './get';
        export * from './post';
        export * from './put';
        export * from './patch';
        export * from './delete';
    `.trim(),

    "api/get": (namePascal, nameCamel, nameKebab, snakeCase) =>
        `
        import { api } from 'shared/lib';
        import { I${namePascal}Response, I${namePascal}sResponse, IGet${namePascal}sParams } from '../types';

        export const get${namePascal} = async (
            ${nameCamel}Id: string,
            signal?: AbortSignal,
        ): Promise<I${namePascal}Response> => {
            const response = await api.get(\`/${nameKebab}s/\${${nameCamel}Id}\`, {
                signal,
            });

            return response.data;
        };

        export const get${namePascal}s = async (
            params: IGet${namePascal}sParams,
            signal?: AbortSignal,
        ): Promise<I${namePascal}sResponse> => {
            const response = await api.get("/${nameKebab}s", {
                signal,
                params,
            });

            return response.data;
        };
    `.trim(),

    "api/put": (namePascal, nameCamel, nameKebab, snakeCase) =>
        `
        import { api } from 'shared/lib';
        import { I${namePascal}Response, IUpdate${namePascal} } from '../types';

        export const update${namePascal} = async (
            ${nameCamel}Id: string,
            payload: IUpdate${namePascal}
        ): Promise<I${namePascal}Response> => {
            const response = await api.put(\`/${nameKebab}s/\${${nameCamel}Id}\`, payload);

            return response.data;
        };
    `.trim(),

    "api/patch": (namePascal, nameCamel, nameKebab, snakeCase) =>
        `
        import { api } from 'shared/lib';
        import { I${namePascal}Response } from '../types';

        export const toggle${namePascal} = async (
            ${nameCamel}Id: string,
        ): Promise<I${namePascal}Response> => {
            const response = await api.patch(\`/${nameKebab}s/\${${nameCamel}Id}\`);

            return response.data;
        };
    `.trim(),

    "api/post": (namePascal, nameCamel, nameKebab, snakeCase) =>
        `
        import { api } from 'shared/lib';
        import { I${namePascal}Response, ICreate${namePascal} } from '../types';

        export const create${namePascal} = async (
            payload: ICreate${namePascal}
        ): Promise<I${namePascal}Response> => {
            const response = await api.post("/${nameKebab}s", payload);

            return response.data;
        };
    `.trim(),

    "api/delete": (namePascal, nameCamel, nameKebab, snakeCase) =>
        `
        import { api } from 'shared/lib';
        import { I${namePascal}Response } from '../types';

        export const delete${namePascal} = async (
            ${nameCamel}Id: string,
        ): Promise<I${namePascal}Response> => {
            const response = await api.delete(\`/${nameKebab}s/\${${nameCamel}Id}\`);

            return response.data;
        };
    `.trim(),

    "api/index": (namePascal, nameCamel, nameKebab, snakeCase) =>
        `
        export * from './get';
        export * from './post';
        export * from './put';
        export * from './patch';
        export * from './delete';
    `.trim(),

    "types/params": (namePascal, nameCamel, nameKebab, snakeCase) =>
        `
        export interface IGet${namePascal}sParams {
            page: number;
            perPage: number;
        }
    `.trim(),

    "types/payloads": (namePascal, nameCamel, nameKebab, snakeCase) =>
        `
        import { I${namePascal} } from "./responses"

        export interface ICreate${namePascal} extends Required<Omit<I${namePascal}, "id">> {}
        export interface IUpdate${namePascal} extends Partial<Omit<I${namePascal}, "id">> {}
    `.trim(),

    "types/responses": (namePascal, nameCamel, nameKebab, snakeCase) =>
        `
        export interface I${namePascal} {
            id: string;
            fullName: string;
        }

        export interface I${namePascal}Response {
            message: string;
            data: I${namePascal}
        }

        export interface I${namePascal}sResponse {
            message: string;
            data: {
                totalPages: number;
                perPage: number;
                total: number
                nextPage: number | null;
                prevPage: number | null;
                ${nameCamel}s: I${namePascal}[]
            }
        }
    `.trim(),

    "types/index": (namePascal, nameCamel, nameKebab, snakeCase) =>
        `
        export * from './params';
        export * from './payloads';
        export * from './responses';
    `.trim(),

    "index": (namePascal, nameCamel, nameKebab, snakeCase) =>
        `
        export * from './api';
        export * from './hooks';
        export * from './types';
    `.trim(),
};
