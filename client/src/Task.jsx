export default function Task({ task, setTasks }) {
  const toggleTaskStatus = async (task) => {
    const response = await fetch(`http://localhost:4000/api/tasks/${task._id}`, {
      method: 'PUT',
      body: JSON.stringify({ status: !task.status }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();
    if (result.acknowledged) {
      setTasks((tasks) => {
        return tasks.map((currentTask) => {
          if (currentTask._id === task._id) {
            return { ...currentTask, status: !currentTask.status }
          }
          return currentTask;
        })
      });
    }
  }

  const deleteTask = async (task) => {
    const response = await fetch(`http://localhost:4000/api/tasks/${task._id}`, {
      method: 'DELETE'
    });
    const result = await response.json();
    if (result.acknowledged) {
      setTasks((tasks) => {
        return tasks.filter(currentTask => currentTask._id !== task._id);
      });
    }
  }

  return (
    <div className="task">
      <p>
        {task.task}
      </p>
      <div className="mutations">
        <button
          className="task_status"
          onClick={() => toggleTaskStatus(task)}>
          {task.status ? '☑' : '☐'}
        </button>
        <button
          className="task_delete"
          onClick={() => deleteTask(task)}>
          🗑️
        </button>
      </div>
    </div>
  )
}
