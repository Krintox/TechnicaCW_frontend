import { useState } from 'react'
import backgroundImage from '../assets/bckgrnd.png';
import Thank from './thank';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { upload } from '../utils/APIroutes';
import {toast,ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


export default function Crossword({info}){
  const navigate = useNavigate();
  //HANDLE KEY TRAERSING
    const handleKeyPress = (event, rowIndex, colIndex) => {
      let newRowIndex = rowIndex;
      let newColIndex = colIndex;
      switch (event.key) {
        case 'ArrowUp':
          newRowIndex--;
          break;
        case 'ArrowDown':
          newRowIndex ++;
          break;
        case 'ArrowLeft':
          newColIndex--;
          break;
        case 'ArrowRight':
          newColIndex++;
          break;
        default:
          return;
      }
      const key = `${newRowIndex}-${newColIndex}`;
      const nextInput = document.getElementById(`${key}`);
      if (nextInput) {
        nextInput.focus();
      }
  };
    

    const arr = info['arr'];
    const [grid, setGrid] = useState(info.grid);    
    
    const downstarting =info.downstarting;
    const downwords = info.downwords;
    const acrossstarting= info.acrossstarting;
    const acrosswords = info.acrosswords;

    const handleChange = (rowIndex, colIndex, e) => {
      const updatedGrid = [...grid];
      updatedGrid[rowIndex][colIndex] = e.target.value.toUpperCase();
      setGrid(updatedGrid);
    };
    const calculateMarks = async(e)=>{
      e.preventDefault();
      let ans = 0;
      for( let i = 0 ; i < downwords.length ; i++){
        let dsi = downstarting[i][0];
        let dsj = downstarting[i][1];
        let str = "";
        while( dsi < grid.length  &&  grid[dsi][dsj] != ''){
          str += grid[dsi][dsj];
          dsi++;
        }
        if(str == downwords[i]){ans++;}
      }
      for(let i = 0 ; i < acrosswords.length ; i++){
        let aci = acrossstarting[i][0];
        let acj = acrossstarting[i][1];
        let str2 = "";
        while( acj < grid[0].length  &&  grid[aci][acj] != ''){
          str2 += grid[aci][acj];
          acj++;
        }
        if(str2 === acrosswords[i]){ans++;}
      }
      setGrid(info.grid);
      const { name , teamname ,regno } = await JSON.parse(localStorage.getItem('user'));
      const data = await axios.post(upload , {
        name,
        teamname,
        regno,
        marks: ans,
      });
      const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      };
      if(data.data.status === false){
        toast.error(data.data.msg , toastOptions);
      }else{
        localStorage.removeItem('user');
        navigate('/thankyou');
      }
    };
    return (
      <>
      <Container>
        <div className="container">
      <div className='Questions'>
          <p>ACROSS<br/>
             {info.across} <br /> 
              DOWN <br />
             {info.down}<br /></p>
      </div>
      <form name='CROSSWORDRESULT' onSubmit={calculateMarks}  >
        <div className="crossword">
          {grid.map((row, rowIndex) => (
            <div className="row" key={rowIndex}>
              {row.map((cell, colIndex) => (
                arr[rowIndex][colIndex] === '-' ? (
                  <input
                    key={`${rowIndex}-${colIndex}`}
                    style={{ opacity: 0 }}
                    className="cell"
                  />
                ) : (
                  <input
                    key={`${rowIndex}-${colIndex}`}
                    maxLength="1"
                    value={isNaN(parseInt(arr[rowIndex][colIndex])) ? cell : arr[rowIndex][colIndex]}
                    disabled={!isNaN(parseInt(arr[rowIndex][colIndex]))}
                    onChange={(e) => handleChange(rowIndex, colIndex, e)}
                    onKeyDown={(e) => handleKeyPress(e, rowIndex, colIndex)}                      
                    className="cell"
                    id={`${rowIndex}-${colIndex}`}
                  />
                )
              ))}
            </div>
          ))}
        </div>
        <button onClick={calculateMarks}> Submit </button>
        </form>
        </div>
      </Container>
      <ToastContainer />
      </>
    )
    
}
const Container = styled.div`
margin : 0;
padding :0;
  height : 100vh;
  width : 100vw;
  background-image: url(${backgroundImage});
  background-size: cover;
  .container{
    display : flex;
    flex-direction: column;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    color : white;
  }
  .cell{
    width: 1rem;
    height: 1rem;
    font-size: 0.8rem;
    text-align: center;
  }
  .Questions{
    font-size : 1.2rem;
  }
  
`