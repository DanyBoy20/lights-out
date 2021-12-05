import React, { Component } from 'react';
import './Cell.css';

/* COMPONENTE CELDA (UNA SOLA CELDA EN EL TABLERO) */
// SOLO CONTIENE DOS PROPIEDADES (NINGUN ESTADO)
// * Propiedad: flipCellsAroundMe (insertamos/creamos esa propiedad cuando insertamos/llamamos la celda en Board.js, )
// de esta manera en el Board.js: <Cell isList="valor" flipCellsAroundMe="valor" /> 
// * Propiedad: isLit (valor booleano) esta esta celda encendida (lit)?
// 
class Cell extends Component {
    constructor(props){
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }
    handleClick(){
        // llama al tablero para voltear las celdas al rededor de esta celda
        this.props.flipCellsAroundMe();
    }

    render() {
        let classes = "Cell" + (this.props.isLit ? " Cell-lit" : "");
    
        return (
            <td className={classes} onClick={this.handleClick} />
        )
    }
}

export default Cell;