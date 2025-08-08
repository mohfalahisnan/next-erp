import { createApiError, createApiResponse } from '@/lib/api-schemas';
import db from '@/lib/db';
import {
	buildPopulateInclude,
	parsePopulateParams,
} from '@/lib/populate-utils';
import { NextResponse } from 'next/server';

const getModelName = async (params: Promise<{ model: string[] }>) => {
	const { model } = await params;
	const currentModel = model[0];
	const id = model[1];
	console.log('currentModel', currentModel);

	return {
		model: currentModel,
		id: id || undefined,
	};
};

export const GET = async (
	req: Request,
	{ params }: { params: Promise<{ model: string[] }> }
) => {
	const { model, id } = await getModelName(params);

	const url = new URL(req.url);
	const searchParams = url.searchParams;

	// Parse populate and depth parameters
	const { populate, depth } = parsePopulateParams(searchParams);

	// Parse pagination parameters
	const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
	const limit = Math.min(
		100,
		Math.max(1, parseInt(searchParams.get('limit') || '10', 10))
	);
	const skip = (page - 1) * limit;

	console.log(
		`Model: ${model}, ID: ${id || 'none'}, Populate: ${populate.join(
			','
		)}, Depth: ${depth}, Page: ${page}, Limit: ${limit}`
	);

	const modelName = model as unknown as any;

	if (!Object.keys(db).includes(modelName)) {
		return NextResponse.json(
			createApiError(
				'Invalid model name',
				'Invalid Model Name',
				'NOT_FOUND'
			)
		);
	}

	const entity = db[modelName] as any;

	// Build include object with validated fields and depth support
	const include = buildPopulateInclude(modelName, populate, depth);

	let data;
	let total = 0;

	if (id) {
		// Find single record by ID
		try {
			data = await entity.findUnique({
				where: { id },
				...(Object.keys(include).length > 0 && { include }),
			});

			if (!data) {
				return NextResponse.json(
					createApiError(
						'Record not found',
						'Record Not Found',
						'NOT_FOUND'
					)
				);
			}
			// For single record, return without pagination
			return NextResponse.json({
				success: true,
				data,
				message: 'Success',
				code: 200,
			});
		} catch (error) {
			console.error('Error finding record by ID:', error);
			return NextResponse.json(
				createApiError(
					'Invalid ID format or database error',
					'Bad Request',
					'BAD_REQUEST'
				)
			);
		}
	} else {
		// Find all records with pagination
		[data, total] = await Promise.all([
			entity.findMany({
				skip,
				take: limit,
				...(Object.keys(include).length > 0 && { include }),
			}),
			entity.count(),
		]);
	}

	const res = createApiResponse(data, total, page, limit, 'Success', 'OK');
	return NextResponse.json(res);
};

export const POST = async (
	req: Request,
	{ params }: { params: Promise<{ model: string[] }> }
) => {
	const { model } = await getModelName(params);
	const modelName = model as unknown as any;

	if (!Object.keys(db).includes(modelName)) {
		return NextResponse.json(
			createApiError(
				'Invalid model name',
				'Invalid Model Name',
				'NOT_FOUND'
			)
		);
	}

	try {
		const body = await req.json();
		const entity = db[modelName] as any;

		// Parse populate parameters for response
		const url = new URL(req.url);
		const { populate, depth } = parsePopulateParams(url.searchParams);
		const include = buildPopulateInclude(modelName, populate, depth);

		const data = await entity.create({
			data: body,
			...(Object.keys(include).length > 0 && { include }),
		});

		const res = createApiResponse(
			data,
			undefined,
			undefined,
			undefined,
			'Created successfully',
			'CREATED'
		);
		return NextResponse.json(res, { status: 201 });
	} catch (error: any) {
		console.error('Error creating record:', error);
		return NextResponse.json(
			createApiError(
				error.message || 'Failed to create record',
				'Bad Request',
				'BAD_REQUEST'
			),
			{ status: 400 }
		);
	}
};

