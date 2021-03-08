import {useState, useEffect} from 'react'
import '../App.css';
import Modal from './Modal'
import axios from "axios";
import * as jQuery from 'jquery'

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

function Todo() {

    const [viewCompleted, setViewCompleted] = useState(false);
    // eslint-disable-next-line
    const [todoList, setTodoList] = useState([]);
    const [modal, setModal] = useState(false);
    const [activeItem, setActiveItem] = useState({
        title: "",
        description: "",
        completed: false,
    })
    // eslint-disable-next-line
    let csrfToken = getCookie('csrftoken')

    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            let cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = jQuery.trim(cookies[i]);
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    useEffect(() => {
        refreshList()
    }, [])

    function refreshList() {
        axios
            .get("/api/todos/", {
                headers: {
                    'X-CSRFToken': csrfToken
                }
            })
            .then((res) => setTodoList(res.data))
            .catch((err) => console.log(err));
    }

    function toggle() {
        setModal(!modal);
    }

    function handleSubmit(item) {
        toggle();

        if (item.id) {
            axios
                .put(`/api/todos/${item.id}/`, item)
                .then((res) => refreshList())
            return;
        }
        axios
            .post("/api/todos/", item)
            .then((res) => refreshList());
    }

    function handleDelete(item) {
        axios
            .delete(`/api/todos/${item.id}/`)
            .then((res) => refreshList());
    }

    function createItem() {
        const item = {title: "", description: "", completed: false};

        setActiveItem(item);
        setModal(!modal)
    };

    function editItem(item) {
        setActiveItem(item);
        setModal(!modal)
    };

    function displayCompleted(status) {
        if (status) {
            return setViewCompleted(true);
        }
        return setViewCompleted(false);
    }

    function renderTabList() {
        return (
            <div className="nav nav-tabs">
                <span
                    className={viewCompleted ? "nav-link" : "nav-link active"}
                    onClick={() => {
                        displayCompleted(true)
                    }}>
                    Complete
                </span>
                <span
                    className={viewCompleted ? "nav-link" : "nav-link active"}
                    onClick={() => displayCompleted(false)}>
                    Incomplete
                </span>
            </div>
        )
    }

    function renderItems() {
        const newItems = todoList.filter(
            (item) => item.completed === viewCompleted
        )
        return newItems.map((item) => (
            <li
                key={item.id}
                className="list-group-item d-flex justify-content-between align-items-center"
            >
        <span
            className={`todo-title mr-2 ${
                viewCompleted ? "completed-todo" : ""
            }`}
            title={item.description}
        >
          {item.title}
        </span>
                <span>
          <button
              className="btn btn-secondary mr-2"
              onClick={() => editItem(item)}
          >
            Edit
          </button>
          <button
              className="btn btn-danger"
              onClick={() => handleDelete(item)}
          >
            Delete
          </button>
        </span>
            </li>
        ));

    }

    return (
        <main className="container">
            <h1 className="text-white text-uppercase text-center my-4">Todo app</h1>
            <div className="row">
                <div className="col-md-6 col-sm-10 mx-auto p-0">
                    <div className="card p-3">
                        <div className="mb-4">
                            <button
                                className="btn btn-primary"
                                onClick={createItem}
                            >
                                Add task
                            </button>
                        </div>
                        {renderTabList()}
                        <ul className="list-group list-group-flush border-top-0">
                            {renderItems()}
                        </ul>
                    </div>
                </div>
            </div>
            {modal ? (
                <Modal
                    activeItem={activeItem}
                    toggle={toggle}
                    onSave={handleSubmit}
                />
            ) : null}
        </main>
    );
}

export default Todo;
