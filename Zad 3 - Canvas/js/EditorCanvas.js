let start_draw = false;
let draw_kind = '';
let Xstart = 0, Ystart = 0, Xmouse = 0, Ymouse = 0;
let touch = "";
let pre_line = [];
let custom_points = [];
let around_radius = 0;

const upper = document.querySelector('header');
const footer = document.querySelector('footer');
const width_line_input = document.querySelector('#lineWidth');
const width_line_output = document.querySelector('#displayLineWidth');
const color_line = document.querySelector('#lineColor');
const draw_name = document.querySelector('#nameOfpicture');
const buttons_types = document.querySelectorAll('.KindOfButtons button');
const all_picture = document.getElementById('canvas');
const con = all_picture.getContext('2d');

window.addEventListener('load', () => {
    setInterval(() => {
        get_already_exist_picture(sessionStorage.drawingID); 
      }, 1000);
    draw_init();
});

window.addEventListener('resize', () => {
    draw_init();
    draw_exist_lines();  
    con.beginPath();
})

window.addEventListener('orientationchange', () => {
    draw_init();
    draw_exist_lines();  
    con.beginPath();
})

width_line_input.oninput = () => width_line_output.innerHTML = width_line_input.value;
draw_name.addEventListener('change', picture_saved);
all_picture.addEventListener('mousedown', first_position, {passive: true, capture: true})
all_picture.addEventListener('mousemove', current_possition, {passive: true, capture: true})
all_picture.addEventListener('mouseup', end_position, {passive: true, capture: true})

all_picture.addEventListener('touchstart', first_position);
all_picture.addEventListener('touchmove', current_possition);
all_picture.addEventListener('touchend', end_position);

const draw_init = () => {
    all_picture.height = window.innerHeight - upper.offsetHeight - footer.offsetHeight - 16;
    all_picture.width = window.innerWidth;
    con.lineCap = 'round';
};

const custom = () => {
    buttons_types.forEach((button) => { button.classList.remove('active') });
    buttons_types[0].classList.toggle('active');
    start_draw = false;
    Xstart = 0, Ystart = 0, Xmouse = 0, Ymouse = 0;
    custom_points = [];
    draw_kind = 'custom';
};

const line = () => {
    buttons_types.forEach((button) => { button.classList.remove('active') });
    buttons_types[1].classList.toggle('active');
    start_draw = false;
    Xstart = 0, Ystart = 0, Xmouse = 0, Ymouse = 0;
    draw_kind = 'line';
};

const around = () => {
    buttons_types.forEach((button) => { button.classList.remove('active') });
    buttons_types[2].classList.toggle('active');
    start_draw = false;
    Xstart = 0, Ystart = 0, Xmouse = 0, Ymouse = 0;
    around_radius = 0;
    draw_kind = 'around';
};


function first_position(e){
    if(e.clientX){
        if(e.button !== 0) return 
        Xstart = e.clientX;
        Ystart = e.clientY - upper.offsetHeight;
    } else{
        Xstart = e.touches[0].clientX;
        Ystart = e.touches[0].clientY - upper.offsetHeight;
    }

    if (draw_kind === 'custom') {
        start_draw = true;
        paint(e);
    } else if (draw_kind === 'line') {
        start_draw = true;
        custom_draw();
    } else if (draw_kind === 'around') {
        start_draw = true;
        circle_draw();
    }
}

function current_possition(e){
    if(e.clientX){
        Xmouse = e.clientX;
        Ymouse = e.clientY - upper.offsetHeight;
    } else{
        Xmouse = e.touches[0].clientX;
        Ymouse = e.touches[0].clientY - upper.offsetHeight;
    }
    if (!start_draw) return;
    if (draw_kind === 'custom') {
        start_draw = true;
        paint(e);
    } else if (draw_kind === 'line') {
        start_draw = true;
        custom_draw();
    } else if (draw_kind === 'around') {
        start_draw = true;
        circle_draw();
    }
}

function end_position(){
    if (draw_kind === 'custom') {
        start_draw = false;
        con.beginPath();
        pre_line.push(custom_points);
        custom_points = [];
    } else if (draw_kind === 'line') {
        if (start_draw) {
            pre_line.push({
                Xstart: Xstart,
                Ystart: Ystart,
                endX: Xmouse,
                endY: Ymouse,
                color: con.strokeStyle,
                width: con.lineWidth,
                type: 'line'
            });            
            start_draw = false;
        }
        custom_draw();
        con.beginPath();
    } else if (draw_kind === 'around') {
        if (start_draw) {
            pre_line.push({
                type: 'around',
                Xstart: Xstart,
                Ystart: Ystart,
                width: con.lineWidth,
                color: con.strokeStyle,
                radius: around_radius,
            });            
            start_draw = false;
        }
        circle_draw();
        con.beginPath();
    }
    
    touch = all_picture.toDataURL();
    picture_saved();
}

