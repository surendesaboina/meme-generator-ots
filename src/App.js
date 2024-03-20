import Navbar from "./components/navbar/Navbar";
import "./App.css";
import { useEffect, useState , lazy, Suspense} from "react";

import {Routes, Route} from "react-router-dom";


const Generate = lazy(()=>import("./components/generate/Generate.js"));
const MemeCard = lazy(()=>import("./components/memecard/MemeCard.js"));
const Pagination = lazy(()=>import("./components/pagination/Pagination.js"));

function App() {

  const [memes, setMemes] = useState();
  const [data, setData] = useState();
  const [currMemes, setCurrMemes] = useState();
  const [pages, setPages]= useState();
  const [currPage, setCurrPage]= useState(0);
  

  // ============= fetching memes ===========================

  const fetchMemes = () => {
    fetch("https://api.imgflip.com/get_memes").then((res) => {
      res.json().then((res) => {
        setData(res.data.memes);
      });
    });
  };

  useEffect(() => {
    fetchMemes();
  }, []);

  useEffect(() => {
    setMemes(data);
    if(data){
    setPages(Math.ceil(data.length/20))
    }

  }, [data]);
  useEffect(()=>{
    if(memes){
      setPages(Math.ceil(memes.length/20))
      }
  },[memes])

  useEffect(()=>{
    if(memes){
      setCurrPage(0)
    }
  },[pages])
// ========================================================


// ============== display current memes ===================

const displayCurrMemes=()=>{
  if(memes){
  setCurrMemes(memes.slice(currPage*20,currPage*20+20))
  }
};

useEffect(()=>{
  displayCurrMemes();
},[memes,currPage]);

// ========================================================

// ========== change page number ===================

const changePage=(n)=>{
  setCurrPage(n-1);
  
};
const prevPage=(n)=>{
  setCurrPage(n-1)
};
const nextPage=(n)=>{
  setCurrPage(n+1)
};

// ======================================================
//  ============== search memes =========================
const searchMemes = (searchValue)=>{
      if(searchValue!==""){
           setMemes(data.filter((c,i)=>{
            
           return(c.name.toLowerCase()===searchValue.toLowerCase() ||
             c.name.toLowerCase().startsWith(searchValue.toLowerCase()) ||
              c.name.toLowerCase().replaceAll(" ","").includes(searchValue.toLowerCase().replaceAll(" ",""))
             )
           }))
      }
     
}
var viewAllResult;
try {
  viewAllResult=memes.length!==data.length;
  
} catch (error) {
  
}
// ============== view all memes =====================
const viewAllMemes= ()=>{
  setMemes(data);
  
}

  return (
    <div className="App">

      
<Suspense>
<Routes>

  <Route exact path="/" element= {<>
  {/* ====== Navbar component ====== */}
      <Navbar searchMemes={searchMemes}/>

   {/* ======= Meme Card component */}
        <div className="container-fluid text-center memes-block">
          {!pages===0?<div className="select-meme-text">Tap on the meme template you want to select</div>:""}
          {pages===0?<div className="my-3 no-memes">No memes found</div>:""}
          {!viewAllResult?"":<div><button className="btn view-all-btn btn-sm my-3" onClick={viewAllMemes}>View all</button></div>}
      {currMemes?currMemes.map((c,i)=>{
        return(<MemeCard meme = {c} key={i}/>)
      }):""}

      
      </div>
      <Suspense fallback = {<div>Loading...</div>}>
      <Pagination pages = {pages} changePage={changePage} currPage={currPage} nextPage={nextPage} prevPage={prevPage}/>
      </Suspense>
      </>}/>

    {/* ====== Generate component ====== */}
 

<Route exact path="/generate" element={<Suspense fallback={<div>loading...</div>}><Generate/></Suspense>}/>

    
</Routes>
</Suspense>
    </div>
  );
}

export default App;