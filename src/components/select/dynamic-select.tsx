"use client";
import { useQuery } from "@tanstack/react-query";
import type { FormProps } from "react-hook-form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";

interface DynamicSelect {
	model: string;
	query?: string;
	placeholder: string;
	label: string;
	indexKey: string;
	indexValue: string;
	className?: string;
	form?: FormProps<any>;
	value?: any;
	onChange?: (value: any) => void;
	disabled?: boolean;
}

export function DynamicSelect(props: DynamicSelect) {
	const data = useQuery({
		queryKey: ["dynamic-select", props.model],
		queryFn: async () => {
			const res = await api.get(`/${props.model}?${props.query || ""}`);
			return res.data;
		},
	});

	if (data.isLoading || data.isFetching) {
		return (
			<Select
				value={props.value?._id}
				disabled={props.disabled || data.isLoading}
				onValueChange={props.onChange}
			>
				<SelectTrigger className={cn("w-[200px] truncate", props.className)}>
					<SelectValue placeholder={props.placeholder} />
				</SelectTrigger>
			</Select>
		);
	}

	return (
		<Select
			value={props.value?._id}
			disabled={props.disabled || data.isLoading}
			onValueChange={props.onChange}
		>
			<SelectTrigger className={cn("w-[200px] truncate", props.className)}>
				<SelectValue placeholder={props.placeholder} />
			</SelectTrigger>
			<SelectContent>
				{data.isLoading || data.isFetching ? (
					<SelectItem value="loading">Loading...</SelectItem>
				) : data.isError ? (
					<SelectItem value="error">Error loading data</SelectItem>
				) : (
					data.data?.data?.map((item: any) => (
						<SelectItem key={item[props.indexKey]} value={item[props.indexKey]}>
							{item[props.indexValue]}
						</SelectItem>
					))
				)}
			</SelectContent>
		</Select>
	);
}
