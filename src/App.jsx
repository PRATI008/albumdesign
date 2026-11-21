import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Home from './Pages/Home'
import Album from './Pages/Album'
import Contact from './Pages/Contact'
import Signup from './Pages/Signup'
import Login from './Pages/Login'
import Training from './Pages/Training'
import Service from './Pages/Service'
import Enquiry from './Pages/Enquiry'


const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/album' element={<Album/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/signup' element={<Signup/>}/>
          <Route path='/training' element={<Training/>}/>
          <Route path='/service' element={<Service/>}/>
          <Route path='/enquiry' element={<Enquiry/>}/>


        </Routes>
      </Router>
    </>
  )
}

export default App