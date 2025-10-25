import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// PUT update contact message (admin only)
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();

    const contact = await Contact.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );

    if (!contact) {
      return NextResponse.json(
        { success: false, error: 'Contact message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: contact });
  } catch (error) {
    console.error('Update contact error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update contact' },
      { status: 400 }
    );
  }
}

// DELETE contact message (admin only)
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const contact = await Contact.findByIdAndDelete(params.id);

    if (!contact) {
      return NextResponse.json(
        { success: false, error: 'Contact message not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: {} });
  } catch (error) {
    console.error('Delete contact error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete contact' },
      { status: 500 }
    );
  }
}
