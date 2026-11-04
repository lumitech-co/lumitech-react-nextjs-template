export const templates = {
  'hooks/get': (namePascal, nameCamel, nameKebab, snakeCase) =>
    `
        import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

        import { QueryKeys } from 'shared/constants/query-keys';

        import { get${namePascal}, get${namePascal}s } from '../api/get';
        import { IGet${namePascal}sParams } from '../types/params';

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
                queryFn: ({ pageParam, signal }) => get${namePascal}s({ ...query, page: pageParam }, signal),
                getNextPageParam: lastPage => lastPage.data.nextPage,
            });
        };

        export const useGet${namePascal} = (${nameCamel}Id: string) => {
            return useQuery({
                queryKey: [QueryKeys.GET_${snakeCase.toUpperCase()}S, ${nameCamel}Id],
                queryFn: ({ signal }) => get${namePascal}(${nameCamel}Id, signal),
            });
        };
    `.trim(),

  'hooks/put': (namePascal, nameCamel, nameKebab, snakeCase) =>
    `
        import { useMutation, useQueryClient } from '@tanstack/react-query';
        import { IUpdate${namePascal} } from "../types/payloads"
        import { QueryKeys } from 'shared/constants/query-keys';

        import { update${namePascal} } from '../api/put';

        export const useUpdate${namePascal} = () => {
            const queryClient = useQueryClient();

            return useMutation({
                onSuccess: () =>
                    Promise.all([
                        queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_${snakeCase.toUpperCase()}S], }),
                        queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_INFINITE_${snakeCase.toUpperCase()}S], }),
                    ]),
                mutationFn: ({${nameCamel}Id, ...payload}: IUpdate${namePascal} & {
                    ${nameCamel}Id: string;
                }) => update${namePascal}(${nameCamel}Id, payload),
            });
        };
    `.trim(),

  'hooks/patch': (namePascal, nameCamel, nameKebab, snakeCase) =>
    `
        import { useMutation, useQueryClient } from '@tanstack/react-query';

        import { QueryKeys } from 'shared/constants/query-keys';

        import { toggle${namePascal} } from '../api/patch';

        export const useToggle${namePascal} = () => {
            const queryClient = useQueryClient();

            return useMutation({
                onSuccess: () =>
                    Promise.all([
                        queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_${snakeCase.toUpperCase()}S], }),
                        queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_INFINITE_${snakeCase.toUpperCase()}S], }),
                    ]),
                mutationFn: (${nameCamel}Id: string) => toggle${namePascal}(${nameCamel}Id),
            });
        };
    `.trim(),

  'hooks/post': (namePascal, nameCamel, nameKebab, snakeCase) =>
    `
        import { useMutation, useQueryClient } from '@tanstack/react-query';
        import { ICreate${namePascal} } from "../types/payloads"
        import { QueryKeys } from 'shared/constants/query-keys';

        import { create${namePascal} } from '../api/post';

        export const useCreate${namePascal} = () => {
            const queryClient = useQueryClient();

            return useMutation({
                onSuccess: () =>
                    Promise.all([
                        queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_${snakeCase.toUpperCase()}S], }),
                        queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_INFINITE_${snakeCase.toUpperCase()}S], }),
                    ]),
                mutationFn: (payload: ICreate${namePascal}) => create${namePascal}(payload),
            });
        };
    `.trim(),

  'hooks/delete': (namePascal, nameCamel, nameKebab, snakeCase) =>
    `
        import { useMutation, useQueryClient } from '@tanstack/react-query';

        import { QueryKeys } from 'shared/constants/query-keys';

        import { delete${namePascal} } from '../api/delete';

        export const useDelete${namePascal} = () => {
            const queryClient = useQueryClient();

            return useMutation({
                onSuccess: () =>
                    Promise.all([
                        queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_${snakeCase.toUpperCase()}S], }),
                        queryClient.invalidateQueries({ queryKey: [QueryKeys.GET_INFINITE_${snakeCase.toUpperCase()}S], }),
                    ]),
                mutationFn: (${nameCamel}Id: string) => delete${namePascal}(${nameCamel}Id),
            });
        };
    `.trim(),

  'api/get': (namePascal, nameCamel, nameKebab, snakeCase) =>
    `
        import { api } from 'shared/lib/axios';
        import { ${nameCamel}ResponseSchema, ${nameCamel}sResponseSchema, I${namePascal}Response, I${namePascal}sResponse } from '../types/responses';
        import { IGet${namePascal}sParams } from '../types/params';

        export const get${namePascal} = async (
            ${nameCamel}Id: string,
            signal?: AbortSignal,
        ): Promise<I${namePascal}Response> => {
            const response = await api.get(\`/${nameKebab}s/\${${nameCamel}Id}\`, {
                signal,
            });

            return ${nameCamel}ResponseSchema.parse(response.data);
        };

        export const get${namePascal}s = async (
            params: IGet${namePascal}sParams,
            signal?: AbortSignal,
        ): Promise<I${namePascal}sResponse> => {
            const response = await api.get("/${nameKebab}s", {
                signal,
                params,
            });

            return ${nameCamel}sResponseSchema.parse(response.data);
        };
    `.trim(),

  'api/put': (namePascal, nameCamel, nameKebab, snakeCase) =>
    `
        import { api } from 'shared/lib/axios';
        import { ${nameCamel}ResponseSchema, I${namePascal}Response } from '../types/responses';
        import { IUpdate${namePascal} } from '../types/payloads';

        export const update${namePascal} = async (
            ${nameCamel}Id: string,
            payload: IUpdate${namePascal}
        ): Promise<I${namePascal}Response> => {
            const response = await api.put(\`/${nameKebab}s/\${${nameCamel}Id}\`, payload);

            return ${nameCamel}ResponseSchema.parse(response.data);
        };
    `.trim(),

  'api/patch': (namePascal, nameCamel, nameKebab, snakeCase) =>
    `
        import { api } from 'shared/lib/axios';
        import { ${nameCamel}ResponseSchema, I${namePascal}Response } from '../types/responses';

        export const toggle${namePascal} = async (
            ${nameCamel}Id: string,
        ): Promise<I${namePascal}Response> => {
            const response = await api.patch(\`/${nameKebab}s/\${${nameCamel}Id}\`);

            return ${nameCamel}ResponseSchema.parse(response.data);
        };
    `.trim(),

  'api/post': (namePascal, nameCamel, nameKebab, snakeCase) =>
    `
        import { api } from 'shared/lib/axios';
        import { ${nameCamel}ResponseSchema, I${namePascal}Response } from '../types/responses';
        import { ICreate${namePascal} } from '../types/payloads';

        export const create${namePascal} = async (
            payload: ICreate${namePascal}
        ): Promise<I${namePascal}Response> => {
            const response = await api.post("/${nameKebab}s", payload);

            return ${nameCamel}ResponseSchema.parse(response.data);
        };
    `.trim(),

  'api/delete': (namePascal, nameCamel, nameKebab, snakeCase) =>
    `
        import { api } from 'shared/lib/axios';
        import { ${nameCamel}ResponseSchema, I${namePascal}Response } from '../types/responses';

        export const delete${namePascal} = async (
            ${nameCamel}Id: string,
        ): Promise<I${namePascal}Response> => {
            const response = await api.delete(\`/${nameKebab}s/\${${nameCamel}Id}\`);

            return ${nameCamel}ResponseSchema.parse(response.data);
        };
    `.trim(),

  'types/params': (namePascal, nameCamel, nameKebab, snakeCase) =>
    `
        export interface IGet${namePascal}sParams {
            page: number;
            perPage: number;
        }
    `.trim(),

  'types/payloads': (namePascal, nameCamel, nameKebab, snakeCase) =>
    `
        import { I${namePascal} } from "./responses"

        export type ICreate${namePascal} = Required<Omit<I${namePascal}, "id">>;
        export type IUpdate${namePascal} = Partial<Omit<I${namePascal}, "id">>;
    `.trim(),

  'types/responses': (namePascal, nameCamel, nameKebab, snakeCase) =>
    `
        import { z } from 'zod';

        export const ${nameCamel}Schema = z.object({
            id: z.string(),
            fullName: z.string(),
        });

        export const ${nameCamel}ResponseSchema = z.object({
            message: z.string(),
            data: ${nameCamel}Schema,
        });

        export const ${nameCamel}sResponseSchema = z.object({
            message: z.string(),
            data: z.object({
                totalPages: z.number(),
                perPage: z.number(),
                total: z.number(),
                nextPage: z.number().nullable(),
                prevPage: z.number().nullable(),
                ${nameCamel}s: z.array(${nameCamel}Schema),
            }),
        });

        export type I${namePascal} = z.infer<typeof ${nameCamel}Schema>;
        export type I${namePascal}Response = z.infer<typeof ${nameCamel}ResponseSchema>;
        export type I${namePascal}sResponse = z.infer<typeof ${nameCamel}sResponseSchema>;
    `.trim(),
};
