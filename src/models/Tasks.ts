import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'Low' | 'Medium' | 'High';
  tags: string[];
  assignedTo: string;          
  comments: string[];          
  createdAt: Date;
}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  tags: { type: [String], default: [] },
  assignedTo: { type: String, default: "Unassigned" }, 
  comments: { type: [String], default: [] },           
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Task || mongoose.model<ITask>("Task", TaskSchema);