import { NextResponse } from 'next/server';

import { getCurrentUser } from '@/lib/auth-user';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // 1. Get the currently logged-in user
    const user = await getCurrentUser();

    // 2. Read data sent by the client
    const body = await request.json();

    const bookingId = body.bookingId;
    const rating = Number(body.rating);
    const comment = typeof body.comment === 'string' ? body.comment.trim() : '';

    // 3. Validate bookingId
    if (typeof bookingId !== 'string' || !bookingId.trim()) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // 4. Validate rating
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // 5. Find the booking
    const booking = await prisma.booking.findFirst({
      where: {
        id: bookingId,
        customerId: user.id,
      },
      select: {
        id: true,
        providerId: true,
        status: true,
      },
    });

    if (!booking) {
      return NextResponse.json(
        {
          error: 'Booking not found or does not belong to you',
        },
        { status: 404 }
      );
    }

    // 6. Only completed bookings can be reviewed
    if (booking.status !== 'COMPLETED') {
      return NextResponse.json(
        {
          error: 'Only completed bookings can be reviewed',
        },
        { status: 409 }
      );
    }

    // 7. Check whether this booking already has a review
    const existingReview = await prisma.review.findUnique({
      where: {
        bookingId: booking.id,
      },
      select: {
        id: true,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        {
          error: 'A review has already been submitted for this booking',
        },
        { status: 409 }
      );
    }

    // 8. Create the review
    const review = await prisma.review.create({
      data: {
        bookingId: booking.id,
        customerId: user.id,
        providerId: booking.providerId,
        rating,
        comment: comment || null,
      },
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        review,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create review error:', error);

    return NextResponse.json(
      {
        error: 'Something went wrong',
      },
      { status: 500 }
    );
  }
}
