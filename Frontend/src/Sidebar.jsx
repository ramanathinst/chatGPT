import "./Sidebar.css"

function Sidebar () {
    return  (
       <section className="sidebar">
            <button>
                <img src="src/assets/blacklogo.png" alt="chat gtp logo" className="logo" />
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>


            <ul className="history">
                <li>History 1</li>
                <li>History 2</li>
                <li>History 3</li>
            </ul>
            <div className="sign">
                <p>By Ramaanathinst &hearts;</p>
            </div>
       </section>
    )
}

export default Sidebar;