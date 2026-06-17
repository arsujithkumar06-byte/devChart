"use client";

import Navbar from "@/components/Navbar";
import TaskCard from "@/components/TaskCard";
import React, { useState, useEffect } from "react";

type Task = {
  _id: string;
  title: string;
  description: string;
  priority: string;
  completion: boolean;
  assignedTo?: string;
  comments?: string[];
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
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

  return (
    <>
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-4">
        {/* Visual Interactive Search & Filter Controls Container */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between mb-6 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
          {/* Real-time search box */}
          <input
            type="text"
            placeholder="🔍 Search task titles or descriptions instantly..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-80 p-2.5 bg-gray-950 text-gray-100 placeholder-gray-500 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500 text-sm"
          />

          {/* Clickable Priority Filtering Buttons */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {["All", "Low", "Medium", "High"].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setSelectedPriority(p)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-full border transition-all duration-200 ${
                  selectedPriority === p
                    ? "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-900/40 scale-105"
                    : "bg-gray-800/80 border-gray-700 text-gray-400 hover:text-white hover:border-gray-500"
                }`}
              >
                {p === "High" ? "🔴 High" : p === "Medium" ? "🟡 Medium" : p === "Low" ? "🟢 Low" : "📋 All Priorities"}
              </button>
            ))}
          </div>
        </div>

        {/* Rendered Kanban Card Row (Switched from tasks to filteredTasks loop) */}
        <div className="flex flex-wrap items-start gap-4">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <TaskCard
                key={task._id}
                id={task._id}
                title={task.title}
                description={task.description}
                priority={task.priority}
                completion={task.completion}
                assignedTo={task.assignedTo}
                comments={task.comments}
              />
            ))
          ) : (
            <p className="text-gray-500 text-sm mt-4 w-full text-center">No tasks match your filter criteria.</p>
          )}
        </div>
      </div>
    </>
  );
}