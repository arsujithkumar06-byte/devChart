import connectDB from "@/lib/mongodb";
import Task from "@/models/Tasks";

export async function GET() {
  try {
    await connectDB();
    const tasks = await Task.find({}).sort({ createdAt: -1 });
    return Response.json(tasks, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Failed to fetch tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { title, description, priority, tags, assignedTo } = body;

    if (!title || !description) {
      return Response.json({ message: "Title and description are required" }, { status: 400 });
    }

    const newTask = await Task.create({
      title,
      description,
      priority: priority || "Medium",
      tags: tags ? tags.split(",").map((t: string) => t.trim()) : [],
      assignedTo: assignedTo || "Unassigned",
      comments: []
    });

    return Response.json(newTask, { status: 201 });
  } catch (error) {
    console.log(error);
    return Response.json({ message: "Failed to create task" }, { status: 500 });
  }
}