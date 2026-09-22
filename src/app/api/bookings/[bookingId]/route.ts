import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/auth-user';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ bookingId: string }>;
  }
) {
  try {
    const user = await getCurrentUser();

    const { bookingId } = await context.params;

    const result = await prisma.booking.updateMany({
      where: {
        id: bookingId,
        customerId: user.id,
        status: {
          in: ['PENDING', 'ACCEPTED'],
        },
      },
      data: {
        status: 'CANCELLED',
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        {
          error:
            'Booking not found, does not belong to you, or cannot be cancelled',
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      status: 'CANCELLED',
    });
  } catch (error) {
    console.error('Customer booking cancellation error:', error);

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
