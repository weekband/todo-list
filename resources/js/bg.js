/**
 * 
 */

let getCoords = () => {
   return new Promise((resolve,reject)=>{
      navigator.geolocation.getCurrentPosition((position) =>{
         resolve(position.coords);         
      });
   })
}

let getLocationWeather = async () => {
	let coords = await getCoords();
	let queryString = createQueryString({
		lat : coords.latitude,
		lon : coords.longitude,
		units : 'metric',
		lang : 'kr',
		appid : '0983ec870e47393145b481ef55af8646'
	});
	
	let url = `https://api.openweathermap.org/data/2.5/weather?${queryString}`;
	let response = await fetch(url);
	let datas = await response.json();
	
	
	return {
		temp : datas.main.temp,
		loc : datas.name
	}
}


let getBackgroundImg = async () =>{
	let prevLog = localStorage.getItem('bg-log');
	
	if(prevLog){
		prevLog =JSON.parse(prevLog);
		if(prevLog.expiraionOn > Date.now()){
			return prevLog.bg;
		}
	}
	
	
	let imgInfo = await requestBackgroundImage();

	registBackgroundLog(imgInfo);	
	return imgInfo;
	
	
}


let requestBackgroundImage = async () =>{
	let queryString = createQueryString({
		orientation : 'landscape',
		query:'landscape'
		
	});
	let url = 'https://api.unsplash.com/photos/random?'+queryString;
		
	let response = await fetch(url,{
		headers:{Authorization: 'Client-ID DLArmy74ikg1fd8t8tl5YHo_ECCjnKYNQCdhWLL-1Hc'}
	});
	let datas = await response.json();
	
	return {
		url : datas.urls.full,
		desc : datas.description
	}
	 
}


let registBackgroundLog = imgInfo =>{
	let expiraionDate = new Date();
	//테스트를 위해 데이터 만료시간을 1일 뒤로 설정
	expiraionDate = expiraionDate.setDate(expiraionDate.getDate()+1);
	
	let bgLog = {
		expiraionOn :expiraionDate,
		bg: imgInfo
	}
	
	localStorage.setItem('bg-log',JSON.stringify(bgLog));
}

let renderBackground = async ()=>{
	
	let locationWeather = await getLocationWeather();
	document.querySelector('.txt_location').innerHTML = `${locationWeather.temp}º @ ${locationWeather.loc}`;

	let background = await getBackgroundImg();
	document.querySelector('body').style.backgroundImage = `url(${background.url})`;
	if(background.desc){	
		document.querySelector('.txt_bg').innerHTML = background.desc;
	}
}

renderBackground();
