import {useState, useEffect} from 'react'
import Loader from 'react-loader-spinner'
import './App.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inprogress: 'INPROGRESS',
}

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

// Replace your code here
const App = () => {
  const [list, setList] = useState([])
  const [status, setStatus] = useState(apiStatusConstants.initial)
  const [drop, setDrop] = useState(categoriesList[0].id)

  const getQueryList = async () => {
    setStatus(apiStatusConstants.inprogress)
    try {
      const response = await fetch(
        `https://apis.ccbp.in/ps/projects?category=${drop}`,
      )
      const data = await response.json()
      const formattedData = data.projects.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        imageUrl: eachItem.image_url,
      }))
      setList(formattedData)
      setStatus(apiStatusConstants.success)
      console.log(formattedData)
    } catch (error) {
      setStatus(apiStatusConstants.failure)
    }
  }

  useEffect(() => {
    getQueryList()
  }, [drop])

  const renderSuccessView = () => (
    <div>
      <ul>
        {list.map(eachWeb => (
          <li key={eachWeb.name}>
            <img src={eachWeb.imageUrl} alt={eachWeb.name} />
            <p>{eachWeb.name}</p>
          </li>
        ))}
      </ul>
    </div>
  )

  const renderFailureView = () => (
    <div>
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" onClick={() => getQueryList()}>
        Retry
      </button>
    </div>
  )

  const renderInprogressView = () => (
    <div className="products-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  const renderList = () => {
    switch (status) {
      case 'SUCCESS':
        return renderSuccessView()
      case 'FAILURE':
        return renderFailureView()
      case 'INPROGRESS':
        return renderInprogressView()
      default:
        return null
    }
  }

  const setDropdown = e => {
    setDrop(e.target.value)
  }

  return (
    <>
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
          alt="website logo"
        />
      </div>
      <select onChange={setDropdown}>
        {categoriesList.map(eachListItem => (
          <option key={eachListItem.id} value={eachListItem.id}>
            {eachListItem.displayText}
          </option>
        ))}
      </select>
      <div>{renderList()}</div>
    </>
  )
}

export default App
