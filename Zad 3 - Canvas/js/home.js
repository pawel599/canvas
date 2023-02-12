let picture_name = [];
let touch_draw = [];
let exist_data = {};
const alreadyDrawed = document.querySelector('.alreadyDrawed');

window.onload = get_already_exist_picture();

function new_paint(){
    const picture_element = document.createElement("div");
    const list_of_draws = document.getElementById("list_of_draws");
    const button_new_draw = document.querySelector(".button_new_draw");

    picture_element.classList.add("drawing");
    picture_element.innerHTML = "obraz z dnia: ";

    list_of_draws.appendChild(picture_element);
    list_of_draws.appendChild(button_new_draw);

    sessionStorage.drawingID = picture_name.length;

    const new_data = new Date();
    const text = new_data.toISOString().slice(12, 20);
    const rhx = new XMLHttpRequest();
    rhx.onreadystatechange = () => {
        if (rhx.readyState == 4 && rhx.status == 200) {
            window.open('EditorCanvas.html', '_self')
        }
    };
    rhx.open("POST", "./php/drawNewPicture.php", true);
    rhx.setRequestHeader("Content-type", "application/json");
    rhx.send('{"lines":[]' +',"thumbnail":""' +',"name":"' + text +'"}');
}

function get_already_exist_picture() {
    const rhx = new XMLHttpRequest();
    rhx.onreadystatechange = () => {
    if (rhx.readyState !== 4) return;
    if (rhx.status === 200 || rhx.status === 304) {
        try {
            exist_data = JSON.parse(rhx.responseText)?.data;
            picture_name = exist_data.map(element => element.text);
            touch_draw = exist_data.map(element => element.thumbnail);
            render_picture(picture_name);
        } catch (error) {
            console.error(error);
        }
    }};
    rhx.open("GET", "./php/getData.php", true);
    rhx.setRequestHeader("Content-Type", " application/json");
    rhx.send();
    }
    

function open_existing_drawing(){
    sessionStorage.drawingID = this.dataset.drawingID;
    window.open('EditorCanvas', '_self');
}

function render_picture(picture_name){
    if(picture_name.length < 1) return;
    const frag = document.createDocumentfrag();
    picture_name.forEach((drawing, index) =>{
        const new_paint = document.createElement('div');
        new_paint.classList.add('drawing');
        new_paint.id = `drawing-${index}`;
        const aint = document.createElement('a');
        aint.href = '#';
        const poster = document.createElement('p');
        poster.textContent = drawing;
        const image = document.createElement('img');
        image.src = touch_draw[index];
        const button = document.createElement('button');
        button.dataset.drawingID = index;
        button.innerText = 'Otwórz';
        button.onclick = open_existing_drawing;
        new_paint.appendChild(aint);
        new_paint.appendChild(poster);
        new_paint.appendChild(image);
        new_paint.appendChild(button);
        frag.appendChild(new_paint);
    });
    alreadyDrawed.appendChild(frag);

}