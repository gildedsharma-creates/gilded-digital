import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { Appointment } from "@/models/Appointment";

// GET: Fetch booked slots for a given date (YYYY-MM-DD)
export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get("date");

    if (!dateParam) {
      const allAppointments = await Appointment.find({}).sort({ appointmentDate: 1 });
      return NextResponse.json({ success: true, data: allAppointments }, { status: 200 });
    }

    const startOfDay = new Date(`${dateParam}T00:00:00.000Z`);
    const endOfDay = new Date(`${dateParam}T23:59:59.999Z`);

    const existing = await Appointment.find({
      appointmentDate: { $gte: startOfDay, $lte: endOfDay },
      status: { $ne: "Cancelled" },
    }).select("timeSlot");

    const bookedSlots = existing.map((item) => item.timeSlot);
    return NextResponse.json({ success: true, bookedSlots }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: Create a new consultation appointment
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { clientName, clientEmail, clientPhone, serviceType, projectScope, appointmentDate, timeSlot, userId } = body;

    if (!clientName || !clientEmail || !clientPhone || !serviceType || !projectScope || !appointmentDate || !timeSlot) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const parsedDate = new Date(`${appointmentDate}T00:00:00.000Z`);
    const endOfDay = new Date(`${appointmentDate}T23:59:59.999Z`);

    // Prevent double-booking the exact same date & time slot
    const conflict = await Appointment.findOne({
      appointmentDate: { $gte: parsedDate, $lte: endOfDay },
      timeSlot,
      status: { $ne: "Cancelled" },
    });

    if (conflict) {
      return NextResponse.json(
        { success: false, error: "This time slot was just booked. Please select another slot." },
        { status: 409 }
      );
    }

    const appointment = await Appointment.create({
      userId: userId || undefined,
      clientName,
      clientEmail,
      clientPhone,
      serviceType,
      projectScope,
      appointmentDate: parsedDate,
      timeSlot,
    });

    return NextResponse.json({ success: true, data: appointment }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}