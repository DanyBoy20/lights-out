import React, { Component } from 'react';
import Cell from './Cell';
import './Board.css';

/** 
 *
 * PROPS (Propiedades):
 *
 * - nrows: numero de filas del tablero
 * - ncols: numero de columnas en el tablero
 * - chanceLightStartsOn: float, posibilidad de que alguna celda se encienda al comienzo del juego
 *
 * State (Estados):
 *
 * - hasWon: boolean, verdadero cuando todo el tablero esta apagado
 * - board: arreglo de arreglos (array-of-arrays) de verdadero/falso
 *
 *    para este tablero:
 *       .  .  .
 *       O  O  .     (donde . es apagado, y O es encendido)
 *       .  .  .
 *
 *    Es decir (en arreglo seria): [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  Esto deberia renderizar una tabla HTML de componentes <Cell /> individuales.
 *
 *  Esto no gestiona los clicks --- los clicks estan sobre cada celda individual
 *
 **/

class Board extends Component {
    // establecemos las propiedades por defecto
    static defaultProps = {
        nrows: 5,
        ncols: 5,
        chanceLightStartsOn: 0.25
    }
    // establecemos el estado inicial
    constructor(props) {
        super(props);
        this.state= {
            hasWon: false,
            board: this.createBoard()
        }
    }

    /* CREAMOS EL TABLERO CON NFILAS (nrows) DE ALTO Y NCOLUMNAS (ncols) DE ANCHO*/
    /* CADA CELDA ESTARA ALEATORIAMENTE ENCENDIDA/APAGADA */
    createBoard(){
        let board = [];
        // Crear un arreglo de arreglos con valores true/false
        // necesitamos iterar por el numero de filas y columnas
        // en el ciclo anidade crearemos una fila lleandola de valores booleanos y cada fila la insertaremos en el tablero (board)

        // y=0, mientras 7 sea menor que el numero de fila de la propiedad nrows, incrementamos y
        for(let y=0; y < this.props.nrows; y++){
            let row = [];
            // iteramos sobre las columnas
            for(let x=0; x < this.props.ncols; x++){
                // decidiremos si algo esta encendido o apagado (true o false) y lo insertamos a la fila
                // Math.random nos da valores entre 0 y 0.99, por lo tanto:
                // si Math.random() < 0.25, entonces esta encendido, caso contrario sera apagado
                row.push(Math.random() < this.props.chanceLightStartsOn); // si es true, agregamos a "row" con push
            }
            // insertamos toda la fila que iteramos al tablero
            board.push(row);
        }
        // habiendo terminado de iterar sobre las filas, retornamos el tablero
        return board;
    }

    /* Gestionamos el cambio de celda: actualizamos el tablero y determinamos ganador */
    flipCellsAround(coord){
        // coord vienen en formato "y-x" (L102)
        /* console.log("FLIPPING", coord); */
        let {ncols, nrows} = this.props; // destructuramos (destructuring) las propiedes por defecto (olo ncols y nrows)
        let board = this.state.board; // asignamos el estado del tablero a una variable (tablero)
        // dividimos (split) las coordenadas (coord) las mapeamos (map), convertimos a numeros (map) y las asignamos a un arreglo [y,x]
        let [y, x] = coord.split("-").map(Number); 

        function flipCell(y, x){
            // si esta coordenada esta actualmente en el tablero, volteala, es decir
            // si x es mayor o igual que cero y menor que el numero de columnas (tambien verifica y >= 0 y sea menos al numero de filas)
            if(x >= 0 && x < ncols && y >= 0 && y < nrows){
                // cambia el valor de la celda (si esta true, cambia a false, y viceversa)
                board[y][x] = !board[y][x]; // con el operador ! , cambiamos al valor contrario
            }
        }

        // cambia esta celda y las celdas al rededor
        flipCell(y,x); // cambiamos el estado inicial de la celda
        flipCell(y, x - 1); // volteamos la celda a la izquierda
        flipCell(y, x + 1); // volteamos la celda a la derecha
        flipCell(y - 1, x); // volteamos la celda de abajo
        flipCell(y + 1, x); // volteamos la celda de arriba

        
        // determinamos si el juego a sido ganado
        //usamos every (array.every) para para evaluar cada celda que este apagada
        let hasWon = board.every(row => row.every(cell => !cell)); // si todas las celdas estan apagadas, entonces ganamos
        this.setState({board: board, hasWon: hasWon});
    }

    makeTable(){
        // creamos la tabla a renderizar con las celdas creadas en createBoard()
        let tblBoard = [];
        // iteramos sobre las filas
        for(let y = 0; y < this.props.nrows; y++){
            // aqui guardaremos las celdas de la fila actual
            let row = [];
            // iteramos sobre las columnas
            for(let x = 0; x < this.props.ncols; x++){
                let coord = `${y}-${x}`;
                // insertamos (push) un componente <Cell /> pasando la propiedad "board" (L43)
                // que fue la que constuyo el tablero con los bolleanos, agregando las coordenadas correspondientes de board
                row.push(
                    <Cell 
                        key={coord}
                        isLit={this.state.board[y][x]} 
                        flipCellsAroundMe={() => this.flipCellsAround(coord)}
                    />
                );
            }
            // agregamos la fila a la tabla
            tblBoard.push(<tr key={y}>{row}</tr>);
        }
        return (
            <table className='Board'>
              <tbody>{tblBoard}</tbody>
            </table>
          );
    }
    render(){        
        return (
            <div>
                {/* si el juego esta ganado, solo muestra un mensaje exitoso sin renderizar nada */}
              {this.state.hasWon ? (
                <div className='winner'>
                  <span className='neon-orange'>YOU</span>
                  <span className='neon-blue'>WIN!</span>
                </div>
              ) : (
                /* crear el tablero */
                <div>
                  <div className='Board-title'>
                    <div className='neon-orange'>Lights</div>
                    <div className='neon-blue'>Out</div>
                  </div>
                  {this.makeTable()}
                </div>
              )}
            </div>
          );
    }
}

export default Board;