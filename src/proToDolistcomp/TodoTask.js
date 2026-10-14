import '@fortawesome/fontawesome-free/css/all.min.css';


import './todolist.css';
import { useState } from 'react';

function TodoTask({ Todoid, title, iscomplete, handelChangeChek, handeldelettask, handleOpenUpdate }) {
    
    let [active, setactive] = useState(iscomplete)
    return (
        <div className='task'>

            <div>
                <h4 style={{textDecoration:iscomplete?"line-through":'none'}}> { title}</h4>
            </div>

            <div>
                <button
                    className={active?'active' :''}
                
                    onClick={() => { 

                        setactive(!active)
                        handelChangeChek(Todoid);
                        
                        
                    }}>
                    
                    <i className="fa-solid fa-check"></i>
                </button>

                <button
                    onClick={() => handleOpenUpdate(Todoid)}
                >
                    <i className="fa-solid fa-pen-to-square"></i>
                </button>

                <button style={{ backgroundColor: 'red', color: 'white' }}
                
                    onClick={() => {
                        handeldelettask(Todoid);
                }}
                
                
                >
                    <i className="fa-solid fa-trash"></i>
                </button>
            </div>

        </div>
    );
}

export default TodoTask;