import connectDB from "@/lib/mongodb";
import Task from "@/models/Tasks";

// Handle moving cards between columns (To Do -> In Progress -> Done)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await request.json();
    const { status } = body;

    // Dynamically find the exact task by its ID and change its status column
    const updatedTask = await Task.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );

    if (!updatedTask) {
      return Response.json({ message: "Task not found" }, { status: 404 });
    }

    return Response.json(updatedTask, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Failed to update task status" },
      { status: 500 }
    );
  }
}