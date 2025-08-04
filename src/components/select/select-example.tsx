import { DynamicSelect } from "./dynamic-select";

export function SelectExample() {
	return (
		<div className="space-y-4">
			<DynamicSelect
				model="department"
				placeholder="Select a department"
				label="Department"
				indexKey="id"
				indexValue="name"
			/>
			<DynamicSelect
				model="project"
				placeholder="Select a project"
				label="Project"
				indexKey="id"
				indexValue="name"
			/>
		</div>
	);
}
