import type { CellContext } from "@tanstack/react-table";
import {
	Clipboard,
	EyeIcon,
	MoreHorizontal,
	PencilIcon,
	TrashIcon,
} from "lucide-react";
import { Badge, type badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useDataTable } from "./data-table-context";

export function CellAction({
	row,
	className,
}: CellContext<any, any> & { className?: string }) {
	const item = row.original;
	const { openEditForm, openDeleteDialog, openViewDialog, tableConfig } =
		useDataTable();

	// Check permissions from table config
	const canEdit =
		tableConfig.actions?.edit !== false &&
		(typeof tableConfig.actions?.edit === "function"
			? tableConfig.actions.edit(item)
			: true);
	const canDelete =
		tableConfig.actions?.delete !== false &&
		(typeof tableConfig.actions?.delete === "function"
			? tableConfig.actions.delete(item)
			: true);
	const canView =
		tableConfig.actions?.view !== false &&
		(typeof tableConfig.actions?.view === "function"
			? tableConfig.actions.view(item)
			: true);
	const canCopyId = tableConfig.actions?.copyId !== false;

	// Get custom actions from table config
	const customActions = tableConfig.customActions || [];
	const visibleCustomActions = customActions.filter(
		(action) => !action.visible || action.visible(item),
	);

	return (
		<div className={cn("text-right", className)}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>
					{canCopyId && item.id && (
						<DropdownMenuItem
							onClick={() => navigator.clipboard.writeText(item.id)}
						>
							<Clipboard /> Copy ID
						</DropdownMenuItem>
					)}
					{(canView ||
						canEdit ||
						canDelete ||
						visibleCustomActions.length > 0) && <DropdownMenuSeparator />}
					{canView && (
						<DropdownMenuItem onClick={() => openViewDialog(item)}>
							<EyeIcon /> View
						</DropdownMenuItem>
					)}
					{canEdit && (
						<DropdownMenuItem onClick={() => openEditForm(item)}>
							<PencilIcon /> Edit
						</DropdownMenuItem>
					)}
					{canDelete && (
						<DropdownMenuItem
							variant="destructive"
							onClick={() => openDeleteDialog(item)}
						>
							<TrashIcon /> Delete
						</DropdownMenuItem>
					)}
					{visibleCustomActions.length > 0 && (
						<>
							<DropdownMenuSeparator />
							{visibleCustomActions.map((action, index) => (
								<DropdownMenuItem
									key={index}
									variant={action.variant || ("default" as any)}
									disabled={action.disabled ? action.disabled(item) : false}
									onClick={() => action.action(item)}
								>
									{action.icon} {action.label}
								</DropdownMenuItem>
							))}
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

export function CellCurrrency({
	className,
	getValue,
}: CellContext<any, any> & { className?: string }) {
	// Format the amount as Indonesian Rupiah
	const value = getValue();
	const currency = Number(value) || 0;
	const formattedCurrency = currency.toLocaleString("id-ID", {
		style: "currency",
		currency: "IDR",
	});
	return (
		<div className={cn("font-medium", className)}>{formattedCurrency}</div>
	);
}

export function CellStatus({
	row,
	className,
}: CellContext<any, any> & { className?: string }) {
	const status = row.getValue("status");

	return (
		<div className={cn("text-left capitalize font-medium", className)}>
			<Badge variant={status as any}>{status as string}</Badge>
		</div>
	);
}

export function CellSelect({ row }: CellContext<any, any>) {
	return (
		<Checkbox
			checked={row.getIsSelected()}
			onCheckedChange={(value) => row.toggleSelected(!!value)}
			aria-label="Select row"
		/>
	);
}

export function CellEmail({ row }: CellContext<any, any>) {
	return <div className="lowercase">{row.getValue("email")}</div>;
}

export function CellDate({ getValue }: CellContext<any, any>) {
	const dateValue = getValue();
	if (!dateValue) return "-";
	const date = new Date(dateValue as string);
	if (Number.isNaN(date.getTime())) return "-";
	return date.toLocaleDateString();
}

export const CellEnum = ({ getValue }: CellContext<any, any>) => {
	const value = getValue();

	if (!Array.isArray(value)) {
		return (
			<Badge
				variant={value.toString().toLowerCase() as keyof typeof badgeVariants}
				showIcon={true}
			>
				{value as string}
			</Badge>
		);
	}

	return (
		<div className="flex gap-1">
			{value.map((item, index) => (
				<Badge
					key={`${item}-${index}`}
					variant={item.toString().toLowerCase() as keyof typeof badgeVariants}
					showIcon={true}
				>
					{item as string}
				</Badge>
			))}
		</div>
	);
};

export const CellText = ({ getValue }: CellContext<any, any>) => {
	const value = getValue();
	return <div>{value}</div>;
};

export const CellBoolean = ({ getValue }: CellContext<any, any>) => {
	const value = getValue();
	return (
		<Badge
			variant={value ? "success" : "secondary"}
			showIcon={true}
		>
			{value as string}
		</Badge>
	);
};