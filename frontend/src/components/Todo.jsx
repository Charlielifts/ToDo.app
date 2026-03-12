import { useState, useEffect } from "react"
import axios from "axios"

const Todo = () => {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState("")

  useEffect(() => {
    fetchTodos()
  }, [])

  const fetchTodos = async () => {
    try {
      const res = await axios.get("https://todo-app-tbjl.onrender.com/todos")
      setTodos(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const addTodo = async () => {
    if (input.trim()) {
      try {
        const res = await axios.post("https://todo-app-tbjl.onrender.com/todos", {
          text: input
        })
        setTodos([res.data, ...todos])
        setInput("")
      } catch (err) {
        console.error(err)
      }
    }
  }

  return (
    <div className="min-h-screen flex items-start pt-10 sm:pt-16 md:pt-20 justify-center bg-gradient-to-r from-red-700 to-amber-400 p-4">
    
      <div className="bg-white shadow-lg rounded-[2vw] p-4 sm:p-8 md:p-12 lg:p-16 w-full max-w-2xl">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center cursor-default text-gray-900 mb-6">ToDo LIST<i className="fa-solid fa-bars-progress"></i></h1>
      
        <div className="flex items-center my-7 bg-gray-200 rounded-full">
            
            <input
            value={input}
            onChange={ (e) => setInput(e.target.value)}
            onKeyDown={(e) => {
            if (e.key === "Enter") addTodo()
            }}
            className='bg-transparent rounded-full outline-none flex-1 h-12 sm:h-14 pl-4 sm:pl-6 pr-2 placeholder:text-slate-600 font-semibold text-sm sm:text-base'
            type="text"
            placeholder='Add new task'/>
            
            <button onClick={addTodo}
             className='border-none rounded-full bg-amber-600 w-24 sm:w-28 md:w-32 h-12 sm:h-14 text-white text-sm sm:text-base md:text-lg
             font-medium cursor-pointer transform transition-transform duration-200 hover:scale-110'
             >ADD<i className="fa-solid fa-plus"></i>

            </button>
        </div>

        <ul className="">
            {
               todos.map((todo) => (
                    <li
                    key={todo["number of list"]}
                    className="flex items-center p-1 sm:p-2 md:p-3
                    rounded-full bg-slate-100 border-0 bg-transparent"
                     >
                        <input type="checkbox"
                        checked={todo.completed}
                        onChange={async () => {
                          await axios.put(`https://todo-app-tbjl.onrender.com/todos/${todo["number of list"]}`, {
                            completed: !todo.completed
                          })
                          fetchTodos()
                        }}
                        className="mr-2 sm:mr-2 h-4 sm:h-5 w-4 sm:w-5 text-gray-600 cursor-pointer"
                        />
                        <span
                            className={`flex-grow ${todo.completed ? "line-through text-gray-500" : "text-gray-800"} font-medium`}
                        >
                            {todo["todo list"]}
                        </span>

                        <button onClick={async () => { await axios.delete(`https://todo-app-tbjl.onrender.com/todos/${todo["number of list"]}`) 
                              fetchTodos()
                              }} className="cursor-pointer">
                             <div className="bg-transparent hover:opacity-75 text-black p-2 rounded-full transition-opacity duration-200">
                                <i className="fa-solid fa-delete-left text-3xl transform transition-transform duration-200 hover:scale-115"></i>
                             </div>

                        </button>
                        
                     </li>

                ))
            }
        </ul>
      </div>
    </div>
  )
}

export default Todo
