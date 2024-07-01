import { useEffect, useState } from "react";
import Task from "./Task";

function App() {
  const [tasks, setTasks] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    async function getTasks() {
      const response = await fetch('http://localhost:4000/api/tasks');
      const tasks = await response.json();
      setTasks(tasks);
    }

    getTasks();
  }, []);

  const createNewTask = async (event) => {
    event.preventDefault();
    if (content.length > 0) {
      const response = await fetch('http://localhost:4000/api/tasks', {
        method: 'POST',
        body: JSON.stringify({ task: content }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const newTask = await response.json();
      console.log(newTask);
      setContent('');
      setTasks([...tasks, newTask]);
    }
  }

  return (
    <main className="container">
      <h1 className="title">Tasks</h1>
      <form className="form" onSubmit={createNewTask}>
        <input
        type="text"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Enter new task"
        className="form_input"
        required/>
        <button className="form_button" type="submit">Create Task</button>
      </form>
      <div className="tasks">
        {tasks.map((task) => (
          <Task key={task._id} task={task} setTasks={setTasks} />
        ))}
      </div>
    </main>
  );
}

export default App;
