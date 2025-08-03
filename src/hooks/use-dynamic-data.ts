"use client";

import { type QueryClientConfig, useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "@/lib/api-schemas";
import api from "@/lib/axios";

export type UseDynamicDataOptions<T = any> = {
	endpoint?: string;
	model?: string;
	params?: Record<string, string | number | boolean>;
	method?: "GET" | "POST" | "PUT" | "DELETE";
	headers?: Record<string, string>;
	body?: any;
	transformResponse?: (data: any) => T;
	queryKey?: unknown[];
	queryConfig?: QueryClientConfig;
} & ({ endpoint: string; model?: never } | { endpoint?: never; model: string });

export function useDynamicData<T = any>({
	model,
	params,
	method = "GET",
	headers,
	body,
	endpoint,
	transformResponse,
	queryKey = ["dynamic-data", model ?? endpoint, params],
	queryConfig,
}: UseDynamicDataOptions<T>) {
	return useQuery<ApiResponse<T>>({
		queryKey,
		queryFn: async () => {
			const url = endpoint ? `${endpoint}/${model ?? ""}` : `/${model}`;
			const config = {
				method,
				headers,
				params,
				data: body,
			};

			const res = await api.request({
				url,
				...config,
			});

			return transformResponse ? transformResponse(res.data) : res.data;
		},
		// Override staleTime for data table queries to ensure sorting/filtering works immediately
		staleTime: 0, // Always refetch when queryKey changes
		...queryConfig,
	});
}
