import React from 'react'

const FilterButtons = ({setItems, allItems, filterItem, categories, setUrl}) => {
    
    return (
        <div className='filter-btns'>
            <p>Filter</p>
            {
                categories.map((val, id) => {
                    return (
                        
                        <button className='clickable'
                        key={id} onClick={()=>{
                            filterItem(val);
                            console.log('Clicking filter button');
                            console.log(val);
                            setUrl(`${val}`);
                            }}>
                            {val}
                        </button>
                    )
                })
            }
            <button 
            className='clickable'
            onClick={() => setItems(allItems)}>
                All
            </button>     
        </div>
    )
}

export default FilterButtons