
function upvoted(event,me) {
    const current = me;
    const ansId = current.previousElementSibling.value;
    const upvoteCountSpan = current.nextElementSibling;
    console.log(current.classList)
   
    
    
        const numUpvotes =  +upvoteCountSpan.innerText;
        
        
        const fetchUrl = `http://localhost:1234/upvote/${ansId}`;
        fetch(fetchUrl,{
            method:'GET',
            headers:{
                'Content-Type':'application/json'
            }
        }).then(data => {
            return data.json();
           
        }).then(result => {
            if(result.upvoteCount>numUpvotes){
                current.classList.add('btn-primary');
            }else {
                current.classList.remove('btn-primary');
            }
            upvoteCountSpan.innerText = result.upvoteCount;
           
        }).catch(err => {
            console.log(err);
        });
        
        
    
    
}