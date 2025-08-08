import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export const GET = async () => {
	const user = await db.user.findMany({
		include: {
			managedDepartments: true,
			managedProjects: true,
			Warehouse: true,
		},
	});
	return NextResponse.json({
		message: 'Hello World',
		user,
	});
};
