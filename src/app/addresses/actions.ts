'use server';

import { getCurrentUser } from '@/lib/auth-user';
import { prisma } from '@/lib/prisma';

type CreateAddressInput = {
  label: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
};

export async function createAddress(input: CreateAddressInput) {
  const user = await getCurrentUser();

  const label = input.label.trim();
  const addressLine = input.addressLine.trim();
  const city = input.city.trim();
  const state = input.state.trim();
  const pincode = input.pincode.trim();

  if (!label || !addressLine || !city || !state || !pincode) {
    throw new Error('All address fields are required.');
  }

  if (!/^\d{6}$/.test(pincode)) {
    throw new Error('Pincode must be 6 digits.');
  }

  const address = await prisma.address.create({
    data: {
      userId: user.id,
      label,
      addressLine,
      city,
      state,
      pincode,
    },
  });

  return address;
}
