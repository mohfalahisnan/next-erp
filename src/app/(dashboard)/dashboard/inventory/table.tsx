""use client"";

import { Suspense } from ""react"";
import {
	DynamicDataTable,
} from ""@/components/data-table/data-table"";
import { config } from ""./config"";

function TableDemo() {
	return (
			<div>
				<Suspense fallback={<div>Loading...</div>}>
					<DynamicDataTable {...config} />
				</Suspense>
			</div>
	);
}

export default TableDemo;
