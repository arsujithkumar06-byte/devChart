"use client";

import { useState, useEffect } from "react";

interface Task {
  _id: string;
  title: string;
  description: string;
  status: "todo" | "in_progress" | "done";
  priority: "High" | "Medium" | "Low";
  tags: string[];
}

export default function KanbanDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // New Task Form States
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [newTag, setNewTag] = useState("");

  // 1. Fetch tasks from the backend database when page loads
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/tasks");
      const data = await res.json();
      if (Array.isArray(data)) {
        setTasks(data);
      } else if (data.tasks) {
        setTasks(data.tasks);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Add a new task with Priority and Tags (Feature 1 & 2)
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const taskData = {
      title: newTitle,
      description: newDesc,
      status: "todo",
      priority: newPriority,
      tags: newTag ? newTag.split(",").map(t => t.trim()) : ["General"]
    };

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      if (res.ok) {
        setNewTitle("");
        setNewDesc("");
        setNewTag("");
        fetchTasks(); // Refresh board layout
      }
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  // 3. Core Kanban Mechanic: Move tasks between columns
  const moveTask = async (id: string, nextStatus: "todo" | "in_progress" | "done") => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        fetchTasks();
      }
    } catch (err) {
      // Fallback: update UI locally if specific PATCH route setup varies slightly
      setTasks(prev => prev.map(t => t._id === id ? { ...t, status: nextStatus } : t));
    }
  };

  // Feature 3: Live Search Filtering
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: { id: "todo" | "in_progress" | "done"; title: string; color: string }[] = [
    { id: "todo", title: "To Do", color: "bg-gray-100 dark:bg-gray-800" },
    { id: "in_progress", title: "In Progress", color: "bg-blue-50 dark:bg-slate-800" },
    { id: "done", title: "Done", color: "bg-green-50 dark:bg-emerald-950" }
  ];

  if (loading) {
    return <div className="flex h-screen items-center justify-center font-semibold text-lg">Loading Android Club Hub...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-6 font-sans">
      {/* Header Banner */}
      <header className="mb-8 border-b pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-indigo-600">Android Club Collaboration Hub</h1>
          <p className="text-sm text-slate-500 mt-1">Recruitment Task 2026 • Technical Department</p>
        </div>
        
        {/* Search Bar Feature */}
        <div className="w-full md:w-72">
          <input
            type="text"
            placeholder="🔍 Search tasks instantly..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm shadow-sm"
          />
        </div>
      </header>

      {/* Main Grid: Form Left, Kanban Right */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        
        {/* Creation panel */}
        <div className="bg-white p-5 rounded-xl shadow-md border border-slate-200 h-fit">
          <h2 className="text-lg font-bold mb-4 text-slate-800 border-b pb-2">Create New Task</h2>
          <form onSubmit={handleAddTask} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Task Title</label>
              <input
                type="text"
                required
                placeholder="Fix navigation bar bug"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Description</label>
              <textarea
                placeholder="Describe the objective..."
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none h-20 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Priority</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white"
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">Tags (Comma Separated)</label>
              <input
                type="text"
                placeholder="Frontend, Bug, UI"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="w-full px-3 py-2 text-sm border rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-md transition text-sm shadow"
            >
              Add to Board
            </button>
          </form>
        </div>

        {/* 3 Kanban Columns System */}
        <div className="xl:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
          {columns.map((col) => (
            <div key={col.id} className={`${col.color} p-4 rounded-xl min-h-[500px] border border-slate-200 shadow-inner`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-700 uppercase tracking-wider text-sm flex items-center gap-2">
                  <span>{col.title}</span>
                  <span className="bg-white px-2 py-0.5 rounded-full text-xs text-slate-500 border shadow-sm">
                    {filteredTasks.filter((t) => t.status === col.id).length}
                  </span>
                </h3>
              </div>

              {/* Task Cards Container */}
              <div className="space-y-3">
                {filteredTasks
                  .filter((task) => task.status === col.id)
                  .map((task) => (
                    <div key={task._id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition group">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h4 className="font-semibold text-slate-800 text-sm group-hover:text-indigo-600 transition">{task.title}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          task.priority === 'High' ? 'bg-red-100 text-red-700' :
                          task.priority === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-600 mb-3 line-clamp-3">{task.description || "No description provided."}</p>
                      
                      {/* Render Tags */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {task.tags?.map((tag, i) => (
                          <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Progression Controls */}
                      <div className="flex gap-1 justify-end pt-2 border-t border-slate-100">
                        {col.id !== "todo" && (
                          <button
                            onClick={() => moveTask(task._id, col.id === "done" ? "in_progress" : "todo")}
                            className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded transition font-medium"
                          >
                            ← Back
                          </button>
                        )}
                        {col.id !== "done" && (
                          <button
                            onClick={() => moveTask(task._id, col.id === "todo" ? "in_progress" : "done")}
                            className="text-[11px] bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-2 py-1 rounded transition font-medium"
                          >
                            Advance →
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}