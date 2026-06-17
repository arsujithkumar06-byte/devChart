"use client";

import React from "react";

type TaskCardProps = {
    id: string;
    title: string;
    description: string;
    priority: string;
    completion: boolean;
    assignedTo?: string;
    comments?: string[];
};

const TaskCard = ({ id, title, description, priority, completion, assignedTo, comments = [] }: TaskCardProps) => {
    const bgClass =
        priority.toLowerCase() === "high"
            ? "bg-red-400"
            : priority.toLowerCase() === "medium"
            ? "bg-yellow-400"
            : "bg-green-400";

    // Core handler to dynamically shift task positions across your columns
    async function updateTaskStatus(newStatus: string) {
        try {
            // Fixed endpoint typo by changing /api/task/ to /api/tasks/
            const res = await fetch(`/api/tasks/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            
            if (res.ok) {
                window.location.reload(); // Instantly visually shifts columns
            }
        } catch (err) {
            console.error("Failed moving task column position:", err);
        }
    }

    return (
        <div className={`flex h-auto w-full self-start flex-col rounded-2xl border-2 border-black overflow-hidden shrink-0 ${bgClass}`}>
            {/* Card Header Title */}
            <div className="bg-black p-3 text-lg font-bold text-teal-200">
                <h2>{title}</h2>
            </div>

            <div className="p-3 flex flex-col gap-3">
                {/* Task Description Body */}
                <div className="rounded-xl border border-black bg-teal-200 p-3 text-sm break-words">
                    {description}
                </div>

                {/* Integration Feature Hub (Assignee + Comments Tracker) */}
                <div className="rounded-xl border border-black bg-black p-3 text-xs text-gray-300">
                    <div className="mb-2 text-teal-200 font-medium">
                        👤 Assignee: <span className="text-white font-semibold">{assignedTo || "Unassigned"}</span>
                    </div>

                    <hr className="border-gray-800 my-2" />

                    <div className="mb-2 text-teal-200 font-medium">
                        💬 Comments ({comments.length})
                    </div>
                    
                    {comments.length > 0 && (
                        <div className="bg-gray-900/90 p-2 rounded border border-gray-800 mb-2 max-h-24 overflow-y-auto space-y-1">
                            {comments.map((commentText, index) => (
                                <p key={index} className="text-[11px] text-gray-200 border-l border-teal-400 pl-1 break-words">
                                    {commentText}
                                </p>
                            ))}
                        </div>
                    )}

                    <input 
                        type="text" 
                        placeholder="Type a comment & press Enter..." 
                        onKeyDown={async (e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                                const inputField = e.currentTarget;
                                const noteValue = inputField.value.trim();
                                inputField.value = '';
                                
                                try {
                                    // Fixed endpoint typo here as well to use plural /api/tasks/
                                    const res = await fetch(`/api/tasks/${id}`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ comment: noteValue })
                                    });
                                    if (res.ok) window.location.reload();
                                } catch (err) {
                                    console.error(err);
                                }
                            }
                        }}
                        className="w-full p-2 bg-gray-950 text-gray-100 placeholder-gray-500 rounded border border-gray-700 text-[11px] focus:outline-none focus:border-teal-400"
                    />
                </div>

                {/* Restored Pipeline Controls Row */}
                <div className="flex justify-between items-center mt-1 pt-1 text-xs font-black text-black">
                    {/* Back Button logic */}
                    {completion ? (
                        <button 
                            type="button" 
                            onClick={() => updateTaskStatus('in-progress')}
                            className="hover:underline transition-all"
                        >
                            ← Back
                        </button>
                    ) : (
                        <button 
                            type="button" 
                            onClick={() => updateTaskStatus('todo')}
                            className="hover:underline transition-all opacity-80 hover:opacity-100"
                        >
                            ← Back
                        </button>
                    )}

                    {/* Advance / Finish Button logic */}
                    {!completion ? (
                        <div className="flex gap-3 ml-auto">
                            <button 
                                type="button" 
                                onClick={() => updateTaskStatus('in-progress')}
                                className="hover:underline transition-all"
                            >
                                Advance →
                            </button>
                            <button 
                                type="button" 
                                onClick={() => updateTaskStatus('done')}
                                className="bg-black text-white px-2.5 py-1 rounded-md text-[10px] hover:bg-gray-800 transition-colors"
                            >
                                Finish ✓
                            </button>
                        </div>
                    ) : (
                        <span className="text-emerald-950 text-[10px] uppercase font-mono ml-auto font-bold tracking-wider">
                            ✓ Task Completed
                        </span>
                    )}
                </div>

            </div>
        </div>
    );
};

export default TaskCard;