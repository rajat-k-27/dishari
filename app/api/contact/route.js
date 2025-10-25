import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { contactSchema } from '@/lib/validations';
import { sendContactConfirmation } from '@/lib/email';

// GET all contact messages (admin only)
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = {};
    if (status) {
      query.status = status;
    }

    const contacts = await Contact.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: contacts });
  } catch (error) {
    console.error('Get contacts error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}

// POST create contact message
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();

    // Validate request body
    const validatedData = contactSchema.parse(body);

    const contact = await Contact.create(validatedData);

    // Send confirmation email (don't wait for it)
    sendContactConfirmation(validatedData).catch((err) =>
      console.error('Email confirmation failed:', err)
    );

    return NextResponse.json(
      { success: true, data: contact },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create contact error:', error);

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { success: false, error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit contact form' },
      { status: 400 }
    );
  }
}
