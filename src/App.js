import './App.css';
import { useEffect, useState } from 'react';
import video from './food.mp4';
import MyNutritionAnalysisComponents from './MyNutritionAnalysisComponent';
import { LoaderPage } from './LoaderPage';
import image from './Icon.png';
import Swal from 'sweetalert2'




function App() {

  const MY_ID = '5b63cfb1';
  const MY_KEY = '0c9bef4c379b3466ae48e5c89d873438';

  const [mySearch, setMySearch] = useState();
  const [myAnalysis, setMyAnalysis] = useState();
  const [wordSubmitted, setWordSubmitted] = useState('');
  const [stateLoader, setStateLoader] = useState(false);


  
    const getData = async (ingr) => {
      setStateLoader(true);

      const response = await fetch(`https://api.edamam.com/api/nutrition-details?app_id=${MY_ID}&app_key=${MY_KEY}`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ingr: ingr})
        })

        if(response.ok) {
          setStateLoader(false);
          const data = await response.json();
          setMyAnalysis(data);

        } 
        else {
          setStateLoader(false);
          Swal.fire({
            title: "What's wrong?",
            text: "You've entered the ingredients incorrectly. Please try again",
            icon: "question"
          });
        }
      }

      const myRecipeSearch = (e) => {
        setMySearch(e.target.value)
      }

      const finalSearch = (e) => {
        e.preventDefault()
        setWordSubmitted(mySearch)
      }

      useEffect(() =>{
        if (wordSubmitted !=='') {
          let ingr = wordSubmitted.split(/[,,;,\n,\r]/);
          getData(ingr);
        }
      }, [wordSubmitted])

      return (
          <div className='head'>
            {stateLoader && <LoaderPage />}
            <div className="container">
              <video autoPlay muted loop>
                <source src={video} type="video/mp4" />
              </video>
              <h1>Nutrition Analysis</h1>
            </div>

            <div className='pair'>
            <div className='container'>
              <form onSubmit={finalSearch}>
                <input className="search" onChange={myRecipeSearch} value={mySearch}/>
              </form>
            </div>


            <div className='container'>
              <button onClick={finalSearch}>
                <img className="icon" src={ image } alt="icon"/>
              </button>
            </div>
            </div>
            <div className='table'>
              {
                myAnalysis && <p className='par'><b>Total calories - </b> {myAnalysis.calories} kcal</p>
              }

              {
                myAnalysis && Object.values(myAnalysis.totalNutrients)
                .map(({ label, quantity, unit }) => 
                <MyNutritionAnalysisComponents
                label={label} 
                quantity={quantity} 
                unit={unit}/>
              )
            }
            
            </div>
          </div>
      );
    }


    export default App;
