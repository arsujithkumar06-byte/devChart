import connectDB from "@/lib/mongodb";
import Task from "@/models/Tasks";

// 1. Fetch all tasks from the database
export async function GET() {
    try {
        await connectDB();
        const tasks = await Task.find().sort({ createdAt: -1 }); // Shows newest tasks first
        return Response.json(tasks);
    } catch (error) {
        console.log(error);
        return Response.json(
            { message: "Failed to fetch tasks" },
            { status: 500 }
        );
    }
}

// 2. Create a new task with all our custom fields
export async function POST(request: Request) {
    try {
        await connectDB();
        const body = await request.json();
        
        // Destructure fields clearly so MongoDB handles them perfectly
        const { title, description, status, priority, tags } = body;

        const task = await Task.create({
            title,
            description,
            status: status || "todo",
            priority: priority || "Medium",
            tags: tags || ["General"]
        });

        return Response.json(task, { status: 201 });
    } catch (error) {
        console.log(error);
        return Response.json(
            { message: "Failed to create task" },
            { status: 500 }
        );
    }
}