function paint(e){
    if(!start_draw) return;
    con.lineWidth = width_line_input.value;
    con.strokeStyle = color_line.value;
    if(e.clientX){
        con.lineTo(e.clientX, e.clientY - upper.offsetHeight);
        con.stroke();
        con.beginPath();
        con.moveTo(e.clientX, e.clientY - upper.offsetHeight);
        custom_points.push({
            Xstart: e.clientX,
            Ystart: e.clientY - upper.offsetHeight,
            endX: e.clientX,
            endY: e.clientY - upper.offsetHeight,
            color: con.strokeStyle,
            width: con.lineWidth
        });
    } else {
        con.lineTo(e.touches[0].clientX, e.touches[0].clientY - upper.offsetHeight);
        con.stroke();
        con.beginPath();
        con.moveTo(e.touches[0].clientX, e.touches[0].clientY - upper.offsetHeight);
        custom_points.push({
            Xstart: e.touches[0].clientX,
            Ystart: e.touches[0].clientY - upper.offsetHeight,
            endX: e.touches[0].clientX,
            endY: e.touches[0].clientY - upper.offsetHeight,
            color: con.strokeStyle,
            width: con.lineWidth
        });
    }
}

function custom_draw(){    
    con.clearRect(0, 0, all_picture.width, all_picture.height);
    draw_exist_lines();
    con.lineWidth = width_line_input.value;	
    if (start_draw) {
        con.strokeStyle = "green";
        con.beginPath();
        con.moveTo(Xstart, Ystart);
        con.lineTo(Xmouse, Ymouse);
        con.stroke();
    }
    con.strokeStyle = color_line.value;
}

function circle_draw(){
    con.clearRect(0, 0, all_picture.width, all_picture.height);
    draw_exist_lines();
    con.lineWidth = width_line_input.value;		
    if (start_draw) {
        con.strokeStyle = "green";
        con.beginPath();
        around_radius = Math.sqrt((Xmouse - Xstart)**2 + (Ymouse - Ystart)**2);
        con.arc(Xstart, Ystart, around_radius, 0, 2 * Math.PI, false);
        con.stroke();
    }
    con.strokeStyle = color_line.value;
}

function clear_(){
    start_draw = false;
    Xstart, Ystart, Xmouse, Ymouse = 0;
    pre_line = [];
    custom_points = [];
    con.clearRect(0, 0, all_picture.width, all_picture.height);
    touch = all_picture.toDataURL();
    picture_saved();
}

function skip_to_last_draw(){
    if(pre_line.length > 0) {
        pre_line.pop();
        con.clearRect(0, 0, all_picture.width, all_picture.height);
        draw_exist_lines();
        start_draw = false;
        con.beginPath();
        touch = all_picture.toDataURL();
        picture_saved();
    }
}

function get_already_exist_picture(index){
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200 || xhr.status === 304) {
          try {
            console.log(xhr.responseText);
              const responseData = JSON.parse(xhr.responseText)?.data;
              draw_name.value = responseData[index]?.name;
              touch = responseData[index]?.thumbnail;
              pre_line = responseData[index]?.lines;
              console.log(pre_line);
              if(pre_line.length > 0) draw_exist_lines();
          } catch (error) {
              console.error(error);
          }
      }
    };
    xhr.open("GET", "./php/getData.php", true);
    xhr.setRequestHeader("Content-Type", " application/json");
    xhr.send();
}

function picture_saved() {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log('Data saved!', Date());
        }
    };
    xhr.open("POST", `./php/saveData.php?id="${sessionStorage.drawingID}"`, true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send('{"lines": ' + JSON.stringify(pre_line) + 
        ',"thumbnail":' + JSON.stringify(touch) + 
        ',"name":' + JSON.stringify(draw_name.value) +
        '}');
}

function draw_exist_lines(){
    pre_line.forEach(line => {
        con.beginPath();
        if(Array.isArray(line)){
            con.lineWidth = line[0].width;
            con.strokeStyle = line[0].color;
            for (let i = 0; i < line.length - 1; ++i) {
                con.moveTo(line[i].endX, line[i].endY);
                con.lineTo(line[i + 1].endX, line[i + 1].endY);
                con.stroke();
            }
            if(line.length === 1){
                con.moveTo(line[0].Xstart, line[0].Ystart);
                con.lineTo(line[0].endX, line[0].endY);
                con.stroke();
            }
        }
        else{
            con.lineWidth = line.width;
            con.strokeStyle = line.color;
            switch(line?.type){
                case 'line':
                    con.moveTo(line.Xstart, line.Ystart);
                    con.lineTo(line.endX, line.endY);
                    break;
                case 'around':
                    con.arc(line.Xstart, line.Ystart, line.radius, 0, 2 * Math.PI, false);
                    break;
                case 'rectangle':
                    con.rect(line.Xstart, line.Ystart, line.endX - line.Xstart, line.endY - line.Ystart);
                    break;
                default:
                    break;
            }
            con.stroke();
        }
    });
    con.lineWidth = width_line_input.value;
    con.strokeStyle = color_line.value;
}

function show() {
    document.getElementById("nameButton").style.display = "none";
    document.getElementById("nameInput").style.display = "block";
}