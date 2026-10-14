import React from 'react'
import './todolist.css';
function CmpPop() {
    return (
        <div className='pop'>
            <div>
                <h4>هل انت متاكد من حذف هذه المهمه</h4>
                <div style={{marginTop:'20px'}}>
                    <button>Close</button>
                    <button>Delete</button>
                </div>
            </div>
      </div>
    )
}

export default CmpPop
