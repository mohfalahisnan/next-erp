import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { FilterOptions } from "./data-table-filters";

// TODO: add multiple select
function SelectFilter({
	filter,
	value,
	onChange,
	clearFilter = false,
}: {
	filter: FilterOptions;
	value: string;
	onChange: (value: string) => void;
	clearFilter: boolean;
}) {
	const [open, setOpen] = useState(false);

	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="border-dashed">
					<PlusCircle />
					{filter.label} {value && ":"}
					{value && (
						<Badge className="capitalize" variant="secondary">
							{value}
						</Badge>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="start">
				{filter.values.map((item) => (
					<DropdownMenuCheckboxItem
						key={item.value}
						onClick={() => onChange(item.value)}
						checked={value === item.value}
					>
						{item.label}
					</DropdownMenuCheckboxItem>
				))}

				{clearFilter && (
					<>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => onChange("")}
							className="items-center justify-center bg-accent cursor-pointer"
						>
							Clear
						</DropdownMenuItem>
					</>
				)}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default SelectFilter;
