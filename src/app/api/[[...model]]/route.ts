import { StatusCodes } from "http-status-codes";
import { type NextRequest, NextResponse } from "next/server";
import { createApiHandler, modelRegistry } from "@/lib/api-handler";
import { createApiError } from "@/lib/api-schemas";

// Valid model names for Drizzle
const validModels = Object.keys(modelRegistry).map((key) => key.toLowerCase());

function isValidModelName(modelName: string): boolean {
	return validModels.includes(modelName.toLowerCase());
}

// GET /api/{model} - List items
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ model: string[] }> },
) {
	const { model } = await params;
	const modelName = model[0].toLowerCase();
	const id = model[1];

	if (!isValidModelName(modelName)) {
		return NextResponse.json(
			createApiError(
				"Invalid model",
				`Model '${modelName}' is not supported. Available models: users, departments, projects, roles`,
				"BAD_REQUEST",
			),
			{ status: StatusCodes.BAD_REQUEST },
		);
	}

	try {
		const handler = await createApiHandler(modelName);
		
		if (id) {
			return handler.GETById(request, id);
		}

		return handler.GET(request);
	} catch (error) {
		console.error('Error in GET handler:', error);
		return NextResponse.json(
			createApiError("Internal server error", "An unexpected error occurred", "INTERNAL_SERVER_ERROR"),
			{ status: StatusCodes.INTERNAL_SERVER_ERROR }
		);
	}
}

// POST /api/{model} - Create new item
export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ model: string[] }> },
) {
	const { model } = await params;
	const modelName = model[0].toLowerCase();

	if (!isValidModelName(modelName)) {
		return NextResponse.json(
			createApiError(
				"Invalid model",
				`Model '${modelName}' is not supported. Available models: users, departments, projects, roles`,
				"BAD_REQUEST",
			),
			{ status: StatusCodes.BAD_REQUEST },
		);
	}

	try {
		const handler = await createApiHandler(modelName);
		return handler.POST(request);
	} catch (error) {
		console.error('Error in POST handler:', error);
		return NextResponse.json(
			createApiError("Internal server error", "An unexpected error occurred", "INTERNAL_SERVER_ERROR"),
			{ status: StatusCodes.INTERNAL_SERVER_ERROR }
		);
	}
}

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ model: string[] }> },
) {
	const { model } = await params;
	const modelName = model[0].toLowerCase();
	const id = model[1];

	if (!isValidModelName(modelName)) {
		return NextResponse.json(
			createApiError(
				"Invalid model",
				`Model '${modelName}' is not supported. Available models: users, departments, projects, roles`,
				"BAD_REQUEST",
			),
			{ status: StatusCodes.BAD_REQUEST },
		);
	}

	try {
		const handler = await createApiHandler(modelName);
		return handler.PATCH(request, id);
	} catch (error) {
		console.error('Error in PATCH handler:', error);
		return NextResponse.json(
			createApiError("Internal server error", "An unexpected error occurred", "INTERNAL_SERVER_ERROR"),
			{ status: StatusCodes.INTERNAL_SERVER_ERROR }
		);
	}
}

export async function DELETE(
	request: NextRequest,
	{ params }: { params: Promise<{ model: string[] }> },
) {
	const { model } = await params;
	const modelName = model[0].toLowerCase();
	const id = model[1];

	if (!isValidModelName(modelName)) {
		return NextResponse.json(
			createApiError(
				"Invalid model",
				`Model '${modelName}' is not supported. Available models: users, departments, projects, roles`,
				"BAD_REQUEST",
			),
			{ status: StatusCodes.BAD_REQUEST },
		);
	}

	try {
		const handler = await createApiHandler(modelName);
		return handler.DELETE(request, id);
	} catch (error) {
		console.error('Error in DELETE handler:', error);
		return NextResponse.json(
			createApiError("Internal server error", "An unexpected error occurred", "INTERNAL_SERVER_ERROR"),
			{ status: StatusCodes.INTERNAL_SERVER_ERROR }
		);
	}
}
