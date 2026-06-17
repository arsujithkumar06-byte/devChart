"use client";

import React from "react";

type TaskCardProps = {
    id: string;            // Passed down to look up the card for comments
    title: string;
    description: string;
    priority: string;
    completion: boolean;
    assignedTo?: string;   // Displays the person working on it
    comments?: string[];   // Array of saved feedback notes
};

const TaskCard = ({ id, title, description, priority, completion, assignedTo, comments = [] }: TaskCardProps) => {
    const bgClass =
        priority.toLowerCase() === "high"
            ? "bg-red-400"
            : priority.toLowerCase() === "medium"
            ? "bg-yellow-400"
            : "bg-green-400";

    return (
        <div className={`flex h-auto w-64 self-start flex-col rounded-2xl border-2 border-black overflow-hidden shrink-0 ${bgClass}`}>
            {/* Card Header Title */}
            <div className="bg-black p-3 text-xl font-bold text-teal-200">
                <h2>{title}</h2>
            </div>

            <div className="p-3 flex flex-col gap-3">
                {/* Task Description Body */}
                <div className="rounded-xl border border-black bg-teal-200 p-3 text-sm break-words">
                    {description}
                </div>

                {/* Collaboration Footer Hub */}
                <div className="rounded-xl border border-black bg-black p-3 text-xs text-gray-300">
                    {/* Feature 1: Assignee Tag */}
                    <div className="mb-2 text-teal-200 font-medium">
                        👤 Assignee: <span className="text-white font-semibold">{assignedTo || "Unassigned"}</span>
                    </div>

                    <hr className="border-gray-800 my-2" />

                    {/* Feature 2: Comments Log Feed */}
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

                    {/* Interactive Enter-Key Input Box */}
                    <input 
                        type="text" 
                        placeholder="Type a comment & press Enter..." 
                        onKeyDown={async (e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim() !== '') {
                                const inputField = e.currentTarget;
                                const noteValue = inputField.value.trim();
                                
                                // Clear input field visually right away
                                inputField.value = '';
                                
                                try {
                                    // Calls your update patch endpoint
                                    const res = await fetch(`/api/task/${id}`, {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ comment: noteValue })
                                    });
                                    
                                    if (res.ok) {
                                        window.location.reload(); // Refresh to see your new comment appear
                                    }
                                } catch (err) {
                                    console.error("Failed adding comment", err);
                                }
                            }
                        }}
                        className="w-full p-2 bg-gray-950 text-gray-100 placeholder-gray-500 rounded border border-gray-700 text-[11px] focus:outline-none focus:border-teal-400"
                    />
                </div>
            </div>
        </div>
    );
};

export default TaskCard;