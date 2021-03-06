import { onNavigate } from './routers.js';
import { register, loginGoogle, accessJalo, deleteHistory, savePost, getHistoryEdit, updateHistory, activeUser, getData } from './firebase.js';
//Función para mandar llamar el id que se usa para el evento para ir de home a login.
const createNewUser = () => {
    let createUser = document.getElementById('newUser');
    createUser.addEventListener('click', (e) => {
        e.preventDefault();
        onNavigate('/login');
    });
};

window.addEventListener('DOMContentLoaded', () => createNewUser());


//Función para mandar llamar el id que se usa para el evento para ir de home a home-login.
const oldUser1 = () => {
    let enter = document.getElementById('oldUser');
    enter.addEventListener('click', (e) => {
        e.preventDefault();
        onNavigate('/home-login');
    });
};

window.addEventListener('DOMContentLoaded', () => oldUser1());


//login to wall
const buttonLogin = () => {
    let youLogin = document.getElementById('checkIn');
    youLogin.addEventListener('click', (e) => {
        //verificarPasswords()
        e.preventDefault();
        register();
    });
};

window.addEventListener('DOMContentLoaded', () => buttonLogin());


//Google to wall
const buttonGoogle = () => {
    let youLoginGoogle = document.getElementById('buttonGoogle');
    youLoginGoogle.addEventListener('click', (e) => {
        e.preventDefault();
        loginGoogle();
    });
};

window.addEventListener('DOMContentLoaded', () => buttonGoogle());


//SingIn with inputs
const buttonSingIn = () => {
    let singInWithInputs = document.getElementById('buttonLoginInputs');
    singInWithInputs.addEventListener('click', (e) => {
        e.preventDefault();
        accessJalo();
    });
};

window.addEventListener('DOMContentLoaded', () => buttonSingIn());


//the actions in inputs div wall.
const like = [];
let editStatus = false;
let id = '';
let buttonHistories = document.getElementsByClassName('save');
let formHistories = document.getElementById('task-formPublication');
const updatePost = document.querySelector('#history-container');
updatePost.addEventListener('click', async (e) => {
    if (e.target.classList.contains('save')) {
        e.preventDefault();
        const title = document.getElementById('task-InputNewPublication');
        const description = document.getElementById('task-contentPublication');
        console.log(buttonHistories);
        
        try {
            if (!title.value.trim() || !description.value.trim()) {
                alert('Escribe algo antes de publicar!');
            }
            if (!editStatus) {
                await savePost(title.value, description.value, like);
            }
             else {
                await updateHistory(id, {
                title: title.value,
                description: description.value,
                })
                console.log('Si estoy');
                editStatus = false;
                id = ''
                buttonHistories[0].innerText = 'Save';
            }

            formHistories.reset();
            title.focus();
        } catch (error) {
            console.log(error);
            }
        };
});
//put all the histories and delete
let printCards = document.querySelector('#tasks-container');
printCards.addEventListener('click', async (e) => {
    if ( e.target.classList.contains('deletePublication')) {
       console.log('si puedo borrar')
       if (confirm('¿Estas segurx que quieres eliminar la reseña de viaje?')) {
            // Save it!
            console.log('La historia se ha borrado');
            console.log(e.target.dataset.id);
            await deleteHistory(e.target.dataset.id);
        } else {   
            // Do nothing!
            console.log('No se borro');
            }    
    }; 
    if (e.target.classList.contains('editPublication')) {
        try{
            let buttonHistories = document.getElementsByClassName('save');
            console.log('editando'); 
            console.log(e.target.dataset.id);
            const doc = await getHistoryEdit(e.target.dataset.id);
            const post = doc.data();
            const title = document.getElementById('task-InputNewPublication');
            const description = document.getElementById('task-contentPublication');
            title.value = post.title;
            description.value = post.description;
            buttonHistories[0].innerText = 'Guardar';
            console.log(buttonHistories[0], 'si jalo');
            editStatus = true;
            id= doc.id;       
        } catch (error) {
            console.log(error);
        }
    };
    });

export const numLikes = () => {
    const desenviaja = document.querySelectorAll('.desenviaja');
    const user = activeUser();
    desenviaja.forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            // define los ids indivisuales
            console.log('like funciono');
            const idlike = e.target.dataset.id;
            console.log(idlike, 'este es el id de la historia para like');
            const docJalo = await getHistoryEdit(idlike);
            const docGet = docJalo.data();
            const mailLike = docGet.like;
            if (mailLike.includes(user.email)) {
                const filteredEmails = mailLike.filter((email) => email !== user.email);
                const updates = { like: filteredEmails };
                await updateHistory(idlike, updates);
                console.log(updateHistory)
                } else {
                mailLike.push(user.email);
                const updates = { like: mailLike };
                await updateHistory(idlike, updates);
                };
        });
    });
    };