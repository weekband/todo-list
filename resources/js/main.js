/**
 * 
 */
let renderCurrentTime = () =>{
	let now = new Date();
	let hour = now.getHours();
	let minutes = now.getMinutes();
	let seconds = now.getSeconds();
	
	hour = hour < 10?"0"+hour:hour;
	minutes = minutes < 10?"0"+minutes:minutes; 
	seconds = seconds < 10?"0"+seconds :seconds;
	
	document.querySelector('.txt_clock').innerHTML = `${hour} : ${minutes} : ${seconds}`;
}

let renderUser = (event) =>{
	event.preventDefault();
	console.dir('renderUser : ' +event.target.className);
	
	let input = document.querySelector('.inp_username').value;
	localStorage.setItem('username',input);
	convertMainDiv(input);
}
let registSchedule = (event) =>{
	event.preventDefault();
	console.dir('registSchedule : ' +event.target.className);
	let prevTodo = localStorage.getItem('todo');
	 
	let input = document.querySelector('.inp_todo').value;
	let todoList = [];
	
	if(prevTodo){
		todoList = JSON.parse(prevTodo);
		let idx = Number(localStorage.getItem('lastIdx')) + 1;
		localStorage.setItem('lastIdx',idx);
		todoList.unshift({work:input,idx:idx});
		
	}else{
		localStorage.setItem('lastIdx',0);
		todoList.unshift({work:input, idx:0});
		
	}
	localStorage.setItem('todo',JSON.stringify(todoList));
	renderSchedule(todoList.slice(0,8));
}
let removeSchedule = event =>{
	let curPage = Number(document.querySelector('.currentPage').textContent);
	let todoList = JSON.parse(localStorage.getItem('todo'));
	console.dir(todoList);
	let removedList = todoList.filter(e=>{
		return event.target.dataset.idx != e.idx;
	});
	
	console.dir(removedList);
	localStorage.setItem('todo',JSON.stringify(removedList));
	let end = curPage * 8;
	let begin = end - 8;
	renderSchedule(removedList.slice(begin,end));
}

let renderSchedule = (todoList) =>{
	document.querySelectorAll('.todo-list>div').forEach(e=>{e.remove()});
	document.querySelector('.inp_todo').value = '';
	todoList.forEach(Schedule=>{
		let workDiv = document.createElement('div');
		workDiv.innerHTML = `<i class="far fa-trash-alt" data-idx="${Schedule.idx}"></i> ${Schedule.work}`;
		document.querySelector('.todo-list').append(workDiv);
		
		});
		
		document.querySelectorAll('.todo-list>div>i').forEach(e=>{
			e.addEventListener('click',removeSchedule);
		})
}
let renderPageination = (event)=>{
	let dir = Number(event.target.dataset.dir);
	let curPage = Number(document.querySelector('.currentPage').textContent);
	let lastPage;
	let renderPage = curPage + dir;
	
	let todoList = localStorage.getItem('todo');
	if(todoList){
		todoList = JSON.parse(todoList);
		let todoCnt = todoList.length;
		lastPage = Math.ceil(todoCnt/8);
		
	}else{
		return;
	}
	
	if(renderPage > lastPage){
		alert('마지막 페이지 입니다.');
		return;
	}
	
	if(renderPage < 1){
		alert('첫 페이지 입니다.');
		return;
	}
	

	
	
	
	let end = renderPage * 8;
	let begin = end-8;
	
	renderSchedule(todoList.slice(begin,end));
	document.querySelector('.currentPage').textContent = renderPage;
}


let convertMainDiv = (username) =>{
		document.querySelector('.username').innerHTML = username;
		document.querySelector('.inp_username').placeholder = 'Enter your schedule';
		document.querySelector('.inp_username').value = '';
		
		document.querySelector('.wrap_username').className = 'box_todo';
  		document.querySelector('.frm_username').className = 'frm_todo';
 		document.querySelector('.inp_username').className = 'inp_todo';

		
		document.querySelector('.main').style.justifyContent = 'space-between';
		document.querySelector('.main').style.marginRight = '20vw';
		document.querySelector('.todo-list').style.display= 'block';
		
		document.querySelector('.frm_todo').removeEventListener('submit',renderUser); //기존에 등록한 submit이벤트 제거
		document.querySelector('.frm_todo').addEventListener('submit',registSchedule);
		document.querySelector('#leftArrow').addEventListener('click',renderPageination);
		document.querySelector('#rightArrow').addEventListener('click',renderPageination);
}

(()=>{
	let username = localStorage.getItem('username');
	let todoList = localStorage.getItem('todo');
	
	if(username){ //사용자가 등록을 진행했다면,
		convertMainDiv(username);
		if(todoList){
			todoList = JSON.parse(todoList);
			renderSchedule(todoList.slice(0,8));
		}
		
	}else{
		document.querySelector('.frm_username').addEventListener('submit',renderUser);
	}
	
	
	setInterval(renderCurrentTime,1000);
})();

