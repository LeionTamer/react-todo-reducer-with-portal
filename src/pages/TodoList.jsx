import { useState, useReducer } from 'react'
import { v4 as uuidV4 } from 'uuid'
import { withModal } from "../components/with-modal"

const TODO_ACTIONS = {
  ADD: 'add',
  DONE: 'done',
  DELETE: 'delete',
  UPDATE: 'update'
}

const FormTest = (({ todoItem, close, dispatch }) => {
  const [editItem, setEditItem] = useState(todoItem.item)

  function handleUpdate() {
    dispatch({ type: TODO_ACTIONS.UPDATE, id: todoItem.id, item: editItem })
    close()
  }

  return (
    <>
      <div className="addItemContainer">
        <input style={{ width: '600px' }} type="text" value={editItem} onChange={(e) => setEditItem(e.target.value)} />
        <button onClick={handleUpdate} disabled={editItem === ''}>Update</button>
      </div>
    </>
  )
})

const TodoItem = ({ id, item, done, edit, dispatch }) => {
  function handleDelete() {
    dispatch({ type: TODO_ACTIONS.DELETE, id: id })
  }

  function handleToggle() {
    dispatch({ type: TODO_ACTIONS.DONE, id: id })
  }

  function handleEdit() {
    edit(id, item)
  }

  return (
    <>
      <div className="todoItem">
        <span className="done">
          <input type="checkbox" value={done} onClick={handleToggle} />
        </span>
        <span className="description" onClick={handleEdit}>{item}</span>
        <span className="delete" onClick={handleDelete}>Delete</span>
      </div>
    </>
  )
}

const TodoList = () => {
  const [todo, setTodo] = useState('')
  const [editTodo, setEditTodo] = useState({})
  const [open, setOpen] = useState(false)
  const [todoList, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case TODO_ACTIONS.ADD:
        return [
          ...state,
          {
            id: uuidV4(),
            item: action.todo,
            done: false
          }
        ]
      case TODO_ACTIONS.DONE:
        return state.map((todoItem) => {
          if (todoItem.id === action.id) {
            const toggle = !todoItem.done
            return { ...todoItem, done: toggle }
          } else {
            return todoItem
          }
        })
      case TODO_ACTIONS.UPDATE:
        return state.map((todoItem) => {
          if (todoItem.id === action.id) {
            return { ...todoItem, item: action.item }
          } else {
            return todoItem
          }
        })
      case TODO_ACTIONS.DELETE: {
        return state.filter(todoItem => todoItem.id !== action.id)
      }
      default:
        return state
    }
  }, [])

  function addTodo() {
    dispatch({ type: TODO_ACTIONS.ADD, todo: todo })
    setTodo('')
  }

  function editForm(id, item) {
    setEditTodo({ id: id, item: item })
    setOpen(true)
  }

  const ModalForm = withModal(FormTest)

  function closeForm() {
    setOpen(false)
  }

  return (
    <>
      <div className="addItemContainer">
        <input type="text" value={todo} onChange={e => setTodo(e.target.value)} />
        <button onClick={addTodo} disabled={todo === ''}>Add Todo</button>
      </div>

      <div>
        {todoList.map((todoItem) => (
          <TodoItem id={todoItem.id} item={todoItem.item} done={todoItem.done} key={todoItem.id} dispatch={dispatch} edit={editForm} />
        ))}
      </div>

      <ModalForm open={open} close={closeForm} todoItem={editTodo} dispatch={dispatch} />
    </>
  )
}

export default TodoList