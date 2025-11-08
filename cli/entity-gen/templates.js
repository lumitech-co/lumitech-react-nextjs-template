export const templates = {
    "hooks/get": (namePascal, nameCamel, _, snakeCase) =>
        `
        import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

        import { QueryKeys } from 'shared/constants';

        import { get${nameCamel} } from '../api';
        import { IGet${nameCamel}sParams } from '../types';

        export const useGet${nameCamel}s = (query: IGet${nameCamel}sParams) => {
            return useQuery({
                queryKey: [QueryKeys.GET_${snakeCase.toUpperCase()}S, query],
                queryFn: ({ signal }) => get${nameCamel}s(query, signal),
            });
        };

        export const useGet${nameCamel}sInfiniteScroll = (query: IGet${nameCamel}sParams) => {
            return useInfiniteQuery({
                initialPageParam: 1,
                queryKey: [QueryKeys.GET_INFINITE_${snakeCase.toUpperCase()}S, query],
                queryFn: ({ pageParam }) => get${nameCamel}s({ ...query, page: pageParam }),
                getNextPageParam: lastPage => lastPage.data.nextPage,
            });
        };

        export const useGetGroup = (${namePascal}Id: string) => {
            return useQuery({
                queryKey: [QueryKeys.GET_${snakeCase.toUpperCase()}S, ${namePascal}Id],
                queryFn: ({ signal }) => get${nameCamel}(${namePascal}Id, signal),
            });
        };
    `.trim(),

    "hooks/put": (namePascal, nameCamel, _) =>
        `
        import { useMutation } from '@tanstack/react-query';
        import { IUpdate${nameCamel} } from "../types"
        import { QueryKeys } from 'shared/constants';
        import { queryClient } from 'shared/lib';

        import { update${nameCamel} } from '../api';

        export const useUpdate${nameCamel} = () => {

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
                    console.error(error));
                },
                mutationFn: ({${namePascal}Id, ...payload}: IUpdate${nameCamel} & {
                    ${namePascal}Id: string;
                }) => update${nameCamel}(${namePascal}Id, payload),
            });
        };
    `.trim(),

    "hooks/patch": (namePascal, nameCamel, _) =>
        `
        import { useMutation } from '@tanstack/react-query';

        import { QueryKeys } from 'shared/constants';
        import { queryClient } from 'shared/lib';

        import { toggle${nameCamel} } from '../api';

        export const useToggle${nameCamel} = () => {

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
                    console.error(error));
                },
                mutationFn: (${namePascal}Id: string) => toggle${nameCamel}(${namePascal}Id),
            });
        };
    `.trim(),

    "hooks/post": (_, nameCamel, _) =>
        `
        import { useMutation } from '@tanstack/react-query';
        import { ICreate${nameCamel} } from "../types"
        import { QueryKeys } from 'shared/constants';
        import { queryClient } from 'shared/lib';

        import { create${nameCamel} } from '../api';

        export const useCreate${nameCamel} = () => {

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
                    console.error(error));
                },
                mutationFn: (payload: ICreate${nameCamel}) => create${nameCamel}(payload),
            });
        };
    `.trim(),

    "hooks/delete": (namePascal, nameCamel, _) =>
        `
        import { useMutation } from '@tanstack/react-query';

        import { QueryKeys } from 'shared/constants';
        import { queryClient } from 'shared/lib';

        import { delete${nameCamel} } from '../api';

        export const useDelete${nameCamel} = () => {

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
                    console.error(error));
                },
                mutationFn: (${namePascal}Id: string) => delete${nameCamel}(${namePascal}Id),
            });
        };
    `.trim(),

    "hooks/index": () =>
        `
        export * from './get';
        export * from './post';
        export * from './put';
        export * from './patch';
        export * from './delete';
    `.trim(),

    "api/get": (namePascal, nameCamel, nameKebab) =>
        `
        import { api } from 'shared/lib';
        import { I${nameCamel}Response } from '../types';

        export const get${nameCamel} = async (
            ${namePascal}Id: string,
            signal?: AbortSignal,
        ): Promise<I${nameCamel}Response> => {
            const response = await api.get(\`/${nameKebab}s/\${${namePascal}Id}\`, {
                signal,
            });

            return response.data;
        };
    `.trim(),

    "api/put": (namePascal, nameCamel, nameKebab) =>
        `
        import { api } from 'shared/lib';
        import { I${nameCamel}Response } from '../types';

        export const update${nameCamel} = async (
            ${namePascal}Id: string,
            payload: IUpdate${nameCamel}
        ): Promise<I${nameCamel}Response> => {
            const response = await api.put(\`/${nameKebab}s/\${${namePascal}Id}\`, payload);

            return response.data;
        };
    `.trim(),

    "api/patch": (namePascal, nameCamel, nameKebab) =>
        `
        import { api } from 'shared/lib';
        import { I${nameCamel}Response } from '../types';

        export const toggle${nameCamel} = async (
            ${namePascal}Id: string,
        ): Promise<I${nameCamel}Response> => {
            const response = await api.patch(\`/${nameKebab}s/\${${namePascal}Id}\`);

            return response.data;
        };
    `.trim(),

    "api/post": (_, nameCamel, nameKebab) =>
        `
        import { api } from 'shared/lib';
        import { I${nameCamel}Response } from '../types';

        export const create${nameCamel} = async (
            payload: ICreate${nameCamel}
        ): Promise<I${nameCamel}Response> => {
            const response = await api.get("/${nameKebab}s", payload);

            return response.data;
        };
    `.trim(),

    "api/delete": (namePascal, nameCamel, nameKebab) =>
        `
        import { api } from 'shared/lib';
        import { I${nameCamel}Response } from '../types';

        export const delete${nameCamel} = async (
            ${namePascal}Id: string,
        ): Promise<I${nameCamel}Response> => {
            const response = await api.delete(\`/${nameKebab}s/\${${namePascal}Id}\`);

            return response.data;
        };
    `.trim(),

    "api/index": () =>
        `
        export * from './get';
        export * from './post';
        export * from './put';
        export * from './patch';
        export * from './delete';
    `.trim(),

    "types/params": () =>
        `
        export interface IGet${nameCamel}s {
            page: number;
            perPage: number;
        }
    `.trim(),

    "types/payloads": () =>
        `
        import { I${nameCamel} } from "./responses.ts"

        export interface ICreate${nameCamel} extends Required<Omit<I${nameCamel}, "id">> {}
        export interface IUpdate${nameCamel} extends Partial<Omit<I${nameCamel}, "id">> {}
    `.trim(),

    "types/responses": () =>
        `
        export interface I${nameCamel} {
            id: string;
            fullName: string;
        }

        export interface I${nameCamel}Response {
            message: string;
            data: I${nameCamel}
        }
    `.trim(),

    "types/index": () =>
        `
        export * from './params';
        export * from './payloads';
        export * from './responses';
    `.trim(),

    "index": () =>
        `
        export * from './api';
        export * from './hooks';
        export * from './types';
    `.trim(),
};
