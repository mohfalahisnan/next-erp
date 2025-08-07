import { createApiError, createApiResponse } from "@/lib/api-schemas";
import db from "@/lib/db";
import { buildPopulateInclude, parsePopulateParams } from "@/lib/populate-utils";
import { NextResponse } from "next/server";

export const GET = async (req: Request,{params}:{params:Promise<{model:string[]}>}) => {
	const {model} = await params;
	const id = model[1];

	const url = new URL(req.url);
	const searchParams = url.searchParams;
	
	// Parse populate and depth parameters
	const { populate, depth } = parsePopulateParams(searchParams);
	
	console.log(`Model: ${model[0]}, ID: ${id || 'none'}, Populate: ${populate.join(",")}, Depth: ${depth}`);
	
	const modelName = model[0] as unknown as any;

	if (!Object.keys(db).includes(modelName)) {
		return NextResponse.json(
			createApiError("Invalid model name","Invalid Model Name","NOT_FOUND"))
	}

	const entity = db[modelName] as any;

	// Build include object with validated fields and depth support
	const include = buildPopulateInclude(modelName, populate, depth);

	let data;
	
	if (id) {
		// Find single record by ID
		try {
			data = await entity.findUnique({
				where: { id },
				...(Object.keys(include).length > 0 && { include })
			});
			
			if (!data) {
				return NextResponse.json(
					createApiError("Record not found","Record Not Found","NOT_FOUND")
				);
			}
		} catch (error) {
			console.error('Error finding record by ID:', error);
			return NextResponse.json(
				createApiError("Invalid ID format or database error","Bad Request","BAD_REQUEST")
			);
		}
	} else {
		// Find all records
		data = await entity.findMany({
			...(Object.keys(include).length > 0 && { include })
		});
	}
	
	const res = createApiResponse(data,10,1,10,"Success","OK");
	return NextResponse.json(res);
};

