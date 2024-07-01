import express from "express";
import { getConnectedClient } from "./database.js";
import { ObjectId } from "mongodb";

const router = express.Router();

const getCollection = () => {
    const client = getConnectedClient();
    const collection = client.db('tasks-db').collection('tasks');
    return collection;
}

router.get('/tasks', async (request, response) => {
    const collection = getCollection();
    const tasks = await collection.find().toArray();
    return response.status(200).json(tasks);
});

router.post('/tasks', async (request, response) => {
    const collection = getCollection();
    const { task } = request.body;
    if (!task || task === '') {
        return response.status(400).json({ message: "Invalid task" });
    }

    const newTask = await collection.insertOne({ task: task, status: false });
    return response.status(201).json({ task: task, status: false, _id: newTask.insertedId });
});

router.put('/tasks/:id', async (request, response) => {
    const collection = getCollection();
    const id = new ObjectId(request.params.id);
    const { status } = request.body;
    if (status === undefined || typeof status !== 'boolean') {
        return response.status(400).json({ message: "Invalid status" });
    }
    const result = await collection.updateOne({ _id: id }, { $set: { status: status } });
    if (!result) {
        return response.status(404).json({ message: "Task not found" });
    }
    return response.status(200).json(result);
});

router.delete('/tasks/:id', async (request, response) => {
    const collection = getCollection();
    const id = new ObjectId(request.params.id);
    const result = await collection.deleteOne({ _id: id });
    if (!result) {
        return response.status(404).json({ message: "Task not found" });
    }
    return response.status(200).json(result);
});

export default router;