export const PUT = async (
	req: Request,
	{ params }: { params: Promise<{ model: string[] }> }
) => {
	const { model, id } = await getModelName(params);
	const modelName = model as unknown as any;

	if (!id) {
		return NextResponse.json(
			createApiError(
				'ID is required for PUT request',
				'Bad Request',
				'BAD_REQUEST'
			),
			{ status: 400 }
		);
	}

	if (!Object.keys(db).includes(modelName)) {
		return NextResponse.json(
			createApiError(
				'Invalid model name',
				'Invalid Model Name',
				'NOT_FOUND'
			)
		);
	}

	try {
		const body = await req.json();
		const entity = db[modelName] as any;

		// Parse populate parameters for response
		const url = new URL(req.url);
		const { populate, depth } = parsePopulateParams(url.searchParams);
		const include = buildPopulateInclude(modelName, populate, depth);

		// Check if record exists
		const existingRecord = await entity.findUnique({ where: { id } });
		if (!existingRecord) {
			return NextResponse.json(
				createApiError(
					'Record not found',
					'Record Not Found',
					'NOT_FOUND'
				),
				{ status: 404 }
			);
		}

		const data = await entity.update({
			where: { id },
			data: body,
			...(Object.keys(include).length > 0 && { include }),
		});

		const res = createApiResponse(
			data,
			undefined,
			undefined,
			undefined,
			'Updated successfully',
			'OK'
		);
		return NextResponse.json(res);
	} catch (error: any) {
		console.error('Error updating record:', error);
		return NextResponse.json(
			createApiError(
				error.message || 'Failed to update record',
				'Bad Request',
				'BAD_REQUEST'
			),
			{ status: 400 }
		);
	}
};

export const PATCH = async (
	req: Request,
	{ params }: { params: Promise<{ model: string[] }> }
) => {
	const { model, id } = await getModelName(params);
	const modelName = model as unknown as any;

	if (!id) {
		return NextResponse.json(
			createApiError(
				'ID is required for PATCH request',
				'Bad Request',
				'BAD_REQUEST'
			),
			{ status: 400 }
		);
	}

	if (!Object.keys(db).includes(modelName)) {
		return NextResponse.json(
			createApiError(
				'Invalid model name',
				'Invalid Model Name',
				'NOT_FOUND'
			)
		);
	}

	try {
		const body = await req.json();
		const entity = db[modelName] as any;

		// Parse populate parameters for response
		const url = new URL(req.url);
		const { populate, depth } = parsePopulateParams(url.searchParams);
		const include = buildPopulateInclude(modelName, populate, depth);

		// Check if record exists
		const existingRecord = await entity.findUnique({ where: { id } });
		if (!existingRecord) {
			return NextResponse.json(
				createApiError(
					'Record not found',
					'Record Not Found',
					'NOT_FOUND'
				),
				{ status: 404 }
			);
		}

		const data = await entity.update({
			where: { id },
			data: body,
			...(Object.keys(include).length > 0 && { include }),
		});

		const res = createApiResponse(
			data,
			undefined,
			undefined,
			undefined,
			'Updated successfully',
			'OK'
		);
		return NextResponse.json(res);
	} catch (error: any) {
		console.error('Error patching record:', error);
		return NextResponse.json(
			createApiError(
				error.message || 'Failed to patch record',
				'Bad Request',
				'BAD_REQUEST'
			),
			{ status: 400 }
		);
	}
};

export const DELETE = async (
	_req: Request,
	{ params }: { params: Promise<{ model: string[] }> }
) => {
	const { model, id } = await getModelName(params);
	const modelName = model as unknown as any;

	if (!id) {
		return NextResponse.json(
			createApiError(
				'ID is required for DELETE request',
				'Bad Request',
				'BAD_REQUEST'
			),
			{ status: 400 }
		);
	}

	if (!Object.keys(db).includes(modelName)) {
		return NextResponse.json(
			createApiError(
				'Invalid model name',
				'Invalid Model Name',
				'NOT_FOUND'
			)
		);
	}

	try {
		const entity = db[modelName] as any;

		// Check if record exists
		const existingRecord = await entity.findUnique({ where: { id } });
		if (!existingRecord) {
			return NextResponse.json(
				createApiError(
					'Record not found',
					'Record Not Found',
					'NOT_FOUND'
				),
				{ status: 404 }
			);
		}

		await entity.delete({
			where: { id },
		});

		const res = createApiResponse(
			[],
			undefined,
			undefined,
			undefined,
			'Deleted successfully',
			'OK'
		);
		return NextResponse.json(res);
	} catch (error: any) {
		console.error('Error deleting record:', error);
		return NextResponse.json(
			createApiError(
				error.message || 'Failed to delete record',
				'Bad Request',
				'BAD_REQUEST'
			),
			{ status: 400 }
		);
	}
};
