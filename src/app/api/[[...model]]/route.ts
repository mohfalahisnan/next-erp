import { createApiError, createApiResponse } from '@/lib/api-schemas';
import db from '@/lib/db';
import {
	buildPopulateInclude,
	parsePopulateParams,
} from '@/lib/populate-utils';
import { NextResponse } from 'next/server';

export const GET = async (
	req: Request,
	{ params }: { params: Promise<{ model: string[] }> }
) => {
	const { model } = await params;
	const id = model[1];

	const url = new URL(req.url);
	const searchParams = url.searchParams;

	// Parse populate and depth parameters
	const { populate, depth } = parsePopulateParams(searchParams);

	console.log(
		`Model: ${model[0]}, ID: ${id || 'none'}, Populate: ${populate.join(
			','
		)}, Depth: ${depth}`
	);

	const modelName = model[0] as unknown as any;

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
		// Find all records
		data = await entity.findMany({
			...(Object.keys(include).length > 0 && { include }),
		});
	}

	const res = createApiResponse(data, 10, 1, 10, 'Success', 'OK');
	return NextResponse.json(res);
};

export const POST = async (
	req: Request,
	{ params }: { params: Promise<{ model: string[] }> }
) => {
	const { model } = await params;
	const modelName = model[0] as unknown as any;

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
			1,
			1,
			1,
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
	const { model } = await params;
	const modelName = model[0] as unknown as any;
	const id = model[1];

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
			1,
			1,
			1,
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
	const { model } = await params;
	const modelName = model[0] as unknown as any;
	const id = model[1];

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
			1,
			1,
			1,
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
	const { model } = await params;
	const modelName = model[0] as unknown as any;
	const id = model[1];

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
			0,
			1,
			0,
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
