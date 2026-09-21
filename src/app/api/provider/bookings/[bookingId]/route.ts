import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/auth-user';
import { prisma } from '@/lib/prisma';

type BookingAction = 'ACCEPT' | 'REJECT';

export async function PATCH(
  request: Request,
  context: {
    params: Promise<{ bookingId: string }>;
  }
) {
  try {
    const user = await getCurrentUser();

    if (user.role !== 'PROVIDER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const provider = await prisma.provider.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (!provider) {
      return NextResponse.json(
        { error: 'Provider profile not found' },
        { status: 404 }
      );
    }

    const { bookingId } = await context.params;

    const body = await request.json();

    const action = body.action as BookingAction;

    if (action !== 'ACCEPT' && action !== 'REJECT') {
      return NextResponse.json(
        { error: 'Invalid booking action' },
        { status: 400 }
      );
    }

    const newStatus = action === 'ACCEPT' ? 'ACCEPTED' : 'REJECTED';

    const result = await prisma.booking.updateMany({
      where: {
        id: bookingId,
        providerId: provider.id,
        status: 'PENDING',
      },
      data: {
        status: newStatus,
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        {
          error:
            'Booking not found, does not belong to you, or is no longer pending',
        },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      status: newStatus,
    });
  } catch (error) {
    console.error('Provider booking action error:', error);

    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
