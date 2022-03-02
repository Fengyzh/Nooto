export async function fetchStuff () {
/*
    const data = await fetch('https://jsonplaceholder.typicode.com/todos/2');
    const item = await data.json();
    ProjectList.push(item)
    console.log(ProjectList)
*/
//console.log(fetch('https://randomuser.me/api/').then(response => response.json()))

return fetch('http://localhost:5000/title', {mode:'no-cors'}).then(response => response.json())

    
    
}