import connectDB from "@/lib/mongodb";
import Task from "@/models/Tasks";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const body = await request.json();
    const { status, comment } = body; 

    const resolvedParams = await params;
    const taskId = resolvedParams.id;

    // If a comment is sent, append it to the task array
    if (comment) {
      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { $push: { comments: comment } }, 
        { new: true }
      );
      if (!updatedTask) return Response.json({ message: "Task not found" }, { status: 404 });
      return Response.json(updatedTask, { status: 200 });
    }

    // If a status update is sent (moving columns), handle it here
    let updateData: any = {};
    if (status) {
      updateData.status = status;
    }

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      updateData,
      { new: true }
    );

    if (!updatedTask) {
      return Response.json({ message: "Task not found" }, { status: 404 });
    }

    return Response.json(updatedTask, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Failed to modify task data" }, { status: 500 });
  }
}