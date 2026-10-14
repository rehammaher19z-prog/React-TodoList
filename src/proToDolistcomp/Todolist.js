
// ==================== Imports ====================

import './todolist.css';
import TodoTask from './TodoTask';

import { v4 as uuidv4 } from 'uuid';

import { useState, useEffect } from 'react';

// Material UI components used for Delete and Update dialogs
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";


function Todolist() {

    // useState stores the input value and the list of tasks.
    // React re-renders the component when their state changes.
    const [task, settask] = useState('');
    const [tasks, settaks] = useState([]);

    // Controls the Delete dialog and stores the selected task ID.
    const [open, setOpen] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(null);

    // Controls the Update dialog and stores the edited task title.
    const [openUpdate, setOpenUpdate] = useState(false);
    const [updatedTitle, setUpdatedTitle] = useState("");

    // useEffect loads saved tasks when the component first mounts.
    // The empty dependency array means this effect runs on mount.
    useEffect(() => {
        const tasksinStorage = JSON.parse(
            localStorage.getItem('Tasks') || '[]'
        );

        settaks(tasksinStorage);
    }, []);


    // ==================== Task Filtering ====================

    // Stores which category the user wants to display.
    const [filter, setFilter] = useState("all");

    // Creates a filtered list without changing the original tasks array.
    const filteredTasks = tasks.filter((task) => {
        if (filter === "completed") {
            return task.isComplete;
        }

        if (filter === "notcompleted") {
            return !task.isComplete;
        }

        return true;
    });


    // map() converts each task object into a TodoTask component.
    const ShowTasks = filteredTasks.map((task) => {
        return (
            <TodoTask
                key={task.id}
                Todoid={task.id}
                title={task.title}
                iscomplete={task.isComplete}
                handelChangeChek={handelChangeChek}
                handeldelettask={handeldelettask}
                handleOpenUpdate={handleOpenUpdate}
            />
        );
    });


    // ==================== Add Task ====================


function handelAddClick() {
    // Prevents adding an empty task or whitespace.
    if (task.trim() === '') {
        alert('Please, enter your task');
    } else {
        
        const newTask = {
            id: uuidv4(),
            title: task,
            isComplete: false
        };

        // Creates a new array containing the old tasks and the new task.
        const updatedTasks = [...tasks, newTask];

        // Updates the state.
        settaks(updatedTasks);

        // Saves the updated tasks in localStorage.
        localStorage.setItem('Tasks', JSON.stringify(updatedTasks));

        // Clears the input after adding the task.
        settask('');
    }
}



    // ==================== Mark Task Complete ====================

    function handelChangeChek(Todoid) {

        // Finds the task by ID and toggles its completion status.
        const updateTaskscomplete = tasks.map((t) => {
            if (t.id === Todoid) {
                return { ...t, isComplete: !t.isComplete };
            }

            return t;
        });

        settaks(updateTaskscomplete);

        // Keeps localStorage synchronized with the updated tasks.
        localStorage.setItem(
            'Tasks',
            JSON.stringify(updateTaskscomplete)
        );
    }


    // ==================== Delete Task ====================

    function handeldelettask(Todoid) {

        // Opens the confirmation dialog for the selected task.
        setSelectedTaskId(Todoid);
        setOpen(true);
    }

    function confirmDelete() {

        // filter() removes the task whose ID matches selectedTaskId.
        const deletedTasks = tasks.filter((t) => {
            return t.id !== selectedTaskId;
        });

        settaks(deletedTasks);

        localStorage.setItem(
            'Tasks',
            JSON.stringify(deletedTasks)
        );

        // Closes the dialog and clears the selected ID.
        setOpen(false);
        setSelectedTaskId(null);
    }


    // ==================== Update Task ====================

    function handleOpenUpdate(Todoid) {

        // Finds the task and puts its current title in the input.
        const selectedTask = tasks.find((t) => t.id === Todoid);

        if (!selectedTask) return;

        setSelectedTaskId(Todoid);
        setUpdatedTitle(selectedTask.title);
        setOpenUpdate(true);
    }

    function handleUpdate() {

        // Prevents saving an empty title.
        if (updatedTitle.trim() === "") return;

        // Updates only the selected task and preserves its other properties.
        const updatedTasks = tasks.map((t) => {
            if (t.id === selectedTaskId) {
                return {
                    ...t,
                    title: updatedTitle.trim()
                };
            }

            return t;
        });

        settaks(updatedTasks);

        localStorage.setItem(
            'Tasks',
            JSON.stringify(updatedTasks)
        );

        setOpenUpdate(false);
    }


    // ==================== JSX ====================

    return (
        <>
            {/* Delete confirmation dialog */}

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
            >
                <DialogTitle>
                    Delete task?
                </DialogTitle>

                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this task?
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpen(false)}>
                        CANCEL
                    </Button>

                    <Button
                        onClick={confirmDelete}
                        color="error"
                        variant="contained"
                    >
                        DELETE
                    </Button>
                </DialogActions>
            </Dialog>


            {/* Update task dialog */}

            <Dialog
                open={openUpdate}
                onClose={() => setOpenUpdate(false)}
                fullWidth
                maxWidth="sm"
                transitionDuration={{ enter: 250, exit: 180 }}
            >
                <DialogTitle>
                    Update task
                </DialogTitle>

                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Edit the title of your task below.
                    </DialogContentText>

                    <TextField
                        sx={{
                            "& .MuiInputBase-input": {
                                color: "black"
                            },
                            "& .MuiInputLabel-root": {
                                color: "gray"
                            },
                            "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: "gray"
                            }
                        }}
                        autoFocus
                        fullWidth
                        label="Task title"
                        value={updatedTitle}
                        onChange={(e) => setUpdatedTitle(e.target.value)}
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpenUpdate(false)}>
                        CANCEL
                    </Button>

                    <Button
                        onClick={handleUpdate}
                        variant="contained"
                        disabled={!updatedTitle.trim()}
                    >
                        UPDATE
                    </Button>
                </DialogActions>
            </Dialog>


            {/* Main Todo List container */}

            <div className="container">

                {/* Input and Add button */}

                <div
                    className="addinput"
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        margin: "10px",
                        paddingTop: "20px"
                    }}
                >
                    <input
                        placeholder="Enter your task"
                        value={task}
                        onChange={(e) => settask(e.target.value)}
                    />

                    <button onClick={handelAddClick}>
                        Add Task
                    </button>
                </div>


                {/* Filter buttons */}

                <div
                    style={{
                        marginBottom: "10px",
                        marginTop: "10px"
                    }}
                >
                    <button onClick={() => setFilter("all")}>
                        All Tasks
                    </button>

                    <button onClick={() => setFilter("completed")} >
                        Completed
                    </button>

                    <button
                        onClick={() => setFilter("notcompleted")}
                        style={{
                            backgroundColor: "pink",
                            color: "white"
                        }}
                    >
                        Not Completed
                    </button>
                </div>


                {/* Displays the tasks that match the selected filter */}

                <div className="tasks">
                    {ShowTasks}
                </div>

            </div>
        </>
    );
}

export default Todolist;
