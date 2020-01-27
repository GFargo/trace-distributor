import React from 'react';

const TableFilter = (props) => {
  let options = props.data.map(props.getValue);
  options = options.filter((value, index, self) => {
      return self.indexOf(value) === index;
    }
  )
  let id = props.name + "-dropdown";
  if (props.active) {
    return(<button className="btn btn-secondary"  onClick={()=>{props.onDeactivate(props.name)}} type="button" id={id} >
          {props.displayName} x
      </button>);
  } else {
    return(
      <div className="dropdown">
        <button className="btn btn-primary dropdown-toggle" type="button" id={id} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          {props.displayName}
        </button>

        <div className="dropdown-menu" aria-labelledby={id}>
          {
            options.map((option) => {
              return(<a key={props.name + "-" + option} className="dropdown-item" onClick={()=>{props.onClick(props.name, option)}}>{option}</a>);
            })
          }
        </div>
      </div>
    );
  }
}

export default TableFilter;
