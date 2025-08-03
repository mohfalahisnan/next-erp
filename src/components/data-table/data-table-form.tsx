"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DynamicSelect } from "@/components/select/dynamic-select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";
import type { FormConfig, FormFieldConfig } from "./data-table";
import { useDataTable } from "./data-table-context";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "./data-table-sheet";

interface DataTableFormProps<T> {
	mode: "create" | "edit";
	open: boolean;
	onClose: () => void;
	onSubmit: (data: Partial<T>) => Promise<void>;
}

export function DataTableForm<T>({
	mode,
	open,
	onClose,
	onSubmit,
}: DataTableFormProps<T>) {
	const { tableConfig, editingRow } = useDataTable<T>();

	// Generate form schema from form configuration
	const formSchema = React.useMemo(() => {
		const schemaFields: Record<string, z.ZodTypeAny> = {};

		// Use the new form.fields structure or fall back to legacy schema
		const formFields = tableConfig.form?.fields || [];

		formFields.forEach((field: FormFieldConfig) => {
			if (field.config && !field.config.hide) {
				const key = field.accessorKey;
				let fieldSchema: z.ZodTypeAny;

				switch (field.config.type) {
					case "email":
						fieldSchema = z.string().email("Invalid email address");
						break;
					case "number":
						fieldSchema = z.number();
						break;
					case "checkbox":
						fieldSchema = z.boolean();
						break;
					case "date":
						fieldSchema = z.string().refine((val) => {
							if (!val) return true; // Allow empty dates if not required
							const date = new Date(val);
							return !isNaN(date.getTime());
						}, "Invalid date format");
						break;
					case "select":
						if (field.config.options) {
							const values = field.config.options.map((opt: any) => opt.value);
							fieldSchema = z.enum(values as [string, ...string[]]);
						} else {
							fieldSchema = z.string();
						}
						break;
					case "dynamic-select":
						fieldSchema = z.string();
						break;
					default:
						fieldSchema = z.string();
				}

				// Apply validation rules from field.validation or field.config.validation
				const validation = field.validation || field.config.validation;
				if (validation) {
					if (validation.required) {
						if (fieldSchema instanceof z.ZodString) {
							fieldSchema = fieldSchema.min(1, "This field is required");
						} else if (fieldSchema instanceof z.ZodNumber) {
							fieldSchema = fieldSchema.min(0, "This field is required");
						}
					}
					if (validation.min && fieldSchema instanceof z.ZodString) {
						fieldSchema = fieldSchema.min(
							validation.min,
							`Minimum length is ${validation.min}`,
						);
					}
					if (validation.max && fieldSchema instanceof z.ZodString) {
						fieldSchema = fieldSchema.max(
							validation.max,
							`Maximum length is ${validation.max}`,
						);
					}
					if (validation.pattern && fieldSchema instanceof z.ZodString) {
						fieldSchema = fieldSchema.regex(
							validation.pattern,
							"Invalid format",
						);
					}
				}

				const isRequired =
					validation?.required || field.config.validation?.required;
				if (!isRequired) {
					fieldSchema = fieldSchema.optional();
				}

				schemaFields[key] = fieldSchema;
			}
		});

		return z.object(schemaFields);
	}, [tableConfig.form?.fields]);

	type FormData = z.infer<typeof formSchema>;

	const form = useForm<FormData>({
		defaultValues: {},
	});

	// Reset form when editingRow changes, mode changes, or dialog opens
	React.useEffect(() => {
		if (mode === "edit" && editingRow) {
			form.reset(editingRow as FormData);
		} else if (mode === "create") {
			// Always reset to empty object in create mode to clear any previous data
			form.reset({});
		}
	}, [mode, editingRow, form, open]);

	// Basic validation function
	const validateForm = (data: FormData) => {
		try {
			formSchema.parse(data);
			return true;
		} catch (error) {
			if (error instanceof z.ZodError) {
				error.issues.forEach((err) => {
					const field = err.path.join(".");
					form.setError(field as any, {
						type: "validation",
						message: err.message,
					});
				});
			}
			return false;
		}
	};

	const handleSubmit = async (data: FormData) => {
		if (!validateForm(data)) {
			return;
		}
		try {
			await onSubmit(data as Partial<T>);
			onClose();
			form.reset();
		} catch (error) {
			console.error("Form submission error:", error);
		}
	};

	const renderFormField = (field: FormFieldConfig) => {
		if (!field.config || field.config.hide) return null;

		const key = field.accessorKey;
		const formConfig = field.config;

		return (
			<FormField
				key={key}
				control={form.control}
				name={key as keyof FormData}
				render={({ field: formField }) => (
					<FormItem>
						<FormLabel className="capitalize">
							{formConfig.label || key}
						</FormLabel>
						<FormControl>
							{renderInputByType(formConfig, formField)}
						</FormControl>
						{formConfig.placeholder && (
							<FormDescription>{formConfig.placeholder}</FormDescription>
						)}
						<FormMessage />
					</FormItem>
				)}
			/>
		);
	};

	const renderInputByType = (formConfig: FormConfig, field: any) => {
		switch (formConfig.type) {
			case "textarea":
				return <Textarea placeholder={formConfig.placeholder} {...field} />;

			case "select":
				return (
					<Select onValueChange={field.onChange} value={field.value}>
						<SelectTrigger>
							<SelectValue placeholder={formConfig.placeholder} />
						</SelectTrigger>
						<SelectContent>
							{formConfig.options?.map((option) => (
								<SelectItem
									key={String(option.value)}
									value={String(option.value)}
								>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				);

			case "checkbox":
				return (
					<Checkbox checked={field.value} onCheckedChange={field.onChange} />
				);

			case "number":
				return (
					<Input
						type="number"
						placeholder={formConfig.placeholder}
						{...field}
						onChange={(e) => field.onChange(Number(e.target.value))}
					/>
				);

			case "date":
				return (
					<Popover>
						<PopoverTrigger asChild>
							<Button
								variant={"outline"}
								className={cn(
									"w-full justify-start text-left font-normal",
									!field.value && "text-muted-foreground",
								)}
							>
								<CalendarIcon className="mr-2 h-4 w-4" />
								{field.value ? (
									format(new Date(field.value), "PPP")
								) : (
									<span>{formConfig.placeholder || "Pick a date"}</span>
								)}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0">
							<Calendar
								mode="single"
								captionLayout="dropdown"
								selected={field.value ? new Date(field.value) : undefined}
								onSelect={(date) => field.onChange(date?.toISOString())}
								disabled={(date) =>
									date > new Date() || date < new Date("1900-01-01")
								}
								initialFocus
							/>
						</PopoverContent>
					</Popover>
				);

			case "dynamic-select":
				// Check if formConfig has the required dynamic select properties
				if (
					"model" in formConfig &&
					"valueKey" in formConfig &&
					"labelKey" in formConfig
				) {
					return (
						<DynamicSelect
							model={formConfig.model}
							placeholder={"Select an option..."}
							label={formConfig.label || ""}
							indexKey={formConfig.valueKey}
							indexValue={formConfig.labelKey}
							value={field.value}
							onChange={field.onChange}
							disabled={false}
						/>
					);
				}
				// Fallback to text input if configuration is incomplete
				return (
					<Input type="text" placeholder={"Select an option..."} {...field} />
				);

			default:
				return (
					<Input
						type={formConfig.type || "text"}
						placeholder={formConfig.placeholder}
						{...field}
					/>
				);
		}
	};

	return (
		<Sheet open={open} onOpenChange={onClose}>
			<SheetContent className="sm:max-w-[540px] overflow-y-auto">
				<ScrollArea className="h-[calc(100vh-38px)]">
					<SheetHeader>
						<SheetTitle>
							{mode === "create" ? "Create New Record" : "Edit Record"}
						</SheetTitle>
						<SheetDescription>
							{mode === "create"
								? "Fill in the details to create a new record."
								: "Update the details for this record."}
						</SheetDescription>
					</SheetHeader>

					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="space-y-4"
						>
							<div className="grid gap-4 p-4">
								{(tableConfig.form?.fields || []).map((field) => {
									return renderFormField(field);
								})}
							</div>

							<SheetFooter>
								<Button type="button" variant="outline" onClick={onClose}>
									Cancel
								</Button>
								<Button type="submit" disabled={form.formState.isSubmitting}>
									{form.formState.isSubmitting
										? "Saving..."
										: mode === "create"
											? "Create"
											: "Update"}
								</Button>
							</SheetFooter>
						</form>
					</Form>
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
}

// View dialog for displaying record details
interface DataTableViewDialogProps<T> {
	open: boolean;
	onClose: () => void;
	item: T | null;
	columns?: Array<{
		accessorKey: string;
		headerLabel?: string;
		cellType?: string;
		detailsOnly?: boolean;
	}>;
}

export function DataTableViewDialog<T>({
	open,
	onClose,
	item,
	columns = [],
}: DataTableViewDialogProps<T>) {
	if (!item) {
		return (
			<Sheet open={open} onOpenChange={onClose}>
				<SheetContent>
					<SheetHeader>
						<SheetTitle>View Details</SheetTitle>
						<SheetDescription>No item selected for viewing.</SheetDescription>
					</SheetHeader>

					<div className="flex items-center justify-center h-[calc(100vh-200px)] mt-6">
						<div className="text-center text-muted-foreground">
							<p className="text-lg font-medium mb-2">No Item Selected</p>
							<p className="text-sm">
								Please select an item to view its details.
							</p>
						</div>
					</div>

					<SheetFooter className="mt-6">
						<Button type="button" variant="outline" onClick={onClose}>
							Close
						</Button>
					</SheetFooter>
				</SheetContent>
			</Sheet>
		);
	}

	const renderValue = (value: any, cellType?: string) => {
		if (value === null || value === undefined) return "—";

		switch (cellType) {
			case "date":
				return new Date(value).toLocaleDateString();
			case "currency":
				return typeof value === "number"
					? value.toLocaleString("id-ID", {
							style: "currency",
							currency: "IDR",
						})
					: value;
			case "status":
				return (
					<span
						className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
							value === "active"
								? "bg-green-100 text-green-800"
								: value === "inactive"
									? "bg-red-100 text-red-800"
									: "bg-gray-100 text-gray-800"
						}`}
					>
						{String(value)}
					</span>
				);
			default:
				return String(value);
		}
	};

	const getDisplayColumns = () => {
		if (columns.length > 0) {
			// Show all columns in view dialog (including detailsOnly columns)
			// but exclude actions and select columns
			return columns.filter(
				(col) => col.accessorKey !== "actions" && col.accessorKey !== "select",
			);
		}

		// If no columns provided, show all item properties
		return Object.keys(item as Record<string, any>)
			.filter((key) => key !== "id")
			.map((key) => ({
				accessorKey: key,
				headerLabel:
					key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"),
			}));
	};

	return (
		<Sheet open={open} onOpenChange={onClose}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>View Details</SheetTitle>
					<SheetDescription>
						Detailed information about this record.
					</SheetDescription>
				</SheetHeader>

				<ScrollArea className="h-[calc(100vh-200px)] mt-6">
					<div className="space-y-4 p-4">
						{getDisplayColumns().map((column: any) => {
							const value = (item as any)[column.accessorKey];
							return (
								<div
									key={column.accessorKey}
									className="grid grid-cols-3 gap-4 py-2 border-b"
								>
									<div className="font-medium text-sm text-muted-foreground capitalize">
										{column.headerLabel || column.accessorKey}
									</div>
									<div className="col-span-2 text-sm">
										{renderValue(value, column.cellType)}
									</div>
								</div>
							);
						})}
					</div>
				</ScrollArea>

				<SheetFooter className="mt-6">
					<Button type="button" variant="outline" onClick={onClose}>
						Close
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}

// Delete confirmation dialog
interface DataTableDeleteDialogProps<T> {
	open: boolean;
	onClose: () => void;
	item: T | null;
	onConfirm: () => Promise<void>;
}

export function DataTableDeleteDialog<T>({
	open,
	onClose,
	onConfirm,
}: DataTableDeleteDialogProps<T>) {
	const [isDeleting, setIsDeleting] = React.useState(false);

	const handleConfirm = async () => {
		setIsDeleting(true);
		try {
			await onConfirm();
			onClose();
		} catch (error) {
			console.error("Delete error:", error);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<Sheet open={open} onOpenChange={onClose}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Confirm Deletion</SheetTitle>
					<SheetDescription>
						Are you sure you want to delete this record? This action cannot be
						undone.
					</SheetDescription>
				</SheetHeader>

				<SheetFooter className="mt-6">
					<Button type="button" variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button
						type="button"
						variant="destructive"
						onClick={handleConfirm}
						disabled={isDeleting}
					>
						{isDeleting ? "Deleting..." : "Delete"}
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
