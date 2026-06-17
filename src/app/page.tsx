"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import TaskCard from "@/components/TaskCard";

type Task = {
  _id: string;
  title: string;
  description: string;
  priority: string;
  status: 'todo' | 'in-progress' | 'done';
  assignedTo?: string;
  comments?: string[];
};

export default function IntegratedHome() {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  // Creation States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [assignedTo, setAssignedTo] = useState("Unassigned");

  // Filtering States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("All");

  async function fetchTasks() {
    const response = await fetch("/api/tasks");
    const data = await response.json();
    setTasks(data);
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !description) return;

    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, priority, assignedTo }),
    });

    if (response.ok) {
      setTitle("");
      setDescription("");
      setPriority("Medium");
      setAssignedTo("Unassigned");
      fetchTasks();
    }
  }

  // Live real-time filter logic
  const filteredTasks = tasks.filter((task) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      task.title.toLowerCase().includes(query) ||
      task.description.toLowerCase().includes(query);

    const matchesPriority =
      selectedPriority === "All" || 
      task.priority.toLowerCase() === selectedPriority.toLowerCase();

    return matchesSearch && matchesPriority;
  });

  const todoTasks = filteredTasks.filter(t => t.status === 'todo' || !t.status);
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in-progress');
  const doneTasks = filteredTasks.filter(t => t.status === 'done');

  return (
    <>
      <Navbar />
      <div className="max-w-[1600px] mx-auto p-4">
        
        {/* Top Feature: Interactive Filter & Search Controls */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-6 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          <input
            type="text"
            placeholder="🔍 Search tasks instantly..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-80 p-2 bg-gray-950 text-gray-100 placeholder-gray-500 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 text-sm"
          />
          <div className="flex flex-wrap gap-2">
            {["All", "Low", "Medium", "High"].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setSelectedPriority(p)}
                className={`px-4 py-1 text-xs font-semibold rounded-full border transition-all duration-200 ${
                  selectedPriority === p
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-gray-800/80 border-gray-700 text-gray-400 hover:text-white"
                }`}
              >
                {p === "All" ? "📋 All" : p}
              </button>
            ))}
          </div>
        </div>

        {/* Main Work Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          
          {/* Creation Sidebar Panel */}
          <div className="bg-gray-900/40 p-5 rounded-2xl border border-gray-800">
            <h3 className="text-lg font-bold text-white mb-4">Create New Task</h3>
            <form onSubmit={handleAddTask} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">TASK TITLE</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Fix navigation bar bug..."
                  className="w-full p-2 bg-gray-950 border border-gray-800 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">DESCRIPTION</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the objective..."
                  className="w-full p-2 bg-gray-950 border border-gray-800 rounded-lg text-sm text-white h-24 resize-none focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">PRIORITY</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full p-2 bg-gray-950 border border-gray-800 rounded-lg text-sm text-white focus:outline-none"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
              </div>
              
              {/* Feature 1: Dropdown Assignee Menu */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1">ASSIGN TASK TO</label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full p-2 bg-gray-950 border border-gray-800 rounded-lg text-sm text-white focus:outline-none"
                >
                  <option value="Unassigned">👤 Unassigned</option>
                  <option value="Sujith">Sujith A R</option>
                  <option value="Tanush">Tanush Sivakumar</option>
                  <option value="Siddharth">Siddharth Krishna</option>
                </select>
              </div>
              
              <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors mt-2">
                Add to Board
              </button>
            </form>
          </div>

          {/* Kanban Columns Displays */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* TO DO COLUMN */}
            <div className="bg-gray-900/20 p-4 rounded-2xl border border-gray-800/60 min-h-[500px]">
              <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                <span>To Do</span>
                <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{todoTasks.length}</span>
              </div>
              <div className="space-y-3">
                {todoTasks.map(task => (
                  <TaskCard key={task._id} id={task._id} title={task.title} description={task.description} priority={task.priority} completion={false} assignedTo={task.assignedTo} comments={task.comments} />
                ))}
              </div>
            </div>

            {/* IN PROGRESS COLUMN */}
            <div className="bg-gray-900/20 p-4 rounded-2xl border border-gray-800/60 min-h-[500px]">
              <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                <span>In Progress</span>
                <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{inProgressTasks.length}</span>
              </div>
              <div className="space-y-3">
                {inProgressTasks.map(task => (
                  <TaskCard key={task._id} id={task._id} title={task.title} description={task.description} priority={task.priority} completion={false} assignedTo={task.assignedTo} comments={task.comments} />
                ))}
              </div>
            </div>

            {/* DONE COLUMN */}
            <div className="bg-gray-900/20 p-4 rounded-2xl border border-gray-800/60 min-h-[500px]">
              <div className="flex items-center gap-2 mb-4 text-xs font-bold uppercase tracking-wider text-gray-400">
                <span>Done</span>
                <span className="bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full">{doneTasks.length}</span>
              </div>
              <div className="space-y-3">
                {doneTasks.map(task => (
                  <TaskCard key={task._id} id={task._id} title={task.title} description={task.description} priority={task.priority} completion={true} assignedTo={task.assignedTo} comments={task.comments} />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}